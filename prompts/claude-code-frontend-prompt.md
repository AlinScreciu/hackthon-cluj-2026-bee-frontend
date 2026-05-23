# Claude Code — Radarul Albinelor Frontend (Next.js 15)

You're building the frontend for **Radarul Albinelor**, a Romanian civic-tech app for Cluj Hackathon 2026. The backend (separate repo, Go + Huma) implements an API documented in `api-contract.md` — your teammate will share that file; treat it as the source of truth. You don't have it in this repo; **expect it as one of the first files placed in `/contract/api-contract.md`**.

You also have a **`/design` folder** populated by Claude Design with components, layout specs, and visual decisions for this app. **READ THAT FOLDER FIRST before writing any UI code.** It contains the visual system (palette, typography, spacing, motion specs), component breakdowns, and the three role dashboards. Your job is to make that design real, with the contract as the data layer.

This prompt locks the tech stack, structure, and the five things that will eat hours if you're not careful: reading the design folder properly, the polling cascade UI, web push setup, Leaflet in Next App Router (it's SSR-hostile), and the auth flow with cookie-based sessions.

---

## 0. First moves (do not skip)

**Step 0a — Read `/design` exhaustively.** Every file. Make a notes file `DESIGN_NOTES.md` at repo root that summarizes:
- Color tokens (exact hex values, semantic names)
- Typography (font, weights, sizes)
- Spacing scale
- Component inventory (what already exists from the design)
- Motion specs (durations, easings, libraries used)
- The three role dashboard layouts
- Open questions or contradictions you spotted

You will refer back to this file constantly. The design intent must win over your defaults.

**Step 0b — Read `/contract/api-contract.md` if present.** If it's not there yet, list what you'd need from it to start. Tell your teammate. Don't invent endpoints.

**Step 0c — Read this prompt's §3 (the cascade UI) carefully.** It's the most demo-critical feature.

---

## 1. Stack (locked)

