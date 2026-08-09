# 📈 Trade Journal SaaS

A premium, highly-interactive trading journal application built on the **MERN** stack (MongoDB, Express, React, Node.js). Designed for serious traders, this platform allows users to log trades, track their psychological state, manage trading strategies, and analyze advanced performance metrics—all wrapped in a stunning, animated dark-mode UI.

---

## 🚀 Features at a Glance

* **Premium UI/UX**: Fully custom Dark Mode interface utilizing Tailwind CSS, Glassmorphism elements (`backdrop-blur`), and fluid micro-animations powered by `framer-motion`.
* **Advanced Trade Logging**: 
  * Comprehensive multi-step form for logging trades (Basic Info, Setup & Pricing, Results, Psychology, Media).
  * Direct image uploads for trade screenshots (Before Entry, During Trade, After Exit) powered by **Cloudinary**.
* **Strategy & Mistake Libraries**: Dedicated, visually distinct sections to document trading strategies (rules, win rates) and common psychological/execution mistakes.
* **Learning Notes**: A dedicated section to jot down trading lessons, categorized by topics like 'Price Action', 'Psychology', or 'ICT'.
* **Advanced Statistics**: Built-in analytical dashboard tracking Win Rate, Average R-Multiple, and overall profitability.
* **Global Trade Gallery**: Users can mark specific trades as "Public", allowing them to be showcased in a community gallery.
* **Monetization Ready**: The architecture is fully pre-configured for future SaaS capabilities:
  * Includes a toggleable `ADS_ENABLED` flag in the master layout.
  * Contains a robust `AdSlot` component that conditionally renders a right-hand Ad Rail for non-premium users.
  * `User` schema natively tracks an `isPremium` boolean flag.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS (Strict Dark Mode)
* **Animations**: Framer Motion
* **Routing**: React Router DOM (v6)
* **State Management & Context**: React Context API (`AuthContext`, `TradeContext`)
* **HTTP Client**: Axios

### Backend (Server)
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB & Mongoose ORM
* **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
* **File Uploads**: Multer & Cloudinary API
* **Environment Management**: dotenv

---

## 📂 Project Structure

The repository is organized into a standard full-stack monorepo structure:

```
Trade Journal/
├── backend/                  # Express.js Server
│   ├── config/               # DB Connection & Cloudinary setup
│   ├── controllers/          # Business logic (auth, trades, notes, strategies)
│   ├── middleware/           # JWT Auth protection & Multer config
│   ├── models/               # Mongoose Schemas (User, Trade, Note, etc.)
│   ├── routes/               # Express API endpoints
│   └── server.js             # Entry point
│
├── frontend/                 # React Vite Application
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, AdSlot, FormInputs)
│   │   ├── context/          # React Context providers (Auth, Trades)
│   │   ├── layouts/          # Master layouts (MainLayout with 3-column Ad Rail)
│   │   ├── pages/            # Application views (Dashboard, AddTrade, Strategies, etc.)
│   │   ├── App.jsx           # Route definitions
│   │   └── main.jsx          # React DOM entry
│   │
│   ├── tailwind.config.js    # Tailwind theme extensions & customizations
│   └── vite.config.js        # Vite bundler config
│
├── .gitignore                # Master ignore file
└── README.md                 # You are here!
```

---

## 💻 Local Development Setup

To run this project locally, you will need two terminals running concurrently—one for the backend and one for the frontend.

### 1. Prerequisites
* Node.js (v18+ recommended)
* MongoDB database (Local or MongoDB Atlas)
* Cloudinary Account (for image uploads)

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Keys
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173` (or the port specified by Vite).*

---

## 💸 Monetization & Ads Architecture (For Collaborators)

This application is built with future SaaS scaling in mind. If you are a developer looking to enable ads or premium features, here is how the system works:

1. **The Layout Toggle:** Open `frontend/src/layouts/MainLayout.jsx`. You will find a constant `ADS_ENABLED = false;`. When set to `true`, the layout automatically expands into a 3-column grid on large screens and renders the Ad Rail.
2. **The AdSlot Component:** Located in `frontend/src/components/ui/AdSlot.jsx`. This component automatically hooks into the `AuthContext`. If `user.isPremium` is true, the AdSlot returns null (hiding the ad).
3. **Premium Status:** The backend `User` model (`backend/models/User.js`) contains an `isPremium` boolean. This is passed down via the JWT token payload upon login.

---

## 🎨 UI/UX Design Guidelines

If you are contributing to the frontend, please adhere strictly to the established design system:
* **Dark Mode Only**: We do not support light mode. Rely on Tailwind's `gray-900`, `gray-800`, and `gray-700` palette for structure.
* **Modals over Pages**: For creating sub-entities (like Strategies, Mistakes, or Notes), use `framer-motion` modals with `backdrop-blur-sm` rather than routing the user to a new page.
* **Gradients & Glows**: Use subtle gradient typography for headers (`bg-clip-text bg-gradient-to-r from-white to-gray-400`) and glowing shadows for premium button hover states.
