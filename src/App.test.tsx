/**
 * Bug Condition Exploration Tests — App Routing
 *
 * CRITICAL: These tests are EXPECTED TO FAIL on unfixed code.
 * Failure confirms the bug exists (App.tsx has no <Routes> tree).
 * DO NOT fix the code or the test when it fails.
 *
 * Validates: Requirements 1.1, 1.2, 1.4 (bugfix.md)
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// ── Mock heavy / external dependencies so the component tree can mount ──

vi.mock('@/utils/supabaseClient', () => ({
  supabase: null,
  isConfigured: false,
}));

vi.mock('@/services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn().mockResolvedValue(null),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signIn: vi.fn().mockResolvedValue({ user: null, error: 'Not configured' }),
    signUp: vi.fn().mockResolvedValue({ user: null, error: 'Not configured' }),
    signInWithPhone: vi.fn().mockResolvedValue({ user: null, error: 'Not configured' }),
    signUpWithPhone: vi.fn().mockResolvedValue({ user: null, error: 'Not configured' }),
    sendOTP: vi.fn().mockResolvedValue({ success: false, error: 'Not configured' }),
    signOut: vi.fn().mockResolvedValue(undefined),
    updateProfile: vi.fn().mockResolvedValue({ user: null, error: 'Not configured' }),
  },
}));

vi.mock('@/services/api', () => ({
  apiService: {
    getWeatherData: vi.fn().mockRejectedValue(new Error('No API key')),
  },
}));

// Mock image assets
vi.mock('@/assets/AgriSathi Logo.png', () => ({ default: 'logo.png' }));
vi.mock('@/assets/agrisathi-logo.svg', () => ({ default: 'logo.svg' }));
vi.mock('@/assets/dashboard_weather_bg.png', () => ({ default: 'weather-bg.png' }));
vi.mock('@/assets/dashboard_chatbot.png', () => ({ default: 'chatbot.png' }));
vi.mock('@/assets/dashboard_scanner.png', () => ({ default: 'scanner.png' }));

// Mock MetaMask / ethers to prevent WalletContext from hanging
vi.mock('@metamask/detect-provider', () => ({
  default: vi.fn().mockResolvedValue(null),
}));

vi.mock('ethers', () => ({
  ethers: {
    BrowserProvider: vi.fn(),
    formatEther: vi.fn().mockReturnValue('0'),
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) =>
      React.createElement('div', props, children),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

// Mock toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn().mockReturnValue({ toast: vi.fn(), toasts: [] }),
}));

// Mock sonner Toaster to avoid window.matchMedia dependency
vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => null,
}));

// ── Import App (after mocks are registered) ──
import App from './App';

beforeEach(() => {
  // Provide minimal localStorage/sessionStorage stubs
  vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
  // Stub matchMedia (required by sonner)
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })));
  // Stub geolocation
  Object.defineProperty(global.navigator, 'geolocation', {
    value: { getCurrentPosition: vi.fn() },
    configurable: true,
  });
  // Suppress known console.warn/error noise from unmocked Supabase path
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Helper: render App with MemoryRouter at a given path ──
// App includes its own BrowserRouter, so we need to override the routing.
// We render the *inner content* of App's BrowserRouter by importing pages directly,
// OR we rely on App's BrowserRouter + window.location manipulation.
//
// Since App uses BrowserRouter (not a passed router), we use the App component
// directly and assert on what actually renders.

describe('Bug Condition Exploration: App Routing', () => {
  /**
   * 1.1 Root route renders AuthEnhanced
   *
   * EXPECTED TO FAIL on unfixed code because App.tsx has no <Routes> tree —
   * it only renders the debug div "✅ Dashboard import OK".
   */
  it('1.1 — navigating to "/" renders AuthEnhanced login/signup content', () => {
    render(<App />);

    // AuthEnhanced shows "Login to AgriSathi" or "Join AgriSathi" and an email/phone toggle
    // On unfixed code the debug div renders instead, so these assertions FAIL.
    const loginHeading = screen.queryByText(/Login to AgriSathi/i)
      || screen.queryByText(/AgriSathi में लॉगिन/i)
      || screen.queryByText(/Join AgriSathi/i);

    // Also check for auth-specific elements
    const emailButton = screen.queryAllByText(/Email/i)[0] ?? null;
    const phoneButton = screen.queryAllByText(/Phone/i)[0] ?? null;

    expect(loginHeading || emailButton || phoneButton).not.toBeNull();
  });

  /**
   * 1.2 Dashboard route renders DashboardSimple
   *
   * EXPECTED TO FAIL on unfixed code — no routes defined, nothing renders.
   * We use window.history.pushState to simulate navigation before rendering.
   */
  it('1.2 — navigating to "/dashboard" renders DashboardSimple content', () => {
    // Push /dashboard into history before rendering App (which uses BrowserRouter)
    window.history.pushState({}, '', '/dashboard');

    render(<App />);

    // DashboardSimple renders feature cards: "AI Chatbot", "Disease Detection", "Farmer Community"
    // These are specific to DashboardSimple and NOT present in the debug stub.
    // On unfixed code: none of these render (no routes defined).
    const chatbotCard = screen.queryByText(/AI Chatbot/i);
    const diseaseCard = screen.queryByText(/Disease Detection/i);
    const communityCard = screen.queryByText(/Farmer Community/i);

    expect(chatbotCard || diseaseCard || communityCard).not.toBeNull();

    // Restore URL
    window.history.pushState({}, '', '/');
  });

  /**
   * 1.3 Unknown route renders NotFound (404)
   *
   * EXPECTED TO FAIL on unfixed code — no catch-all <Route path="*"> exists.
   */
  it('1.3 — navigating to "/unknown-route" renders NotFound 404 content', () => {
    window.history.pushState({}, '', '/unknown-route');

    render(<App />);

    // NotFound renders <h1>404</h1> and "Oops! Page not found"
    // On unfixed code: nothing renders (no routes, no catch-all).
    const notFoundHeading = screen.queryByText('404');
    const notFoundMessage = screen.queryByText(/Page not found/i);

    expect(notFoundHeading || notFoundMessage).not.toBeNull();

    // Restore URL
    window.history.pushState({}, '', '/');
  });
});

