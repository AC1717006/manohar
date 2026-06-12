# Surendra Sa Rajputi Fashion — Ecommerce Platform

A full-stack ecommerce site for **Surendra Sa Rajputi Fashion** (Utar Ghee Mandi,
Naya Bazar, Ajmer, Rajasthan 305001) — Rajputi Poshak, Bridal Poshak, Wedding
Collection, Traditional Dress and Kids Collection.

## Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion,
  React Three Fiber / drei, Zustand
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT auth
- **Deployment**: Docker Compose for local dev; AWS EC2 + Nginx + PM2 for
  production (see [DEPLOYMENT.md](./DEPLOYMENT.md))

## Project Structure

```
/backend   Express API + Prisma schema/seed
/frontend  Next.js storefront + admin panel
```

## Local Development

### 1. Database

```bash
docker compose up postgres -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev   # http://localhost:4000
```

Seeded admin login: `admin@surendrasarajputi.com` / `admin123`
(change the password after first login in production).

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev   # http://localhost:3000
```

## Key Features (this phase)

- 3D animated hero (React Three Fiber) with golden royal styling
- Product catalog with category filter & search, 3D tilt product cards
- Product detail page with image zoom, quantity selector, add to cart / buy now
- Cart with GST (5%) and delivery charge calculation (free above ₹5,000)
- Checkout with COD / UPI / QR payment selection, generates `SRF-YYYY-#####` order IDs
- Admin panel: dashboard stats, product CRUD with image upload, order status
  management, customer list with order history
- Floating WhatsApp button, basic SEO (metadata, sitemap, robots.txt)

## Out of Scope (future phases)

- "Rajputi Fashion Assistant" AI chatbot (OpenAI integration)
- Automatic WhatsApp order notifications to the store owner
- Real UPI/QR payment gateway integration (currently a placeholder QR image)
- Wishlist, product reviews, coupon system, recently viewed products

## Database Schema

See [backend/prisma/schema.prisma](./backend/prisma/schema.prisma) for the full
Prisma schema: `users`, `categories`, `products`, `customers`, `orders`,
`order_items`, `payments`, `settings`.
