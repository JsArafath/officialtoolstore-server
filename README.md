# 🚀 Official Tool Store — Backend

Backend API for the Official Tool Store (ToolStore), a MERN-based eCommerce platform for selling legally authorized digital tools and software subscriptions.

---

## ⚙️ Features

* 🔐 JWT Authentication (Register/Login)
* 👤 Role-based Authorization (Admin/User)
* 🛍️ Product Management (Admin CRUD)
* 🛒 Order Management System
* 💳 SSLCommerz Payment Integration
* 🔒 Secure Password Hashing (bcrypt)
* 🌐 RESTful API
* 📦 MongoDB Database (Atlas)

---

## 🧰 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (jsonwebtoken)
* bcryptjs
* dotenv
* cors

---

## 📁 Project Structure

```bash
officialtoolstore-server/
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── paymentRoutes.js
│   └── orderRoutes.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
│
├── server.js
├── .env
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

SSLC_STORE_ID=your_sslcommerz_store_id
SSLC_STORE_PASSWORD=your_sslcommerz_password
SSLC_IS_LIVE=false

CLIENT_URL=http://localhost:5173
```

---

## 🔧 Installation & Run

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/official-toolstore.git
cd officialtoolstore-server
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Run Server

```bash
npm run dev
```

or

```bash
npm start
```

---

## 🔐 Authentication System

* JWT token-based login system
* Password hashing using bcrypt
* Protected routes using middleware
* Admin-only routes secured

---

## 🛍️ Product API

* `GET /api/products` → Get all products
* `POST /api/products` → Add product (Admin only)
* `DELETE /api/products/:id` → Delete product (Admin only)

---

## 📦 Order API

* `GET /api/orders/my-orders` → User orders
* `GET /api/orders` → All orders (Admin)

---

## 💳 Payment Integration (SSLCommerz)

### Flow:

1. Client calls `/api/payment/init`
2. Server creates order with `pending` status
3. SSLCommerz payment session initialized
4. User redirected to payment gateway
5. After payment → `/api/payment/verify`
6. Order status updated to `paid`

---

## 🛠️ API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Products

* `GET /api/products`
* `POST /api/products`
* `DELETE /api/products/:id`

### Orders

* `GET /api/orders/my-orders`
* `GET /api/orders`

### Payment

* `POST /api/payment/init`
* `POST /api/payment/verify`

---

## 🔒 Security

* JWT authentication
* Role-based authorization
* Password hashing
* Environment variables protection
* CORS configured

---

## 🚀 Deployment

### Backend (Render)

* Build Command: `npm install`
* Start Command: `npm start`

### Environment Variables must be set in Render dashboard.

---

## 🧠 Challenges

* MongoDB Atlas connection issues (SRV fix)
* SSLCommerz integration complexity
* Payment verification flow
* JWT auth + role system

---


## 📌 Status

Backend is functional and under continuous improvement.

Upcoming:

* Payment validation security upgrade
* Admin analytics dashboard
* Review API
* Error handling improvements

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
