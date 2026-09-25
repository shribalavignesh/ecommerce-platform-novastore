const { queryAll, queryOne, execute, db } = require('../config/db');

function generateOrderId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `ORD-${year}-${randomNum}`;
}

function generateTrackingNumber() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `TRK-${randomNum}-US`;
}

function createOrder(req, res) {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingFee,
      discount = 0,
      totalAmount
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Shipping address and payment method are required.' });
    }

    const orderId = generateOrderId();
    const trackingNumber = generateTrackingNumber();
    const userId = req.user ? req.user.id : 2; // Default to demo user if guest checkout
    const userName = req.user ? req.user.name : (shippingAddress.fullName || 'Guest Customer');
    const userEmail = req.user ? req.user.email : (shippingAddress.email || 'customer@guest.com');

    // Estimate delivery date 3 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Begin transaction
    db.exec('BEGIN TRANSACTION;');

    try {
      // 1. Insert order
      execute(
        `INSERT INTO orders (
          id, user_id, user_name, user_email, total_amount, subtotal, tax, shipping_fee, discount,
          shipping_address, payment_method, payment_status, status, tracking_number, carrier, estimated_delivery
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          userId,
          userName,
          userEmail,
          Number(totalAmount),
          Number(subtotal),
          Number(tax),
          Number(shippingFee),
          Number(discount),
          JSON.stringify(shippingAddress),
          paymentMethod,
          'Paid',
          'Order Placed',
          trackingNumber,
          'SwiftLogistics Express',
          estimatedDelivery
        ]
      );

      // 2. Insert items and decrement stock
      for (const item of items) {
        execute(
          `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.id || item.product_id,
            item.title,
            Number(item.price),
            item.image || '',
            Number(item.quantity) || 1
          ]
        );

        // Decrement stock if available
        execute(
          `UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?`,
          [Number(item.quantity) || 1, item.id || item.product_id]
        );
      }

      // 3. Insert initial tracking events
      execute(
        `INSERT INTO order_events (order_id, status, message, location) VALUES (?, ?, ?, ?)`,
        [orderId, 'Order Placed', 'Payment processed and order placed successfully', 'Online Portal']
      );

      execute(
        `INSERT INTO order_events (order_id, status, message, location) VALUES (?, ?, ?, ?)`,
        [orderId, 'Processing', 'Order dispatched to central automated warehouse for picking and packing', 'Main Fulfillment Center']
      );

      db.exec('COMMIT;');
    } catch (txError) {
      db.exec('ROLLBACK;');
      throw txError;
    }

    const createdOrder = getOrderWithDetails(orderId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder
    });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create order.' });
  }
}

function getOrderWithDetails(orderId) {
  const order = queryOne('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!order) return null;

  try {
    order.shipping_address = JSON.parse(order.shipping_address);
  } catch (e) {
    // Already an object or string
  }

  order.items = queryAll('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  order.events = queryAll('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC', [orderId]);

  return order;
}

function getMyOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = queryAll('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);

    const populatedOrders = orders.map(order => {
      try {
        order.shipping_address = JSON.parse(order.shipping_address);
      } catch (e) {}
      order.items = queryAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.events = queryAll('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC', [order.id]);
      return order;
    });

    return res.json({ success: true, count: populatedOrders.length, orders: populatedOrders });
  } catch (error) {
    console.error('getMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order history.' });
  }
}

function getAllOrders(req, res) {
  try {
    const { status, search } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (id LIKE ? OR user_name LIKE ? OR user_email LIKE ? OR tracking_number LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const orders = queryAll(sql, params);
    const populated = orders.map(o => {
      try {
        o.shipping_address = JSON.parse(o.shipping_address);
      } catch (e) {}
      o.items = queryAll('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      o.events = queryAll('SELECT * FROM order_events WHERE order_id = ? ORDER BY created_at ASC', [o.id]);
      return o;
    });

    return res.json({ success: true, count: populated.length, orders: populated });
  } catch (error) {
    console.error('getAllOrders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch all orders.' });
  }
}

function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = getOrderWithDetails(id);

    if (!order) {
      return res.status(404).json({ success: false, message: `Order with ID "${id}" was not found.` });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error('getOrderById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
  }
}

function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, message, location } = req.body;

    const order = queryOne('SELECT * FROM orders WHERE id = ?', [id]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    execute(
      `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    const defaultMessages = {
      'Order Placed': 'Order received and confirmed',
      'Processing': 'Items picked and preparing for shipment',
      'In Transit': 'Package handed over to carrier and in transit',
      'Out for Delivery': 'Out for delivery with local courier',
      'Delivered': 'Delivered to recipient address',
      'Cancelled': 'Order has been cancelled'
    };

    const eventMessage = message || defaultMessages[status] || `Status updated to ${status}`;
    const eventLocation = location || 'Regional Logistics Facility';

    execute(
      `INSERT INTO order_events (order_id, status, message, location) VALUES (?, ?, ?, ?)`,
      [id, status, eventMessage, eventLocation]
    );

    const updated = getOrderWithDetails(id);
    return res.json({ success: true, message: `Order status updated to "${status}".`, order: updated });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
}

function getAdminStats(req, res) {
  try {
    const totalOrdersRow = queryOne('SELECT COUNT(*) as count FROM orders');
    const totalRevenueRow = queryOne("SELECT SUM(total_amount) as sum FROM orders WHERE payment_status = 'Paid'");
    const totalProductsRow = queryOne('SELECT COUNT(*) as count FROM products');
    const totalUsersRow = queryOne('SELECT COUNT(*) as count FROM users');
    const statusCounts = queryAll('SELECT status, COUNT(*) as count FROM orders GROUP BY status');

    const recentOrders = queryAll('SELECT id, user_name, total_amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5');

    return res.json({
      success: true,
      stats: {
        totalOrders: totalOrdersRow ? totalOrdersRow.count : 0,
        totalRevenue: totalRevenueRow && totalRevenueRow.sum ? Number(totalRevenueRow.sum.toFixed(2)) : 0,
        totalProducts: totalProductsRow ? totalProductsRow.count : 0,
        totalUsers: totalUsersRow ? totalUsersRow.count : 0,
        statusCounts,
        recentOrders
      }
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getAdminStats
};
