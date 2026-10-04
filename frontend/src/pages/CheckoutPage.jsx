import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  ArrowLeft,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/NotificationToast';
import { formatINR } from '../utils/format';

export default function CheckoutPage({ onBackToStore, onOrderSuccess }) {
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee,
    tax,
    totalAmount,
    clearCart
  } = useCart();

  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'alex@demo.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('42, MG Road, Brigade Junction');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [zip, setZip] = useState('560001');
  const [country, setCountry] = useState('India');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [cardNumber, setCardNumber] = useState('5520 •••• •••• 5555');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvc, setCardCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No items to checkout</h2>
        <p className="text-xs text-slate-500 mb-6">Your shopping cart is currently empty. Add products from the catalog to proceed.</p>
        <button
          onClick={onBackToStore}
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Return to Store Catalog
        </button>
      </div>
    );
  }

  // If order was successfully completed, show the confirmation screen!
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-8 md:p-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Payment Verified & Order Confirmed
          </span>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3 mb-2">
            Thank you for your order!
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            We have dispatched your order details to <span className="font-semibold text-slate-800">{completedOrder.user_email}</span>. A logistics tracking ID has been created.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-bold text-slate-900 font-mono text-sm">{completedOrder.id}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="text-slate-500">Tracking Code:</span>
              <span className="font-bold text-blue-600 font-mono text-sm">{completedOrder.tracking_number}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
              <span className="text-slate-500">Carrier & Speed:</span>
              <span className="font-semibold text-slate-800">{completedOrder.carrier}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Estimated Delivery:</span>
              <span className="font-semibold text-emerald-700">{completedOrder.estimated_delivery}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onOrderSuccess(completedOrder.id)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery Status</span>
            </button>
            <button
              onClick={onBackToStore}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!fullName || !email || !address || !city || !zip) {
      showToast('Please fill out all required shipping fields.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress = { fullName, email, phone, address, city, state, zip, country };
      const paymentMethodLabel =
        paymentMethod === 'upi' ? 'UPI / QR (PhonePe / GPay)' :
        paymentMethod === 'card' ? 'Credit / Debit Card' :
        paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Net Banking (NEFT/IMPS)';

      const payload = {
        items,
        shippingAddress,
        paymentMethod: paymentMethodLabel,
        subtotal,
        tax,
        shippingFee,
        discount: discountAmount,
        totalAmount
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Order submission failed.');
      }

      setCompletedOrder(data.order);
      clearCart();
      showToast(`Order ${data.order.id} placed successfully!`);
    } catch (err) {
      showToast(err.message || 'Error creating order', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} id="checkout-form">
            {/* Step 1: Shipping Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-base">Delivery Address (India)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street / Flat / Area *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone (for delivery SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-base">Select Payment Method</h3>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">UPI / QR (PhonePe)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Debit/Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs">Cash on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'netbanking'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Net Banking</span>
                </button>
              </div>

              {/* Dynamic Payment Body */}
              {paymentMethod === 'upi' && (
                <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 text-center">
                  <p className="text-xs font-bold text-purple-900 mb-1">Instant UPI Payment</p>
                  <p className="text-[11px] text-purple-700 mb-3">Scan and pay using PhonePe, Google Pay, or Paytm.</p>
                  <div className="inline-block p-2 bg-white rounded-lg border border-purple-200 shadow-xs">
                    <QrCode className="w-24 h-24 text-purple-900" />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number (Visa / Mastercard / RuPay)</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                  <p className="font-bold mb-1">Cash on Delivery (Doorstep Payment)</p>
                  <p className="text-[11px] text-emerald-700">Please keep exact cash of <strong className="text-emerald-950 font-bold">{formatINR(totalAmount)}</strong> ready upon delivery by courier executive.</p>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold mb-1">All Major Indian Banks Supported</p>
                  <p className="text-[11px] text-amber-700">SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak Mahindra Bank.</p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Order Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 text-base mb-4">Price Details</h3>

            {/* Item list */}
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 mb-4">
              {items.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations in INR */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium text-slate-900">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-medium text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE Delivery</span> : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-medium text-slate-900">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span>{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Payment...' : `Place Order (${formatINR(totalAmount)})`}</span>
            </button>

            {/* Security Guarantee */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Safe & Secure Online Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