/**
 * Preservation Property-Based Tests — Unknown Route Catch-All
 *
 * Validates that <Route path="*"> catch-all is always present by testing
 * multiple random-looking routes that are NOT in the known route list.
 *
 * Validates: Requirements 3.5 (preservation of NotFound for unknown routes)
 *
 * **Validates: Requirements 3.5**
 */
describe('Preservation: Unknown routes always render NotFound', () => {
  const KNOWN_ROUTES = [
    '/',
    '/dashboard',
    '/chat',
    '/disease-detection',
    '/community',
    '/profile',
    '/wallet',
    '/agri-credits',
    '/service-confirmation',
  ];

  // A hardcoded set of random-looking routes not in the known list
  const unknownRoutes = [
    '/abc',
    '/xyz',
    '/foo/bar',
    '/random-123',
    '/unknown',
    '/does-not-exist',
    '/settings',
    '/admin',
    '/test-route-999',
    '/not-a-real-page',
  ];

  // Sanity check: none of our test routes accidentally match a known route
  unknownRoutes.forEach((route) => {
    if (KNOWN_ROUTES.includes(route)) {
      throw new Error(`Test route "${route}" is in the known routes list — pick a different one`);
    }
  });

  unknownRoutes.forEach((route) => {
    it(`renders NotFound for unknown route "${route}"`, () => {
      window.history.pushState({}, '', route);

      render(<App />);

      const notFoundHeading = screen.queryByText('404');
      const notFoundMessage = screen.queryByText(/Page not found/i);

      expect(
        notFoundHeading || notFoundMessage,
        `Expected NotFound content at route "${route}" but found neither "404" nor "Page not found"`
      ).not.toBeNull();

      // Restore URL
      window.history.pushState({}, '', '/');
    });
  });
});
