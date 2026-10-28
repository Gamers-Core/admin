# Gamers Core Admin

The back office for [Gamers Core](https://gamers-core.net), a live bilingual gaming-accessories store in Egypt. Operators use it to manage orders, customers, the product catalogue, discounts and storefront content, so the business owner can run the shop without touching code or a third-party dashboard.

**Live admin:** [admin.gamers-core.net](https://admin.gamers-core.net) (administrators only)

**Part of Gamers Core:** [Storefront](https://github.com/Gamers-Core/frontend) · **Admin panel (this repo)** · [Backend API](https://github.com/Gamers-Core/backend)

<!-- Add screenshots to docs/screenshots/ (no real customer data):
![Orders](docs/screenshots/orders.png)
![Product editor](docs/screenshots/product-editor.png)
![Discount rules](docs/screenshots/discounts.png) -->

## Highlights

- **Orders:** list and detail views with status history, driven by the backend's status and payment state machines.
- **Catalogue:** products, variants, brands, categories and featured variants, with drag-and-drop ordering and media upload and reordering (upload progress, per-file cancellation).
- **Discounts:** create and edit discounts with variant targeting, free shipping and eligibility rules.
- **Content:** FAQs, policies and user reviews; rich text editing with TipTap.
- **Data tables:** server-side filtering and sorting through URL params, with clickable rows.
- **Secure access:** administrators sign in with email and one-time-password verification.
- **Quality gate:** Husky hooks and GitHub Actions run type-check, lint and formatting, then a production build.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, TanStack Query and Table, React Hook Form, Zod, Zustand, Tailwind CSS, Radix/shadcn UI.

## Features

- Review orders and inspect individual order details.
- Browse users and view user details.
- Manage products, product variants, brands, categories and featured variants.
- Create and edit discounts and their eligibility rules.
- Maintain FAQs, policies and user reviews.
- View account and application settings.
- Upload and reorder product media.

## Requirements

- Node.js `22.18.0` or a compatible Node 22 release, and npm
- A running, reachable Gamers Core backend with the admin API enabled

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with the backend URL (the example assumes the backend runs locally with `PORT=8000`):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

`NEXT_PUBLIC_BACKEND_URL` is used by both API clients:

- General requests use `${NEXT_PUBLIC_BACKEND_URL}`.
- Admin requests use `${NEXT_PUBLIC_BACKEND_URL}/admin`.

Environment files are ignored by Git. Do not commit credentials, session data or other secrets.

## Development

The storefront uses port `3000` locally, so run the admin panel on `3001`:

```bash
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001). The backend must be running before you use data-backed pages. The app forwards browser cookies on client requests and the incoming cookie header on server requests, so local authentication also depends on the backend's cookie configuration.

## Authentication

Sign-in is an email and OTP flow:

1. Open `/signin` and submit an administrator email.
2. Continue to `/verify-otp` and enter the OTP you receive by email.
3. After verification, the app returns you to the page you originally requested, or `/`.

The Next.js proxy protects routes by checking for the `session` and `session.sig` cookies, redirects unauthenticated users to `/signin?from=...`, and sends authenticated users away from guest-only routes. This is a routing gate, not authorization: the backend validates the session and enforces permissions.

## Application routes

Route groups in `src/app` are organizational only and do not appear in URLs.

| Area              | Routes                                            |
| ----------------- | ------------------------------------------------- |
| Authentication    | `/signin`, `/verify-otp`                          |
| Home and settings | `/`, `/settings`                                  |
| Orders            | `/orders`, `/orders/[orderNumber]`                |
| Users             | `/users`, `/users/[id]`                           |
| Products          | `/products`, `/products/add`, `/products/[id]`    |
| Store setup       | `/brands`, `/categories`, `/featured-variants`    |
| Discounts         | `/discounts`, `/discounts/add`, `/discounts/[id]` |
| Content           | `/faqs`, `/policies`, `/user-reviews`             |

The sidebar navigation is defined in `src/components/sidebar/const.ts`. Dynamic segments such as `[id]` and `[orderNumber]` are replaced with real identifiers at runtime.

## Project structure

```text
src/
├── api/backend/    Axios clients, API types, schemas and helpers
├── app/            App Router layouts, pages and global styles
├── components/     Shared UI and domain-specific feature components
├── hooks/          React Query queries, mutations and reusable hooks
├── lib/            Shared utilities
├── proxy.ts        Route protection and request metadata
└── stores/         Client-side Zustand stores
```

Conventions:

- Server components are the default; keep browser-only hooks and APIs in client components.
- Server-rendered pages prefetch TanStack Query data and pass it through a `HydrationBoundary`.
- Keep domain hooks under `src/hooks/<domain>` and backend contracts under `src/api/backend`.
- Mutations should invalidate or update the exact affected query keys.
- Use `cn()` from `src/lib/utils.ts` and the existing shared UI components before adding new primitives.
- In Next.js 16, route `params` and `searchParams` are Promise-based.
- Remote images are allowed from `res.cloudinary.com` in `next.config.ts`.

## Scripts

| Command           | Purpose                                                |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the local development server.                    |
| `npm run build`   | Create a production build.                             |
| `npm start`       | Serve the production build.                            |
| `npm run lint`    | Run ESLint.                                            |
| `npm test`        | Run TypeScript checks, ESLint and Prettier validation. |
| `npm run prepare` | Set up Husky hooks after installation.                 |

Before opening a pull request, run:

```bash
npm test
npm run build
```

## CI

GitHub Actions runs on every push and pull request for `master`, `staging` and `dev`, using Node `22.18.0`. It runs `npm test` and builds only if the checks pass.

## Technology references

[Next.js](https://nextjs.org/docs) · [TanStack Query](https://tanstack.com/query/latest) · [React Hook Form](https://react-hook-form.com/) · [Zod](https://zod.dev/) · [Tailwind CSS](https://tailwindcss.com/docs)
