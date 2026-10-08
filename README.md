# HALYARD — High-Converting E-Commerce Storefront

A high-conversion e-commerce storefront for **Halyard**, an engineered jewelry brand selling bracelets in **recycled 316L marine-grade stainless steel** and **solid 925 sterling silver** across silver, gold, and matte black finishes.

Built with **Next.js (App Router)**, **TypeScript**, and **custom CSS design tokens** (supporting dark and light modes, accessible contrast, and smooth micro-interactions).

---

## 🚀 Key Highlights & Features

### 1. Visual Aesthetics & Design System
- **Curated Palette**: Cool slate neutrals (`hsl(220 14% 6%)`), crisp foregrounds, metallic gradients (silver, 18k gold, DLC black), and a petrol-teal accent (`hsl(192 60% 38%)`).
- **Typography**:
  - `Archivo`: Bold, industrial uppercase headlines (`font-weight: 900`).
  - `Hanken Grotesk`: Crisp, readable body copy.
  - `JetBrains Mono`: Technical specifications, dimensions, currency prices, and badges.
- **Sharp Corners & Tactile Controls**: 0px radius on product stages and cards; pill-shaped (`999px`) on interactive chips and buttons.
- **Theme Provider**: Seamless Dark and Light theme switching via CSS variables.

### 2. High-Converting Collection Experience (`/bracelets` & `/`)
- **Hero Section**:
  - 14-piece catalog callout.
  - Interactive swaying bracelet stage (`BraceletSVG`) with real-time finish switching.
  - 3-point proof strip (Lifetime Warranty, Recycled 316L & 925 Silver, Free Shipping Over €40).
- **Sticky Filter Bar**:
  - Category tabs (`All`, `Chains`, `Cuffs`, `Signets`) with live item counts.
  - Material filters (`316L Steel`, `925 Silver`).
  - Finish swatches (`Silver`, `Gold`, `Black`).
  - Instant client search with clear button.
  - Price and name sorting.
- **Product Grid**:
  - 4-column responsive grid (down to 390px mobile).
  - Hover slide-up action bar: Quick Add (instant bag addition) and Quick View.
  - Live finish selector on each card.
  - Wishlist toggle button.
  - **Bundle Tile**: Injected after the 4th product ("Stack Three, Save 10%").
- **Metallurgy Comparison Table**: Detailed technical comparison between 316L stainless steel and 925 sterling silver.
- **Interactive Fit Finder**: Slider from 14–22 cm with drape preference selection and calculated size recommendations.
- **Private Previews Newsletter**: Instant validation and subscription confirmation.
- **Complete Footer**: Studio ethos, 4-column link tree, payment icons, and legal lines.

### 3. Slide-in Bag Drawer & Promotional Tiers
- **Tier 1**: Free shipping progress bar (orders over €40).
- **Tier 2**: Free signature gift box progress bar (orders over €100).
- **Automatic 10% Bundle Discount**: Automatically applied when 3 or more bracelets are in the bag.
- **Quantity Steppers & Line-item removal**.
- **Bag Pop Animation**: Cart icon reacts with micro-bounce upon addition.

### 4. Interactive Quick-View Modal
- Accessible modal with keyboard navigation (Esc to close) and backdrop click dismissal.
- Full finish switching, unisize/sized selection, accordion specs, and instant add-to-bag.

### 5. Product Detail Pages (`/bracelets/[slug]`)
- Dynamic metadata & JSON-LD `Product` schema for SEO.
- Interactive multi-finish gallery stage.
- Technical specifications accordion, care guide, lifetime guarantee, and shipping details.
- **Curated Pairings ("Wear It With")**: Direct links to complementary stack pieces.

### 6. Specialized Experience Pages
- **Stack Builder (`/stack-builder`)**: Interactive 3-slot visual stack creator with live 10% savings calculation and one-click stack add.
- **Gift Guide (`/gift-guide`)**: Fail-safe gift guide focusing on adjustable unisize pieces (no sizing required), solid silver heirlooms, and under-€30 foundations.
- **Standalone Fit Finder (`/fit-finder`)**: Complete wrist measurement guide with 3 measurement techniques.
- **Saved Items (`/saved`)**: Persistent wishlist with one-click move to bag.
- **Our Story (`/our-story`)**: Brand philosophy, circular metallurgy, and guarantee policies.

