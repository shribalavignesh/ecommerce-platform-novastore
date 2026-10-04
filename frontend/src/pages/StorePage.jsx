import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Cpu,
  Shirt,
  Home,
  Activity,
  Briefcase,
  Layers,
  Store,
  ExternalLink
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { formatINR } from '../utils/format';

export default function StorePage({
  searchQuery,
  setSearchQuery,
  onViewProductDetails,
  onProceedToCheckout
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all'); // 'all', 'amazon', 'flipkart', 'meesho'
  const [sortBy, setSortBy] = useState('newest');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const categoryIcons = {
    all: Layers,
    electronics: Cpu,
    fashion: Shirt,
    home: Home,
    fitness: Activity,
    accessories: Briefcase
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPlatform, sortBy, maxPrice, searchQuery]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/products/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);
      if (sortBy) params.append('sortBy', sortBy);
      if (maxPrice < 10000) params.append('maxPrice', maxPrice);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Great Indian Festive Catalog • Amazon, Flipkart & Meesho Partnered</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Best deals in India. <span className="text-blue-400">Compare & Save Big.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Shop authentic electronics, trending ethnic wear, and home essentials in <strong>Indian Rupees (₹)</strong> with live order tracking or compare instantly on Amazon, Flipkart, and Meesho.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('electronics');
                  window.scrollTo({ top: 480, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
              >
                Explore Electronics
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('fashion');
                  window.scrollTo({ top: 480, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-pink-600/90 hover:bg-pink-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-pink-500/30 transition transform hover:-translate-y-0.5"
              >
                Meesho & Fashion Deals
              </button>
            </div>
          </div>

          {/* Hero Feature Card */}
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-3 text-xs text-blue-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>TOP FESTIVE OFFER</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                50% OFF
              </span>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden mb-3">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Featured Product"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-white font-bold text-sm">Aura Sound ANC Wireless Headphones</h4>
            <p className="text-slate-300 text-xs mt-1 line-clamp-2">
              45mm dynamic bass drivers, active hybrid noise cancellation, 40 hrs playtime.
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <div>
                <span className="text-lg font-extrabold text-white">₹2,499</span>
                <span className="text-xs text-slate-400 line-through ml-2">₹4,999</span>
              </div>
              <button
                onClick={() => {
                  const item = products.find(p => p.id === 1);
                  if (item) onViewProductDetails(item);
                }}
                className="text-xs bg-white text-slate-900 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Marketplace Platform Filter Bar */}
        <div className="mb-6 p-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Marketplace Hub:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedPlatform === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              All Stores
            </button>
            <button
              onClick={() => setSelectedPlatform('amazon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedPlatform === 'amazon'
                  ? 'bg-amber-400 text-slate-900 font-bold shadow-sm'
                  : 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
              }`}
            >
              <span>Amazon Items</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('flipkart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedPlatform === 'flipkart'
                  ? 'bg-blue-500 text-white font-bold shadow-sm'
                  : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
              }`}
            >
              <span>Flipkart Items</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('meesho')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedPlatform === 'meesho'
                  ? 'bg-pink-500 text-white font-bold shadow-sm'
                  : 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30'
              }`}
            >
              <span>Meesho Items</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Categories</span>
          </button>

          {categories.map(cat => {
            const IconComponent = categoryIcons[cat.id] || Layers;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.product_count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row */}
        <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Active Status & Search indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-slate-900 font-bold">{products.length}</span> items
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-lg border border-blue-200">
                <span>Filter: &ldquo;{searchQuery}&rdquo;</span>
                <button onClick={() => setSearchQuery('')} className="font-bold text-blue-900">
                  ×
                </button>
              </span>
            )}
            {selectedPlatform !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-lg border border-amber-200 capitalize">
                <span>Platform: {selectedPlatform}</span>
                <button onClick={() => setSelectedPlatform('all')} className="font-bold text-amber-900">
                  ×
                </button>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Price Slider in INR */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Max:</span>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-blue-600 cursor-pointer"
              />
              <span className="font-bold text-slate-800 w-16">{formatINR(maxPrice)}</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded-md w-1/2 mb-4"></div>
                  <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No matching products found</h3>
              <p className="text-xs text-slate-500 mb-6">
                Try adjusting your search keyword, category, or platform filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                  setSearchQuery('');
                  setMaxPrice(10000);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-medium text-xs rounded-xl hover:bg-blue-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={onViewProductDetails}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
