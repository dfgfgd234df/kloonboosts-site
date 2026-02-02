"use client";
import { useState, useEffect } from "react";
import { X, Minus, Plus, Copy, CheckCircle } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: string;
    sellixProductId: string;
  };
  existingInvoice?: any;
}

interface LTCInvoice {
  invoice_id: string;
  address: string;
  amount_ltc: number;
  network_fee: number;
  total_ltc: number;
  txid?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  product,
  existingInvoice,
}: CheckoutModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [serverInvite, setServerInvite] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<"whop" | "litecoin" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [ltcInvoice, setLtcInvoice] = useState<LTCInvoice | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Load existing invoice data
  useEffect(() => {
    if (existingInvoice) {
      setEmail(existingInvoice.email || "");
      setServerInvite(existingInvoice.server_invite || "");
      setPaymentStatus(existingInvoice.payment_status || "");
      
      if (existingInvoice.payment_method === "LTC" && existingInvoice.ltc_address) {
        setSelectedPayment("litecoin");
        // Reconstruct LTC invoice data from database
        setLtcInvoice({
          invoice_id: existingInvoice.id,
          address: existingInvoice.ltc_address,
          amount_ltc: parseFloat(existingInvoice.ltc_amount) || 0,
          network_fee: 0,
          total_ltc: parseFloat(existingInvoice.ltc_amount) || 0,
          txid: existingInvoice.txid,
        });
      } else if (existingInvoice.payment_method === "Whop") {
        setSelectedPayment("whop");
      }
    }
  }, [existingInvoice]);

  const fetchLTCInvoiceDetails = async (invoiceId: string) => {
    try {
      const response = await fetch("/api/ltc/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      const data = await response.json();
      if (data.address) {
        setLtcInvoice(prev => prev ? {
          ...prev,
          address: data.address,
          amount_ltc: data.amount_ltc || 0,
          network_fee: data.network_fee || 0,
          total_ltc: data.total_ltc || 0,
        } : null);
      }
    } catch (error) {
      console.error("Failed to fetch LTC invoice details:", error);
    }
  };

  // Reset all state when modal closes or product changes
  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setEmail("");
      setServerInvite("");
      setSelectedPayment(null);
      setIsProcessing(false);
      setShowCoupon(false);
      setLtcInvoice(null);
      setPaymentStatus("");
      setCopied(false);
      setCopiedAmount(false);
    }
  }, [isOpen]);

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedPayment(null);
    setIsProcessing(false);
    setShowCoupon(false);
    setLtcInvoice(null);
    setPaymentStatus("");
    setCopied(false);
    setCopiedAmount(false);
  }, [product.sellixProductId]);

  // Poll for payment status
  useEffect(() => {
    if (!ltcInvoice) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/ltc/check-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoice_id: ltcInvoice.invoice_id }),
        });

        const data = await response.json();
        
        if (data.is_confirmed) {
          setPaymentStatus("confirmed");
          
          // Update invoice status in database
          try {
            await fetch("/api/invoices", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: ltcInvoice.invoice_id,
                paymentStatus: "confirmed",
                txid: data.txid,
              }),
            });
            
            // Send Discord notification
            await fetch("/api/discord/notify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "paid",
                invoiceData: {
                  id: ltcInvoice.invoice_id,
                  email,
                  paymentMethod: "LTC",
                  product: product.title,
                  serverInvite,
                  amount: product.price,
                  txid: data.txid,
                },
              }),
            });
            
            // Send email notification
            await fetch("/api/email/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "paid",
                email,
                invoiceData: {
                  id: ltcInvoice.invoice_id,
                  email,
                  paymentMethod: "LTC",
                  product: product.title,
                  serverInvite,
                  amount: product.price,
                  txid: data.txid,
                },
              }),
            });
          } catch (error) {
            console.error("Failed to update invoice:", error);
          }
          
          clearInterval(interval);
          setTimeout(() => {
            alert("Payment confirmed! Your order will be processed.");
            onClose();
          }, 2000);
        } else if (data.is_paid) {
          setPaymentStatus(`pending (${data.confirmations || 0} confirmations)`);
          if (data.txid) {
            setLtcInvoice(prev => prev ? { ...prev, txid: data.txid } : null);
          }
        }
      } catch (error) {
        console.error("Status check failed:", error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [ltcInvoice, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, isAmount = false) => {
    navigator.clipboard.writeText(text);
    if (isAmount) {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saveInvoice = async (invoiceData: any) => {
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceData),
      });
    } catch (error) {
      console.error("Failed to save invoice:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !serverInvite || !selectedPayment) {
      alert("Please fill in all fields and select a payment method");
      return;
    }

    setIsProcessing(true);

    if (selectedPayment === "whop") {
      try {
        const response = await fetch("/api/whop/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.sellixProductId,
            email,
            serverInvite,
            productTitle: product.title,
            price: product.price,
          }),
        });

        const data = await response.json();
        if (data.checkoutUrl) {
          // Save invoice to dashboard
          const invoiceData = {
            id: `whop_${Date.now()}`,
            email,
            paymentMethod: "Whop",
            paymentStatus: "pending",
            product: product.title,
            serverInvite,
            amount: product.price,
            checkoutUrl: data.checkoutUrl,
            timestamp: new Date().toISOString(),
          };
          await saveInvoice(invoiceData);
          
          // Send Discord notification
          fetch("/api/discord/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "created", invoiceData }),
          }).catch(console.error);
          
          // Send email notification
          fetch("/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "created", email, invoiceData }),
          }).catch(console.error);
          
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || "Failed to create checkout");
        }
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } else if (selectedPayment === "litecoin") {
      try {
        const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ""));
        
        const response = await fetch("/api/ltc/create-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount_usd: numericPrice * quantity,
            description: `${product.title} - ${email}`,
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          // Save invoice to dashboard with LTC details
          const invoiceData = {
            id: data.invoice_id,
            email,
            paymentMethod: "LTC",
            paymentStatus: "pending",
            product: product.title,
            serverInvite,
            amount: product.price,
            ltcAddress: data.address,
            ltcAmount: data.total_ltc,
            timestamp: new Date().toISOString(),
          };
          await saveInvoice(invoiceData);
          
          // Send Discord notification
          fetch("/api/discord/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "created", invoiceData }),
          }).catch(console.error);
          
          // Send email notification
          fetch("/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "created", email, invoiceData }),
          }).catch(console.error);
          
          setLtcInvoice(data);
          setPaymentStatus("waiting for payment");
        } else {
          throw new Error(data.error || "Failed to create LTC invoice");
        }
        
        setIsProcessing(false);
      } catch (error) {
        console.error("LTC invoice creation failed:", error);
        alert("Failed to create Litecoin payment. Please try again.");
        setIsProcessing(false);
      }
    }
  };

  // If LTC invoice is created, show payment screen
  if (ltcInvoice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative bg-[#09090b] rounded-2xl w-full max-w-[480px] shadow-2xl border border-zinc-800 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 space-y-4">
            <div className="border-b border-zinc-800 pb-4 mb-4">
              <div className="flex gap-3 items-center mb-4">
                <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-300" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
                    <path fill="#FFF" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">Litecoin</h3>
                  <p className="text-sm text-zinc-400">{ltcInvoice.invoice_id}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400">Invoice ID</p>
                  <button
                    onClick={() => copyToClipboard(ltcInvoice.invoice_id)}
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-blue-500"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{ltcInvoice.invoice_id}</span>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400">E-mail Address</p>
                  <p className="text-sm text-zinc-300">{email}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400">Total Price</p>
                  <p className="text-sm text-zinc-300">{product.price}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-400">Total Amount (LTC)</p>
                  <p className="text-sm text-zinc-300">{ltcInvoice.total_ltc} LTC</p>
                </div>
              </div>
            </div>

            {paymentStatus.includes('pending') || paymentStatus === 'confirmed' ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  paymentStatus === 'confirmed' 
                    ? 'bg-green-500/10 text-green-500 border-green-500' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {paymentStatus === 'confirmed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" className="w-5 h-5 animate-spin">
                        <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>
                      </svg>
                    )}
                    <span className="text-sm">{paymentStatus === 'confirmed' ? 'Payment confirmed! Processing your order...' : 'Your order will be automatically processed once the transaction is confirmed.'}</span>
                  </div>
                </div>

                <div>
                  <p className="text-blue-500 text-base font-medium mb-3">Transaction History</p>
                  {ltcInvoice.txid ? (
                    <div className="flex justify-between items-center gap-4 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-950">
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <p className="text-zinc-200 font-medium">{ltcInvoice.total_ltc} LTC</p>
                        <a
                          href={`https://live.blockcypher.com/ltc/tx/${ltcInvoice.txid}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-zinc-400 hover:text-blue-500 break-all"
                        >
                          {ltcInvoice.txid}
                        </a>
                      </div>
                      <div className="flex-shrink-0">
                        {paymentStatus === 'confirmed' ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256" className="w-6 h-6 text-yellow-500 animate-spin">
                            <path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">No transactions yet...</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                  <p className="text-xs text-zinc-400 mb-2">Send to this address:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-white break-all flex-1">{ltcInvoice.address}</code>
                    <button
                      onClick={() => copyToClipboard(ltcInvoice.address)}
                      className="p-2 hover:bg-zinc-800 rounded transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3">Amount:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white flex-1">{ltcInvoice.total_ltc} LTC</p>
                    <button
                      onClick={() => copyToClipboard(ltcInvoice.total_ltc.toString(), true)}
                      className="p-2 hover:bg-zinc-800 rounded transition-colors flex-shrink-0"
                    >
                      {copiedAmount ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
                  <img
                    src={`/api/ltc/qr?invoice_id=${ltcInvoice.invoice_id}`}
                    alt="QR Code"
                    className="mx-auto w-48 h-48 bg-white p-2 rounded"
                  />
                  <p className="text-xs text-zinc-400 mt-2">Scan with your Litecoin wallet</p>
                </div>

                <div className="text-xs text-zinc-500 space-y-1">
                  <p>• Amount: {ltcInvoice.amount_ltc} LTC</p>
                  <p>• Network Fee: {ltcInvoice.network_fee} LTC</p>
                  <p>• Total: {ltcInvoice.total_ltc} LTC</p>
                </div>

                <p className="text-xs text-center text-zinc-500">
                  Payment will be confirmed automatically after network confirmations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-[#09090b] rounded-2xl w-full max-w-[480px] shadow-2xl border border-zinc-800 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-stretch min-h-24">
              <div className="flex flex-col text-left w-full justify-between">
                <div className="space-y-1">
                  <h1 className="font-bold text-white text-xl">{product.title}</h1>
                  <div className="flex flex-row gap-2 items-center">
                    <div className="text-lg text-white font-bold">{product.price}</div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between mt-2">
                  <div className="flex items-stretch rounded-md font-semibold border-2 border-zinc-800 bg-zinc-950 shadow-sm transition-all duration-200">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex items-center px-3 py-2 text-white hover:bg-zinc-900 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex items-center justify-center px-6 text-white min-w-[4rem] text-center">
                      {quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex items-center px-3 py-2 text-white hover:bg-zinc-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-white">∞ available</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="w-full rounded-md bg-zinc-950 text-white placeholder-zinc-500 shadow-sm border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-700 pl-10 pr-4 py-3 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="w-full py-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedPayment("litecoin")}
                  className={`relative flex flex-col justify-center items-center gap-3 p-4 transition duration-200 ease-in-out rounded-lg shadow-sm bg-zinc-950 border-2 cursor-pointer hover:shadow-md hover:bg-black h-24 ${
                    selectedPayment === "litecoin" 
                      ? "border-blue-600 ring-2 ring-blue-800" 
                      : "border-zinc-900"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-8 h-8 text-zinc-300" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="16" fill="#BFBBBB"/>
                      <path fill="#FFF" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"/>
                    </svg>
                    <span className="text-xs font-medium text-center text-white">Litecoin</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayment("whop")}
                  className={`relative flex flex-col justify-center items-center gap-2 p-3 transition duration-200 ease-in-out rounded-lg shadow-sm bg-zinc-950 border-2 cursor-pointer hover:shadow-md hover:bg-black h-24 ${
                    selectedPayment === "whop" 
                      ? "border-blue-600 ring-2 ring-blue-800" 
                      : "border-zinc-900"
                  }`}
                >
                  <div className="flex flex-row items-center gap-2">
                    {/* Credit Card Icon */}
                    <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    {/* CashApp Icon */}
                    <svg className="w-6 h-6 text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.59 3.47A5.1 5.1 0 0 0 20.54.42C19.23 0 18.04 0 15.62 0H8.36c-2.4 0-3.61 0-4.9.4A5.1 5.1 0 0 0 .41 3.46C0 4.76 0 5.96 0 8.36v7.27c0 2.41 0 3.6.4 4.9a5.1 5.1 0 0 0 3.05 3.05c1.3.41 2.5.41 4.9.41h7.28c2.41 0 3.61 0 4.9-.4a5.1 5.1 0 0 0 3.06-3.06c.41-1.3.41-2.5.41-4.9V8.38c0-2.41 0-3.61-.41-4.91zM17.42 8.1l-.93.93a.5.5 0 0 1-.67.01 5 5 0 0 0-3.22-1.18c-.97 0-1.94.32-1.94 1.21 0 .9 1.04 1.2 2.24 1.65 2.1.7 3.84 1.58 3.84 3.64 0 2.24-1.74 3.78-4.58 3.95l-.26 1.2a.49.49 0 0 1-.48.39H9.63l-.09-.01a.5.5 0 0 1-.38-.59l.28-1.27a6.54 6.54 0 0 1-2.88-1.57v-.01a.48.48 0 0 1 0-.68l1-.97a.49.49 0 0 1 .67 0c.91.86 2.13 1.34 3.39 1.32 1.3 0 2.17-.55 2.17-1.42 0-.87-.88-1.1-2.54-1.72-1.76-.63-3.43-1.52-3.43-3.6 0-2.42 2.01-3.6 4.39-3.71l.25-1.23a.48.48 0 0 1 .48-.38h1.78l.1.01c.26.06.43.31.37.57l-.27 1.37c.9.3 1.75.77 2.48 1.39l.02.02c.19.2.19.5 0 .68z"/>
                    </svg>
                    {/* Bank Transfer Icon - Simplified */}
                    <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-center text-white leading-tight">Cards / CashApp / Bank</span>
                </button>
              </div>
            </div>

            <div className="text-left space-y-2">
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-1">
                  Permanent Server Invite Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serverInvite}
                  onChange={(e) => setServerInvite(e.target.value)}
                  placeholder="Permanent Server Invite Link"
                  className="w-full rounded-md bg-zinc-950 text-white placeholder-zinc-500 shadow-sm border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-700 px-4 py-3 transition duration-200"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="py-2 text-zinc-500 hover:text-zinc-200 text-sm mx-auto block transition duration-100 ease-in-out"
                >
                  Add coupon
                </button>
                {showCoupon && (
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full rounded-md bg-zinc-950 text-white placeholder-zinc-500 shadow-sm border-2 border-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-700 px-4 py-2 transition duration-200 mt-2"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <button
                type="submit"
                disabled={isProcessing || !selectedPayment}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Buy now"}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-zinc-950 rounded-t-2xl py-4 flex flex-row justify-center items-center gap-2 border-t border-zinc-900">
          <button
            type="button"
            className="flex items-center text-white bg-zinc-800 border-2 border-zinc-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:text-zinc-300 transition-colors"
          >
            Description
          </button>
        </div>
      </div>
    </div>
  );
}

