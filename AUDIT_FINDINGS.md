# UI Audit Findings — Radarul Albinelor

> Status legend: [ ] = open, [x] = fixed, [~] = partial

---

## Phase 1: Login, 2FA, Fermier Dashboard

### Login Page (`app/(auth)/login/page.tsx`)

- [x] **Screenshot**: Added "ROeID · Pasul 1" step indicator label above Beelive title
- [x] **Branding**: Kept "Beelive" title + logo as intended
- [ ] **Accessibility**: No safe-area-inset support for notched devices
- [ ] **Functionality**: No zod validation schema for form (only runtime checks)
- [x] **Production**: Test credentials wrapped in `NODE_ENV !== 'production'` check

### 2FA Page (`app/(auth)/2fa/page.tsx`)

- [ ] **Accessibility**: OTP box border `border-purple/30` may fail WCAG contrast on light bg
- [ ] **All Good**: Auto-advance, paste, auto-submit, method switch, error handling, role redirect all working

### Fermier Dashboard (`app/(app)/fermier/page.tsx`)

- [x] **Branding**: TopBar already shows "Beelive" (correct) — role badge already amber (#EEA727) for fermier
- [x] **Critical/Functionality**: CTA now links to `/fermier/raport-nou` (was `/fermier/rapoarte`)
- [ ] **Functionality**: Parcel cards all link to `/fermier/parcele` list — no individual parcel detail page exists
- [x] **Functionality**: Greeting now dynamic (dimineața/ziua/seara based on hour)
- [x] **Accessibility**: Stats cards now have aria-labels
- [x] **Accessibility**: Parcel/report lists now have `role="list"` and `role="listitem"`
- [x] **Accessibility**: Color contrast fixed — greeting text changed from `text-pollen` to `text-white/80`
- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Production**: Added loading state for parcels (Spinner) + stats show "—" while loading
- [ ] **Production**: No error state handling for failed API calls

---

## Phase 2: Apicultor Dashboard, BzzBzz Alert, Alerte List

### Apicultor Dashboard (`app/(app)/apicultor/page.tsx`)

- [x] **Functionality**: Greeting now dynamic (dimineața/ziua/seara)
- [x] **Screenshot**: Empty state now shows "Zero alerte. Zumzet liniștit." with EmptyState + subtitle
- [ ] **Accessibility**: Section elements lack `aria-labelledby` attributes
- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [ ] **Production**: No error state handling for failed API calls

### BzzBzzCard (`components/alerts/BzzBzzCard.tsx`)

- [x] **Screenshot**: Header now uppercase "BZZ BZZ · ALERTĂ URGENTĂ"
- [ ] **Functionality**: LedgerChip "Verifică" button has no `onVerify` callback — does nothing
- [x] **Functionality**: `final_status === 'failed'` now shows error bar instead of CTA
- [x] **Functionality**: Channel timestamps now displayed (e.g., "SMS · 18:05")
- [x] **Accessibility**: Verify button now has `aria-label`
- [x] **i18n**: Fixed typo 'Neridcat' → 'Neridicat'

### Alerte List (`app/(app)/apicultor/alerte/page.tsx`)

- [x] **Screenshot**: Empty state now matches design with subtitle + action link
- [x] **Functionality**: Added active/all status filter toggle
- [x] **Accessibility**: Alert cards now wrapped in `ul`/`li` with proper roles
- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [ ] **Production**: No error state if API fails

---

## Phase 3: Inspector Dashboard, Map, Fermieri/Pagube

### Inspector Dashboard (`app/(app)/inspector/page.tsx`)

- [x] **Responsiveness**: Stats grid now `grid-cols-2 sm:grid-cols-3` for mobile
- [x] **Accessibility**: Stats cards now have aria-labels, damage list has `ul`/`li` semantics
- [ ] **Functionality**: Damage claim cards link to list (no detail page exists)
- [x] **Production**: Added loading states — stats show "—", Spinner for damage claims
- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding

### Inspector Map (`app/(app)/inspector/harta/page.tsx`)

- [x] **Accessibility**: Map wrapper div has `role="application"` and `aria-label`
- [x] **Functionality**: Damage claims now rendered on map as red CircleMarkers
- [ ] **Functionality**: No legend/filter controls for toggling layer visibility
- [x] **Responsiveness**: Added responsive padding
- [ ] **Production**: No error boundary or error state for failed API

### Fermieri Page (`app/(app)/inspector/fermieri/page.tsx`)

- [x] **Accessibility**: List items now in `ul`/`li` with roles
- [x] **Production**: Replaced `as any[]` with typed assertion
- [x] **Responsiveness**: Added responsive padding

### Pagube Page (`app/(app)/inspector/pagube/page.tsx`)

- [x] **Responsiveness**: Added responsive padding

---

## Phase 4: Spray Report Form, Report Detail/Cascade, Settings

### Spray Report Form (`components/forms/RaportStropireForm.tsx` + `raport-nou/page.tsx`)

- [x] **Screenshot**: Page heading changed to "Raport stropire nouă" to match design
- [x] **Accessibility**: All form fields now have `aria-invalid` + `aria-describedby` linking to error messages
- [x] **Accessibility**: Substance pill buttons now use `role="radiogroup"` / `role="radio"` + `aria-checked`
- [x] **Accessibility**: Error messages have `id` attributes for `aria-describedby` linkage
- [x] **Functionality**: Duration label fixed from "Ora" to "Durată (ore)" for clarity
- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding on wrapper page
- [ ] **Functionality**: "Salvează ca draft" button only calls `router.back()` — no actual draft persistence
- [ ] **Functionality**: `MOCK_AFFECTED` beekeepers are hardcoded — in production this comes from the API response
- [ ] **Accessibility**: No `aria-invalid` on textarea `notes` field (optional field, low priority)

### Report Detail (`app/(app)/fermier/rapoarte/[id]/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Back button now has `aria-label="Înapoi la lista de rapoarte"`
- [x] **Screenshot**: Added "Gata! Apicultorii știu." success banner when cascade is complete (matches design panel C)
- [x] **Functionality**: Added PDF download link for primărie document
- [ ] **Production**: No error boundary — if spray report fetch fails, shows "Raportul nu a fost găsit" (acceptable for v1)

### CascadeRow (`components/cascade/CascadeRow.tsx`)

- [x] **Screenshot**: Initials circle with solid color fill — matches design ✓
- [x] **Screenshot**: Status badges (Confirmat/În așteptare/Eșuat/În curs) match design variants
- [x] **Functionality**: Added downwind wind indicator icon next to distance
- [x] **Functionality**: Added unconfirmed warning bar with masked phone number
- [x] **Functionality**: Added failed error bar with "Eroare tehnică" message
- [x] **Accessibility**: Confetti respects `prefers-reduced-motion`
- [ ] **Functionality**: Phone number in unconfirmed warning is placeholder — needs real data from API

### CascadeStatusList (`components/alerts/CascadeStatusList.tsx`)

- [x] **Accessibility**: Summary pills section now has `role="group"` + `aria-label`
- [x] **Accessibility**: Dispatch list has `role="list"` + `aria-label`
- [x] **Accessibility**: Live region announces state changes via `aria-live="polite"`
- [x] **Production**: Offline banner + retry indicator after 3 failed polls
- [x] **Production**: Skeleton loading states match dispatch count

### Settings (`app/(app)/setari/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Functionality**: Added Notification preferences section (Bell icon)
- [x] **Functionality**: Added Security section (Shield icon)
- [x] **Accessibility**: Logout button now has `aria-label` and confirmation dialog
- [x] **Production**: Added loading state with Spinner while user data loads
- [x] **Production**: Logout button shows disabled state + spinner during logout
- [ ] **Functionality**: Notification/Security sections are display-only (no drill-down pages yet)

---

## Phase 5: Stupine pages, Parcele, Registru ANF, Rapoarte List

### Stupine List (`app/(app)/apicultor/stupine/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Apiary cards now in `ul`/`li` with `role="list"` + `role="listitem"`
- [x] **Accessibility**: "Adaugă" button now has `aria-label="Adaugă stupină nouă"`
- [x] **Accessibility**: Each apiary link has descriptive `aria-label` with name, hive count, and status
- [x] **Functionality**: Empty state now includes CTA link to register first apiary
- [ ] **Production**: No error state for failed API calls (shows empty list on error)

### Stupine Nou (`app/(app)/apicultor/stupine/nou/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Form inputs now have proper `htmlFor`/`id` label associations
- [x] **Accessibility**: Back button has `aria-label="Înapoi la lista de stupine"`
- [x] **Functionality**: Added apiary type selector (permanent/pastoral) with `role="radiogroup"`
- [x] **Production**: Added error state display on submit failure with `ApiError` handling
- [ ] **Functionality**: Coordinates are hardcoded (46.77, 23.59) — no map picker yet
- [ ] **Accessibility**: Missing end_date field for pastoral type

### Stupine Detail (`app/(app)/apicultor/stupine/[id]/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Back button has `aria-label="Înapoi la lista de stupine"`
- [x] **Accessibility**: Stats cards have `aria-label` for stupi count and active alerts
- [x] **Functionality**: Displays hive count, type, start date, active alerts, notes, ledger hash
- [ ] **Functionality**: History data from API response not displayed (available but unused)

### Parcele (`app/(app)/fermier/parcele/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Parcel cards now in `ul`/`li` with `role="list"` + `role="listitem"`
- [x] **Functionality**: Added empty state with BeeLogo when no parcels
- [x] **Functionality**: Surface now uses `formatHa()` for Romanian locale (e.g., "4,5 ha")
- [x] **Accessibility**: MapPin icon has `aria-hidden` to avoid screen reader noise
- [ ] **Functionality**: Cards are not clickable — no individual parcel detail page exists

### Registru ANF (`app/(app)/fermier/registru-anf/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Functionality**: Export URL now uses `NEXT_PUBLIC_API_BASE_URL` env variable
- [x] **Accessibility**: Download button has descriptive `aria-label`
- [x] **Production**: Added error state display on failed export
- [ ] **Functionality**: Export is a simple `window.open` — no actual PDF download with progress

### Rapoarte List (`app/(app)/fermier/rapoarte/page.tsx`)

- [x] **Responsiveness**: Added `md:px-6 lg:px-8` responsive padding
- [x] **Accessibility**: Report cards now in `ul`/`li` with `role="list"` + `role="listitem"`
- [x] **Accessibility**: FileText icon has `aria-hidden`
- [x] **Functionality**: Improved empty state with BeeLogo + CTA link to create first report
- [ ] **Production**: No error state for failed API calls
