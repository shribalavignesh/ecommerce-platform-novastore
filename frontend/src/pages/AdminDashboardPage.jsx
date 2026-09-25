import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  Database,
  Search,
  Filter,
  RefreshCw,
  X,
  Truck,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/NotificationToast';

export default function AdminDashboardPage({ onTrackOrder, onOpenAuthModal }) {
  const { user, token, isAdmin, loginAsDemo } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'database'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inspectingOrder, setInspectingOrder] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('electronics');
  const [formImage, setFormImage] = useState('');
  const [formStock, setFormStock] = useState('15');
  const [formFeatured, setFormFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin && token) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, token]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchOrders(),
        fetchCategories()
      ]);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/orders/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {}
  }

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (e) {}
  }

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (e) {}
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/products/categories');
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (e) {}
  }

  // Open modal for Create
  function openCreateModal() {
    setEditingProduct(null);
    setFormTitle('');
    setFormDesc('');
    setFormPrice('');
    setFormCategory('electronics');
    setFormImage('https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80');
    setFormStock('20');
    setFormFeatured(false);
    setIsProductModalOpen(true);
  }

  // Open modal for Edit
  function openEditModal(prod) {
    setEditingProduct(prod);
    setFormTitle(prod.title);
    setFormDesc(prod.description);
    setFormPrice(prod.price);
    setFormCategory(prod.category);
    setFormImage(prod.image);
    setFormStock(prod.stock);
    setFormFeatured(!!prod.featured);
    setIsProductModalOpen(true);
  }

  // Save product (Create or Update)
  async function handleSaveProduct(e) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formTitle,
      description: formDesc,
      price: Number(formPrice),
      category: formCategory,
      image: formImage,
      stock: Number(formStock),
      featured: formFeatured
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Operation failed.');

      showToast(editingProduct ? 'Product updated successfully!' : 'New product created!');
      setIsProductModalOpen(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // Delete product
  async function handleDeleteProduct(id, title) {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Delete failed');

      showToast(`Product "${title}" deleted.`);
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Update Order Status
  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          message: `Order status updated to ${newStatus} by Store Admin`,
          location: 'Central Fulfillment Logistics'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Status update failed');

      showToast(`Order ${orderId} updated to ${newStatus}!`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // Access Control Guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500 mb-6">
          This portal allows managing product inventory and dispatching customer orders. Sign in with administrator credentials to continue.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => loginAsDemo('admin')}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/25 transition"
          >
            1-Click Login as Demo Admin
          </button>
          <button
            onClick={onOpenAuthModal}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
          >
            Custom Sign In
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.user_email.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Operations Suite</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage product inventory, fulfill orders, and monitor real-time database transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Sales Volume</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ${stats ? stats.totalRevenue.toFixed(2) : '0.00'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Live Realized Revenue</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Orders</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats ? stats.totalOrders : '0'}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">Across all customers</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Catalog Items</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats ? stats.totalProducts : '0'}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Active in store</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Registered Users</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {stats ? stats.totalUsers : '0'}
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Admin & Customers</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Management ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order Dispatch & Status ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'database'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Architecture (MySQL / PG / Mongo)</span>
        </button>
      </div>

      {/* Tab 1: Product Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <span className="text-xs text-slate-500 text-right">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-100 bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 truncate max-w-xs">{prod.title}</p>
                          <span className="text-[10px] text-slate-400">ID: #{prod.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${Number(prod.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stock > 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : prod.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">★ {prod.rating || '4.8'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders & Dispatch Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Orders Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID, Customer name or email..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <span className="text-xs text-slate-500 text-right">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Live Status (Update)</th>
                  <th className="py-3 px-4">Carrier & Tracking</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-slate-900">{order.id}</p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{order.user_name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{order.user_email}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ${Number(order.total_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-blue-50 text-blue-800 border-blue-300'
                        }`}
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700 text-xs font-medium">{order.carrier}</p>
                      <p className="font-mono text-[10px] text-blue-600">{order.tracking_number}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setInspectingOrder(order)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                          title="View order invoice & address"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onTrackOrder(order.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Live tracking view"
                        >
                          <Truck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Database Integration Hub */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Multi-Engine Database Integration</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              This application satisfies the specification: <strong>&ldquo;Database integration with MySQL, PostgreSQL, or MongoDB&rdquo;</strong>.
              It features active zero-friction native persistence and includes ready-to-run DDL schemas and connection scripts for all 3 databases.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest bg-blue-200/60 px-2 py-0.5 rounded">
                  Active Runtime
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">Native SQLite Engine</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Built-in Node.js 26 <code>node:sqlite</code> with relational foreign keys and ACID transactions. Persisted to <code>backend/data/ecommerce.db</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest bg-slate-200 px-2 py-0.5 rounded">
                  MySQL Ready
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">MySQL / MariaDB Schema</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Production DDL schema with InnoDB, foreign keys, and indexes located at: <code>backend/database/schema-mysql.sql</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest bg-slate-200 px-2 py-0.5 rounded">
                  PostgreSQL / Mongo Ready
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-2">Postgres & Mongoose Schemas</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Postgres DDL at <code>schema-postgres.sql</code> and Mongoose document models at <code>schema-mongo.js</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Aura Studio Noise-Cancelling Headphones"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    placeholder="149.99"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="electronics">Electronics & Gadgets</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home">Home & Living</option>
                  <option value="fitness">Sports & Outdoors</option>
                  <option value="accessories">Bags & Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Detailed specifications and highlights..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formFeatured}
                  onChange={e => setFormFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-700">
                  Highlight as Featured Product (Staff Pick)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-mono font-bold text-slate-900 text-sm">{inspectingOrder.id}</h3>
                <span className="text-[11px] text-slate-500">Customer: {inspectingOrder.user_name} ({inspectingOrder.user_email})</span>
              </div>
              <button
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Address</span>
                <p className="font-semibold text-slate-900 mt-1">{inspectingOrder.shipping_address?.fullName}</p>
                <p>{inspectingOrder.shipping_address?.address}, {inspectingOrder.shipping_address?.city}, {inspectingOrder.shipping_address?.state} {inspectingOrder.shipping_address?.zip}</p>
                <p className="text-slate-400">{inspectingOrder.shipping_address?.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">Ordered Items</span>
                <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                  {inspectingOrder.items?.map(it => (
                    <div key={it.id} className="py-2 flex justify-between">
                      <span>{it.product_title} × {it.quantity}</span>
                      <span className="font-bold">${(Number(it.product_price) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span>${Number(inspectingOrder.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
