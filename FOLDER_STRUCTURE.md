# Complete Folder Structure

```
d:\lostandfound/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── PRD.md
├── TASKS.md
├── UI_RULES.md
├── schema.sql
├── .gitignore
├── tsconfig.json
├── package.json
├── package-lock.json
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── proxy.ts
├── next-env.d.ts
│
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── admin-actions.tsx
│   ├── api/
│   │   ├── health/
│   │   │   └── route.ts
│   │   ├── admin/
│   │   │   ├── items/
│   │   │   │   └── [itemId]/
│   │   │   │       └── route.ts
│   │   │   └── claims/
│   │   │       └── [claimId]/
│   │   │           └── route.ts
│   │   ├── users/
│   │   │   └── me/
│   │   │       └── role/
│   │   │           └── route.ts
│   │   ├── items/
│   │   │   ├── found/
│   │   │   │   └── route.ts
│   │   │   └── lost/
│   │   │       └── route.ts
│   │   ├── claims/
│   │   │   ├── route.ts
│   │   │   ├── [claimId]/
│   │   │   │   └── moderate/
│   │   │   │       └── route.ts
│   │   │   └── confirm-return/
│   │   │       └── route.ts
│   │   └── notifications/
│   │       ├── unread-count/
│   │       │   └── route.ts
│   │       └── [id]/
│   │           └── read/
│   │               └── route.ts
│   ├── claims/
│   │   ├── page.tsx
│   │   ├── claim-request-form.tsx
│   │   ├── confirm-received-button.tsx
│   │   └── owner-claim-actions.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── found/
│   │   └── new/
│   │       ├── page.tsx
│   │       └── report-found-item-form.tsx
│   ├── help/
│   │   └── page.tsx
│   ├── items/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── items-filters.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── lost/
│   │   └── new/
│   │       ├── page.tsx
│   │       └── report-lost-item-form.tsx
│   ├── notifications/
│   │   ├── page.tsx
│   │   └── mark-read-button.tsx
│   ├── sign-in/
│   │   └── [[...sign-in]]/
│   └── sign-up/
│       └── [[...sign-up]]/
│
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx
│   │   ├── footer.tsx
│   │   ├── navbar.tsx
│   │   └── page-shell.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
│
├── config/
│   └── site.ts
│
├── docs/
│   └── PROJECT_STRUCTURE.md
│
├── features/
│   └── items/
│       ├── types.ts
│       ├── components/
│       │   └── item-card.tsx
│       └── schemas/
│           ├── found-item.ts
│           └── lost-item.ts
│
├── lib/
│   ├── auth.ts
│   ├── notifications.ts
│   ├── supabase-rls.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts
│       └── server.ts
│
└── public/
    ├── favicon.ico
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## Project Overview

This is a **Next.js project** for a Lost and Found application.

### Key Directories

- **app/** - Next.js app directory containing pages, API routes, and layouts
  - **(auth)/** - Authentication routes for sign-in and sign-up
  - **api/** - Backend API endpoints for users, items, claims, and notifications
  - **admin/** - Admin panel pages and actions
  - **claims/** - Claims management pages and components
  - **items/** - Item listing and detail pages with filters
  - **found/** - Report found items forms
  - **lost/** - Report lost items forms
  - **notifications/** - Notification pages and components
  - **dashboard/** - User dashboard

- **components/** - Reusable React components
  - **layout/** - Layout components (navbar, footer, app-shell, page-shell)
  - **ui/** - UI primitives (button, card, badge)

- **config/** - Configuration files
  - **site.ts** - Site-wide configuration

- **features/** - Feature modules
  - **items/** - Item-related components, types, and validation schemas

- **lib/** - Utility and library functions
  - **auth.ts** - Authentication utilities
  - **supabase.ts** - Supabase client setup
  - **supabase-rls.ts** - Row-level security utilities
  - **notifications.ts** - Notification utilities
  - **supabase/** - Supabase client and server functions

- **public/** - Static assets (images, icons)

- **docs/** - Documentation files

### Root Level Configuration

- **tsconfig.json** - TypeScript configuration
- **next.config.ts** - Next.js configuration
- **eslint.config.mjs** - ESLint configuration
- **postcss.config.mjs** - PostCSS configuration
- **package.json** - Project dependencies
- **schema.sql** - Database schema
