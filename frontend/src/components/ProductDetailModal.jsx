import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, RotateCcw, Truck, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './NotificationToast';

export default function ProductDetailModal({ product, onClose, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!product) return null;

  function handleAddToCart() {
    addToCart(product, quantity);
    showToast(`Added ${quantity} ${product.title} to your cart!`);
    onClose();
  }

  function handleDirectBuy() {
    addToCart(product, quantity);
    onClose();
    if (onBuyNow) onBuyNow();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-xs text-slate-500 hover:text-slate-900 p-1.5 rounded-full shadow-sm hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="relative group w-full aspect-square max-w-sm rounded-xl overflow-hidden shadow-inner">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.featured ? (
              <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="capitalize font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-slate-800">{product.rating || '4.8'}</span>
                <span className="text-slate-400">({product.reviews_count || '50'} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-tight">
              {product.title}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-extrabold text-slate-900">${Number(product.price).toFixed(2)}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-600 mb-6">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Express Ship</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Yr Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span>30-Day Return</span>
              </div>
            </div>
          </div>

          <div>
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-900 bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 99)}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleDirectBuy}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
