# White Screen Landing Page Bugfix Design

## Overview

The AgriSathi app renders a blank white screen on load due to two compounding defects:

1. **`App.tsx` debug stub** — the entire `<Routes>` tree was stripped during debugging, replaced with a hardcoded `<div>✅ Dashboard import OK</div>`. No routes are defined, so nothing renders at any URL.
2. **Invalid Supabase anon key** — `.env` contains `VITE_SUPABASE_ANON_KEY=sb_publishable_…`, which does not start with `eyJ` (a JWT). `supabaseClient.ts` validates the prefix and sets `supabase = null`, silently disabling all authenticated API calls.

The fix is surgical: restore the full `<Routes>` tree in `App.tsx` and update (or document) the `.env` key. The existing mock-auth fallback in `authService.ts` already handles `supabase = null` gracefully in dev mode, so the second fix is low-risk.

---

## Glossary

- **Bug_Condition (C)**: The condition that triggers the white screen — `App.tsx` has no `<Routes>` tree, and/or `VITE_SUPABASE_ANON_KEY` does not start with `eyJ`.
- **Property (P)**: The desired behavior after the fix — navigating to `/` renders `AuthEnhanced`; navigating to `/dashboard` renders `DashboardSimple`; the screen is never blank.
- **Preservation**: All existing routes, context providers, mock-auth flow, error boundary behaviour, and `NotFound` page rendering must remain unchanged.
- **`App`**: The root component in `src/App.tsx` that wraps providers and defines the `<Routes>` tree.
- **`supabaseClient`**: The module at `src/utils/supabaseClient.ts` that creates the Supabase client or exports `null` when the key is invalid/missing.
- **`authService`**: The service at `src/services/authService.ts` that handles sign-in/sign-up and falls back to `mockAuthResponse` in dev mode when `supabase === null`.
- **`AuthEnhanced`**: The landing/auth page (`src/pages/AuthEnhanced.tsx`) that must render at the `/` route.
- **`DashboardSimple`**: The post-login dashboard (`src/pages/DashboardSimple.tsx`) that must render at the `/dashboard` route.
- **`isConfigured`**: The boolean in `supabaseClient.ts` — `true` only when `VITE_SUPABASE_URL` is set and `VITE_SUPABASE_ANON_KEY` starts with `eyJ`.

---

## Bug Details

### Bug Condition

The white screen manifests when `App.tsx` contains only the debug stub (no `<Routes>`) **or** when the Supabase anon key is not a valid JWT. Either condition alone degrades the app; together they produce a completely non-functional UI.

**Formal Specification:**

```
FUNCTION isBugCondition(X)
  INPUT: X of type AppState
  OUTPUT: boolean

  RETURN (X.appHasNoRoutes = true)
      OR (X.supabaseAnonKey does NOT start with "eyJ")
END FUNCTION
```

### Examples

- **Example 1**: User opens `http://localhost:8080/`. App mounts, `ErrorBoundary` wraps the tree, but `<BrowserRouter>` contains only `<div>✅ Dashboard import OK</div>`. Expected: `AuthEnhanced` renders. Actual: blank/debug div.
- **Example 2**: `VITE_SUPABASE_ANON_KEY=sb_publishable_1mtAjxPCzQM2Z5Bvpk0lYQ_3Gj2cWLA` — `isConfigured` is `false`, `supabase = null`. Expected: app renders in mock-auth mode. Actual: auth calls return `"Authentication not configured"` error before the dev-bypass check runs (for non-phone-OTP flows).
- **Example 3**: User navigates to `/dashboard` directly. Expected: `DashboardSimple` renders. Actual: nothing renders (no routes defined).
- **Edge case**: User visits an unknown route (e.g. `/xyz`). Expected: `NotFound` page. Actual: nothing (no routes, no catch-all).

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Navigating to `/dashboard` after login must continue to render `DashboardSimple` with weather, chatbot, scanner, and community cards.
- Phone OTP sign-in via `AuthEnhanced` → `authService.signInWithPhone` must continue to authenticate and redirect to `/dashboard`.
- When `VITE_SUPABASE_ANON_KEY` is not configured, the app must continue to operate in mock-auth mode (using `localStorage` session) without crashing.
- The `ErrorBoundary` must continue to display the "Something went wrong" fallback UI with a Refresh button when a render error occurs.
- Visiting any unknown route must continue to render the `NotFound` page.
- All context providers (`LanguageProvider`, `UserProvider`, `WalletProvider`, `QueryClientProvider`, `TooltipProvider`) must remain in place, wrapping the router.

