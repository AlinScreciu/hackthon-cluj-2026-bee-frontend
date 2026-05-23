# Beelive — Build Progress

## How to resume work
```bash
cd /Users/alexandramarian/code/hackaton-ui
npm run dev          # starts at http://localhost:3000
```

**Test credentials (mock API):**
| Role       | CNP             | Parolă   |
|------------|-----------------|----------|
| Apicultor  | 1900101400001   | test1234 |
| Fermier    | 1850201400002   | test1234 |
| Inspector  | 1780301400003   | test1234 |

2FA: any 6-digit code works in dev.

**Switch to Go backend:** change `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

---

## Phases

### ✅ Phase 0 — Scaffold
- Next.js 16.2.6 + TypeScript + Tailwind v4 + ESLint
- All deps installed: framer-motion, @tanstack/react-query, react-leaflet, react-hook-form, zod, lucide-react, sonner, jose

### ✅ Phase 0b — Mock Next.js API
- `app/api/v1/` — all contract endpoints implemented
- Auth: `jose` JWT in `ra_session` HttpOnly cookie
- Cascade: time-based state progression (t+3s→sent, t+15s→confirmed)
- `app/api/v1/_mock/data.ts` — seeded users, apiaries, parcels, substances
- `app/api/v1/_mock/auth.ts` — JWT sign/verify, error helpers

### ✅ Phase 1 — Design Tokens
- `app/globals.css` — Tailwind v4 `@theme` with all RA colors
- Honeycomb background, bee animation keyframes, cascade chip-pulse
- `lib/tokens.ts`, `lib/format.ts`, `lib/geo.ts`, `lib/i18n.ts`

### ✅ Phase 2 — API Client & Types
- `lib/api/client.ts` — cookie-fetch wrapper, `ApiError` class
- `lib/api/types.ts` — full contract types (User, Apiary, SprayReport, CascadeStatus, etc.)
- `lib/api/queries.ts` — all TanStack Query hooks including `useCascadeStatus` (2s polling)

### ✅ Phase 3 — Root Layout & Providers
- `app/layout.tsx` — Inter font, skip-nav, Providers, Toaster
- `app/providers.tsx` — QueryClientProvider + devtools
- `proxy.ts` — cookie-presence guard for protected routes (Next.js 16 convention)

### ✅ Phase 4 — UI Primitives
- `components/ui/Badge.tsx` — ToxBadge (T+/T/T-) + StatusBadge — now `rounded-[6px]` / `rounded-full`
  - **ToxBadge responsive legend**: short label (`T+ mare`) on mobile; full label (`T+ Toxicitate mare`) on `sm:` and up
- `components/ui/Button.tsx` — **NEW** primary + ghost variants, loading spinner, fullWidth
- `components/ui/Chip.tsx` — **NEW** stat pill (distance, ETA, wind)
- `components/ui/EmptyState.tsx` — **NEW** Albi mascot + message + optional action link

### ✅ Phase 5 — Layout Shell
- `components/layout/AppShell.tsx` — auth-gate, `bg-cream` background
- `components/layout/TopBar.tsx` — **REDESIGNED**: SVG BrandMark, RolePill (color-coded per role), Bell icon with red unread badge
- `components/layout/MobileTabBar.tsx` — **UPGRADED**: 2px purple indicator bar on active tab, bold active label
- `app/(app)/layout.tsx`

### ✅ Phase 6 — Auth Flow
- `app/(auth)/login/page.tsx` — **REDESIGNED**: cream bg + honeycomb overlay, BeeLogo mascot, white card with shadow, styled inputs
- `app/(auth)/2fa/page.tsx` — **REDESIGNED**: 6 individual OTP boxes (42×52px) with auto-focus, auto-advance, paste support, stagger animation

### ✅ Phase 7 — Feedback Components
- `components/feedback/Spinner.tsx` — bee sinus-path animation + reduced-motion fallback; **BeeSvg updated to svgrepo bee** (pollen body, purple eyes)
- `components/feedback/LedgerChip.tsx` — ledger hash display
- `components/feedback/ConfettiBurst.tsx` — 6-dot confetti burst on cascade confirm
- `components/mascot/Albi.tsx` — bee SVG mascot

### ✅ Phase 8 — Apicultor Dashboard
- `app/(app)/apicultor/page.tsx` — hero banner, active alerts, apiaries list
  - **Active alerts section now uses `BzzBzzCard`**: replaced simple link card with full card (map preview, chips, channel rows, CTA buttons, ledger footer); wired to `useConfirmAlert`
- `app/(app)/apicultor/stupine/` — list, detail, add new
- `app/(app)/apicultor/alerte/page.tsx` — list with EmptyState
- `app/(app)/apicultor/alerte/[id]/page.tsx` — **REDESIGNED**: BzzBzzCard + AnimatePresence → BzzBzzConfirmed

### ✅ Phase 9 — Fermier Dashboard
- `app/(app)/fermier/page.tsx` — hero CTA, stats, recent reports
- `app/(app)/fermier/parcele/page.tsx`
- `app/(app)/fermier/rapoarte/page.tsx`
- `components/forms/RaportStropireForm.tsx` — react-hook-form + zod, substance→toxicity animation, sticky CTA

### ✅ Phase 10 — Cascade Status UI ⭐
- `components/cascade/CascadeRow.tsx` — **NEW**: Framer Motion stagger, initials circle, ChannelTimeline (push→call→SMS dots), status badges
- `components/alerts/CascadeStatusList.tsx` — **UPGRADED**: uses CascadeRow, 80ms stagger delays
- `app/(app)/fermier/rapoarte/[id]/page.tsx` — spray detail + cascade embedded

### ✅ Phase 11 — Inspector Dashboard
- `app/(app)/inspector/page.tsx` — stats, quick links
- `app/(app)/inspector/harta/page.tsx` — dynamic Leaflet map (ssr: false)
- `app/(app)/inspector/fermieri/page.tsx`
- `app/(app)/inspector/pagube/page.tsx`
- `components/map/MapView.tsx` — apiaries, risk circles, wind cones

### ✅ Phase 12 — BzzBzz Alert System ⭐
- `components/alerts/BzzBzzCard.tsx` — **NEW**: urgent alert card
  - Honey left border with `bzz-flash` + `bzz-pulse` CSS animations
  - Bee icon in pollen bubble with `bzz-wing` animation
  - `RiskMapPreview` — pure SVG map thumbnail (no Leaflet)
  - Stat Chips (distance, time, wind compass)
  - `BzzChannelChips` — push/call/SMS state pills
  - Framer Motion entry `scale(0.95)→scale(1)` with `[0.2,0.9,0.3,1.1]` easing
  - Primary + Ghost CTA buttons
  - `prefers-reduced-motion` fully respected
- `components/alerts/BzzBzzConfirmed.tsx` — **NEW**: success state
  - Albi mascot + ConfettiBurst + green card
  - Framer Motion `AnimatePresence mode="wait"` swap from BzzBzzCard

### ✅ Phase 13 — Web Push (partial)
- `lib/hooks/usePushSubscription.ts` — subscribe/unsubscribe lifecycle
- `app/api/v1/push/` — vapid-public-key + subscriptions endpoints
- ⬜ TODO: `public/sw.js` — service worker for push notifications

### ✅ Phase 14 — Polish
- `app/(app)/setari/page.tsx` — profile + logout
- `app/(app)/fermier/registru-anf/page.tsx`
- `app/globals.css` — added `bzz-flash`, `bzz-wing`, `casc-dot`, `spin` keyframes; fixed body bg to `cream`

### ✅ Phase 16 — Screenshot-accurate structural overhaul
- **CascadeRow** completely redesigned: solid-fill initials circle (green/orange/red/purple), `initials · apiary · X km` one-line header, status badge right-aligned, 3-column channel grid (`Push | Apel | SMS`) with colored dot + state text replacing the dot-timeline
- **RaportStropireForm** substance selection replaced from `<select>` dropdown to inline **pill buttons** (selected = purple fill, unselected = white/border); sticky CTA redesigned to dark ink card with affected count, beekeeper name list, pollen "🔔 Notifică toți" button, "Salvează ca draft" ghost link
- **Fermier raport/[id]** added `CascadeProgressSteps` component: 4 progress items (trimis raportul, PDF generat, email primărie, ledger) with green checkmarks above the cascade rows
- **Apicultor dashboard** added `ACTIVITATE RECENTĂ` section showing active alerts as activity feed items
- **BzzBzzCard** channel display changed from bordered chips to simple `● label · state` rows
- **Inspector damage claims** added "Toxicitate medie" badge to each claim row

### ✅ Phase 17 — Bee SVG unification
- **`designs/bee-svgrepo-com.svg`** adopted as the single canonical bee across the app
- `components/ui/BeeLogo.tsx` — replaced side-view illustration with svgrepo bee (pollen body `#EEA727`, purple eyes `#40288C`)
- `designs/tokens.jsx` BrandMark — replaced triangle/radar icon with svgrepo bee (pollen + purple tokens)
- `components/feedback/Spinner.tsx` BeeSvg — replaced hand-drawn top-down bee with svgrepo bee; wing flutter changed to whole-svg scale bob
- `designs/app.jsx` TwoFactorScreen — replaced static `<Albi>` mascot with `<BeeSpinner size="lg">` (animated waiting state)

