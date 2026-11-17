# Finance App

A modern fullstack application for tracking personal finances. Built as a Bachelor Thesis project, it features user authentication, transaction management, visualizations, and UI theming.

---

## 🌟 Features

-   🔐 **Authentication** – Register, login, and secure user sessions with JWT
-   💸 **Transactions** – Add, edit, delete, filter by category, date, and type
-   📊 **Charts** – Visual breakdown via pie and line charts
-   🎨 **Dark Mode** – Switchable light/dark theme in settings
-   🌍 **Multi-currency** – Toggle between EUR €, USD $, and UAH ₴
-   📁 **Persistent Categories** – Save frequently used transaction categories
-   🧭 **Floating Quick Add Widget** – Add transactions without scrolling

---

## 🚀 Live Demo

Click below to open and test the live application:

👉 **[Launch Finance App (Live Demo)](https://finance-app-client-usqr.onrender.com)**

> ⏳ **Note:** Hosted on Render's free tier. If the server is asleep, the initial load may take **30–50 seconds** while it wakes up. Thanks for your patience!

---

### 🔑 Demo Account & Login Options

You can test the application in two ways:

1. **Use the pre-filled Demo Account** (recommended to explore existing charts & transaction data right away):
   - **Email:** `yhrhrbn@gmail.com`
   - **Password:** `123456`

2. **Create your own fresh account:**
   - Register a new account manually with your email.
   - Or sign in quickly via **Google OAuth**.

---

### 🔗 API Endpoints
- **Backend API Base URL:** [https://finance-app-backend-5fja.onrender.com](https://finance-app-backend-5fja.onrender.com)
---

## 🛠️ Tech Stack

### Frontend

-   React 19 + TypeScript
-   Material UI + Bootstrap
-   React Router v7
-   Recharts

### Backend

-   Node.js + Express
-   MongoDB + Mongoose
-   JWT for auth
-   CORS + .env configuration

---

## ⚙️ Running Locally

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/finance-app.git
cd finance-app
```

2. Install dependencies:

```bash
cd client
npm install
cd ../server
npm run dev
```

3. Set up environment variables:

#### `client/.env.development`

```
REACT_APP_API_URL=http://localhost:5000/api
```

#### `server/.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Run locally:

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm start
```

> The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
finance-app/
├── client/          # React frontend
├── server/          # Express backend
├── README.md
└── ...
```

---

## 📃 License

This project is part of a Bachelor Thesis and open for learning and inspiration.
