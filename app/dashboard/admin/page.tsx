"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ExternalLink } from "lucide-react";

interface Invoice {
  id: string;
  email: string;
  paymentMethod: "LTC" | "Whop";
  paymentStatus: "pending" | "confirmed" | "failed";
  product: string;
  serverInvite: string;
  amount: string;
  timestamp: string;
  txid?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "failed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    // Check authentication via API (HttpOnly cookies can't be read by JS)
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      const data = await response.json();
      
      if (!data.authenticated) {
        router.push("/dashboard");
        return;
      }
      
      // Load invoices after auth check passes
      loadInvoices();
    } catch (error) {
      router.push("/dashboard");
    }
  };

  const loadInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      const data = await response.json();
      
      if (data.invoices) {
        const invoiceData: Invoice[] = data.invoices.map((inv: any) => ({
          id: inv.id,
          email: inv.email,
          paymentMethod: inv.payment_method,
          paymentStatus: inv.payment_status,
          product: inv.product,
          serverInvite: inv.server_invite,
          amount: inv.amount,
          timestamp: inv.created_at,
          txid: inv.txid,
        }));
        
        setInvoices(invoiceData);
        
        // Calculate stats
        const totalRevenue = invoiceData
          .filter(inv => inv.paymentStatus === "confirmed")
          .reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^0-9.]/g, "")), 0);
        
        setStats({
          totalRevenue,
          totalOrders: invoiceData.length,
          pendingOrders: invoiceData.filter(inv => inv.paymentStatus === "pending").length,
          completedOrders: invoiceData.filter(inv => inv.paymentStatus === "confirmed").length,
        });
      }
    } catch (error) {
      console.error("Failed to load invoices:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    router.push("/dashboard");
  };

  const filteredInvoices = invoices
    .filter(inv => filter === "all" || inv.paymentStatus === filter)
    .filter(inv => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return inv.id.toLowerCase().includes(query) || inv.email.toLowerCase().includes(query);
    });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-500 bg-green-500/10";
      case "pending": return "text-yellow-500 bg-yellow-500/10";
      case "failed": return "text-red-500 bg-red-500/10";
      default: return "text-zinc-500 bg-zinc-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="w-10 h-10" alt="Logo" />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Kloon<span className="text-blue-500">boosts</span> Admin
              </h1>
              <p className="text-sm text-zinc-500">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pendingOrders}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-500">{stats.completedOrders}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => { setFilter(status as any); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Invoice ID or Email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-80 px-4 py-2 pl-10 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Method</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-zinc-400">Server</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-zinc-500">
                      No invoices found. Payments will appear here once customers make purchases.
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      onClick={() => setSelectedInvoice(invoice)}
                      className="border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors"
                    >
                      <td className="p-4 text-sm text-zinc-300 font-mono">
                        {invoice.id.substring(0, 8)}...
                      </td>
                      <td className="p-4 text-sm text-white">{invoice.email}</td>
                      <td className="p-4 text-sm text-zinc-300">{invoice.product}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.paymentMethod === "LTC" 
                            ? "bg-orange-500/10 text-orange-500" 
                            : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {invoice.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-white font-medium">{invoice.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-zinc-400">
                        {new Date(invoice.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-zinc-400 max-w-xs truncate">
                        {invoice.serverInvite}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-[#09090b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 z-10 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-white">Order #{selectedInvoice.id}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedInvoice.paymentStatus)}`}>
                      {selectedInvoice.paymentStatus}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400">
                    Date: {new Date(selectedInvoice.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Order Details</h3>
                <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{selectedInvoice.product}</div>
                      <div className="text-sm text-zinc-400 mt-1">Quantity: 1</div>
                    </div>
                    <div className="text-white font-bold">{selectedInvoice.amount}</div>
                  </div>
                  
                  <div className="border-t border-zinc-800 pt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Subtotal</span>
                      <span className="text-white">{selectedInvoice.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Platform Fee</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t border-zinc-800 pt-2">
                      <span className="text-white">Total</span>
                      <span className="text-white">{selectedInvoice.amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Customer Details</h3>
                <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white">{selectedInvoice.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-zinc-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="flex-1 break-all">
                      <div className="text-zinc-400 text-xs mb-1">Server Invite Link</div>
                      <a href={selectedInvoice.serverInvite} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                        {selectedInvoice.serverInvite}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Payment Information</h3>
                <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400 text-sm">Payment Method:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedInvoice.paymentMethod === "LTC" 
                        ? "bg-orange-500/10 text-orange-500" 
                        : "bg-blue-500/10 text-blue-500"
                    }`}>
                      {selectedInvoice.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 text-sm">Invoice ID:</span>
                    <span className="text-white text-sm font-mono break-all">{selectedInvoice.id}</span>
                  </div>
                  {selectedInvoice.txid && (
                    <div className="flex flex-col gap-1 border-t border-zinc-800 pt-3">
                      <span className="text-zinc-400 text-sm">Transaction Hash:</span>
                      <a 
                        href={`https://live.blockcypher.com/ltc/tx/${selectedInvoice.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-xs font-mono break-all flex items-center gap-1"
                      >
                        {selectedInvoice.txid}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
