# Lost & Found MVP Structure

## Folder Structure

```txt
app/
  api/
    health/route.ts
  admin/page.tsx
  claims/page.tsx
  dashboard/page.tsx
  found/new/page.tsx
  items/page.tsx
  lost/new/page.tsx
  sign-in/[[...sign-in]]/page.tsx
  sign-up/[[...sign-up]]/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  layout/
    navbar.tsx
    page-shell.tsx
config/
  site.ts
docs/
  PROJECT_STRUCTURE.md
lib/
  supabase/
    client.ts
    server.ts
  utils.ts
middleware.ts
schema.sql
.env.example
```

## Why this shape

- Route-first `app` layout with one page per MVP task for fast parallel development.
- Shared UI in `components/layout` keeps pages uncluttered and consistent.
- Provider and config boundaries in `lib` and `config` simplify future scaling.
- `schema.sql` captures MVP entities (`items`, `claims`) and statuses.
