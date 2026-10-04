const { queryAll, queryOne, execute } = require('../config/db');

function getAllProducts(req, res) {
  try {
    const { category, search, sortBy, minPrice, maxPrice, featured, platform } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (platform && platform !== 'all') {
      if (platform === 'amazon') {
        sql += ' AND (amazon_url IS NOT NULL AND amazon_url != "")';
      } else if (platform === 'flipkart') {
        sql += ' AND (flipkart_url IS NOT NULL AND flipkart_url != "")';
      } else if (platform === 'meesho') {
        sql += ' AND (meesho_url IS NOT NULL AND meesho_url != "")';
      } else if (platform === 'direct') {
        sql += ' AND (amazon_url IS NULL OR amazon_url = "") AND (flipkart_url IS NULL OR flipkart_url = "")';
      }
    }

    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ? OR brand LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (featured === '1' || featured === 'true') {
      sql += ' AND featured = 1';
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'rating':
        sql += ' ORDER BY rating DESC';
        break;
      case 'title':
        sql += ' ORDER BY title ASC';
        break;
      case 'newest':
      default:
        sql += ' ORDER BY created_at DESC';
        break;
    }

    const products = queryAll(sql, params);
    return res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
}

function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = queryOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
}

function getCategories(req, res) {
  try {
    const categories = queryAll(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    return res.json({ success: true, categories });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
}

function createProduct(req, res) {
  try {
    const {
      title,
      description,
      price,
      original_price,
      category,
      image,
      stock,
      featured,
      brand,
      amazon_url,
      flipkart_url,
      meesho_url
    } = req.body;

    if (!title || !description || price == null || !category || !image) {
      return res.status(400).json({ success: false, message: 'Missing required product fields.' });
    }

    const result = execute(
      `INSERT INTO products (title, description, price, original_price, category, image, stock, rating, reviews_count, featured, brand, amazon_url, flipkart_url, meesho_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        Number(price),
        original_price ? Number(original_price) : Number(price) * 1.3,
        category.trim(),
        image.trim(),
        Number(stock) || 10,
        featured ? 1 : 0,
        brand ? brand.trim() : 'NovaStore',
        amazon_url ? amazon_url.trim() : '',
        flipkart_url ? flipkart_url.trim() : '',
        meesho_url ? meesho_url.trim() : ''
      ]
    );

    const newProduct = queryOne('SELECT * FROM products WHERE id = ?', [result.lastInsertRowid]);
    return res.status(201).json({ success: true, message: 'Product created successfully.', product: newProduct });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
}

function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = queryOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      title = existing.title,
      description = existing.description,
      price = existing.price,
      original_price = existing.original_price,
      category = existing.category,
      image = existing.image,
      stock = existing.stock,
      featured = existing.featured,
      brand = existing.brand,
      amazon_url = existing.amazon_url,
      flipkart_url = existing.flipkart_url,
      meesho_url = existing.meesho_url
    } = req.body;

    execute(
      `UPDATE products
       SET title = ?, description = ?, price = ?, original_price = ?, category = ?, image = ?, stock = ?, featured = ?, brand = ?, amazon_url = ?, flipkart_url = ?, meesho_url = ?
       WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        Number(price),
        original_price != null ? Number(original_price) : null,
        category.trim(),
        image.trim(),
        Number(stock),
        featured ? 1 : 0,
        brand ? brand.trim() : 'NovaStore',
        amazon_url ? amazon_url.trim() : '',
        flipkart_url ? flipkart_url.trim() : '',
        meesho_url ? meesho_url.trim() : '',
        id
      ]
    );

    const updated = queryOne('SELECT * FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product updated successfully.', product: updated });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
}

function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const existing = queryOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    execute('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
};
