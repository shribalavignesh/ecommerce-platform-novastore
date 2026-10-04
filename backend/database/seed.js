const bcrypt = require('bcryptjs');
const { db, execute, queryOne } = require('../config/db');

async function seed() {
  console.log('--- Starting Database Seeding (INR Currency & Multi-Platform Catalog) ---');

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
    { id: 'electronics', name: 'Electronics & Audio', icon: 'Cpu', description: 'Headphones, wearables, smart audio & wireless chargers' },
    { id: 'fashion', name: 'Fashion & Apparel', icon: 'Shirt', description: 'Ethnic wear, hoodies, denim jackets & daily wear' },
    { id: 'home', name: 'Home & Kitchen', icon: 'Home', description: 'Smart ambient lighting, ceramic dining & ergonomic furniture' },
    { id: 'fitness', name: 'Sports & Fitness', icon: 'Activity', description: 'Running shoes, insulated flasks & training gear' },
    { id: 'accessories', name: 'Bags & Accessories', icon: 'Briefcase', description: 'Leather backpacks, watches & travel accessories' }
  ];

  for (const cat of categories) {
    execute(
      `INSERT INTO categories (id, name, icon, description) VALUES (?, ?, ?, ?)`,
      [cat.id, cat.name, cat.icon, cat.description]
    );
  }
  console.log(`Seeded ${categories.length} categories.`);

  // 3. Products in INR (₹) with Multi-Platform Links (Amazon, Flipkart, Meesho)
  const products = [
    {
      title: 'Aura Sound ANC Wireless Headphones',
      description: 'Engineered for audio purists with custom 45mm dynamic drivers, hybrid active noise cancellation, and up to 40 hours of playtime.',
      price: 2499,
      original_price: 4999,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      stock: 35,
      rating: 4.8,
      reviews_count: 142,
      featured: 1,
      brand: 'Aura Sound',
      amazon_url: 'https://www.amazon.in/s?k=wireless+anc+headphones',
      flipkart_url: 'https://www.flipkart.com/search?q=wireless+anc+headphones',
      meesho_url: ''
    },
    {
      title: 'boAt Airdopes 141 True Wireless Earbuds',
      description: '42 hours playback, ENx noise-cancellation tech, ASAP fast charge (5 mins = 75 mins playtime), and IPX4 water resistance.',
      price: 1199,
      original_price: 2990,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      stock: 60,
      rating: 4.7,
      reviews_count: 320,
      featured: 1,
      brand: 'boAt',
      amazon_url: 'https://www.amazon.in/s?k=boat+airdopes+141',
      flipkart_url: 'https://www.flipkart.com/search?q=boat+airdopes+141',
      meesho_url: 'https://www.meesho.com/search?q=boat+earbuds'
    },
    {
      title: 'Noise ColorFit Pulse Grand Smart Watch',
      description: '1.69 inch HD display, 60 sports modes, 150+ customizable cloud watch faces, 24/7 heart rate and SpO2 health monitor.',
      price: 1499,
      original_price: 3999,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      stock: 45,
      rating: 4.6,
      reviews_count: 215,
      featured: 1,
      brand: 'Noise',
      amazon_url: 'https://www.amazon.in/s?k=noise+smart+watch',
      flipkart_url: 'https://www.flipkart.com/search?q=noise+smart+watch',
      meesho_url: 'https://www.meesho.com/search?q=smart+watch'
    },
    {
      title: 'Keychron Tactile RGB Mechanical Keyboard',
      description: 'Hot-swappable tactile switches, CNC aluminum chassis, dynamic RGB backlighting with 18 presets, wireless Bluetooth 5.2.',
      price: 4999,
      original_price: 7999,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      stock: 18,
      rating: 4.9,
      reviews_count: 78,
      featured: 0,
      brand: 'Keychron',
      amazon_url: 'https://www.amazon.in/s?k=mechanical+keyboard',
      flipkart_url: 'https://www.flipkart.com/search?q=mechanical+keyboard',
      meesho_url: ''
    },
    {
      title: 'Anarkali Printed Rayon Kurta Set with Dupatta',
      description: 'Pure breathable rayon fabric with traditional floral gold-foil prints, matching pants, and lightweight chiffon dupatta. Ideal for festive and casual wear.',
      price: 849,
      original_price: 1899,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      stock: 50,
      rating: 4.8,
      reviews_count: 189,
      featured: 1,
      brand: 'Jaipur Crafts',
      amazon_url: 'https://www.amazon.in/s?k=anarkali+kurti+set',
      flipkart_url: 'https://www.flipkart.com/search?q=anarkali+kurti+set',
      meesho_url: 'https://www.meesho.com/search?q=anarkali+kurta+set'
    },
    {
      title: 'Heritage Full-Grain Leather Commuter Backpack',
      description: 'Handcrafted water-resistant vegetable-tanned leather with padded 16-inch laptop compartment and hidden anti-theft pocket.',
      price: 2899,
      original_price: 5499,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      stock: 14,
      rating: 4.9,
      reviews_count: 85,
      featured: 1,
      brand: 'Heritage Leather',
      amazon_url: 'https://www.amazon.in/s?k=leather+commuter+backpack',
      flipkart_url: 'https://www.flipkart.com/search?q=leather+backpack',
      meesho_url: 'https://www.meesho.com/search?q=leather+backpack'
    },
    {
      title: 'Slim Fit Classic Denim Jacket for Men',
      description: '100% premium washed cotton denim with brass buttons, dual chest flap pockets, and timeless rugged streetwear silhouette.',
      price: 1499,
      original_price: 2999,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      stock: 35,
      rating: 4.7,
      reviews_count: 94,
      featured: 0,
      brand: 'Roadster Denims',
      amazon_url: 'https://www.amazon.in/s?k=mens+denim+jacket',
      flipkart_url: 'https://www.flipkart.com/search?q=mens+denim+jacket',
      meesho_url: 'https://www.meesho.com/search?q=denim+jacket'
    },
    {
      title: 'Handcrafted Ceramic Dinner Plates & Bowls (Set of 6)',
      description: 'Artisanal speckled matte stoneware, microwave safe, dishwasher friendly, lead-free food-grade glaze.',
      price: 1299,
      original_price: 2499,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      rating: 4.7,
      reviews_count: 56,
      featured: 0,
      brand: 'Khurja Pottery',
      amazon_url: 'https://www.amazon.in/s?k=ceramic+dinner+plates',
      flipkart_url: 'https://www.flipkart.com/search?q=ceramic+plates+set',
      meesho_url: 'https://www.meesho.com/search?q=ceramic+plates'
    },
    {
      title: 'Milton Thermosteel Flip-Lid Thermal Flask 1000ml',
      description: 'Vacuum insulated double-wall stainless steel keeps beverages hot for 24 hours or cold for 24 hours. Leak-proof flip spout.',
      price: 899,
      original_price: 1295,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      stock: 70,
      rating: 4.9,
      reviews_count: 412,
      featured: 1,
      brand: 'Milton',
      amazon_url: 'https://www.amazon.in/s?k=milton+thermosteel+flask',
      flipkart_url: 'https://www.flipkart.com/search?q=milton+thermosteel+flask',
      meesho_url: 'https://www.meesho.com/search?q=milton+flask'
    },
    {
      title: 'CloudStratus High-Traction Running Shoes',
      description: 'Carbon-infused ultra-cushioned foam midsole, breathable air-mesh upper, and high-grip rubber outsole for road and gym workouts.',
      price: 1899,
      original_price: 3499,
      category: 'fitness',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      stock: 40,
      rating: 4.8,
      reviews_count: 128,
      featured: 1,
      brand: 'CloudStratus',
      amazon_url: 'https://www.amazon.in/s?k=running+shoes+men',
      flipkart_url: 'https://www.flipkart.com/search?q=running+shoes',
      meesho_url: 'https://www.meesho.com/search?q=running+shoes'
    },
    {
      title: 'Cotton Blend Solid Casual Shirt with Mandarin Collar',
      description: 'Soft combed cotton with modern mandarin collar, full sleeves, regular fit styling. Versatile for office and weekend outings.',
      price: 599,
      original_price: 1399,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      stock: 48,
      rating: 4.5,
      reviews_count: 73,
      featured: 0,
      brand: 'Urban Trend',
      amazon_url: 'https://www.amazon.in/s?k=mandarin+collar+shirt',
      flipkart_url: 'https://www.flipkart.com/search?q=mandarin+collar+shirt',
      meesho_url: 'https://www.meesho.com/search?q=mens+casual+shirt'
    },
    {
      title: 'Ambient Architect Smart LED Desk Lamp 10W',
      description: '3 color temperatures (warm, natural, cool white), stepless brightness dimmer, touch control, USB output charging port.',
      price: 999,
      original_price: 1999,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      stock: 30,
      rating: 4.7,
      reviews_count: 65,
      featured: 0,
      brand: 'Wipro Ambient',
      amazon_url: 'https://www.amazon.in/s?k=smart+led+desk+lamp',
      flipkart_url: 'https://www.flipkart.com/search?q=led+desk+lamp',
      meesho_url: 'https://www.meesho.com/search?q=desk+lamp'
    },
    {
      title: 'ErgoComfort High-Back Mesh Executive Office Chair',
      description: 'Adaptive lumbar support, breathable mesh backrest, heavy-duty metal chrome base, smooth 360-degree silent nylon castors.',
      price: 6499,
      original_price: 12999,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1580481077111-9a74f4be2b85?auto=format&fit=crop&w=800&q=80',
      stock: 12,
      rating: 4.8,
      reviews_count: 144,
      featured: 1,
      brand: 'Green Soul Ergo',
      amazon_url: 'https://www.amazon.in/s?k=ergonomic+office+chair',
      flipkart_url: 'https://www.flipkart.com/search?q=office+chair',
      meesho_url: ''
    },
    {
      title: 'OmniCharge 3-in-1 Fast Wireless Charging Station',
      description: 'Simultaneously charge smartphone, smartwatch, and earbuds with Qi fast-charging induction and smart LED indicator.',
      price: 1299,
      original_price: 2499,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80',
      stock: 55,
      rating: 4.6,
      reviews_count: 51,
      featured: 0,
      brand: 'OmniCharge',
      amazon_url: 'https://www.amazon.in/s?k=3+in+1+wireless+charger',
      flipkart_url: 'https://www.flipkart.com/search?q=wireless+charging+station',
      meesho_url: 'https://www.meesho.com/search?q=wireless+charger'
    }
  ];

  for (const p of products) {
    execute(
      `INSERT INTO products (title, description, price, original_price, category, image, stock, rating, reviews_count, featured, brand, amazon_url, flipkart_url, meesho_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.title,
        p.description,
        p.price,
        p.original_price,
        p.category,
        p.image,
        p.stock,
        p.rating,
        p.reviews_count,
        p.featured,
        p.brand,
        p.amazon_url,
        p.flipkart_url,
        p.meesho_url
      ]
    );
  }
  console.log(`Seeded ${products.length} products with multi-platform links.`);

  // 4. Seed Demo Orders for Alex Morgan (in INR ₹)
  const order1Id = 'ORD-2026-4401';
  execute(
    `INSERT INTO orders (id, user_id, user_name, user_email, total_amount, subtotal, tax, shipping_fee, discount, shipping_address, payment_method, payment_status, status, tracking_number, carrier, estimated_delivery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order1Id,
      user.id,
      'Alex Morgan',
      'alex@demo.com',
      3398.00,
      3398.00,
      271.84,
      0.00,
      200.00,
      JSON.stringify({ fullName: 'Alex Morgan', address: '42, MG Road, Brigade Junction', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', phone: '+91 98765 43210' }),
      'UPI / QR (PhonePe / GPay)',
      'Paid',
      'In Transit',
      'TRK-983271-IN',
      'BlueDart Express Logistics',
      'Oct 6, 2026'
    ]
  );

  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order1Id, 1, 'Aura Sound ANC Wireless Headphones', 2499.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 1]
  );
  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order1Id, 9, 'Milton Thermosteel Flip-Lid Thermal Flask 1000ml', 899.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80', 1]
  );

  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-2 days'))`,
    [order1Id, 'Order Placed', 'Payment authorized via UPI (Ref: UPI-984321). Order accepted.', 'Online Portal']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-1 days'))`,
    [order1Id, 'Processing', 'Items inspected, verified and packaged at Bengaluru Mega Hub', 'Hub #1 - Hosur Road, Bengaluru']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-6 hours'))`,
    [order1Id, 'In Transit', 'Package dispatched with BlueDart Express en route to delivery center', 'Koramangala Dispatch Center']);

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
      2899.00,
      2899.00,
      231.92,
      0.00,
      0.00,
      JSON.stringify({ fullName: 'Alex Morgan', address: '42, MG Road, Brigade Junction', city: 'Bengaluru', state: 'Karnataka', zip: '560001', country: 'India', phone: '+91 98765 43210' }),
      'Credit Card (Mastercard •••• 5555)',
      'Paid',
      'Delivered',
      'TRK-882194-IN',
      'BlueDart Express Logistics',
      'Delivered on Oct 2, 2026'
    ]
  );
  execute(
    `INSERT INTO order_items (order_id, product_id, product_title, product_price, product_image, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
    [order2Id, 6, 'Heritage Full-Grain Leather Commuter Backpack', 2899.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 1]
  );
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-5 days'))`,
    [order2Id, 'Order Placed', 'Payment confirmed via Credit Card', 'Online Portal']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-4 days'))`,
    [order2Id, 'In Transit', 'Handed over to courier delivery executive', 'Bengaluru South Hub']);
  execute(`INSERT INTO order_events (order_id, status, message, location, created_at) VALUES (?, ?, ?, ?, datetime('now', '-3 days'))`,
    [order2Id, 'Delivered', 'Delivered safely to recipient at doorstep. Signature recorded.', 'Bengaluru, Karnataka']);

  console.log(`Seeded demo orders and tracking checkpoints in INR.`);
  console.log('--- Database Seeding Complete! ---');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
