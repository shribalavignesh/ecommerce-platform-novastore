const http = require('http');

const PORT = 5000;
let userToken = '';
let adminToken = '';
let createdProductId = null;
let createdOrderId = null;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n--- 🚀 RUNNING FULL-STACK BACKEND API TEST SUITE ---\n');

  // 1. Health check
  const health = await request('GET', '/health');
  assert(health.status === 200 && health.body.status === 'online', 'Health Check API returns online');

  // 2. Demo Accounts
  const demoAccounts = await request('GET', '/auth/demo-accounts');
  assert(demoAccounts.status === 200 && demoAccounts.body.accounts.length === 2, 'Fetch demo accounts list');

  // 3. Customer Login
  const customerLogin = await request('POST', '/auth/login', {
    email: 'alex@demo.com',
    password: 'user123'
  });
  assert(customerLogin.status === 200 && customerLogin.body.token, 'Customer login succeeds and returns JWT');
  userToken = customerLogin.body.token;

  // 4. Admin Login
  const adminLogin = await request('POST', '/auth/login', {
    email: 'admin@shop.com',
    password: 'admin123'
  });
  assert(adminLogin.status === 200 && adminLogin.body.user.role === 'admin', 'Admin login succeeds with admin role');
  adminToken = adminLogin.body.token;

  // 5. Products Catalog
  const productsRes = await request('GET', '/products');
  assert(productsRes.status === 200 && productsRes.body.products.length >= 12, `Fetch products catalog (found ${productsRes.body.products.length})`);

  // 6. Categories List
  const catRes = await request('GET', '/products/categories');
  assert(catRes.status === 200 && catRes.body.categories.length === 5, 'Fetch categories with product counts');

  // 7. Product Search & Filter
  const searchRes = await request('GET', '/products?search=Headphones');
  assert(searchRes.status === 200 && searchRes.body.products.length >= 1, 'Product search returns matching items');

  // 8. RBAC Protection: Non-admin cannot create product
  const forbiddenCreate = await request('POST', '/products', {
    title: 'Hacker Item',
    description: 'Should fail',
    price: 99,
    category: 'electronics',
    image: 'test.jpg'
  }, userToken);
  assert(forbiddenCreate.status === 403, 'RBAC prevents normal customer from creating product (403 Forbidden)');

  // 9. Admin creates a new product
  const newProduct = await request('POST', '/products', {
    title: 'Aerospace Wireless Gaming Mouse',
    description: 'Ultra-lightweight 58g honeycomb shell with PixArt 3395 optical sensor and 4000Hz polling rate.',
    price: 79.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    featured: true
  }, adminToken);
  assert(newProduct.status === 201 && newProduct.body.product.id, 'Admin successfully creates new product via CRUD API');
  createdProductId = newProduct.body.product.id;

  // 10. Checkout & Place Order
  const orderRes = await request('POST', '/orders', {
    items: [
      { id: createdProductId, title: 'Aerospace Wireless Gaming Mouse', price: 79.99, quantity: 2, image: 'mouse.jpg' }
    ],
    shippingAddress: {
      fullName: 'Alex Morgan',
      email: 'alex@demo.com',
      address: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    paymentMethod: 'Credit Card (Visa •••• 4242)',
    subtotal: 159.98,
    tax: 12.80,
    shippingFee: 0.00,
    discount: 10.00,
    totalAmount: 162.78
  }, userToken);
  assert(orderRes.status === 201 && orderRes.body.order.id, `Order placed successfully (Order ID: ${orderRes.body.order?.id})`);
  createdOrderId = orderRes.body.order.id;

  // 11. Customer checks order tracking timeline
  const trackRes = await request('GET', `/orders/${createdOrderId}`);
  assert(trackRes.status === 200 && trackRes.body.order.events.length >= 2, 'Order tracking timeline retrieved with tracking events');

  // 12. Admin updates order status to 'Out for Delivery'
  const updateStatusRes = await request('PATCH', `/orders/${createdOrderId}/status`, {
    status: 'Out for Delivery',
    message: 'Package is with delivery agent and out for immediate delivery',
    location: 'Seattle Metro Station'
  }, adminToken);
  assert(updateStatusRes.status === 200 && updateStatusRes.body.order.status === 'Out for Delivery', 'Admin successfully updates order status');

  // 13. Admin stats & metrics overview
  const statsRes = await request('GET', '/orders/stats', null, adminToken);
  assert(statsRes.status === 200 && statsRes.body.stats.totalOrders > 0, `Admin metrics overview retrieved (Total orders: ${statsRes.body.stats.totalOrders})`);

  // 14. Admin deletes product
  const deleteRes = await request('DELETE', `/products/${createdProductId}`, null, adminToken);
  assert(deleteRes.status === 200, 'Admin successfully deletes product');

  console.log('\n🎉 ALL 14 BACKEND API TESTS PASSED WITH 100% SUCCESS!\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
