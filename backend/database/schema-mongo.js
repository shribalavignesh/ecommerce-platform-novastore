/**
 * MongoDB / Mongoose Data Models for E-Commerce Platform
 * Demonstrates document-oriented schema design with embedded subdocuments for order items & tracking events.
 */

const mongoose = require('mongoose');

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewsCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// 3. Order Item Subdocument Schema
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productTitle: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productImage: { type: String },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

// 4. Order Tracking Event Subdocument Schema
const orderEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  location: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

// 5. Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Paid' },
  status: {
    type: String,
    enum: ['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Processing',
    index: true
  },
  trackingNumber: { type: String },
  carrier: { type: String, default: 'SwiftLogistics Express' },
  estimatedDelivery: { type: String },
  events: [orderEventSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema)
};
