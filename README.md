# OptiMart AI — E-Commerce Web Application

**Tagline:** *Shop Smarter. Sell Better. Waste Less.*

OptiMart AI is a production-grade, full-stack, responsive AI-powered e-commerce web platform integrating three core innovations:
1. **AI Smart Surplus Marketplace** — Detects warehouse holding velocity gaps and suggests seller-approved discounts up to 55% off MSRP, liquidating overstock and preventing supply chain landfill waste.
2. **AI Price Guardian** — Audits 180-day simulated historical catalogue price points to deliver an objective 0–100 Deal Score, volatility ratings, and strategic purchase advice.
3. **AI Smart Cart & Budget Assistant** — Helps customers shop within strict budgets in Indian Rupees (₹), automatically recommending high-value surplus alternatives and duplicate removals with user-approved swaps.

---

## 1. Key Platform Features

- **10,200+ Product Demonstration Catalogue**: Seeded deterministically using reproducible pseudo-random generation across 15 retail categories, ensuring identical, stable records without bloat.
- **Three.js 3D Interactive Hero**: Interactive holographic geometric artifact with responsive camera tracking, dynamic lighting, and graceful CSS/SVG fallbacks for non-WebGL devices.
- **Opti Assistant Co-pilot**: Floating AI assistant powered by Gemini 3.8 Flash (`@google/genai` server-side SDK) with grounded catalogue item retrieval and conversational shopping recommendations.
- **Seller Portal & Surplus Pricing Engine**: Complete dashboard for 6 verified demo merchants to review carrying costs, approve AI-suggested discounts, and publish new products.
- **Safe Demo Checkout & Tracking**: Cash on Delivery and Instant UPI demo flows, address book management, stock reservations, and order tracking timelines.
- **Side-by-Side Product Comparison**: Compare up to 4 items across specifications, warranties, return policies, and deal ratings.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React icons, Three.js
- **Backend**: Node.js, Express, tsx
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK with model `gemini-3.8-flash`) via server-side proxy
- **Product Pipeline**: Scalable deterministic catalogue generator (`10,200` items) with category-specific high-resolution photography

---

## 3. Setup and Run Commands

### Development Server
```bash
# Install dependencies
npm install

# Start full-stack development server on port 3000
npm run dev
```

### Production Build
```bash
# Build frontend bundle
npm run build

# Start production server
npm start
```

### Type Checking & Linting
```bash
npm run lint
```

---

## 4. Configuration Instructions

### Gemini API Configuration
The Gemini API key is managed securely server-side.
- Define `GEMINI_API_KEY` in your environment (in AI Studio, this is automatically injected via the Secrets panel).
- Server routes (`/api/gemini/*`) consume `process.env.GEMINI_API_KEY` using the official `@google/genai` SDK with `model: 'gemini-3.8-flash'`.
- If no key is set or the API is unreachable, OptiMart AI falls back gracefully to a deterministic rule-based pricing and recommendation engine.

### Firebase Configuration (Optional)
OptiMart AI includes a self-contained demonstration data provider for sessions, carts, and orders. To connect to Cloud Firestore and Firebase Authentication:
1. Provide Firebase Web App credentials in `.env` (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.).
2. The catalogue schema maps to collections `products`, `orders`, `sellerProfiles`, and `users`.
3. Seed the catalogue using the deterministic `generateCatalogue()` pipeline in batches of 500 documents.

---

## 5. Verification & Testing

- **TypeScript Compilation**: Verified via `tsc --noEmit` with zero errors.
- **Production Build**: Verified via Vite build system.
- **Responsiveness**: Tested across mobile (360px, 390px), tablet (768px), laptop (1024px), and desktop (1440px+).
- **Catalogue Integrity**: Deterministic Mulberry32 PRNG guarantees 10,200 unique product IDs (`OPT-10001` through `OPT-20200`) with consistent prices, ratings, and image mappings.