**Scope:**
All inputs that do NOT involve the missing routes or the invalid key should be completely unaffected by this fix. This includes:
- All existing route paths (`/chat`, `/disease-detection`, `/community`, `/profile`, `/wallet`, etc.)
- All auth flows (email/password, phone OTP, mock-auth bypass)
- All context state (language, user profile, wallet)
- All UI components that do not depend on routing

---

## Hypothesized Root Cause

1. **Debug stub left in `App.tsx`**: During investigation of an import error, the developer replaced the full `<Routes>` tree with a single hardcoded `<div>` to isolate the problem. The fix was never reverted. File evidence: `App.tsx` imports `DashboardSimple` as `Dashboard` but never uses it in a `<Route>`.

2. **Non-JWT Supabase key in `.env`**: The key `sb_publishable_1mtAjxPCzQM2Z5Bvpk0lYQ_3Gj2cWLA` uses the new Supabase publishable-key format (introduced mid-2024), but `supabaseClient.ts` validates with `.startsWith('eyJ')`, which only accepts the legacy JWT anon key format. The validation logic needs to either be updated or the correct JWT anon key must be placed in `.env`.

3. **Order-of-checks in `authService`**: For `signInWithPhone`, the dev-bypass check (`if (import.meta.env.DEV && otp === '123456')`) runs **before** the `!supabase` guard, so phone OTP mock auth works fine. However, `signIn` and `signUp` (email/password) check `!supabase` first with no dev bypass, meaning email auth fails silently when Supabase is unconfigured. This is a secondary issue exposed by the invalid key.

4. **No route fallback**: Without a `<Route path="*">` catch-all, React Router v6 renders nothing for unmatched paths, compounding the blank-screen symptom.

---

## Correctness Properties

Property 1: Bug Condition - Routes Tree Restored and App Renders

_For any_ app state where `isBugCondition` holds (no routes defined OR invalid Supabase key), the fixed `App` component SHALL render a visible UI — specifically, navigating to `/` SHALL render the `AuthEnhanced` component with at least one visible DOM element, and `isBlankScreen` SHALL be `false`.

**Validates: Requirements 2.1, 2.2, 2.4**

Property 2: Preservation - Existing Routes and Auth Flows Unchanged

_For any_ app state where `isBugCondition` does NOT hold (routes are defined AND Supabase key is valid or mock-auth is active), the fixed app SHALL produce the same rendered output and auth behaviour as the original correctly-functioning app, preserving all existing route handlers, context providers, and auth service responses.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

---

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File 1**: `src/App.tsx`

**Function**: `App` (default export)

**Specific Changes**:
1. **Remove debug stub**: Delete the `import Dashboard from './pages/DashboardSimple'` import and the `<div>✅ Dashboard import OK</div>` element.
2. **Restore full route imports**: Re-add imports for all page components — `AuthEnhanced`, `DashboardSimple`, and all other pages previously defined in the routes tree.
3. **Restore `<Routes>` tree**: Replace the debug div with a full `<Routes>` block containing:
   - `<Route path="/" element={<AuthEnhanced onAuth={...} />} />`
   - `<Route path="/dashboard" element={<DashboardSimple />} />`
   - Routes for `/chat`, `/disease-detection`, `/community`, `/profile`, `/wallet`, `/agri-credits`, `/service-confirmation`
   - `<Route path="*" element={<NotFound />} />` catch-all
4. **Auth callback**: Pass an `onAuth` prop to `AuthEnhanced` (can be a no-op or state setter) to satisfy its TypeScript interface.

**File 2**: `.env`

