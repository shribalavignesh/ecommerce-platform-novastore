import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecommerce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('ecommerce_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('ecommerce_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('ecommerce_coupon');
    }
  }, [coupon]);

  function addToCart(product, quantity = 1) {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock || 99)
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            title: product.title,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock || 99)
          }
        ];
      }
    });
    setIsDrawerOpen(true);
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.min(quantity, item.stock || 99) } : item
      )
    );
  }

  function removeFromCart(productId) {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
    setCoupon(null);
  }

  function applyCoupon(code) {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE20') {
      const c = { code: 'SAVE20', discountPercent: 20, description: '20% Off Entire Order' };
      setCoupon(c);
      return { success: true, message: 'Coupon SAVE20 applied! 20% discount granted.' };
    } else if (clean === 'SAVE200') {
      const c = { code: 'SAVE200', discountFixed: 200, description: '₹200 Off Instant Voucher' };
      setCoupon(c);
      return { success: true, message: 'Coupon SAVE200 applied! ₹200 discount granted.' };
    } else if (clean === 'WELCOME500') {
      const c = { code: 'WELCOME500', discountFixed: 500, description: '₹500 Off Welcome Offer' };
      setCoupon(c);
      return { success: true, message: 'Coupon WELCOME500 applied! ₹500 discount granted.' };
    } else if (clean === 'FREESHIP') {
      const c = { code: 'FREESHIP', freeShipping: true, description: 'Free Express Shipping' };
      setCoupon(c);
      return { success: true, message: 'Coupon FREESHIP applied! Shipping is free.' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try SAVE20, SAVE200, or FREESHIP' };
    }
  }

  function removeCoupon() {
    setCoupon(null);
  }

  // Calculations in INR (₹)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discountAmount = Number(((subtotal * coupon.discountPercent) / 100).toFixed(2));
    } else if (coupon.discountFixed) {
      discountAmount = Math.min(subtotal, coupon.discountFixed);
    }
  }

  const shippingFee = (subtotal >= 999 || subtotal === 0 || coupon?.freeShipping) ? 0 : 99;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableAmount * 0.05).toFixed(2)); // 5% GST
  const totalAmount = Number((taxableAmount + tax + shippingFee).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee,
        tax,
        totalAmount,
        coupon,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
