# My Lagos Community — Codebase Documentation

> A comprehensive virtual city guide for Lagos, Nigeria — featuring business listings, events, shopping, an AI chatbot, and community news.

## Tech Stack

| Layer       | Technology                                     |
| ----------- | ---------------------------------------------- |
| Framework   | **React 18.3.1** (functional components, hooks) |
| Language    | **TypeScript** (strict, ES2022 target)          |
| Bundler     | **Vite 6** (`@vitejs/plugin-react`)             |
| Styling     | **Tailwind CSS** (loaded via CDN in `index.html`) |
| Icons       | **Lucide React 0.344** (tree-shakable SVG icons) |
| Fonts       | **Plus Jakarta Sans** (primary), **Southern Jannie** (decorative script) — Google Fonts |
| AI          | **Gemini 1.5 Flash** via direct REST API calls  |
| Dev server  | `localhost:3000` (configured in `vite.config.ts`) |

## Project Structure

```
my-lagos-community-new/
├── index.html            # Entry HTML — loads Tailwind CDN, fonts, import map, custom styles
├── index.tsx             # React DOM root mount
├── App.tsx               # Root component — state-based routing, auth state, navigation
├── vite.config.ts        # Vite config — React plugin, port 3000, path alias `@/`
├── tsconfig.json         # TypeScript config — bundler module resolution, react-jsx
├── package.json          # Dependencies and scripts
├── metadata.json         # App metadata (name, description)
├── .env.local            # Environment variables (GEMINI_API_KEY)
├── assets/
│   └── images.ts         # Centralized image URL constants (TESTIMONIAL_BG, HERO_BG, CAFE_BG)
└── components/
    ├── Navbar.tsx         # Top navigation bar — logo, nav links, auth buttons, mobile menu
    ├── Hero.tsx           # Landing hero — background image, search bar (category/location/keyword)
    ├── CategoryStrip.tsx  # Horizontal category icon grid (12 categories)
    ├── CuriositySection.tsx # "What sparks your curiosity" — 6 category image cards
    ├── HowItWorks.tsx     # 4-step explainer section (Select → Location → Keyword → Results)
    ├── FeaturedSection.tsx # Full-width CTA banner for cafes/restaurants/bars
    ├── PopularLocations.tsx # 4-card grid of popular business listings
    ├── Testimonials.tsx   # 3 user testimonial cards with circular photos
    ├── BlogSection.tsx    # 4-card news/tips grid
    ├── Footer.tsx         # Site footer — brand, links, social icons, back-to-top
    ├── AIChatBot.tsx      # Floating Gemini AI chatbot — slide-in drawer, Lagos city guide
    ├── Dashboard.tsx      # User dashboard — sidebar nav, stats, listings/events/orders/profile views
    ├── ListingsPage.tsx   # Business listings page — category filter sidebar, 6 listing cards
    ├── ListingDetail.tsx  # Single listing detail — image gallery, reviews, map embed, share
    ├── ContactPage.tsx    # Contact form + office info + social links
    ├── EventsPage.tsx     # Events directory — category strip, 8 event cards with search
    ├── AddBusinessPage.tsx # Multi-field business submission form (name, category, amenities, hours)
    ├── ShopPage.tsx       # E-commerce shop — category strip, category cards, product grid
    ├── ProductDetail.tsx  # Single product detail — image carousel, specs, related products
    ├── AuthModal.tsx      # Login/signup modal — email/password login, multi-step signup form
    └── ui/
        └── TextHoverEffect.tsx  # Reusable gradient text effect component
```

## Routing

The app uses **state-based client-side routing** (no router library). Navigation is controlled by a `currentView` state in `App.tsx`:

| View               | Component          | Description                       |
| ------------------- | ------------------ | --------------------------------- |
| `home`              | Multiple sections  | Landing page (Hero → Blog)         |
| `listings`          | `ListingsPage`     | Business directory                 |
| `listing-detail`    | `ListingDetail`    | Individual business page           |
| `contact`           | `ContactPage`      | Contact form                       |
| `events`            | `EventsPage`       | Events directory                   |
| `add-business`      | `AddBusinessPage`  | Submit a new business              |
| `shop`              | `ShopPage`         | E-commerce marketplace             |
| `product-detail`    | `ProductDetail`    | Individual product page            |
| `dashboard`         | `Dashboard`        | User dashboard (authenticated)     |

