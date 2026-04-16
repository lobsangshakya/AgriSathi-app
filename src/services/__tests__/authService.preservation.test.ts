/**
 * Preservation Property Tests
 *
 * Property 2: Preservation - Non-Bypass Auth Paths Are Unchanged
 *
 * These tests MUST PASS on unfixed code.
 * They confirm the baseline behavior that must be preserved after the fix.
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 */

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';

// Mock supabaseClient to export supabase = null (simulating missing/placeholder env vars)
vi.mock('@/utils/supabaseClient', () => ({
  supabase: null,
}));

import { authService } from '@/services/authService';

describe('Preservation: Non-Bypass Auth Paths Are Unchanged', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * P2a: For all OTP strings that are NOT "123456", signInWithPhone(phone, otp)
   * with supabase = null always returns { user: null, error: <non-null string> }.
   *
   * This confirms that non-magic OTPs always fail gracefully when Supabase is unconfigured.
   */
  it('P2a: signInWithPhone with non-"123456" OTP and supabase=null always returns error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 15 }),
        fc.string().filter(s => s !== '123456'),
        async (phone, otp) => {
          const result = await authService.signInWithPhone(phone, otp);
          expect(result.user).toBeNull();
          expect(result.error).not.toBeNull();
          expect(typeof result.error).toBe('string');
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * **Validates: Requirements 3.2**
   *
   * P2b: For all OTP strings (including "123456") with import.meta.env.DEV = false,
   * signInWithPhone(phone, otp) with supabase = null always returns
   * { user: null, error: <non-null string> } — no bypass in production.
   */
  it('P2b: signInWithPhone with DEV=false and supabase=null always returns error (no bypass in production)', async () => {
    // Set DEV = false to simulate production environment
    Object.defineProperty(import.meta, 'env', {
      value: { ...import.meta.env, DEV: false },
      writable: true,
      configurable: true,
    });

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 10, maxLength: 15 }),
        fc.string(),
        async (phone, otp) => {
          const result = await authService.signInWithPhone(phone, otp);
          expect(result.user).toBeNull();
          expect(result.error).not.toBeNull();
          expect(typeof result.error).toBe('string');
        }
      ),
      { numRuns: 5 }
    );
  });

  /**
   * **Validates: Requirements 3.3**
   *
   * P2c: signIn(email, password) with supabase = null always returns
   * { user: null, error: <non-null string> } regardless of inputs.
   */
  it('P2c: signIn(email, password) with supabase=null always returns error regardless of inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(),
        fc.string(),
        async (email, password) => {
          const result = await authService.signIn(email, password);
          expect(result.user).toBeNull();
          expect(result.error).not.toBeNull();
          expect(typeof result.error).toBe('string');
        }
      ),
      { numRuns: 5 }
    );
  });
});
