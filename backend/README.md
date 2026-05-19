# Inventory Backend Full

Full backend for the StockSuite / SUNSHAFT inventory frontend.

## Stack

Node.js, Express, MySQL, Prisma ORM, JWT auth, role authorization, Socket.IO, Multer, XLSX.

## Run

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run db:seed
npm run dev
```

Backend runs at `http://localhost:5000`.

## Seeded Login

```text
admin@app.local / admin123
user@app.local / user123
```

## Main API

```text
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile

GET  /api/users
POST /api/users
GET  /api/users/:id
PUT  /api/users/:id
GET  /api/users/template
POST /api/users/upload

GET  /api/customers
POST /api/customers
GET  /api/customers/:id
PUT  /api/customers/:id
GET  /api/customers/template
POST /api/customers/upload

GET  /api/manufacturers
POST /api/manufacturers
PUT  /api/manufacturers/:id

GET  /api/products
POST /api/products
GET  /api/products/:id
PUT  /api/products/:id
GET  /api/products/template
POST /api/products/upload

GET  /api/locations
POST /api/locations
PUT  /api/locations/:id

GET  /api/inventory
GET  /api/inventory/summary

GET  /api/transactions
POST /api/transactions
GET  /api/transactions/template
POST /api/transactions/upload
```

## Socket Events

Server emits:

```text
inventory:changed
transaction:created
```

Client can emit:

```text
join:inventory
```
