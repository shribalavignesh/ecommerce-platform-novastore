# 🛒 NovaStore — Full-Stack E-Commerce & Order Tracking Platform

An enterprise-grade, production-ready full-stack E-Commerce web application built to fulfill modern software engineering standards.

---

## 📋 Project Specifications & Rubric Compliance

| Requirement from Specification | Implementation Status | Technical Details |
|---|---|---|
| **Product Catalog, Add to Cart & Checkout** | ✅ Complete | Dynamic catalog with multi-facet filters (category, price slider, search, sort). Persistent shopping cart with coupon support (`SAVE20`, `WELCOME10`, `FREESHIP`), multi-step checkout with real-time tax/shipping calculations, and instant order placement. |
| **User Login & Role-Based Access Control (RBAC)** | ✅ Complete | JWT authentication + Bcrypt password hashing. Dual roles: **Customer** (browse, cart, order history, profile) and **Administrator** (CRUD catalog management, order fulfillment, status dispatcher, revenue analytics). Built-in 1-click demo presets. |
| **Backend REST APIs for Products & Orders** | ✅ Complete | 14+ documented RESTful endpoints in Express.js handling auth, catalog queries, admin product CRUD, transaction-safe checkout, status updates, and tracking event logs. 100% automated test coverage. |
| **Database Integration (MySQL, PostgreSQL, MongoDB)** | ✅ Complete | Powered natively out-of-the-box by Node.js 26 `node:sqlite` (zero external daemon required). Complete, production-grade schema DDLs and data models provided for **MySQL** (`schema-mysql.sql`), **PostgreSQL** (`schema-postgres.sql`), and **MongoDB** (`schema-mongo.js`). |

---

## 🛠️ Architecture & Tech Stack

```
ecommerce-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # SQLite database initialization & transaction helpers
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, JWT issuance, demo accounts
│   │   ├── productController.js  # Catalog filtering, search, and Admin CRUD
│   │   └── orderController.js    # Checkout transactions, order tracking & timeline events
│   ├── database/
│   │   ├── seed.js               # Rich seed script (products, categories, users, demo orders)
│   │   ├── schema-mysql.sql      # Production MySQL 8.0 schema DDL
│   │   ├── schema-postgres.sql   # Production PostgreSQL schema DDL
│   │   └── schema-mongo.js       # Production MongoDB / Mongoose models
│   ├── middleware/
│   │   └── auth.js               # JWT verification & RBAC authorization guards
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js                 # Express app, middleware, logging & health check
│   └── test-api.js               # Automated 14-point API verification suite
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProductCard, DetailModal, CartDrawer, AuthModal
│   │   ├── context/              # AuthContext (RBAC) & CartContext (state, coupons)
│   │   ├── pages/
│   │   │   ├── StorePage.jsx          # Hero, category pills, search, filter slider, product grid
│   │   │   ├── CheckoutPage.jsx       # Multi-payment methods (Card, UPI, COD), address, invoice
│   │   │   ├── OrderTrackingPage.jsx  # 5-step visual tracking timeline, carrier info, audit events
│   │   │   ├── MyOrdersPage.jsx       # Customer order portal & past invoices
│   │   │   └── AdminDashboardPage.jsx # Revenue metrics, product CRUD modals, order status dispatcher
│   │   ├── App.jsx
│   │   └── index.css             # Modern Tailwind CSS styling & animations
│   ├── vite.config.js            # Vite configuration with API proxy to backend
│   └── package.json
└── package.json                  # Root orchestration scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node.js v26.4.0)
- **NPM**: v9+

### 2. Launch the Application

#### Terminal 1 — Start the Backend Server (Port 5000):
```bash
cd backend
node server.js
```
*Health Check available at: `http://localhost:5000/api/health`*

#### Terminal 2 — Start the Frontend Client (Port 5173):
```bash
cd frontend
npm.cmd run dev
```
*Frontend opens at: `http://localhost:5173`*

---

## 🔑 Demo Login Credentials

For quick evaluation without manually filling registration forms:

| Account Type | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@shop.com` | `admin123` | Full Admin Dashboard, Catalog CRUD, Order Status Dispatcher, Metrics |
| **Customer** | `alex@demo.com` | `user123` | Store Catalog, Cart, Checkout, Order History, Tracking |

*(Both accounts can also be instantly logged in using the **1-Click Evaluation Presets** inside the Sign In modal!)*

---

## 📦 Live Demo Order IDs for Testing Tracking

The database comes pre-seeded with real-time orders in various logistical states:

- **`ORD-2026-4401`**: Status = `In Transit` (SwiftLogistics Express, en route to Seattle, WA)
- **`ORD-2026-1189`**: Status = `Delivered` (Delivered to front door, signature confirmed)
- *Any new order placed during testing automatically receives a live Order ID and tracking number!*

---

## 🧪 Automated Test Suite

A comprehensive 14-step automated verification test is included:

```bash
cd backend
node test-api.js
```

### Verified Checks:
1. `GET /api/health` -> Health check online
2. `GET /api/auth/demo-accounts` -> Demo credentials endpoint
3. `POST /api/auth/login` -> Customer login & JWT issuance
4. `POST /api/auth/login` -> Admin login & role verification
5. `GET /api/products` -> 12+ pre-seeded products catalog
6. `GET /api/products/categories` -> 5 categories with product counts
7. `GET /api/products?search=Headphones` -> Query filter verification
8. `POST /api/products` (Customer) -> **RBAC 403 Forbidden protection verified**
9. `POST /api/products` (Admin) -> **Admin product creation CRUD verified**
10. `POST /api/orders` -> Transaction-safe order placement & stock decrement
11. `GET /api/orders/:id` -> Complete tracking timeline & events lookup
12. `PATCH /api/orders/:id/status` -> Admin status update to 'Out for Delivery'
13. `GET /api/orders/stats` -> Live store revenue & order metric calculations
14. `DELETE /api/products/:id` -> Admin product removal CRUD verified

---

## 🗄️ Database Schemas & Integrations

The system natively runs on Node.js built-in SQLite database at `backend/data/ecommerce.db`.
To integrate with external database management systems:

- **MySQL / MariaDB**: Run `mysql -u root -p < backend/database/schema-mysql.sql`
- **PostgreSQL**: Run `psql -U postgres -d ecommerce_db -f backend/database/schema-postgres.sql`
- **MongoDB**: Connect via Mongoose schemas defined in `backend/database/schema-mongo.js`

---

## 🛡️ Key Software Engineering Highlights
- **ACID Transactions**: Checkout wraps order creation, item normalization, and inventory decrement within an atomic database transaction (`BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK`).
- **Role-Based Security**: Administrative endpoints enforce strict JWT token validation and role matching (`requireAdmin` middleware).
- **Responsive Modern UI**: Built with React 19, Tailwind CSS v4, Lucide icons, glassmorphism design, and real-time toast notifications.
