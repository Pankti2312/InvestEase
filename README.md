# InvestEase - Digital Investor Operations Platform

InvestEase is a premium, AI-assisted (rule-based) investor self-service platform designed for mutual fund companies. It drastically reduces inbound customer support calls by moving repetitive tasks (like KYC, nominee updates, SIP failures, and statements) into a highly actionable, secure self-service dashboard.

## 🚀 Key Features

*   **Command Center Dashboard**: A premium, SaaS-tier dashboard showcasing portfolio values, daily trends, and an interactive Investor Health Score.
*   **Smart Insights**: Dynamically generated, color-coded recommendations that tell investors exactly what they need to do (e.g., "Complete your KYC", "SIP Payment Failed").
*   **Guided Resolution Assistant**: A JSON-powered decision tree that catches common support queries and routes users to self-service actions (like "Retry Payment") instead of creating tickets.
*   **Dynamic Statement Generation**: Backend PDF generation using `pdfkit` for downloading precise, customized monthly statements.
*   **Admin Support Queue**: A dedicated panel for administrators to review KYC documents, resolve support tickets, and manage operations.
*   **Full CRUD Modules**: Manage SIPs, Nominees, and KYC verification seamlessly.

## 🛠 Tech Stack

*   **Frontend**: React, Vite, Tailwind CSS v4, Recharts, Lucide Icons, React Router.
*   **Backend**: Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), Multer (file uploads), PDFKit.

## 💻 Running Locally

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Run the seed script to populate the database with mock data:
```bash
node seed/seed.js
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Test Credentials
*   **Investor Account**: `demo@investease.com` / `Demo@123`
*   **Admin Account**: `admin@investease.com` / `Admin@123`

## 📊 Mock Analytics Note

> [!NOTE]
> Business metrics shown in the prototype are representative values intended to demonstrate operational impact. In production, these metrics would be calculated from live platform analytics.

## 🛡️ Security

This project is configured to safely ignore `.env` files and the `node_modules` and `uploads` directories from version control. Ensure you never commit your production `MONGO_URI` or `JWT_SECRET` to a public repository.