- **Next.js 15** App Router, TypeScript strict
- **Tailwind v4** (CSS-first, `@theme` block; no `tailwind.config.js`)
- **Framer Motion** for animations
- **TanStack Query v5** for server state
- **react-leaflet** for maps (with SSR workarounds — see §4)
- **react-hook-form** + **zod** for forms and validation
- **Lucide React** for icons (one family, no mixing)
- **sonner** for toasts
- **openapi-typescript** for generating types from `openapi.json` (when the API team makes it available); a hand-written thin fetch wrapper around the generated types
- **Zustand** only if needed for ephemeral UI state (don't add it preemptively)
- **next-pwa** or a hand-rolled service worker for web push

Do not add UI libraries (no Material, no Chakra). Tailwind + your own primitives based on the design folder.

---

## 2. Folder structure

```
/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── 2fa/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx              # auth-gate, app shell
│   │   ├── apicultor/
│   │   │   ├── page.tsx            # dashboard
│   │   │   ├── stupine/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── nou/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── alerte/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── fermier/
│   │   │   ├── page.tsx
│   │   │   ├── raport-nou/page.tsx
│   │   │   ├── rapoarte/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── registru-anf/page.tsx
│   │   ├── inspector/
│   │   │   ├── page.tsx
│   │   │   ├── harta/page.tsx
│   │   │   ├── fermieri/page.tsx
│   │   │   └── pagube/page.tsx
│   │   └── setari/page.tsx
│   ├── api/
│   │   └── (none expected — all data goes through the Go API)
│   ├── layout.tsx
│   ├── providers.tsx               # QueryClientProvider, ThemeProvider
│   └── globals.css                 # Tailwind imports + design tokens
├── components/
│   ├── ui/                         # primitives: Button, Input, Card, Badge, Dialog, etc.
│   ├── alerts/
│   │   ├── BzzBzzCard.tsx
│   │   └── CascadeStatusList.tsx   # the polling UI
│   ├── forms/
│   │   └── RaportStropireForm.tsx
│   ├── map/
│   │   ├── MapView.tsx             # dynamic import; ssr: false
│   │   ├── WindCone.tsx
│   │   └── ApiaryMarker.tsx
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── TopBar.tsx
│   │   └── MobileTabBar.tsx
│   ├── mascot/
│   │   └── Albi.tsx                # the bee mascot, single file
│   └── feedback/
│       ├── Spinner.tsx             # the bee spinner from the design
│       ├── LedgerChip.tsx
│       └── ConfettiBurst.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts               # fetch wrapper with auth + error parsing
│   │   ├── types.gen.ts            # GENERATED from openapi.json — do not edit
│   │   └── queries.ts              # query keys + tanstack hooks
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCascadeStatus.ts     # the polling hook
│   │   ├── usePushSubscription.ts
│   │   ├── useReducedMotion.ts
│   │   └── useToast.ts
│   ├── geo.ts                      # client-side distance + bearing utils
│   ├── format.ts                   # Romanian-aware date/number formatting
│   └── tokens.ts                   # palette + spacing constants pulled from /design
├── public/
│   ├── sw.js                       # service worker for push
│   └── icons/
├── design/                         # READ-ONLY — Claude Design's output lives here
├── contract/
│   └── api-contract.md             # the contract, copied here on boot
├── DESIGN_NOTES.md
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

---

## 3. The cascade status UI (§3 = the demo)

This is what wins UX points. Read carefully.

When the farmer submits `POST /spray-reports`, the response includes initial dispatches. The farmer is then taken to `/fermier/rapoarte/[id]` which renders `<CascadeStatusList>`. That component:

1. Reads the spray report and initial dispatches from the route loader (React Query `prefetchQuery` in a server component, or fetch on mount in client).
2. Uses `useCascadeStatus(sprayId)` — a TanStack Query hook with `refetchInterval: 2000` and `refetchIntervalInBackground: false`. The interval is automatically stopped when the API reports `overall_status === "complete"` (set `refetchInterval` to a function that returns `false` in that case).
3. Renders one row per dispatch, **with stable keys** (`alert_dispatch_id`) so Framer Motion `LayoutGroup` can animate state transitions instead of remounting.
4. Each row shows three channel chips (push / call / SMS). Each chip has an icon, state label, and timestamp. State changes animate smoothly: chip morphs color + label using a 200ms spring.

**Visual states per chip:**
- pending / queued → outline, muted grey, no glow
- in-flight (sent / ringing / answered) → soft purple background, subtle 1.2s pulse on the icon
- confirmed → solid green background, check icon, no pulse
- skipped → outline, faded, "Sărit" label
- failed / no_answer → soft red border, alert icon

**Row's `final_status`:**
- `null` → row has the cascade animation visible
- `confirmed_*` → row collapses to a compact success state (still readable, but cascade chips dim to indicate "settled"); confetti of 6 yellow dots emits once from that row (respect `prefers-reduced-motion`)
- `unconfirmed` → row stays expanded, shows orange warning bar with "Apicultorul nu a confirmat. Sună-l direct: 07••" — the farmer can act
- `failed` → red, "Eroare tehnică" with retry CTA (calls `POST /spray-reports/:id/cascade-retry/:dispatch_id` — note: this endpoint isn't in v1 contract; coordinate if needed)

The whole list lives below the spray report summary card. On mobile it's a vertical stack; on desktop (≥`lg`) it's a 2-column grid.

**Empty/loading/error states for the polling:**
- First load: skeleton rows (one per dispatch returned in the create response — you know how many beekeepers to show)
- Polling error: silent retry (TanStack Query handles), only show a small "Reîncerc..." chip in the corner after 3 failed polls
- Network offline: a top banner "Ești offline. Statusul se va actualiza când revii pe net."

**`useCascadeStatus` hook contract:**
```ts
function useCascadeStatus(sprayId: string) {
  return useQuery({
    queryKey: ['cascade-status', sprayId],
    queryFn: () => api.get(`/spray-reports/${sprayId}/cascade-status`),
    refetchInterval: (q) => q.state.data?.overall_status === 'complete' ? false : 2000,
    refetchIntervalInBackground: false,
    staleTime: 0,
  })
}
```

That's the demo's heartbeat. Get this component right.

---

## 4. Leaflet in App Router

React-Leaflet doesn't SSR — `window` references explode. The fix:

```tsx
// components/map/MapView.tsx is a 'use client' file
// In the page that uses it:
import dynamic from 'next/dynamic'
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false, loading: () => <Spinner /> })
```

CSS: import `leaflet/dist/leaflet.css` in `app/globals.css`. Default marker icons break with bundlers — set up `L.Icon.Default.mergeOptions` once in MapView with the correct paths from `node_modules/leaflet/dist/images/` (copy them to `/public/leaflet/` or use the workaround that points to a CDN). Document the chosen approach in MapView.

**Wind cone:** draw an `<Polygon>` or custom SVG overlay using `react-leaflet`. The cone is a sector emanating from the spray point in the direction the wind blows toward, with ±30° half-angle, length = `1.5 × risk_radius`. Use `geo.ts` helper `sectorPolygon(center, bearing_deg, radius_m, half_angle_deg)` → returns an array of `[lat, lng]` for the polygon.

**Risk radius circle:** plain `<Circle>` centered on spray, radius from contract toxicity rules.

---

## 5. Auth flow

Cookie-based, set by the API. Your responsibilities:

1. `/login` page: POST to `/api/v1/auth/login`. On 200, navigate to `/2fa` with `challenge_id` in URL or React state (preferred: encrypted in a short-lived cookie set by a server action, but for hackathon, URL state is fine).
2. `/2fa` page: enter 6-digit code, POST to `/api/v1/auth/2fa/verify`. On success, the cookie is set by the API. Navigate to `/{role}` — read the role from the response.
3. Every page in `(app)/` is wrapped in `<AppShell>` which calls `useAuth()` (which does `GET /auth/me`). On 401, redirect to `/login` via `router.replace`.
4. Server-side auth check: a `middleware.ts` at root reads the `ra_session` cookie and redirects unauthenticated requests on `(app)/` paths. **Don't validate the JWT in middleware** (you don't have the API's secret) — just check cookie presence; the `/auth/me` call inside the layout does the real auth check.

Logout: POST `/api/v1/auth/logout`, clear local query cache, redirect to `/login`.

---

## 6. API client

`lib/api/client.ts`:
```ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',           // critical — sends the cookie
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body?.error?.code ?? 'unknown', body?.error?.message ?? res.statusText, body?.error?.details)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

