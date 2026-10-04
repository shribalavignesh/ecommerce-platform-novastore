import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../components/NotificationToast';
import { formatINR } from '../utils/format';

export default function OrderTrackingPage({ initialOrderId, onBackToStore }) {
  const [searchId, setSearchId] = useState(initialOrderId || 'ORD-2026-4401');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const stages = [
    { key: 'Order Placed', label: 'Order Placed' },
    { key: 'Processing', label: 'Processing' },
    { key: 'In Transit', label: 'In Transit' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' }
  ];

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      fetchOrder(initialOrderId);
    } else {
      fetchOrder('ORD-2026-4401');
    }
  }, [initialOrderId]);

  async function fetchOrder(idToFetch) {
    const target = idToFetch || searchId;
    if (!target.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${target.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order not found.');
      }

      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Failed to locate order.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchOrder(searchId);
  }

  // Determine active stage index for stepped visual progress
  function getCurrentStageIndex(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('out for delivery')) return 3;
    if (s.includes('transit') || s.includes('shipped')) return 2;
    if (s.includes('processing')) return 1;
    return 0; // Order Placed
  }

  const currentStageIndex = order ? getCurrentStageIndex(order.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 mb-2">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Logistics & Order Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Shipment
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter your Order Reference ID to view live carrier movements, dispatch status, and estimated delivery times.
        </p>

        {/* Quick Demo Pre-fill buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 font-medium">Quick Examples:</span>
          <button
            onClick={() => {
              setSearchId('ORD-2026-4401');
              fetchOrder('ORD-2026-4401');
            }}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition text-[11px] font-mono shadow-2xs"
          >
            ORD-2026-4401 (In Transit)
          </button>
          <button
            onClick={() => {
              setSearchId('ORD-2026-1189');
              fetchOrder('ORD-2026-1189');
            }}
            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition text-[11px] font-mono shadow-2xs"
          >
            ORD-2026-1189 (Delivered)
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID (e.g. ORD-2026-4401)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs font-mono uppercase bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          <span>Track</span>
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3 mb-8">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <p>{error}</p>
        </div>
      )}

      {/* Order Details Body */}
      {order && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Status & Stepped Progress Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-mono">{order.id}</h2>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
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
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Estimated Delivery</span>
                  <span className="font-bold text-slate-900 text-sm">{order.estimated_delivery}</span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-8">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0">
                  <div
                    className="h-1 bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${(currentStageIndex / (stages.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {/* Stage Steps */}
                <div className="relative z-10 flex justify-between">
                  {stages.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isCurrent
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`mt-2 text-[11px] font-semibold text-center whitespace-nowrap hidden sm:block ${
                            isCurrent
                              ? 'text-blue-600 font-bold'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Courier Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Carrier Information</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Courier</span>
                  <span className="font-semibold text-slate-800">{order.carrier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracking Code</span>
                  <span className="font-mono font-bold text-blue-600">{order.tracking_number}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="text-slate-700">{order.payment_method}</span>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900">{order.shipping_address?.fullName || order.user_name}</p>
                <p>{order.shipping_address?.address}</p>
                <p>
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zip}
                </p>
                <p className="text-slate-400 mt-1">{order.shipping_address?.phone}</p>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Payment Summary</span>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>{formatINR(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{order.shipping_fee === 0 ? 'FREE' : formatINR(order.shipping_fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
                  <span>Total Paid:</span>
                  <span>{formatINR(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Items in this Delivery</h3>
            <div className="divide-y divide-slate-100">
              {order.items?.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product_title}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{item.product_title}</h4>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatINR(item.product_price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {formatINR(Number(item.product_price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chronological Audit Events Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tracking History & Checkpoint Activity</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.events && order.events.length > 0 ? (
                order.events.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900">{evt.status}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(evt.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{evt.message}</p>
                    {evt.location && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{evt.location}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No checkpoints recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
