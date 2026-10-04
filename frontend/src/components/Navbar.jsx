import React, { useState } from 'react';
import { ShoppingBag, Search, User, Shield, Package, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

export default function Navbar({
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  onOpenAuthModal
}) {
  const { user, isAdmin, isAuthenticated, logout, loginAsDemo } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('store')}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="text-left">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition">
                  Nova<span className="text-blue-600">Store</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                  Full-Stack E-Com
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setCurrentView('store')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === 'store'
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Store Catalog
              </button>
              <button
                onClick={() => setCurrentView('track')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                  currentView === 'track'
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Track Order</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    currentView === 'orders'
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Orders
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                    currentView === 'admin'
                      ? 'text-purple-700 bg-purple-100 font-bold'
                      : 'text-purple-600 hover:bg-purple-50 font-semibold'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'store') setCurrentView('store');
                }}
                placeholder="Search products, headphones, titanium watch..."
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Right Action Icons: Auth & Cart */}
          <div className="flex items-center gap-2.5">
            {/* Developer GitHub Reference */}
            <a
              href="https://github.com/shribalavignesh"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition border border-slate-700 hover:shadow"
              title="Developer GitHub: Shri Bala Vignesh A R"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-slate-300 font-normal">Dev:</span>
              <span>Shri Bala Vignesh</span>
            </a>

            {/* Quick Demo Switcher if not admin */}
            {!isAdmin && (
              <button
                onClick={() => loginAsDemo('admin')}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition"
                title="Switch directly to Admin role for evaluation"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Quick Admin</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition focus:outline-none"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-slate-200"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-slate-200"
                  />
                  <div className="hidden md:block text-left text-xs pr-1">
                    <p className="font-semibold text-slate-800 leading-none truncate max-w-[100px]">{user.name}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? 'text-purple-600' : 'text-slate-500'}`}>
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setCurrentView('orders');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Orders</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
