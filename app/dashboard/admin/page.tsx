"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "failed">("all");

  useEffect(() => {
    // Check authentication
    const isAuthenticated = document.cookie.includes("admin_auth=true");
    if (!isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    // Load invoices from database
    loadInvoices();
  }, [router]);

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

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.push("/dashboard");
  };

  const filteredInvoices = filter === "all" 
    ? invoices 
    : invoices.filter(inv => inv.paymentStatus === filter);

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

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "confirmed", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
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
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-zinc-500">
                      No invoices found. Payments will appear here once customers make purchases.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
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

        {/* Quick Instructions */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">📊 How it works</h3>
          <p className="text-zinc-300 text-sm mb-3">
            This dashboard tracks all payment invoices from both Litecoin and Whop payments.
          </p>
          <ul className="space-y-1 text-sm text-zinc-400">
            <li>• Invoices are automatically saved when customers create payments</li>
            <li>• LTC payments show transaction IDs when confirmed</li>
            <li>• Whop payments sync through webhooks</li>
            <li>• Data persists in browser localStorage (production will use database)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