api.get = <T>(path: string) => api<T>(path)
api.post = <T>(path: string, body?: unknown) => api<T>(path, { method: 'POST', body: JSON.stringify(body) })
api.patch = <T>(path: string, body?: unknown) => api<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
api.del = <T>(path: string) => api<T>(path, { method: 'DELETE' })
```

Type the return values from `types.gen.ts` once that exists. Until then, type by hand based on the contract.

**Generating types when ready:**
```bash
npx openapi-typescript ../api/openapi.json -o lib/api/types.gen.ts
```
Wire this into a script `npm run gen:api`.

**CORS:** the API allows `http://localhost:3000`. Make sure your dev server runs on 3000.

---

## 7. Web push setup

1. Service worker at `/public/sw.js` listens for `push` events, calls `self.registration.showNotification(title, options)` with `{ body, icon, badge, data: { url } }` and on `notificationclick` navigates to `data.url`.
2. On login, after auth, call `Notification.requestPermission()` if the user is `apicultor`. If granted, `navigator.serviceWorker.ready.then(reg => reg.pushManager.subscribe(...))` using the VAPID public key from `GET /push/vapid-public-key`.
3. POST the subscription to `/push/subscriptions`.
4. Show a polite onboarding card on the apicultor dashboard if push is denied: "Activează notificările Bzz Bzz pentru a fi alertat de stropiri."

**Don't request permission on page load.** Request only after the user explicitly opts in or completes onboarding. Browsers penalize aggressive permission prompts.

**The Bzz Bzz UI:** the push notification is one half. The other half is the in-app `<BzzBzzCard>` (already designed in `/design`) which is the persistent alert at the top of the apicultor dashboard. Even if push is denied, the in-app card always shows. Use `aria-live="assertive"` and put it at the top of the DOM tab order.

---

## 8. Forms

`RaportStropireForm`:
- Use `react-hook-form` + `zod` resolver
- Single screen, no wizard
- Fields per contract §4
- Substance combobox uses `GET /reference/substances` cached for the session
- When substance changes, toxicity badge animates (color flip, 200ms)
- Default values: today + 1 day, last-used parcel (read from localStorage `ra:last_parcel_id`)
- Submit button on mobile: full-width sticky bottom CTA with safe-area inset (`pb-[env(safe-area-inset-bottom)]`)
- After submit: route to the spray report detail page where the cascade animates in. Don't show a generic toast and stay on the form.

---

## 9. Accessibility (graded, do not skip)

- All interactive elements reachable by keyboard. Visible focus ring: `ring-2 ring-[--ring] ring-offset-2 ring-offset-[--bg]` with `--ring` = the design's primary purple
- Skip-to-main-content link on every page
- Color contrast ≥ 4.5:1 for all text. **Never** use `#FFEF5F` as text color on white — it's a surface accent only
- Every icon-only button has `aria-label`
- The cascade list uses `role="list"` and each row `role="listitem"`. State changes announced via a polite `aria-live` region that says "Apicultor 1: confirmat prin apel" etc. (text-only, no animation)
- Forms: every input has an associated `<label>`. Errors use `aria-describedby` and `aria-invalid`
- Respect `prefers-reduced-motion`: in `lib/hooks/useReducedMotion.ts`, gate Framer Motion components to use simple fade/opacity transitions instead of springs

