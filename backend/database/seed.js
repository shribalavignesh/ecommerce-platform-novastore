const bcrypt = require('bcryptjs');
const { db, execute, queryOne } = require('../config/db');

async function seed() {
  console.log('--- Starting Database Seeding ---');

  // Clear existing data in correct order
  db.exec(`
    DELETE FROM order_events;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  // 1. Create Users (Admin & Customer)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const userPasswordHash = await bcrypt.hash('user123', salt);

  execute(
    `INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)`,
    ['System Administrator', 'admin@shop.com', adminPasswordHash, 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80']
  );

  execute(
    `INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)`,
    ['Alex Morgan', 'alex@demo.com', userPasswordHash, 'user', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80']
  );

  const admin = queryOne('SELECT id FROM users WHERE email = ?', ['admin@shop.com']);
  const user = queryOne('SELECT id FROM users WHERE email = ?', ['alex@demo.com']);

  console.log(`Seeded users: Admin (ID: ${admin.id}), Demo Customer (ID: ${user.id})`);

  // 2. Categories
  const categories = [
    { id: 'electronics', name: 'Electronics & Gadgets', icon: 'Cpu', description: 'Cutting-edge tech, wearables, and audio gear' },
    { id: 'fashion', name: 'Fashion & Apparel', icon: 'Shirt', description: 'Curated modern styles and daily essentials' },
    { id: 'home', name: 'Home & Living', icon: 'Home', description: 'Furniture, kitchenware, and ambient interior' },
    { id: 'fitness', name: 'Sports & Outdoors', icon: 'Activity', description: 'Performance equipment and training accessories' },
    { id: 'accessories', name: 'Bags & Accessories', icon: 'Briefcase', description: 'Premium leather goods and travel gear' }
  ];

  for (const cat of categories) {
    execute(
      `INSERT INTO categories (id, name, icon, description) VALUES (?, ?, ?, ?)`,
      [cat.id, cat.name, cat.icon, cat.description]
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 3. Products
  const products = [
    {
      title: 'Aura Sound ANC Wireless Headphones',
      description: 'Engineered for audio purists with custom 45mm dynamic drivers, hybrid active noise cancellation, and up to 40 hours of playtime on a single charge.',
      price: 199.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: 35,
      rating: 4.8,
      reviews_count: 142,
      featured: 1
    },
    {
      title: 'Vanguard Titanium Smart Watch Pro',
      description: 'Aircraft-grade titanium casing, sapphire crystal display, ECG monitoring, built-in dual GPS, and water resistance up to 50 meters.',
      price: 249.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      stock: 22,
      rating: 4.9,
      reviews_count: 98,
      featured: 1
    },
    {
      title: 'Keychron Tactical Mechanical Keyboard',
      description: 'Hot-swappable tactile switches, CNC aluminum chassis, RGB backlighting with 18 dynamic presets, and wireless Bluetooth 5.2 connectivity.',
      price: 119.50,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      stock: 18,
      rating: 4.7,
      reviews_count: 67,
      featured: 0
    },
    {
      title: 'OmniCharge 3-in-1 MagSafe Charging Dock',
      description: 'Fast charge your phone, smartwatch, and earbuds simultaneously with sleek weighted aluminum base and intelligent heat dissipation.',
      price: 54.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
      stock: 50,
      rating: 4.6,
      reviews_count: 43,
      featured: 0
    },
    {
      title: 'Heritage Full-Grain Leather Commuter Backpack',
      description: 'Handcrafted water-resistant vegetable-tanned leather with padded 16-inch laptop compartment, hidden passport pocket, and breathable back panel.',
      price: 159.00,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      stock: 14,
      rating: 4.9,
      reviews_count: 85,
      featured: 1
    },
    {
      title: 'Minimalist Matte Ceramic Pour-Over Set',
      description: 'Artisanal stoneware dripper paired with double-wall borosilicate glass carafe for the ultimate pour-over coffee ritual at home.',
      price: 42.00,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      stock: 28,
      rating: 4.6,
      reviews_count: 38,
      featured: 0
    },
    {
      title: 'ErgoComfort Lumbar Mesh Executive Chair',
      description: 'Adaptive 3D lumbar support, high-density breathable mesh, 4D adjustable armrests, and synchro-tilt mechanism engineered for all-day posture.',
      price: 289.99,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1580481077111-9a74f4be2b85?auto=format&fit=crop&w=800&q=80',
      stock: 11,
      rating: 4.8,
      reviews_count: 112,
      featured: 1
    },
    {
      title: 'CloudStratus Ultra-Responsive Trail Runners',
      description: 'Proprietary carbon-infused midsole, multi-directional lug outsole for aggressive grip, and breathable hydrophobic mesh upper.',
      price: 135.00,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      stock: 40,
      rating: 4.7,
      reviews_count: 76,
      featured: 1
    },
    {
      title: 'HydroShield Vacuum-Insulated Thermal Flask 32oz',
      description: 'Triple-wall stainless steel keeps beverages piping hot for 18 hours or iced cold for 36 hours. Spill-proof magnetic flip lid included.',
      price: 29.99,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      stock: 65,
      rating: 4.9,
      reviews_count: 210,
      featured: 0
    },
    {
      title: 'Signature Heavyweight Cotton French Terry Hoodie',
      description: '450 GSM combed organic cotton with relaxed drop-shoulder silhouette, double-layered hood, and reinforced ribbed cuffs.',
      price: 78.00,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      rating: 4.5,
      reviews_count: 54,
      featured: 0
    },
    {
      title: 'Luxe Italian Silk-Wool Blend Overcoat',
      description: 'Tailored notched lapels, horn buttons, premium Bemberg lining, and timeless silhouette for both formal and elevated streetwear.',
      price: 320.00,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      stock: 8,
      rating: 4.9,
      reviews_count: 29,
      featured: 1
    },
    {
      title: 'Ambient Architect LED Smart Desk Lamp',
      description: 'Full-spectrum CRI 98 glare-free lighting, dual touch color-temperature sliders (2700K - 6500K), and integrated ambient light auto-sensor.',
      price: 64.50,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      rating: 4.7,
      reviews_count: 48,
      featured: 0
    }
  ];

  for (const p of products) {
    execute(
      `INSERT INTO products (title, description, price, category, image, stock, rating, reviews_count, featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.title, p.description, p.price, p.category, p.image, p.stock, p.rating, p.reviews_count, p.featured]
    );
  }
  console.log(`Seeded ${products.length} products.`);

  // 4. Seed Demo Orders for Alex Morgan (user ID)
  const order1Id = 'ORD-2026-4401';
  execute(
    `INSERT INTO orders (id, user_id, user_name, user_email, total_amount, subtotal, tax, shipping_fee, discount, shipping_address, payment_method, payment_status, status, tracking_number, carrier, estimated_delivery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order1Id,
      user.id,
      'Alex Morgan',
      'alex@demo.com',
      248.98,
      229.98,
      19.00,
      0.00,
      0.00,
      JSON.stringify({ fullName: 'Alex Morgan', address: '742 Evergreen Terrace', city: 'Seattle', state: 'WA', zip: '98101', country: 'United States', phone: '+1 (555) 234-5678' }),
      'Credit Card (Visa •••• 4242)',
      'Paid',
      'In Transit',
      'TRK-983271-US',
      'SwiftLogistics Express',
      'Sept 27, 2026'
    ]
  );

  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order1Id, 1, 'Aura Sound ANC Wireless Headphones', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 1]
  );
  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order1Id, 9, 'HydroShield Vacuum-Insulated Thermal Flask 32oz', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', 1]
  );

  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-2 days'))`,
    [order1Id, 'Order Placed', 'Order received and payment authorized successfully', 'Online Portal']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-1 days'))`,
    [order1Id, 'Processing', 'Items picked, verified for quality, and packaged', 'Fulfillment Hub A - Seattle, WA']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-6 hours'))`,
    [order1Id, 'In Transit', 'Package departed sorting facility en route to local delivery station', 'Transit Station #4']);

  // Second demo order: Delivered
  const order2Id = 'ORD-2026-1189';
  execute(
    `INSERT INTO orders (id, user_id, user_name, user_email, total_amount, subtotal, tax, shipping_fee, discount, shipping_address, payment_method, payment_status, status, tracking_number, carrier, estimated_delivery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order2Id,
      user.id,
      'Alex Morgan',
      'alex@demo.com',
      169.54,
      159.00,
      10.54,
      0.00,
      0.00,
      JSON.stringify({ fullName: 'Alex Morgan', address: '742 Evergreen Terrace', city: 'Seattle', state: 'WA', zip: '98101', country: 'United States', phone: '+1 (555) 234-5678' }),
      'UPI / Digital Wallet',
      'Paid',
      'Delivered',
      'TRK-882194-US',
      'SwiftLogistics Express',
      'Delivered on Sept 22, 2026'
    ]
  );
  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order2Id, 5, 'Heritage Full-Grain Leather Commuter Backpack', 159.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 1]
  );
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-5 days'))`,
    [order2Id, 'Order Placed', 'Order confirmed and paid via digital wallet', 'Online Portal']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-4 days'))`,
    [order2Id, 'In Transit', 'Dispatched with courier', 'West Coast Hub']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-3 days'))`,
    [order2Id, 'Delivered', 'Delivered to resident at front door. Signature captured.', 'Seattle, WA']);

  console.log(`Seeded demo orders and tracking events.`);
  console.log('--- Database Seeding Complete! ---');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