### ✅ Phase 18 — Fermier dashboard polish
- **Hero card** (`.honeycomb-bg`): replaced flat `var(--color-purple)` with `linear-gradient(135deg, #40288C → #85489D)`; removed honeycomb SVG stripe overlay
- **Parcel rows**: parcel name + status badge (`Programat` / `Liber`) now on the same line; "Următoarea" amber pill on its own line below with `LuTriangleAlert` icon (replaces bell emoji); text bumped to `text-[11px]`
- **Mock data**: added `spray-seed-4` (`scheduled`, parcel-2, tomorrow) so the "Următoarea" pill is visible in dev

### ✅ Phase 19 — Desktop responsive overhaul (≥1024px)
Goal: app was mobile-locked at `max-w-3xl`; on 1440px monitors it sat in a thin centered column. Now it scales fluidly to `max-w-7xl` with a persistent left sidebar. Mobile renders pixel-identical (all changes use `lg:` / `xl:` prefixes only).

- **Shell**:
  - `components/layout/Sidebar.tsx` — **NEW**. Persistent 220px left rail on `lg+` only (`hidden lg:flex lg:fixed`). Contains BeeLogo brand, role pill, user name+locality, primary nav (with active indicator bar + `aria-current`), bell badge on `/apicultor/alerte`, footer with Setări + Ieși din cont
  - `components/layout/AppShell.tsx` — wraps content in `lg:pl-[220px]`; `main` cap is now `max-w-lg md:max-w-3xl lg:max-w-7xl mx-auto`; removed outer `bg-cream` so body hex wallpaper shows through
  - `components/layout/TopBar.tsx` — on `lg+` brand is hidden (sidebar owns it), inline tab nav is hidden, Settings + Logout buttons hidden; shows derived page title via `getPageTitle(pathname)`
  - `components/layout/MobileTabBar.tsx` — now `lg:hidden` (was `md:hidden`); consumes shared nav from `lib/nav.ts`
  - `lib/nav.ts` — **NEW**. Single source for `PRIMARY_NAV_BY_ROLE` (sidebar), `MOBILE_NAV_BY_ROLE` (bottom tabs), `ROLE_PILL`, `ROLE_ROOT`, `isNavActive`, `getPageTitle`

