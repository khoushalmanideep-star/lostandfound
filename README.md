# Campus Lost & Found Portal (MVP)

College-only Lost & Found portal where students can post lost/found items, claim ownership with proof, and complete a safe return flow with admin moderation and in-app notifications.

## Project overview

This app is a Next.js App Router project with Clerk authentication and Supabase as the database + storage backend. It ships the core MVP flow:

- Post **Lost** and **Found** item listings
- Browse **active found items** with search + filters
- Submit **claim requests** with proof
- Admin can **approve/reject** claims and delete spam posts
- Owners can **confirm received** to mark an item as **returned**
- In-app **notifications** for claim decisions and returns

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database/Storage**: Supabase (Postgres + Storage)
- **UI**: Tailwind CSS + Lucide icons
- **Forms & Validation**: React Hook Form + Zod
- **Toasts**: Sonner

## Key features

- **Authentication**: sign-in / sign-up pages + protected routes
- **Lost items**: report lost item form (validated) + image upload
- **Found items**: report found item form (validated) + image upload
- **Browse**: active found items only (`status='open'`) with:
  - keyword search (debounced)
  - category / color / location filters
  - clear filters + empty/loading states
- **Item details**: dynamic route `/items/[id]`
- **Claims**: submit claim request (message + proof), track statuses
- **Return flow**: approved claim → owner confirms received → item marked `returned`
- **Notifications**: in-app notifications for:
  - claim approved
  - claim rejected
  - item marked returned
- **Admin**: stats + view all users/items/claims, approve/reject claims, delete spam posts

## Setup steps

### 1) Install dependencies

```bash
npm install
```

### 2) Configure Supabase

1. Create a new Supabase project
2. In Supabase SQL Editor, run `schema.sql`
3. Create a Storage bucket named **`item-images`**

### 3) Configure Clerk

1. Create a Clerk application
2. Copy the publishable key + secret key
3. Set redirect URLs in Clerk dashboard to match:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - After auth: `/dashboard`

## Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

Required variables:

- **Clerk**
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
  - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`

- **Supabase**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only; required for admin/actions/uploads in this MVP)

## Run locally

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Deploy on Vercel

### 1) Push to GitHub

Create a repo and push this project.

### 2) Import into Vercel

1. Create a new Vercel project from your GitHub repo
2. Add the same environment variables from `.env.example` in Vercel Project Settings
3. Deploy

### 3) Production considerations

- **Do not expose** `SUPABASE_SERVICE_ROLE_KEY` to the client (keep it server-only in Vercel envs).
- For a production-ready setup, add Supabase **RLS policies** and replace service-role queries with user-scoped access.

"# lostandfound" 
