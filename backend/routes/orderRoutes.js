const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const { queryOne } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Optional auth helper for guest checkout vs logged in user
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = queryOne('SELECT id, name, email, role, avatar FROM users WHERE id = ?', [decoded.id]);
      if (user) req.user = user;
    } catch (e) {
      // Ignore token failure for optional auth
    }
  }
  next();
}

// User & Guest checkout
router.post('/', optionalAuth, orderController.createOrder);

// User order history
router.get('/mine', verifyToken, orderController.getMyOrders);

// Admin order metrics & all orders
router.get('/stats', verifyToken, requireAdmin, orderController.getAdminStats);
router.get('/', verifyToken, requireAdmin, orderController.getAllOrders);

// Order tracking / details by ID
router.get('/:id', orderController.getOrderById);

// Admin status update
router.patch('/:id/status', verifyToken, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
