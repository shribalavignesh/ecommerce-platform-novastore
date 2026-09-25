import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/NotificationToast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import AuthModal from './components/AuthModal';

import StorePage from './pages/StorePage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const [currentView, setCurrentView] = useState('store'); // 'store', 'checkout', 'track', 'orders', 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('ORD-2026-4401');

  function handleViewProductDetails(product) {
    setSelectedProduct(product);
  }

  function handleProceedToCheckout() {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleOrderSuccess(newOrderId) {
    setTrackingOrderId(newOrderId);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleTrackOrder(orderId) {
    setTrackingOrderId(orderId);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Container */}
      <div className="flex-1">
        {currentView === 'store' && (
          <StorePage
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewProductDetails={handleViewProductDetails}
            onProceedToCheckout={handleProceedToCheckout}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToStore={() => setCurrentView('store')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'track' && (
          <OrderTrackingPage
            initialOrderId={trackingOrderId}
            onBackToStore={() => setCurrentView('store')}
          />
        )}

        {currentView === 'orders' && (
          <MyOrdersPage
            onTrackOrder={handleTrackOrder}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onBackToStore={() => setCurrentView('store')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardPage
            onTrackOrder={handleTrackOrder}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={() => {
            setSelectedProduct(null);
            handleProceedToCheckout();
          }}
        />
      )}

      {/* Shopping Cart Slide-out Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer */}
      <Footer onCategorySelect={() => setCurrentView('store')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