- **Hex SVG wallpaper background**:
  - `public/hex-bg.svg` — **NEW** (copied from `designs/35514628_modern_stylish_hexagonal_background_wallpaper.svg`)
  - `app/globals.css` body: layered `linear-gradient(rgba(255,251,235,0.82), …)` on top of `url('/hex-bg.svg') repeat fixed` — keeps pattern subtle (~18% visible) so transparent cards (`bg-pollen/15`, `bg-purple/10`, etc.) don't read as busy
  - Added `.bg-cream-flat` utility for cards that must hide the wallpaper

- **Dashboards** (all 3 redesigned, mobile unchanged):
  - **Fermier** (`app/(app)/fermier/page.tsx`): `lg:grid-cols-12 lg:gap-6`. Hero CTA `col-span-8`. New "Activitate recentă" mini-card `col-span-4` showing total reports + latest one. Stats grid extended `lg:grid-cols-4` with 2 new metrics (Apicultori notificați cumulat, Cascade complete). Parcele + Rapoarte side-by-side `lg:grid-cols-2`. Slice bumped 3→5 on lg
  - **Apicultor** (`app/(app)/apicultor/page.tsx`): `lg:grid-cols-12`. Hero (alert OR safe) full-width `col-span-12`. BzzBzzCard preview `col-span-8` beside right rail `col-span-4` with Stupinele tale (top 4) + Activitate recentă feed
  - **Inspector** (`app/(app)/inspector/page.tsx`): stats `lg:grid-cols-4` with new "Fermieri în județ" card. InspectorMiniMap promoted to `lg:h-[420px]` hero in `lg:col-span-7`; Pagube de revizuit rail `lg:col-span-5` with `lg:max-h-[420px] lg:overflow-y-auto`. InspectorMiniMap gained `lgHeight?: number` prop

- **List pages** → responsive grids:
  - `apicultor/stupine`: `lg:grid-cols-2 xl:grid-cols-3`
  - `apicultor/alerte`: kept single column but `lg:max-w-3xl`; filter pinned `lg:sticky lg:top-16 lg:bg-white/80 lg:backdrop-blur`
  - `fermier/parcele`: `lg:grid-cols-2 xl:grid-cols-3`
  - `fermier/rapoarte`: `lg:grid-cols-2`
  - `inspector/fermieri`: `lg:grid-cols-2 xl:grid-cols-3` + new search input (full-name + locality, case-insensitive, "Niciun rezultat" empty state) — works on mobile too
  - `inspector/pagube`: `lg:grid-cols-2`

