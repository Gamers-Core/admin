# Gamers Core Admin

This is a Next.js 16 App Router admin application. Read the relevant installed guidance under `node_modules/next/dist/docs/` before changing routing, layouts, or proxy behavior; Next 16 uses `src/proxy.ts`, not `middleware.ts`.

## Commands

- Install with `npm ci`.
- Run locally with `npm run dev`.
- Run `npm test` before completing work. It runs TypeScript, ESLint, and Prettier checks; there is no unit-test framework configured.
- Use `npm run build` to validate a production build when changing routes, server components, configuration, or environment-sensitive code.

## Application Shape

- Routes live under `src/app`. Route groups such as `(hydration)`, `(auth)`, `(base)`, `(content)`, and `(store)` do not appear in URLs.
- The root and hydration layouts are [src/app/layout.tsx](src/app/layout.tsx) and [src/app/(hydration)/layout.tsx](<src/app/(hydration)/layout.tsx>). The hydration layout prefetches React Query data and creates the server-to-client boundary.
- `params` and `searchParams` are Promise-based in this Next version. Reuse the shared route types in [src/app/types.ts](src/app/types.ts).
- Keep browser-only hooks and APIs behind interactive client components; do not add `use client` to server layouts or pages unless the boundary requires it.

## Data and Auth

- Backend Axios clients and server cookie forwarding are defined in [src/api/backend/api.ts](src/api/backend/api.ts). Preserve `withCredentials` and cookie forwarding when changing requests; the backend URL comes from `NEXT_PUBLIC_BACKEND_URL`.
- Backend exports are centralized in [src/api/backend/index.ts](src/api/backend/index.ts), with types and schemas beside the API implementations.
- Domain query and mutation hooks live under `src/hooks/<domain>`. Follow existing hooks such as [src/hooks/discounts/useDiscountsInfiniteQuery.ts](src/hooks/discounts/useDiscountsInfiniteQuery.ts) and [src/hooks/brands/useAddBrandMutation.ts](src/hooks/brands/useAddBrandMutation.ts): keep query keys stable, expose reusable query options for server prefetch, and invalidate the exact affected queries after mutations.
- Route protection is a cookie-presence gate in [src/proxy.ts](src/proxy.ts); `/api` is excluded from its matcher. Do not treat proxy authentication as backend authorization.

## UI Conventions

- Shared domain components and hooks are organized by feature under `src/components` and `src/hooks`.
- UI primitives follow the Radix Mira/shadcn setup in [components.json](components.json), with aliases such as `@/components`, `@/components/ui`, `@/hooks`, and `@/lib`.
- Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) for class merging and reuse shared components before adding new primitives.
- Tailwind v4 styles are defined through [src/app/globals.css](src/app/globals.css). The application is globally dark and uses Oxanium/Cairo fonts from the root layout.

## Working Rules

- Make the smallest change at the owning layer and preserve existing public APIs unless the task requires a contract change.
- Inspect a neighboring route, hook, or component before introducing a new pattern.
- Do not expose secrets or commit environment files. Keep API contracts, schemas, and frontend types aligned when changing backend-facing behavior.
- Update documentation only when behavior or setup changes; use the [README](README.md) for general project setup.
