import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyOrdersPage({ onTrackOrder, onOpenAuthModal, onBackToStore }) {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  async function fetchMyOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching my orders:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">View Your Order History</h2>
        <p className="text-xs text-slate-500 mb-6">
          Sign in to your account to review previous orders, invoices, and track your active parcels.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl hover:bg-blue-700 transition"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order History</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage all orders placed under <span className="font-semibold text-slate-700">{user.email}</span>
          </p>
        </div>
        <button
          onClick={onBackToStore}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          Continue Shopping &rarr;
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">No orders found</h3>
          <p className="text-xs text-slate-500 mb-6">You have not placed any orders with this account yet.</p>
          <button
            onClick={onBackToStore}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Start Browsing Store
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 text-sm">{order.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Placed: {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    ${Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items in Order */}
              <div className="py-4 space-y-3">
                {order.items?.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80'}
                        alt={item.product_title}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-slate-800 block truncate max-w-xs sm:max-w-md">
                          {item.product_title}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          Qty: {item.quantity} × ${Number(item.product_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-800">
                      ${(Number(item.product_price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tracking: <strong className="font-mono text-slate-700">{order.tracking_number}</strong></span>
                </div>

                <button
                  onClick={() => onTrackOrder(order.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Live Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
