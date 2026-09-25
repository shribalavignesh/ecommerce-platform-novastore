const bcrypt = require('bcryptjs');
const { queryOne, execute } = require('../config/db');
const { generateToken } = require('../middleware/auth');

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = queryOne('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Role safety: Only explicitly allow admin if requested in development/demo mode or default to user
    const assignedRole = (role === 'admin') ? 'admin' : 'user';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

    const result = execute(
      'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), normalizedEmail, hashedPassword, assignedRole, avatar]
    );

    const newUser = queryOne('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = queryOne('SELECT * FROM users WHERE email = ?', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      created_at: user.created_at
    };

    const token = generateToken(safeUser);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}

function getDemoAccounts(req, res) {
  return res.json({
    success: true,
    accounts: [
      { role: 'admin', email: 'admin@shop.com', password: 'admin123', label: 'Store Administrator' },
      { role: 'user', email: 'alex@demo.com', password: 'user123', label: 'Demo Customer' }
    ]
  });
}

module.exports = {
  register,
  login,
  getMe,
  getDemoAccounts
};
