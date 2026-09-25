const { queryAll, queryOne, execute } = require('../config/db');

function getAllProducts(req, res) {
  try {
    const { category, search, sortBy, minPrice, maxPrice, featured } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
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
    const { title, description, price, category, image, stock, featured } = req.body;

    if (!title || !description || price == null || !category || !image) {
      return res.status(400).json({ success: false, message: 'Missing required product fields.' });
    }

    const result = execute(
      `INSERT INTO products (title, description, price, category, image, stock, rating, reviews_count, featured)
       VALUES (?, ?, ?, ?, ?, ?, 5.0, 1, ?)`,
      [
        title.trim(),
        description.trim(),
        Number(price),
        category.trim(),
        image.trim(),
        Number(stock) || 10,
        featured ? 1 : 0
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
      category = existing.category,
      image = existing.image,
      stock = existing.stock,
      featured = existing.featured
    } = req.body;

    execute(
      `UPDATE products
       SET title = ?, description = ?, price = ?, category = ?, image = ?, stock = ?, featured = ?
       WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        Number(price),
        category.trim(),
        image.trim(),
        Number(stock),
        featured ? 1 : 0,
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
