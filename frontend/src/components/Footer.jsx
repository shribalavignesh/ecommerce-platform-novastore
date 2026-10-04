import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Phone, User, ExternalLink, Code2 } from 'lucide-react';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

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
                <p className="text-[11px] text-slate-400">On all orders over ₹999</p>
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

      {/* Developer & Project Reference Showcase Card */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/60 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30">
                <Code2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                    Lead Developer & Author
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                    Full-Stack Submission
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Shri Bala Vignesh A R</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete E-Commerce Architecture &bull; React 19 &bull; Node.js &bull; REST API &bull; Multi-DB
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:6381566225"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition shadow-sm hover:border-slate-600"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 63815 66225</span>
              </a>

              <a
                href="https://github.com/shribalavignesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
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
          &copy; {new Date().getFullYear()} NovaStore. Developed by <span className="text-slate-300 font-medium">Shri Bala Vignesh A R</span>.
        </div>
      </div>
    </footer>
  );
}
