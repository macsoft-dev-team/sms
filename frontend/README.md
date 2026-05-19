# StockSuite Frontend API Connected

React + Vite + Redux Toolkit frontend connected to the Node/Express/Prisma backend.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Make sure the backend is running on `http://localhost:5000`.

## Backend expected routes

```text
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
GET  /api/users
POST /api/users
PUT  /api/users/:id
GET  /api/customers
POST /api/customers
PUT  /api/customers/:id
GET  /api/manufacturers
GET  /api/products
POST /api/products
PUT  /api/products/:id
GET  /api/locations
GET  /api/inventory
GET  /api/inventory/summary
GET  /api/transactions
POST /api/transactions
GET  /api/transactions/template
POST /api/transactions/upload
```

## Demo credentials from backend seed

```text
admin@app.local / admin123
user@app.local / user123
```

## Notes

This version removes localStorage demo data for business records. Authentication token is stored in localStorage and API data is loaded from the backend.

Customers, products, and users support Excel sample download and Excel upload from the frontend. The upload parser reads the Excel file in the browser and creates records using the existing backend create APIs.
