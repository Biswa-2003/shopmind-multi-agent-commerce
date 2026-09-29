# ShopMind AI — AI-Powered E-Commerce Assistant
> *"Shopping, powered by intelligence."*

ShopMind AI is a production-grade, next-generation conversational shopping platform that helps customers discover, understand, compare, and purchase electronics and lifestyle products using natural language reasoning.

---

## 🌟 Key Highlights

- 🧠 **Multi-Agent AI Architecture**: Coordinated 6-agent system (`ShoppingOrchestratorAgent`, `IntentAgent`, `ProductSearchAgent`, `RecommendationAgent`, `ComparisonAgent`, `ProductQAAgent`).
- ⚡ **Next.js 16 App Router**: Ultra-fast server and client rendering powered by Turbopack.
- 🎨 **Visual Excellence**: Dark-mode-first aesthetic with violet/indigo gradients, subtle glassmorphism cards, and Framer Motion micro-interactions.
- 🇮🇳 **Indian Rupee Standard**: Native INR (`₹`) formatting across all product pricing and budget filters.
- 💬 **Conversational Shopping Concierge**: Answers natural queries like *"Find a laptop under ₹60,000 for coding"* or *"Suggest the best phone for photography"* with direct add-to-cart actions.
- ⚖️ **Side-by-Side Comparison Matrix**: 4-device hardware spec comparison with automated AI winners.
- 🛒 **Persistent Shopping Bag & Wishlist**: Real-time Zustand stores with local synchronization and animated badge counters.
- 🛡️ **Fail-Safe Client Fallback**: AI Assistant automatically falls back to client-side heuristics if the backend server is temporarily unreachable.

---

## 📁 Monorepo Workspace Structure

```
Shopping_assistant/
├── apps/
│   ├── web/                     # Next.js 16 App Router web frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router pages (/, /shop, /products, /assistant, /compare, /cart, /wishlist)
│   │   │   ├── components/      # UI primitives, layout, catalog, assistant, cart, comparison
│   │   │   ├── data/            # 24+ structured Indian market electronics products
│   │   │   ├── hooks/           # useAssistant, useCart, useWishlist, useProducts
│   │   │   ├── store/           # Persistent Zustand state stores
│   │   │   └── types/           # TypeScript interfaces for products and agent messaging
│   │   └── package.json
│   └── mobile/                  # Cross-platform React Native / Expo workspace
├── backend/                     # Node.js Express TypeScript API
│   ├── src/
│   │   ├── agents/              # Multi-agent fleet (Orchestrator, Intent, Search, Rec, Comp, QA)
│   │   ├── config/              # Environment config and database connections
│   │   ├── controllers/         # Request handling and JSON validation
│   │   ├── data/                # In-memory product database with specs & sentiment
│   │   ├── middleware/          # Helmet, CORS, Morgan, Error handler, Zod validator
│   │   ├── routes/              # Express route declarations (assistant, products, cart, health)
│   │   ├── services/            # Core business logic and agent invocation
│   │   ├── types/               # Agent and domain model types
│   │   └── utils/               # Structured response formatter and logger
│   └── package.json
├── database/                    # Database migrations and models
│   ├── prisma/
│   │   └── schema.prisma        # Complete schema (User, Product, Category, Cart, Wishlist, Order, Review)
│   └── sql/                     # Seed and DDL scripts
├── packages/
│   ├── shared-types/            # Shared TypeScript domain contracts
│   ├── validation/              # Zod validation schemas
│   └── api-client/              # Unified API client
├── docs/                        # Architecture, API, Agent workflows, Roadmap
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (v22+ recommended)
- **npm**: v9.0.0 or later
- **PostgreSQL**: v14 or later, running locally (or via `docker compose up postgres`)

### 1. Install dependencies (once, from the repo root)

```bash
npm install
```

### 2. Configure and create the database

```bash
cp backend/.env.example backend/.env
# Edit backend/.env: set DATABASE_URL (your Postgres password) and JWT_SECRET
```

Create the database named in `DATABASE_URL` (e.g. `createdb -U postgres smartshop_ai`), then:

```bash
npm run db:deploy --workspace=backend   # create tables from database/prisma/migrations
npm run db:seed --workspace=backend     # load 9 categories, 24 products and a demo account
```

Demo login: `demo@shopmind.ai` / `demo12345`

### 3. Start Backend API (`backend`)

```bash
npm run dev:backend
```

The Express API server will listen on **[http://localhost:5000](http://localhost:5000)**.
Check health (including the database connection) at: `http://localhost:5000/api/health`

### 4. Start Frontend (`apps/web`)