**Specific Changes**:
1. **Option A (preferred)**: Replace `VITE_SUPABASE_ANON_KEY=sb_publishable_…` with the correct JWT anon key from the Supabase project dashboard (Settings → API → `anon` `public` key — starts with `eyJ`).
2. **Option B (acceptable for dev)**: Leave the key as-is and document that the app runs in mock-auth mode. The `authService` already handles `supabase = null` gracefully for phone OTP flows. Update `.env.example` to note the JWT format requirement.

**File 3** (optional): `src/utils/supabaseClient.ts`

**Specific Changes**:
1. If Supabase introduces the `sb_publishable_` key format as a valid anon key, update the key validation to also accept that prefix. Otherwise, no changes needed — the existing JWT check is correct.

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behaviour.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the white screen BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write render tests that mount `App` (with a mocked router location set to `/`) and assert that `AuthEnhanced` content is visible. Run these tests on the UNFIXED `App.tsx` to observe failures.

**Test Cases**:
1. **Root route renders auth page**: Mount `App` at `/`, assert `AuthEnhanced` heading or login form is present (will fail on unfixed code — only debug div renders).
2. **Dashboard route renders dashboard**: Mount `App` at `/dashboard`, assert `DashboardSimple` content is present (will fail on unfixed code — no routes defined).
3. **Unknown route renders NotFound**: Mount `App` at `/xyz`, assert 404 content is present (will fail on unfixed code — no catch-all route).
4. **Supabase null with valid key format**: Mock `VITE_SUPABASE_ANON_KEY` starting with `eyJ`; assert `supabase` is not null (verifies key validation logic).

**Expected Counterexamples**:
- `AuthEnhanced` content is not found in the rendered output — only the debug div (`✅ Dashboard import OK`) is present.
- Possible causes: `<Routes>` tree missing, debug import left in place.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed app renders visible UI.

**Pseudocode:**
```
FOR ALL X WHERE isBugCondition(X) DO
  result := renderApp_fixed(X)
  ASSERT result.rootRouteRendered = true
  ASSERT result.visibleUIElements > 0
  ASSERT result.isBlankScreen = false
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed app produces the same result as the correctly-functioning original.

**Pseudocode:**
```
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderApp_original(X) = renderApp_fixed(X)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behaviour is unchanged for non-buggy inputs

**Test Plan**: Observe behaviour on UNFIXED code first for all existing routes and auth flows, then write property-based tests capturing that behaviour.

**Test Cases**:
1. **Dashboard route preservation**: Verify `/dashboard` continues to render `DashboardSimple` after fix.
2. **Auth service preservation**: Verify `authService.signInWithPhone` with non-`123456` OTP and `supabase=null` still returns `{ user: null, error: <string> }`.
3. **Mock-auth preservation**: Verify that `supabase=null` in dev mode with OTP `"123456"` still returns a non-null mock user.
4. **NotFound preservation**: Verify `*` catch-all still renders `NotFound` for unknown routes.

### Unit Tests

- Test that `App` at `/` renders `AuthEnhanced` (not the debug div).
- Test that `App` at `/dashboard` renders `DashboardSimple`.
- Test that `App` at `/unknown` renders `NotFound`.
- Test `supabaseClient` key validation: `eyJ…` key → `supabase` is non-null; `sb_publishable_…` key → `supabase` is null.

### Property-Based Tests

- Generate random valid phone strings and assert `authService.signInWithPhone(phone, '123456')` returns non-null user in dev mode with `supabase=null` (already covered by `authService.bugCondition.test.ts`).
- Generate random non-`123456` OTP strings and assert `authService.signInWithPhone` returns `{ user: null, error: <string> }` with `supabase=null` (already covered by `authService.preservation.test.ts`).
- Generate random route strings and assert that the app never renders a blank screen after the fix.

### Integration Tests

- Full login flow: open `/`, enter credentials via phone OTP mock (`123456`), assert redirect to `/dashboard` and `DashboardSimple` content visible.
- Logout flow: from `/dashboard`, click logout, assert redirect to `/` and `AuthEnhanced` rendered.
- Direct navigation to `/dashboard` without auth: assert redirect to `/` or `AuthEnhanced` is rendered (depending on auth guard implementation).
- Unknown route: navigate to `/does-not-exist`, assert `NotFound` page is rendered.
