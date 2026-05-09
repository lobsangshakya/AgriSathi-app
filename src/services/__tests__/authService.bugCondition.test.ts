/**
 * Bug Condition Exploration Test
 *
 * Property 1: Bug Condition - Dev Bypass Missing When Supabase Unconfigured
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists.
 * DO NOT fix the code or the test when it fails.
 *
 * Validates: Requirements 1.1, 1.2
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Mock supabaseClient to export supabase = null (simulating missing/placeholder env vars)
vi.mock('@/utils/supabaseClient', () => ({
  supabase: null,
}));

// Mock import.meta.env.DEV = true
vi.stubEnv('DEV', 'true');

// We need to patch import.meta.env.DEV directly since vi.stubEnv may not cover it
Object.defineProperty(import.meta, 'env', {
  value: { ...import.meta.env, DEV: true },
  writable: true,
  configurable: true,
});

describe('Bug Condition Exploration: Dev Bypass Missing When Supabase Unconfigured', () => {
  beforeEach(() => {
    vi.resetModules();
    // Ensure import.meta.env.DEV is true for each test
    Object.defineProperty(import.meta, 'env', {
      value: { ...import.meta.env, DEV: true },
      writable: true,
      configurable: true,
    });
  });

  /**
   * Property 1 (Bug Condition):
   * For any phone string, when supabase === null AND DEV === true AND otp === "123456",
   * signInWithPhone should return { user: <non-null>, error: null }.
   *
   * On UNFIXED code this FAILS because the `if (!supabase)` guard fires first
   * and returns { user: null, error: "Authentication not configured..." }.
   *
   * Validates: Requirements 1.1, 1.2
   */
  it('Property 1 (signInWithPhone): should return non-null user for any phone when supabase=null, DEV=true, otp="123456"', async () => {
    // Dynamically import after mocks are set up
    const { authService } = await import('@/services/authService');

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 15 }),
        async (phone) => {
          const result = await authService.signInWithPhone(phone, '123456');
          // On unfixed code: result.user === null and result.error !== null
          // This assertion FAILS on unfixed code — that is the expected outcome
          expect(result.user).not.toBeNull();
          expect(result.error).toBeNull();
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * Property 1 (Bug Condition):
   * Same as above but for signUpWithPhone.
   *
   * Validates: Requirements 1.1, 1.2
   */
  it('Property 1 (signUpWithPhone): should return non-null user for any phone when supabase=null, DEV=true, otp="123456"', async () => {
    const { authService } = await import('@/services/authService');

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 15 }),
        async (phone) => {
          const result = await authService.signUpWithPhone(phone, '123456', { name: 'Test' });
          // On unfixed code: result.user === null and result.error !== null
          // This assertion FAILS on unfixed code — that is the expected outcome
          expect(result.user).not.toBeNull();
          expect(result.error).toBeNull();
        }
      ),
      { numRuns: 5 }
    );
  });
});