- **Spray-report split-view** (marquee — replicates screenshot 4's A/B/C panels):
  - `components/panels/RiskPreviewPanel.tsx` — **NEW**. Map preview + tox badge + risk radius + affected beekeepers list + "Notifică toți" submit button. `lg:sticky lg:top-20`
  - `components/forms/RaportStropireForm.tsx`: exported `RISK_RADIUS`, `MOCK_AFFECTED`; added `id="raport-stropire-form"`; sticky mobile CTA now `lg:hidden`; inline desktop CTA `hidden lg:flex`; new optional `onLiveValues` prop streams substance/parcel_id/toxicity upward
  - `app/(app)/fermier/raport-nou/page.tsx`: now client component; `lg:grid lg:grid-cols-[1fr_360px]`; form left, RiskPreviewPanel right; subscribes to `onLiveValues` and resolves parcel via `useParcels()`
  - `app/(app)/fermier/rapoarte/[id]/page.tsx`: `lg:grid lg:grid-cols-[420px_1fr]`; spray-report card on sticky left rail; CascadeProgressSteps + success banner + CascadeStatusList on right
  - `components/alerts/BzzBzzCard.tsx`: exported `RiskMapPreview` for reuse by `RiskPreviewPanel`

- **Detail / form split-views**:
  - `components/panels/ApiaryHistoryPanel.tsx` — **NEW**. ISTORIC PE LEDGER card with icon-mapped event rows + last-6-char hash chips
  - `app/(app)/apicultor/stupine/[id]/page.tsx`: `lg:grid-cols-[1fr_320px]`; stats grid `lg:grid-cols-4`; sticky `ApiaryHistoryPanel` right
  - `app/api/v1/apiaries/[id]/route.ts` + `lib/api/queries.ts`: `useApiary` now returns `{ apiary, history }` populated from `LEDGER_EVENTS` filtered by `payload.apiary_id`
  - `app/(app)/apicultor/stupine/nou/page.tsx`: `lg:grid-cols-[1fr_360px]`; form left (`lg:max-w-md`), right rail with Locație placeholder card + "Ce se întâmplă după trimitere?" explainer (3 bullets w/ Layers/FileText/Bell icons)
  - `app/(app)/fermier/parcele/[id]/page.tsx` — **NEW** page. Back link, parcel card with cadastral + surface (via `formatHa`), filtered spray reports rail (`useSprayReports().items.filter(r => r.parcel_id === id)`) with empty-state CTA
  - `app/(app)/apicultor/alerte/[id]/page.tsx`: page wrapper now `lg:max-w-2xl lg:mx-auto` for focused alert detail

- **Inspector map full-bleed** (`app/(app)/inspector/harta/page.tsx`):
  - Mobile branch unchanged (`lg:hidden`)
  - Desktop branch (`hidden lg:block lg:fixed lg:top-14 lg:left-[220px] lg:right-0 lg:bottom-0 lg:z-10`) escapes the `max-w-7xl` cap and fills viewport-minus-sidebar
  - Layer toggle pills float top-right (`absolute top-4 right-4 bg-white rounded-xl shadow-lg`)
  - Legend floats bottom-left (`absolute bottom-4 left-4 bg-white rounded-xl shadow-lg`)
  - `LayerPills` and `Legend` extracted as local helpers to share between mobile/desktop trees

- **Settings** (`app/(app)/setari/page.tsx`):
  - `lg:grid lg:grid-cols-[240px_1fr] lg:gap-6`
  - Left rail `lg:sticky lg:top-20` with anchor links (Profil / Notificări / Securitate); active section tracked via `IntersectionObserver` and highlighted `bg-purple/10 text-purple`
  - Sections gained `id` + `scroll-mt-20`; on lg+ each section becomes its own card (mobile keeps unified card with divider)
  - Logout button `lg:max-w-xs` so it doesn't span the whole right column

- **Auth pages** (login, 2fa): verified unchanged — intentionally centered narrow `max-w-sm` cards with `bg-cream` (not part of AppShell, hex wallpaper doesn't apply)

### ✅ Phase 20 — Background, top bar, auth & brand polish (follow-ups to Phase 19)

- **Hex wallpaper iteration** (`app/globals.css` body / `body::before`):
  - First attempt: tiled hex SVG → ugly horizontal banding every 400px (the SVG has a baked-in top→bottom tan gradient that doesn't tile seamlessly)
  - Second attempt: `background-size: cover` with cream wash overlay → user found the tan tones still too prominent
  - **Final**: body is plain white (`#ffffff`); hex SVG moved to `body::before` pseudo-element (`position: fixed; inset: 0; background-size: cover; opacity: 0.18; z-index: -1`). Faint pattern shows behind everything but doesn't bleed into transparent cards (`bg-purple/10`, `bg-pollen/15`, etc.)

- **TopBar on lg+** (`components/layout/TopBar.tsx`):
  - Page title bumped from `text-[15px] font-semibold` → `text-[18px] font-bold tracking-[-0.01em]` for proper presence
  - Redundant bell hidden on lg+ (`lg:hidden` on the apicultor bell) — the sidebar's "Alerte" nav item already shows the same unread badge
  - **Date pill** added to the right slot on lg+: `bg-hair-soft` chip with `CalendarDays` icon + `Intl.DateTimeFormat('ro-RO', { weekday, day, month })` (e.g. "marți, 23 mai"). Fills the right side meaningfully instead of leaving an orphaned bell
  - Inner div changes from `max-w-7xl mx-auto` → `lg:max-w-none lg:mx-0` so TopBar chrome (title left, date pill right) anchors to the edges of the sidebar-shifted area rather than aligning exactly with the content cap underneath. Distinct chrome/content bands
  - Mobile/tablet TopBar identical to Phase 19

- **Auth pages** (`app/(auth)/login/page.tsx`, `app/(auth)/2fa/page.tsx`):
  - Removed `bg-cream` from all three wrappers (login, 2FA, 2FA Suspense fallback)
  - Removed the redundant `honeycomb-bg opacity-[0.035]` overlay divs
  - Auth pages now display the body-level hex SVG wallpaper consistently with the rest of the app

- **Brand tagline**:
  - Added `t.brand.tagline = "Because bees live, we live too"` to `lib/i18n.ts` (single source of truth — the wordplay on "Beelive" = "bees live")
  - Rendered on `app/(auth)/login/page.tsx` under the h1 "Beelive": italic `text-purple/80` line above the existing subtitle
  - Rendered in `components/layout/Sidebar.tsx` brand block: small italic `text-purple/70` line indented under the wordmark
  - User refined the rendered text to English (vs. the initial Romanian "Pentru că albinele trăiesc, trăim și noi.")

### ✅ Phase 15 — Screenshot Replication
- **Color palette corrected**: Royal Purple `#40288C` (was `#4D2B8C`), Soft Purple `#85489D` (was `#85409D`) — updated `globals.css`, `lib/tokens.ts`, all inline SVG hex values in BzzBzzCard, InspectorMiniMap, CascadeRow
- **TopBar brand**: simplified to "Radarul Albinelor" on one line (removed "Beelive" / subtitle structure)
- **2FA page redesigned**:
  - "ROeID · Pasul 2" label now purple (was gray)
  - Auto-submits when all 6 digits filled (no explicit submit button shown)
  - Method switch links: "Trimite prin SMS" / "Trimite prin Email" below digit boxes
  - CNP/session info bar in pollen yellow at bottom
  - OTP boxes have `border-purple/30` outline always (not just on focus)
- **Apicultor safe hero**: gradient background (`linear-gradient` + green tint) with faint honeycomb SVG texture
- **Inspector damage claims**: now shows `claim.description` as title (was showing UUID `claim.apiary_id`)

---

### ✅ Session 2026-05-23 — Privacy + UX polish

**Privacy (cross-role identity masking — UI layer only; backend still returns real names)**
- `app/(app)/apicultor/page.tsx:120` — alert feed reads "Un fermier a anunțat…" instead of `alert.farmer_name_masked`
- `components/alerts/BzzBzzCard.tsx:233` — alert card header reads "Un fermier · {own apiary}" instead of `farmer_name_masked`
- `components/cascade/CascadeRow.tsx:94,125` — farmer-facing cascade row shows literal "Apicultor" + "AP" avatar instead of `dispatch.beekeeper_initials`
- `components/alerts/CascadeStatusList.tsx:41` — accessibility live-region says "Apicultor, {apiary}: …" (no initials)
- `components/panels/RiskPreviewPanel.tsx` — bulleted beekeeper-name list dropped entirely from the spray-report sidebar; `visible`/`extra` locals removed
- `components/forms/RaportStropireForm.tsx` — desktop + mobile CTA cards drop `MOCK_AFFECTED.join(', ')` line; only the count remains
- Inspector views unchanged — ANF still sees `full_name` (correct)

**Sidebar profile card** (`components/layout/Sidebar.tsx:53-90` + `initialsOf()` helper at top)
- Role-colored avatar circle (initials from `user.name`), role-tinted card background + 1px border + hover state
- Role pill placed beside the name; card is a `<Link>` to `/setari`

**react-select migration**
- Added `react-select` ^5.10.2 to deps
- `components/forms/RaportStropireForm.tsx` — parcel `<select>` replaced with `Controller` + `Select` (`unstyled` + `classNames`, searchable, clearable, focus:border-purple, purple-tinted selected option). Only that one native select existed; substance picker stays pill-button.

**/setari cleanup** (`app/(app)/setari/page.tsx` rewritten)
- Removed unimplemented "Notificări" and "Securitate" placeholder sections
- Removed section-nav sidebar + scrollspy IntersectionObserver (single section now)
- Removed unused `Bell`, `Shield`, `ChevronRight` imports + `useEffect`

**Copy fixes**
- `app/(app)/fermier/page.tsx:122,130-132` — 4th stat card relabeled "Cascade complete / rapoarte încheiate" → **"Procese încheiate / din N totale"**; same card's other subtitle "toate pe ledger" → **"toate în registru"**
- De-jargoned "ledger" in user-facing copy:
  - `app/(app)/apicultor/stupine/nou/page.tsx:183` — "înregistrată pe ledger" → "înregistrată oficial"
  - `app/(app)/fermier/rapoarte/[id]/page.tsx:23` — cascade step "Înregistrat pe ledger" → "Înregistrat oficial"
  - `components/panels/ApiaryHistoryPanel.tsx:35,38` — heading "Istoric pe ledger" → "Istoric oficial"; empty state "Niciun eveniment pe ledger încă" → "…înregistrat încă"
  - `components/feedback/LedgerChip.tsx` — chip now reads **🔗 Dovadă #{hash}** instead of a bare hex string; aria-label simplified
- Internal field names (`ledger_hash`, `LedgerChip` component name, `AlertView.farmer_name_masked`, `AlertDispatchPublic.beekeeper_initials`) kept — code-only

---

### ✅ Session 2026-05-24 — Spray-report form polish + validation

**Spray-report form CTA cleanup** (`components/forms/RaportStropireForm.tsx`)
- **Removed duplicate desktop CTA**: form had its own inline "Notifică toți" while `RiskPreviewPanel` already owns the desktop submit (wired via `form="raport-stropire-form"`); inline block deleted, panel button is single source of truth on lg+
- **Removed "Salvează ca draft"** ghost links from both desktop CTA and mobile sticky CTA — not implemented (was just `router.back()`) and we don't ship dishonest controls
- **Mobile sticky CTA repositioned**: was `bottom-0 z-20`, hidden behind `MobileTabBar` (`bottom-0 z-30 ~72px`). Now `bottom: calc(72px + env(safe-area-inset-bottom))` so it floats above the tab bar. Form padding bumped `pb-40` → `pb-56` so last field clears the floating CTA
- **Color palette rework**: dropped the dark navy (`#1B0F2E`) + pollen yellow combo on both desktop + mobile CTAs — felt heavy / out of palette. Now white card + purple primary button + `shadow-lg` to lift it off the cream wallpaper

**`RiskPreviewPanel` disabled state** (`components/panels/RiskPreviewPanel.tsx` + `app/(app)/fermier/raport-nou/page.tsx:29`)
- New `disabled?: boolean` prop; submit becomes `disabled || submitting`
- Page wires `disabled={!live.parcel_id}` so submit greys out until parcel is picked (matches the old inline CTA's `!selectedParcelId` guard)

**Surface validation** (`components/forms/RaportStropireForm.tsx`)
- `useEffect` watches `surface_ha` vs selected parcel's `surface_ha`; calls `setError('surface_ha', { message: 'Nu poate depăși X ha (suprafața parcelei)' })` when exceeded, else `clearErrors`
- Added `max={parcelMaxHa}` on the input (HTML5 hint + browser stepper cap)
- Muted `max X ha` hint under the field when parcel is selected; replaced by red zod error when exceeded
- Flows through `isValid` so both desktop submit + mobile sticky CTA respect the constraint

**Bee-safe hour warning** (`components/forms/RaportStropireForm.tsx`)
- Derived `isRiskyHour` from `watch('scheduled_at')` — true when hour ∈ `[6, 21)` (active foraging window)
- Non-blocking pollen/honey-tinted `<note>` appears below the date+duration row: "Ora poate afecta albinele. Stropirea în intervalul 06:00–21:00 prinde albinele în zbor. Recomandăm seara târziu sau dimineața devreme."
- `aria-describedby` on datetime input points at the warning when present
- Does NOT block submission

**Centering** (`app/(app)/apicultor/stupine/nou/page.tsx:177`)
- "Ce se întâmplă după trimitere?" right-rail heading centered (`text-center` added)

---

### ✅ Session 2026-05-24 — WCAG 2.1 AA accessibility pass

**Color contrast (1.4.3)**
- `app/globals.css` — new token `--color-honey-deep: #b45309` (5.0:1 on white, vs honey's 2.06:1 failure)
- `text-honey` → `text-honey-deep` on text-bearing elements only (icons remain `text-honey` decorative + `aria-hidden`):
  - `app/(app)/apicultor/page.tsx` — "X km de stropire" warning + "Atenție" hero label
  - `app/(app)/inspector/page.tsx:180` — "Stropiri" KPI number
  - `app/(app)/fermier/page.tsx:125,170` — "Apicultori notificați" KPI + parcel "Următoarea" pill text/icon
  - `components/cascade/CascadeRow.tsx:128` — wind-favored chip
  - `components/forms/RaportStropireForm.tsx:363-364` — bee-safe-hour warning icon + text
- `text-ink-muted` on `bg-hair-soft` chips (~4.3:1 borderline) → `text-ink-soft` (8:1+):
  - `components/feedback/LedgerChip.tsx`, `components/panels/ApiaryHistoryPanel.tsx`, `app/(app)/inspector/page.tsx:245` ledger-hash chips
- `components/ui/EmptyState.tsx:22` — `text-ink-muted/70` (failed) → `text-ink-muted` (full opacity, passes)

**Focus visibility (2.4.7)**
- Form inputs were stripping focus ring (`focus:outline-none focus:border-purple`) with border-only replacement. Added `focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-1` to:
  - `app/(auth)/login/page.tsx` — CNP + password inputs
  - `app/(auth)/2fa/page.tsx` — 6 OTP boxes
  - `components/forms/RaportStropireForm.tsx` — `fieldCls` + textarea
  - `app/(app)/apicultor/stupine/nou/page.tsx` — notes textarea (other inputs already had `focus:ring-2 focus:ring-purple`)

**Landmark structure (2.4.1)**
- `app/(auth)/layout.tsx` — **NEW**. Wraps login/2fa in `<main id="main-content">` so the skip link target exists on auth routes (previously only `(app)/layout.tsx` had it → dead anchor on /login + /2fa)

**Card-link accessible names (4.1.2)**
- Added explicit `aria-label` to `<Link>` cards so SR announces a coherent summary instead of concatenated cell fragments:
  - `app/(app)/apicultor/page.tsx` — apiary row (name + hives + status), alert row (substance + distance + apiary)
  - `app/(app)/apicultor/alerte/page.tsx` — alert list rows (apiary + date + substance)
  - `app/(app)/fermier/page.tsx` — parcel rows (name + locality + ha + next-spray hint), report rows (parcel + date)
  - `app/(app)/fermier/rapoarte/page.tsx` — report cards (parcel + date + crop)

**OTP autocomplete (3.3.7 / UX)**
- `app/(auth)/2fa/page.tsx:146` — first OTP input gets `autoComplete="one-time-code"` so iOS / modern browsers can auto-fill the SMS code

**Decorative icons (1.1.1)**
- Added `aria-hidden` to lucide icons inside text-labeled buttons / chevrons inside aria-labeled links so SRs don't double-announce:
  - `MobileTabBar` tab icon + its wrapper span
  - `TopBar` Bell / Settings / LogOut icons
  - `apicultor/stupine/page.tsx`, `apicultor/alerte/page.tsx`, `inspector/page.tsx`, `inspector/fermieri/page.tsx`, `fermier/rapoarte/page.tsx`, `fermier/parcele/[id]/page.tsx`, `panels/RiskPreviewPanel.tsx` — ChevronRight / MapPin / Wind icons in card lists

**Map keyboard hints (2.1.1)**
- `components/map/MapView.tsx` — added `aria-describedby="map-keyboard-help"` and a `sr-only` description listing keyboard shortcuts (arrows pan, +/- zoom, Tab between markers). Also explicit `keyboard` prop on `<MapContainer>` to make Leaflet's keyboard handler intent visible

**Verified compliant (no change needed)**
- `lang="ro"` on `<html>`, skip-link in root layout, `:focus-visible` global ring, `prefers-reduced-motion` honored across CSS + Framer Motion, substance/type radio-buttons announce their text content correctly, `Chip.tsx` uses `text-ink-soft` (not the borderline `ink-muted` the first-pass audit flagged)

---

### ✅ Session 2026-05-24 — Urgent-alert demo + dashboard contract fixes + safe-hero polish

**`alert.urgent` ledger event type** (`components/panels/ApiaryHistoryPanel.tsx` + `app/api/v1/_mock/data.ts`)
- `TYPE_ICON`/`TYPE_LABEL` gained `'alert.urgent' → AlertTriangle / "Alertă urgentă"` (distinct from `'alert.confirmed' → CheckCircle / "Alertă confirmată"`)
- New `TYPE_TINT` map: urgent rows render with `bg-alert/10` + `text-alert` icon chip instead of the neutral purple-on-hair-soft used for the other event types
- `LEDGER_EVENTS` gained `evt-016` (apiary-1) and `evt-017` (apiary-2) urgent events with payload `{ toxicity: 'T+', downwind: true, reason: 'tox_high_downwind_close' }`. Hash chain extended off `evt-015`

**Urgent / unsafe alert seed** (`app/api/v1/_mock/data.ts`)
- New `spray-seed-urgent`: T+ Confidor Energy, parcel-2 area, started 30 min ago, `status: 'in_progress'`, `created_at_ms = Date.now() - 120s`
- New `dispatch-seed-urgent` for apiary-1 (0.4 km, downwind): `final_status: 'unconfirmed'`, channels in terminal "tried everything" state — push `delivered`, call `no_answer` after 3 attempts, sms `no_reply`
- `computeDispatch` extended: `if (d.final_status === 'unconfirmed') return d` — same short-circuit pattern already used for `'confirmed_app'`. Without this, the cascade tick would overwrite the seeded 'unconfirmed' state with `'confirmed_call'` once `t > 12`. Means demo URL `/apicultor/alerte/dispatch-seed-urgent` stays urgent indefinitely instead of auto-confirming on refresh

**API: `GET /alerts?status=active|all` actually honored** (`app/api/v1/alerts/route.ts`)
- Previously the route ignored `?status` and returned every dispatch — the dashboard's "active" hero was just picking `[0]` of the unfiltered list, which always happened to be `dispatch-seed-1a` (cascade auto-confirmed it to `confirmed_call`)
- Now: `request` parameter pulled in, `searchParams.get('status')` checked. `status=active` filters out any enriched dispatch whose `final_status` starts with `'confirmed'`. `status=all` (or absent) returns everything
- Sort: `created_at` DESC across both branches — standard feed ordering, contract-compliant. Earlier attempt with custom "pending-first then ascending distance" sort was dropped because it bypassed the standard list ordering the rest of the app expects; clients re-sort if they need a specialized order
- Per API contract §5: `?status=active|all` is part of the spec — implementation now matches

**Apicultor dashboard: two-query split** (`app/(app)/apicultor/page.tsx`)
- Was: single `useAlerts('active')` powered both the hero ("X alerte active" + `BzzBzzCard`) AND the "Activitate recentă" right-rail feed. Once `?status=active` actually started filtering, the activity feed collapsed to 0 items in normal cases (everything historical is confirmed)
- Now:
  - `useAlerts('active')` → `activeAlerts` → hero count + closest-distance pick for the `BzzBzzCard` (`heroAlert = [...activeAlerts].sort((a,b) => a.distance_km - b.distance_km)[0]`)
  - `useAlerts('all')` → `recentAlerts` → "Activitate recentă" feed shows top 3 regardless of confirmation state
- Hero subtitle and `BzzBzzCard` both consume `heroAlert` (so they always describe the same dispatch)

**Apicultor dashboard: side-by-side rail when no alert** (`app/(app)/apicultor/page.tsx`)
- The desktop right `<aside>` was hardcoded `lg:col-span-4` even when the hero filled `col-span-12` alone — left 8 cols of dead space
- Now the aside switches class set on `hasAlert`:
  - `hasAlert`: `hidden lg:flex lg:col-span-4 lg:flex-col lg:gap-6` (narrow rail beside `BzzBzzCard`)
  - no alert: `hidden lg:grid lg:col-span-12 lg:grid-cols-2 lg:gap-6` (full-width, two equal columns — Stupinele tale | Activitate recentă)
- Mobile/tablet layout unchanged (each section still renders separately under `lg:hidden lg:col-span-12`)

**Safe-hero contrast fix** (`app/globals.css` + `app/(app)/apicultor/page.tsx`)
- New token `--color-safe-deep: #15803d` (Tailwind green-700, ~4.98:1 on white vs the brand `safe` color's 3.26:1 — fails AA for small text)
- Safe hero background: dropped the `linear-gradient(... → cream 100%)` fade (left the right half too light for the green `text-safe` to read against). First swapped to `rgba(22,163,74,0.10)` + honeycomb-stripe `backgroundImage`. User flagged that hex stripes shouldn't appear on the green surface (body wallpaper bleeding through translucent bg looked dirty), so final: **solid `#e8f6ed`** (matches the visual 10% green tint on white but opaque), honeycomb texture overlay removed entirely, border `rgba(22,163,74,0.28)`
- "BUNĂ DIMINEAȚA, IOAN" label: `text-safe` → **`text-safe-deep`**. Subtitle "80 stupi · 0 alerte": `text-ink-muted` → `text-ink-soft` for consistency with the new opaque surface

**StatusBadge solid green** (`components/ui/Badge.tsx`)
- Same hex-bleed problem on small chips: `bg-safe/10` (translucent) → **`bg-[#e8f6ed]`** (solid) on `safe`/`completed`/`accepted` variants
- Text: `text-safe` → `text-safe-deep` on those same variants (the now-lighter solid background made the brand green even less readable than before)
- Warning/honey + danger/red variants untouched — those warm tones mask the hex pattern visually and pass contrast as-is; can revisit with `bg-amber-100`/`bg-red-100` if needed

**`EmptyState` horizontal variant** (`components/ui/EmptyState.tsx`)
- New `align?: 'center' | 'left'` prop (default `'center'` so all existing call sites render unchanged)
- `align="left"` switches the wrapper to `flex items-center gap-5 text-left`, drops the bee's `mx-auto` for `shrink-0`, text column gets `flex-1 min-w-0`, subtitle max-width relaxes 280px → 420px
- Applied on `app/(app)/apicultor/alerte/page.tsx` — bee+text now sit on the same left edge as the `h1` "Alertele mele" and the Active/Toate tab bar above, instead of floating in the center of a left-aligned page

---

### ✅ Session 2026-05-24 — Apiary location picker + global toast helpers

**Interactive location picker** (`components/map/LocationPicker.tsx` — **NEW**)
- Address input + Nominatim geocoder (`https://nominatim.openstreetmap.org/search` with `countrycodes=ro`, `Accept-Language: ro`) — Enter or search button geocodes RO addresses; first hit becomes the new lat/lng. Nominatim's free tier (~1 req/s) is fine for the hackathon; would swap to Mapbox/Google for prod
- Draggable Leaflet `Marker` + map click-to-set (`useMapEvents.click`) both fire the same `handlePick` → `onChange` upward + reverse-geocode (`/reverse?format=json`) populates the address input so the user sees a human-readable confirmation of where they dropped
- Imperative `Recenter` child component runs `map.setView([lat, lng], map.getZoom())` whenever the prop changes (after first render — initial mount uses `MapContainer`'s `center`)
- `InvalidateOnMount` calls `map.invalidateSize()` 50ms after mount so tiles render correctly when the map appears inside a flex/grid container that resolved size post-mount (modal expansion in particular)
- "Maximize" button (top-right overlay) opens a `fixed inset-0 z-[9999]` modal with: identical address bar, larger map (`h-full`), confirm button. Closes back to the inline picker preserving lat/lng
- `fill?: boolean` prop — when true root becomes `flex flex-col h-full min-h-0`, map wrapper gets `flex-1 min-h-0`, map element `h-full` (used by the desktop aside to fill row height). When false (mobile inline), map uses fixed `h-[220px] sm:h-[280px]`
- Leaflet CSS already imported in `globals.css`; loaded via `next/dynamic` with `ssr: false` matching the `MapView` pattern

**Wired into stupină-nouă** (`app/(app)/apicultor/stupine/nou/page.tsx`)
- Lat/lng lifted into form state (default `46.77 / 23.59`); `POST /apiaries` body now sends real coords. Was previously hardcoded — would have written Cluj's centroid for every apiary
- Picker rendered in two places: the aside (`hidden lg:flex`) using `fill` mode AND inline inside the form (`lg:hidden`) for mobile. Two `MapContainer` instances coexist sharing parent state — fine on a hackathon, OK to revisit
- Grid widened on bigger screens: `lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_520px] 2xl:grid-cols-[1fr_640px]`; switched `lg:items-start` → `lg:items-stretch` so the Locație card stretches to match the form's row height
- Removed the "Ce se întâmplă după trimitere?" explainer card (`Layers/FileText/Bell` bullets) from the aside — aside now contains only the Locație picker. Unused icon imports dropped
- **`locationTouched` gate**: separate flag (vs comparing to default coords) flips `true` from any picker `onChange` — address-search, map click, OR marker drag. Submit button disabled until then. Label shows red `*` + "Necesar" pill / mobile shows red helper text below the picker until touched. Prevents submitting a default placeholder location masquerading as a real one (per API contract §2, `lat`/`lng` are required non-optional numbers)
- `min={today}` on start-date input (`today = new Date().toISOString().split('T')[0]`); pastoral end-date already has `min={startDate}` so it's transitively ≥ today

**Global toast helpers** (`lib/api/toast.ts` — **NEW**)
- Sonner + `<Toaster>` mount were already in `app/layout.tsx`; needed a shared call site so API integrations across the app produce consistent UX without each page hand-rolling error unwrap logic
- `toastSuccess(msg)` — thin wrapper around `toast.success` for symmetry with the error helper
- `toastError(err, fallback)` — if `err instanceof ApiError`, prefers the first string value in `err.details` (field-level Romanian message per contract §0's `validation_failed` shape), else `err.message`, else `fallback`. Non-`ApiError` paths (network, parse) go straight to fallback. Means the API team's localized error messages surface as-is without per-page wiring
- `toastApiPromise(promise, { loading, success, errorFallback })` — same unwrap logic but composed with `toast.promise` for one-line loading→success/error chains on mutations
- Stupină creation now uses `toastSuccess('Stupina a fost înregistrată.')` + `toastError(err, 'Eroare la salvare. Reîncearcă.')`; inline `role="alert"` error block deleted (toast carries its own aria-live). Unused `useState` `error` removed
- Pattern for future API wiring across the app: `try { await api.x(); toastSuccess('...') } catch (err) { toastError(err, '...') }`

**Login cleanup** (`app/(auth)/login/page.tsx`)
- Removed the dev-only "Date de test: CNP 1900101400001 / parolă test1234 / Roluri: ...400001=apicultor..." hint block. Test credentials still live in `PROGRESS.md`'s resume table for anyone running the mock backend locally

---

## ⬜ Remaining / Nice-to-haves

- **`public/sw.js`** — service worker (push event → showNotification, notificationclick → openWindow)
- **`app/(auth)/onboarding/page.tsx`** — push permission request UI for apicultor
- **Framer Motion page transitions** — AnimatePresence on route group
- Mobile QA pass at 360×740
- Error boundaries around cascade list and map
- `npm run gen:api` script when Go API exports openapi.json
- Wire EmptyState to fermier/parcele and inspector list pages

---

## Key decisions / gotchas

- **Next.js 16**: middleware renamed to `proxy.ts` (not `middleware.ts`)
- **Zod v4**: `invalid_type_error` → `error` in number schemas
- **In-memory mock**: state resets on server restart (Next.js dev server stays up); spray reports survive across requests in the same process
- **Leaflet icons**: using unpkg CDN for marker images (avoids bundler issue)
- **Cascade timing**: each dispatch staggered by 8s so the animation plays visually distinctly
- **Tailwind v4**: CSS-first `@theme` in globals.css — no `tailwind.config.js`
- **RiskMapPreview**: pure SVG, never import Leaflet in BzzBzzCard
- **prefers-reduced-motion**: all Framer Motion + CSS animations guarded; `@media` block in globals.css
- **OTP inputs**: `type="text" inputMode="numeric"` — never `type="number"` (breaks maxLength + iOS)
- **TopBar bell badge**: only shown for `apicultor` role (uses `useAlerts('active')`)
- **AnimatePresence mode="wait"**: BzzBzzCard ↔ BzzBzzConfirmed transition on alert confirmation
