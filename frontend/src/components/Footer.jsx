import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export default function Footer({ onCategorySelect }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value props banner */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">Free Express Shipping</h4>
                <p className="text-[11px] text-slate-400">On all orders over $75</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">256-Bit SSL Security</h4>
                <p className="text-[11px] text-slate-400">Encrypted payment gateway</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-slate-800 rounded-xl text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">30-Day Hassle Returns</h4>
                <p className="text-[11px] text-slate-400">Full money-back guarantee</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-slate-800 rounded-xl text-purple-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">24/7 Priority Support</h4>
                <p className="text-[11px] text-slate-400">Dedicated agent team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <span className="text-white font-bold text-sm tracking-tight">NovaStore</span>
          <span className="text-slate-500">| Complete Full-Stack E-Commerce Project</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Database: SQLite / PostgreSQL / MySQL / MongoDB</span>
          <span>•</span>
          <span>Role-Based Access: Admin & Customer</span>
        </div>

        <div className="text-slate-500">
          &copy; {new Date().getFullYear()} NovaStore. Built for production demonstration.
        </div>
      </div>
    </footer>
  );
}
