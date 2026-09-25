import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './NotificationToast';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  function handleQuickAdd(e) {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.title}" to cart!`);
  }

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Wrap */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {product.featured ? (
          <span className="absolute top-3 left-3 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Staff Pick
          </span>
        ) : null}

        {/* Hover overlay quick action */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="p-2.5 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-50 transition transform hover:scale-110"
            title="Quick view"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="capitalize font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating || '4.8'}</span>
            </div>
          </div>

          <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition">
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400">
              {product.stock > 0 ? (
                <span className="text-emerald-600 font-medium">In stock ({product.stock})</span>
              ) : (
                <span className="text-rose-600 font-medium">Out of stock</span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
