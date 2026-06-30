# White Screen Landing Page Bugfix Tasks

## Tasks

- [x] 1. Write exploratory bug condition tests (unfixed code)
  - [x] 1.1 Create `src/App.test.tsx` with a render test that mounts `App` at `/` and asserts `AuthEnhanced` content is present — expect this test to FAIL on unfixed code
  - [x] 1.2 Add a render test that mounts `App` at `/dashboard` and asserts `DashboardSimple` content is present — expect FAIL on unfixed code
  - [x] 1.3 Add a render test that mounts `App` at `/unknown-route` and asserts `NotFound` content (404) is present — expect FAIL on unfixed code
  - [x] 1.4 Run the tests and confirm they fail, documenting the actual rendered output as the counterexample

- [-] 2. Fix Root Cause 1 — Restore the `<Routes>` tree in `App.tsx`
  - [x] 2.1 Remove the debug import (`import Dashboard from './pages/DashboardSimple'`) and the hardcoded debug `<div>` from `App.tsx`
  - [x] 2.2 Add imports for all page components: `AuthEnhanced`, `DashboardSimple`, `ChatSimple`, `DiseaseDetectionSimple`, `Community`, `Profile`, `Wallet`, `AgriCredits`, `ServiceConfirmation`, `NotFound`
  - [ ] 2.3 Restore the full `<Routes>` tree inside `<BrowserRouter>`:
    - `<Route path="/" element={<AuthEnhanced onAuth={...} />} />`
    - `<Route path="/dashboard" element={<DashboardSimple />} />`
    - Routes for `/chat`, `/disease-detection`, `/community`, `/profile`, `/wallet`, `/agri-credits`, `/service-confirmation`
    - `<Route path="*" element={<NotFound />} />` catch-all
  - [x] 2.4 Verify no TypeScript errors (`getDiagnostics` on `src/App.tsx`)

- [x] 3. Fix Root Cause 2 — Resolve the invalid Supabase anon key
  - [x] 3.1 Update `.env` — replace `VITE_SUPABASE_ANON_KEY=sb_publishable_…` with either the correct JWT anon key (starts with `eyJ`) from the Supabase project dashboard, or a clearly documented placeholder that communicates mock-auth mode is active
  - [x] 3.2 Update `.env.example` to document that `VITE_SUPABASE_ANON_KEY` must be a JWT starting with `eyJ`, and add a comment explaining the mock-auth fallback

- [x] 4. Verify fix checking — confirm bug condition is resolved
  - [x] 4.1 Run the tests from task 1 — all three should now PASS
  - [x] 4.2 Manually open the app in a browser at `/` and confirm `AuthEnhanced` renders (no blank screen)
  - [x] 4.3 Manually navigate to `/dashboard` and confirm `DashboardSimple` renders

- [x] 5. Verify preservation checking — confirm no regressions
  - [x] 5.1 Run existing `authService.preservation.test.ts` — all tests must continue to PASS
  - [x] 5.2 Run existing `authService.bugCondition.test.ts` — tests must PASS on the fixed `authService` (which already has the dev bypass)
  - [x] 5.3 Manually test phone OTP login: enter any phone number, use OTP `123456` in dev mode, assert redirect to `/dashboard`
  - [x] 5.4 Manually test logout: click logout from `/dashboard`, assert redirect to `/` with `AuthEnhanced` visible
  - [x] 5.5 Manually navigate to `/unknown-route` and confirm `NotFound` renders

- [x] 6. Add preservation property-based tests
  - [x] 6.1 Add a property-based test in `src/App.test.tsx` (or a new file) that generates random route strings not in the known list and asserts `NotFound` is rendered — validates `Route path="*"` catch-all is always present
  - [x] 6.2 Confirm all tests pass with `vitest --run`