---

## 10. Motion guidance

- Page transitions: subtle 150ms fade + 8px y-slide. Use Framer Motion's `AnimatePresence` mode="wait" at the route group level
- Card mounts: spring `{ type: "spring", stiffness: 260, damping: 22 }`
- State transitions on cascade chips: 200ms color tween + 1.2s subtle pulse on icon while in-flight
- The bee spinner: lives in `/components/feedback/Spinner.tsx`, animates along a small sinus path; on reduced-motion, becomes a static SVG with opacity pulse only
- Never block the user. Optimistic UI for confirmations where the contract supports it

---

## 11. Romanian copy

Read the design folder's tone-of-voice notes. Hard rules:
- Buttons are imperative verbs ("Notifică", "Mut stupii"). No "Click aici", no "Submit", no English.
- Errors are human ("N-am putut trimite emailul. Reîncerc în 30s." not "Error 503")
- "Tu" not "Dvs." everywhere
- Dates: `23 mai 2026` not `2026-05-23` for display. Use `Intl.DateTimeFormat('ro-RO', ...)`
- Numbers: Romanian decimal comma (`2,5 ha` not `2.5 ha`)

Centralize labels in `lib/i18n.ts` even though we only have one language — makes it consistent and grep-able. Don't sprinkle Romanian strings raw across components without a reason.

---

## 12. Boot sequence

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
npm i framer-motion @tanstack/react-query react-leaflet leaflet @types/leaflet react-hook-form @hookform/resolvers zod lucide-react sonner
npm i -D openapi-typescript
```

Then:
1. Read `/design`, write `DESIGN_NOTES.md`
2. Move design tokens into `app/globals.css` `@theme` block
3. Build `components/ui/` primitives (Button, Input, Card, Badge, Dialog) matching the design — these are the foundation, get them right before anything else
4. Build the layout shell, top bar, mobile tab bar
5. Build the auth flow (login → 2FA → role redirect)
6. Build the apicultor dashboard + BzzBzzCard from design
7. Build the fermier dashboard + RaportStropireForm
8. Build the cascade status list (the §3 demo feature)
9. Build the inspector dashboard with Leaflet map
10. Wire web push
11. Polish: spinner, toasts, error boundaries, empty states with Albi mascot
12. Mobile QA at 360×740 and 414×896

Commit after each phase.

---

## 13. Definition of done

- [ ] Designs from `/design` faithfully implemented across all role dashboards
- [ ] Auth + 2FA works end-to-end against the live API
- [ ] Fermier can submit a spray report; the cascade UI on the report detail page polls every 2s and animates chip state changes smoothly
- [ ] Apicultor receives a real push notification when a spray is filed; opening it lands on the alert detail page
- [ ] Apicultor in-app BzzBzzCard shows the alert with a working confirm action
- [ ] Inspector map renders all apiaries + active sprays + risk cones with wind direction
- [ ] All routes pass keyboard navigation; focus rings visible; no contrast issues
- [ ] Works on a 360px-wide viewport (Chrome DevTools mobile sim) without horizontal scroll
- [ ] `prefers-reduced-motion: reduce` disables all springs and pulses
- [ ] README documents env vars, dev commands, push setup gotcha

## 14. Nice-to-haves

- [ ] Apicultor map view with route to apiary
- [ ] Damage claim filing flow
- [ ] Ledger verification UI (animate the block chain check)
- [ ] PWA install prompt
- [ ] Optimistic UI for in-app confirm

---

## 15. Anti-patterns to avoid

- Don't roll your own design system — match `/design`. If something isn't in the design, find the closest analogue there and ask before inventing.
- Don't fetch in client components when a server component (with `dynamic = 'force-dynamic'`) would work — except for the cascade polling, which **must** be a client hook.
- Don't use `useEffect` for data fetching. TanStack Query handles everything.
- Don't reach into `document` directly. If you think you need to, you probably want a portal or a ref.
- Don't use `any`. The contract has types; use them.
- Don't put Tailwind classes in `cn(...)` calls longer than ~6 utilities without extracting to a component class or a `data-state`-driven block.

Start with Step 0a. **Read the design folder before doing anything else.** Then 0b. Then in order.

If something in the contract feels wrong as you build, push back with a concrete proposed change — don't silently diverge from your teammate.
