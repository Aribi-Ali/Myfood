# YallahKool — Front-End

Next.js client-facing SPA for the YallahKool food marketplace platform (Algerian market).

## Tech Stack

- **Next.js** (App Router, Turbopack)
- **React** with TypeScript
- **Tailwind CSS v4** for styling
- **GrapesJS** for drag-and-drop page builder
- **Lucide React** for icons

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Project Structure

```
src/
├── app/                  # App Router pages
│   ├── login/            # Split-screen Algerian-themed login
│   ├── register/         # Split-screen Algerian-themed register
│   ├── stores/           # Store listing, details, menu, reservation
│   ├── orders/           # Client order history + tracking
│   ├── dashboard/        # Owner dashboard, orders, menu, themes, settings, etc.
│   ├── delivery/         # Delivery dashboard, active deliveries
│   └── admin/            # Admin pages
├── components/
│   ├── ui/               # Primitive components (button, card, input, modal, skeleton, etc.)
│   ├── templates/        # 23 premium store templates
│   ├── navbar.tsx        # Navigation bar with city selector + user menu
│   ├── auth-background.tsx       # Algerian-themed split-screen auth layout
│   ├── floating-store-logo.tsx   # Draggable floating logo
│   ├── multi-searchable-select.tsx  # Multi-select dropdown
│   ├── city-selector.tsx         # Wilaya/commune picker
│   ├── store-card.tsx            # Store preview card
│   └── page-builder.tsx          # GrapesJS integration
├── contexts/             # React contexts (auth, city, cart)
├── lib/                  # Utilities (api-client, utils, themes)
└── types/                # TypeScript interfaces
```

## Available Scripts

| Command        | Description                 |
|----------------|-----------------------------|
| `npm run dev`  | Start development server    |
| `npm run build`| Production build             |
| `npm run lint` | Run ESLint                  |
| `npx tsc --noEmit` | TypeScript type check   |

## Features

- **23 Premium Store Templates** with unique visual identities
- **Multi-category Foods** via many-to-many pivot table
- **City Persistence** via localStorage, cleared on logout
- **Client Order Workflow** — place, history, live tracking timeline, complaints
- **Owner Order Manager** — auto-polling, bulk actions, rider assignment (search/favorites/infinite scroll), status transitions, detail modal
- **Delivery Dashboard** — available orders, accept, active deliveries, mark complete, stats bar, working toggle
- **Algerian-themed Auth** — split-screen design with flag colors, couscous, Arabic tagline
- **RTL Support** — Arabic locale direction
- **Responsive Design** — mobile-first, works across all devices