```bash
npm run dev:web
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### How data is stored

- **Products** live in PostgreSQL. The website loads them from the API and falls back to its bundled copy (`apps/web/src/data/products.ts`, also the seed source) if the backend is down.
- **Accounts** use bcrypt-hashed passwords and JWT tokens (`/api/auth/register`, `/login`, `/me`).
- **Cart and wishlist** are kept in the browser for guests. After login they're merged into the account and saved in the database.
- **Orders** are placed at checkout with **Pay online** (Razorpay: UPI, cards, netbanking) or **Cash on Delivery**. The server recalculates every price from the database.

### Payments & order processing (event-driven)

```
Checkout ─► Order Service ─► orders + outbox_events (same transaction)
                                   │ relay
                                   ▼
                        pg-boss queues (PostgreSQL)
   ┌───────────────┬───────────────┼────────────────┬──────────────────┐
   ▼               ▼               ▼                ▼                  ▼
inventory.*     payment.*       email.*       order.cancel-on-     (each handler:
reserve/commit/ refund on       confirmation/ stock-failure         own queue, retries
release stock   cancel          receipt/                            with backoff, then
                                cancellation                        dead-letter queue)
```

- **Events:** `OrderCreated`, `PaymentSucceeded`, `PaymentFailed`, `StockReservationFailed`, `OrderCancelled` ([backend/src/events](backend/src/events)).
- **Online payment:** the order starts as `pending_payment` with its stock held. It becomes `paid` only after the server verifies Razorpay's signature (from the browser callback or the webhook, whichever arrives first). Unpaid orders are cancelled after `PAYMENT_TIMEOUT_MINUTES`, and their stock is released.
- **Compensation:** if stock runs out or an order is cancelled after payment, the payment is refunded automatically.
- **Idempotency:** every handler records `(eventId, handler)` in `processed_events`, so redelivered events are skipped.
- **Dead letter queue:** after `EVENT_RETRY_LIMIT` retries, the failed event and its last error are kept in `dead_letter_events`. List them with `npm run dlq --workspace=backend`; after fixing the cause, replay with `npm run dlq --workspace=backend -- replay all`.
- **No Razorpay keys?** In development a simulated gateway is used: the payment page shows "Simulate success / failure" buttons and no money moves. It is refused in production. To go live, add your Razorpay keys to `backend/.env`.
- **AI assistant** conversations are saved (`conversations` / `messages` tables), so follow-ups like "add the second one to my cart" work. The AI model parses each message into intent, category, budget and product IDs, with keyword rules as a fallback when no API key is set. Cart requests return an `add_to_cart` action that the website applies.
- **CORS** allows only `CLIENT_URL`, any origins listed in `CORS_ORIGINS`, and in development, any `localhost` port.

---

## 🧪 Example AI Prompts to Try

Test the conversational shopping concierge on `/assistant` or via the homepage AI preview:

1. **Budget Coding Laptop**:
   > *"Find a laptop under ₹60,000 for coding."*  
   > *(Recommends Acer Swift Go 14 OLED at ₹57,990 with 16GB RAM and OLED display)*

2. **Smartphone Photography**:
   > *"Suggest the best phone for photography."*  
   > *(Recommends Vivo X100 Pro with ZEISS 1-inch sensor and iPhone 15 Pro)*

3. **Smartwatch under ₹5,000**:
   > *"Show me headphones or smartwatches under ₹5,000."*  
   > *(Recommends Noise ColorFit Pro 5 at ₹3,799 and boAt Nirvana Ion at ₹1,999)*

4. **Direct Hardware Inquiries**:
   > *"What is the battery life of the MacBook Air M3?"*  
   > *(Answers factually: Up to 18 hours with 52.6Wh battery)*

---

## 📚 Technical Documentation

- 🏛️ [System Architecture](file:///e:/Shopping_assistant/docs/architecture.md)
- 🤖 [Multi-Agent System & Workflows](file:///e:/Shopping_assistant/docs/ai-agents.md)
- 📡 [REST API Specification](file:///e:/Shopping_assistant/docs/api-documentation.md)
- 🗺️ [Development Roadmap (Phases 1–13)](file:///e:/Shopping_assistant/docs/development-roadmap.md)
- 🗄️ [Database Design](file:///e:/Shopping_assistant/docs/database-design.md)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router + Turbopack) |
| **Styling** | Tailwind CSS + Glassmorphism tokens |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Client State** | Zustand (`persist` middleware) |
| **Backend Framework** | Node.js + Express + TypeScript |
| **Validation** | Zod |
| **Database ORM** | Prisma ORM |
| **Security** | Helmet.js + CORS |
