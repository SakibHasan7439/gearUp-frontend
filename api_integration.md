# API Integration Map — GearUp Frontend

This document maps frontend routes/components to the backend API endpoints they consume.

Base URL: requests go through a Next.js rewrite (`/api/*` → backend origin, configured via `BACKEND_URL` env var), so the frontend always calls relative `/api/...` paths.

Auth: JWT access/refresh tokens are set as `httpOnly` cookies by the backend on login/refresh. The frontend never reads or stores raw tokens — `withCredentials: true` on the axios instance ensures cookies are sent automatically on every request. A 401 response triggers a silent refresh (`POST /api/auth/refresh-token`) and retry.

---

## Auth

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/auth/register` | `RegisterForm` → `useRegister()` | `POST /api/auth/register` |
| `/auth/login` | `LoginForm` → `useLogin()` | `POST /api/auth/login` |
| (automatic, on 401) | axios interceptor in `lib/api-client.ts` | `POST /api/auth/refresh-token` |
| `middleware.ts` | route protection | reads `accessToken` cookie, decodes role client-side (no network call) |

## Public — Categories & Gear Browsing

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/`, `/gear` | `GearCard` grid → `useGearList()` | `GET /api/gear` (supports query filters: category, search, price range) |
| `/gear` filters | category filter → `useCategories()` | `GET /api/categories` |
| `/gear/[id]` | gear details → `useGearDetails(id)` | `GET /api/gear/:id` |
| `/gear/[id]` | reviews list → `useGearReviews(gearItemId)` | `GET /api/gear/:gearItemId/reviews` |

## Customer

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/gear/[id]` | "Rent Now" form → `useCreateRental()` | `POST /api/rentals` |
| `/dashboard/customer` | orders list → `useMyRentals()` | `GET /api/rentals` |
| `/rentals/[id]` | order detail (also Stripe success/cancel landing page) → `useRentalDetails(id, pollForUpdate)` | `GET /api/rentals/:id` |
| `/rentals/[id]` | "Pay Now" button → `useCreateCheckout()` | `POST /api/payments/create` (redirects to Stripe-hosted checkout) |
| — | payment history → `useMyPayments()` | `GET /api/payments` |
| — | single payment lookup → `usePaymentById(id)` | `GET /api/payments/:id` |
| `/rentals/[id]` | `ReviewForm` on `RETURNED` orders → `useCreateReview()` | `POST /api/review` |

**Stripe redirect flow:** `createCheckoutSession` sets `success_url`/`cancel_url` to `/rentals/:id?success=true|false`. The webhook (`POST /api/payments/webhook`, Stripe → backend only, not called by the frontend) asynchronously flips `Payment.status` to `COMPLETED` and `RentalOrder.status` to `CONFIRMED`. The frontend polls `GET /api/rentals/:id` every 2s while status is still `PENDING` and `success=true` is present, to reflect the webhook's update without a manual refresh.

## Provider

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/provider` | overview stats (derived client-side) | `GET /api/provider/gear`, `GET /api/provider/orders` |
| `/dashboard/provider/gear` | gear list → `useMyGear()` | `GET /api/provider/gear` |
| `/dashboard/provider/gear/new` | `GearForm` → `useCreateGear()` | `POST /api/provider/gear` |
| `/dashboard/provider/gear/[id]/edit` | `GearForm` (prefilled) → `useUpdateGear(id)` | `PUT /api/provider/gear/:id` |
| `/dashboard/provider/gear` | delete action → `useDeleteGear()` | `DELETE /api/provider/gear/:id` |
| `/dashboard/provider/orders` | orders table → `useProviderOrders()` | `GET /api/provider/orders` |
| `/dashboard/provider/orders` | status action buttons → `useUpdateOrderStatus()` | `PATCH /api/provider/orders/:id` (body: `{ status }`) |

## Admin

| Frontend | Component / Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/admin` | overview stats (derived client-side) | reuses categories/gear/rentals hooks below |
| `/dashboard/admin/categories` | category list | `GET /api/categories` |
| `/dashboard/admin/categories` | create → `useCreateCategory()` | `POST /api/admin/categories` |
| `/dashboard/admin/categories` | edit (partial fields accepted) → `useUpdateCategory(id)` | `PATCH /api/admin/categories/:id` |
| `/dashboard/admin/categories` | delete → `useDeleteCategory()` | `DELETE /api/admin/categories/:id` |
| `/dashboard/admin/gear` | read-only gear table → `useAdminGear()` | `GET /api/admin/gear` |
| `/dashboard/admin/rentals` | read-only rentals table → `useAdminRentals()` | `GET /api/admin/rentals` (includes nested `gearItem` per order item) |

---

## Known nuances worth noting to a reviewer

- Payment status lives on the separate `Payment` model, not as a `RentalOrder.status` value — status badges combine both.
- `RentalOrder.status` values are `PENDING → CONFIRMED → PICKED_UP → RETURNED`/`CANCELLED` (no distinct `PAID` state — `CONFIRMED` implies payment succeeded, set by the Stripe webhook).
- `GearItem` has no image field in the schema; gear cards/details render without images.