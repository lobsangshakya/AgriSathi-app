# Bugfix Requirements Document

## Introduction

When AgriSathi is loaded in a browser at the root URL (`/`), the landing page never renders — the tab title shows correctly but the viewport remains completely blank. Investigation reveals two compounding causes:

1. **`App.tsx` is in a broken debug state** — it renders only a hardcoded `<div>✅ Dashboard import OK</div>` with no `<Routes>`, no `<Route>` definitions, and no landing page component. The routing tree that should show `AuthEnhanced` at `/` was stripped out during debugging and never restored.

2. **Invalid Supabase anon key** — `.env` sets `VITE_SUPABASE_ANON_KEY=sb_publishable_…` which does not start with `eyJ` (a JWT). `supabaseClient.ts` validates the key format and sets `supabase = null` when the check fails, silently disabling auth. This is non-fatal on its own, but combined with the missing routes it contributes to a completely non-functional app shell.

Both issues together mean the React tree mounts, the `ErrorBoundary` wraps the app, but nothing is ever routed or rendered to the user.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user navigates to `http://localhost:8080/` THEN the system renders a blank white screen with no UI elements visible

1.2 WHEN `App.tsx` is loaded THEN the system renders only a hardcoded debug `<div>` (`✅ Dashboard import OK`) with no router, no routes, and no landing page component

1.3 WHEN `VITE_SUPABASE_ANON_KEY` is set to a value that does not start with `eyJ` THEN the system silently sets `supabase = null` and logs only a console warning, without surfacing any error to the user

1.4 WHEN the app mounts with no `<Routes>` defined inside `<BrowserRouter>` THEN the system renders nothing beyond the debug placeholder, leaving all authenticated and unauthenticated page paths unreachable

### Expected Behavior (Correct)

2.1 WHEN a user navigates to `http://localhost:8080/` THEN the system SHALL render the landing/authentication page (`AuthEnhanced`) so the user can log in or sign up

2.2 WHEN `App.tsx` is loaded THEN the system SHALL render a complete `<Routes>` tree with at minimum a `/` route mapped to the auth/landing page and a `/dashboard` route mapped to `DashboardSimple`

2.3 WHEN `VITE_SUPABASE_ANON_KEY` is a valid JWT (starts with `eyJ`) THEN the system SHALL successfully initialise the Supabase client and enable authenticated API calls

2.4 WHEN `VITE_SUPABASE_ANON_KEY` is missing or malformed THEN the system SHALL fall back gracefully to mock auth (as already designed) and SHALL still render the full app UI without a white screen

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a logged-in user navigates to `/dashboard` THEN the system SHALL CONTINUE TO render `DashboardSimple` with weather, chatbot, scanner, and community cards

3.2 WHEN a user submits valid OTP credentials via `AuthEnhanced` THEN the system SHALL CONTINUE TO authenticate via `authService` and redirect to `/dashboard`

3.3 WHEN `VITE_SUPABASE_ANON_KEY` is not configured THEN the system SHALL CONTINUE TO operate in mock-auth mode (using `localStorage` session) without crashing

3.4 WHEN the `ErrorBoundary` catches a render error THEN the system SHALL CONTINUE TO display the "Something went wrong" fallback UI with a Refresh button rather than a completely blank screen

3.5 WHEN a user visits any unknown route THEN the system SHALL CONTINUE TO render the `NotFound` page

---

## Bug Condition

**Bug Condition Function:**

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type AppState
  OUTPUT: boolean

  // Bug fires when App.tsx has no <Routes> (debug stub is active)
  // AND/OR the Supabase key is non-JWT format
  RETURN (X.appHasNoRoutes = true)
      OR (X.supabaseAnonKey does NOT start with "eyJ")
END FUNCTION
```

**Property: Fix Checking**

```pascal
FOR ALL X WHERE isBugCondition(X) DO
  result ← renderApp'(X)
  ASSERT result.rootRouteRendered = true
  ASSERT result.visibleUIElements > 0
  ASSERT result.isBlankScreen = false
END FOR
```

**Property: Preservation Checking**

```pascal
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT renderApp(X) = renderApp'(X)
  // All existing routes, auth flows, and context providers behave identically
END FOR
```