---

## 🛠️ Tech Stack & Directory Structure

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with `persist` middleware (local storage keys `halyard-cart` and `halyard-saved`)
- **Icons**: Lucide React
- **Payments**: Stripe Checkout (`@stripe/stripe-js` + `stripe` SDK)

```
c:\vlacier\
├── app\
│   ├── layout.tsx                     # Root layout (Announcement, Header, Drawer, Modal)
│   ├── globals.css                    # Design system tokens and styles
│   ├── page.tsx                       # Home page (renders Bracelets collection)
│   ├── bracelets\
│   │   ├── page.tsx                   # Collection page with ItemList JSON-LD
│   │   └── [slug]\page.tsx            # Dynamic PDP with Product JSON-LD
│   ├── stack-builder\page.tsx         # 3-slot stack builder
│   ├── gift-guide\page.tsx            # Curated gift edits
│   ├── fit-finder\page.tsx            # Standalone sizing tool
│   ├── saved\page.tsx                 # Wishlist page
│   ├── our-story\page.tsx             # Brand & metallurgy story
│   ├── checkout\mock-success\page.tsx # Demonstration checkout endpoint
│   └── api\checkout\route.ts          # Stripe Checkout session API
├── components\
│   ├── AnnouncementBar.tsx            # Sticky top bar
│   ├── SiteHeader.tsx                 # Navigation, currency selector, theme toggle
│   ├── Hero.tsx                       # Hero with swaying bracelet stage
│   ├── FilterBar.tsx                  # Filtering & search controls
│   ├── ProductCard.tsx                # Card with finish switcher & quick actions
│   ├── ProductGrid.tsx                # 4-column grid + bundle promo tile
│   ├── QuickViewModal.tsx             # Pop-up product inspection
│   ├── BagDrawer.tsx                  # Cart drawer with tier progress
│   ├── BraceletSVG.tsx                # Parametric SVG bracelet renderer
│   ├── MaterialsTable.tsx             # 316L vs 925 Silver comparison
│   ├── FitFinder.tsx                  # Wrist measurement slider
│   ├── StackBuilder.tsx               # 3-slot stack composer
│   ├── Newsletter.tsx                 # Release newsletter signup
│   └── SiteFooter.tsx                 # 4-column footer
├── lib\
│   ├── products.json                  # Single source of truth for 14 products
│   ├── types.ts                       # TypeScript interfaces and price formatters
│   └── store.ts                       # Zustand stores (cart, saved, ui)
└── .env.local.example                 # Environment variables template
```

---

## 📦 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 Connecting Stripe Payments

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your Stripe keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys):
   ```env
   STRIPE_SECRET_KEY=sk_test_51...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
   ```
3. When `STRIPE_SECRET_KEY` is present, the Checkout button in the bag drawer automatically generates a hosted Stripe Checkout Session and redirects the customer. If no key is set, it directs to the built-in mock checkout page.

---

## 📸 Swapping in Real Photos & Products

All product data resides in a single, well-documented file: [`c:\vlacier\lib\products.json`](file:///c:/vlacier/lib/products.json).

To add real photos:
1. Place image files into `public/products/` (e.g. `public/products/cuban-silver-1.jpg`).
2. Update the `images` array for any product in `lib/products.json`:
   ```json
   "images": [
     "/products/cuban-silver-1.jpg",
     "/products/cuban-silver-2.jpg"
   ]
   ```
3. If `images` is empty, the parametric `BraceletSVG` vector placeholder renders automatically with metallic gradients matching the chosen finish.

---

## 📝 Still Needs Your Input (Production Checklist)

1. **Product Photography**:
   - High-resolution studio lifestyle and flat-lay photography to replace the SVG placeholders in `lib/products.json`.
2. **Live Stripe Credentials**:
   - Provide your live `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in production deployment.
3. **Domain & Analytics**:
   - Configure your custom domain DNS and Google Tag Manager / Meta Pixel if running paid acquisition.
4. **Legal Pages**:
   - Replace concierge email (`concierge@halyard.studio`) with your operational support mailbox.