Navigation is done via the `navigateTo()` helper which updates state and scrolls to top. All nav callbacks are passed as props through `Navbar`.

## Authentication

- Managed via `isLoggedIn` state in `App.tsx` (no backend; UI-only for now)
- `AuthModal` component provides login and multi-step signup forms
- Login: email + password
- Signup: name, email, phone, password, location (multi-step)
- On auth success, `isLoggedIn` is set to `true` and the modal closes

## AI Chatbot (AIChatBot.tsx)

- Floating amber button (bottom-right) opens a slide-in chat drawer
- Powered by **Gemini 1.5 Flash** via direct `fetch` to the REST API
- System prompt: Lagos city guide persona with local knowledge and slang
- API key loaded from `process.env.API_KEY` (defined via Vite's `define` config from `.env.local`)
- Messages stored in component-level state; auto-scrolls on new messages

## Styling Conventions

- **Tailwind CSS via CDN** — utility classes used directly in JSX
- **Custom CSS** defined in `index.html` `<style>` block:
  - `.font-southern` — Southern Jannie decorative font
  - `.curved-edge` — curved bottom border radius
  - `.glass-card` — frosted glass effect
  - `.how-it-works-bg` — blue background with SVG cross pattern
  - `.no-scrollbar` — hides scrollbar while preserving scroll functionality
  - Custom scrollbar styling for webkit browsers
- **Color palette**: Navy/dark backgrounds (`#0a192f`, `#111827`), blue accents (`#2563eb`), amber highlights (`#f59e0b`), clean whites
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints throughout

## Data

All data is currently **hardcoded** as constants within individual components:
- `LISTINGS` / `CATEGORIES` — in `ListingsPage.tsx`
- `LOCATIONS` — in `PopularLocations.tsx`
- `PRODUCTS` / `CATEGORY_CARDS` — in `ShopPage.tsx`
- `RELATED_PRODUCTS` — in `ProductDetail.tsx`
- `EVENT_DATA` — in `EventsPage.tsx`
- `TESTIMONIALS` — in `Testimonials.tsx`
- `POSTS` — in `BlogSection.tsx`
- `CURIOUS_CARDS` — in `CuriositySection.tsx`
- `AMENITIES` / `CATEGORIES` — in `AddBusinessPage.tsx`

Images are sourced from **Unsplash** URLs and a hosted banner at `communitycra.vercel.app`.

## Dashboard (Dashboard.tsx)

The dashboard has a sidebar with 5 sub-views, managed by local state:
- **Overview** (`StatsOverview`) — stat cards (listings, events, pending, views)
- **My Listings** (`ListingsView`) — table of user's listed businesses
- **My Events** (`EventsView`) — table of user's events
- **Order History** (`OrdersView`) — table of past orders
- **Profile** (`ProfileView`) — editable user profile form with avatar upload area

Helper component: `InputGroup` for reusable labeled form inputs.

## Scripts

| Command         | Action                    |
| --------------- | ------------------------- |
| `npm run dev`   | Start Vite dev server     |
| `npm run build` | Build for production      |
| `npm run preview` | Preview production build |

## Environment Variables

| Variable          | Purpose                        |
| ----------------- | ------------------------------ |
| `GEMINI_API_KEY`  | API key for Gemini AI chatbot  |

Accessed via `process.env.API_KEY` / `process.env.GEMINI_API_KEY` (both defined in `vite.config.ts` `define` block).

## Key Patterns & Notes

- **No router library** — all navigation is prop-drilled callbacks from `App.tsx`
- **No state management library** — all state lives in `App.tsx` or individual components via `useState`
- **No backend** — entirely client-side; auth is simulated, data is static
- **Component isolation** — each page component is self-contained with its own data constants
- **Lucide icons** are imported individually per component for tree-shaking
- **`Zone.Identifier` files** are Windows metadata artifacts (safe to ignore/delete)
- The `index.html` includes an **import map** (for ESM CDN fallback) alongside Vite's bundling — this is from the project's origins and Vite takes precedence during development
