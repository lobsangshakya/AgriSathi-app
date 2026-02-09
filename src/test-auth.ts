/**
 * Simple Authentication Test
 * Run this in the browser console to test authentication
 */

import { authWrapper } from './services/authServiceWrapper';

// Test signup
async function testSignup() {
  console.log('Testing signup...');
  const result = await authWrapper.signUp('test@example.com', 'password123', {
    name: 'Test User',
    phone: '+1234567890',
    location: 'Test Location',
    language: 'english',
  });
  console.log('Signup result:', result);
}

// Test login
async function testLogin() {
  console.log('Testing login...');
  const result = await authWrapper.signIn('test@example.com', 'password123');
  console.log('Login result:', result);
}

// Test OTP
async function testOTP() {
  console.log('Testing OTP...');
  const sendResult = await authWrapper.sendOTP('+1234567890');
  console.log('Send OTP result:', sendResult);
  
  if (sendResult.success) {
    const verifyResult = await authWrapper.verifyOTP('+1234567890', '123456');
    console.log('Verify OTP result:', verifyResult);
  }
}

// Export test functions
(window as any).testAuth = {
  testSignup,
  testLogin,
  testOTP,
};

console.log('Auth test functions available: testAuth.testSignup(), testAuth.testLogin(), testAuth.testOTP()');
