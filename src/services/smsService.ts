/**
 * SMS Service for OTP Delivery
 * Integrates with multiple SMS providers for reliable OTP delivery
 */

// SMS Provider Types
type SMSProvider = 'twilio' | 'messagebird' | 'textlocal' | 'fast2sms';

interface SMSConfig {
  provider: SMSProvider;
  apiKey?: string;
  senderId?: string;
  apiUrl?: string;
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * SMS Service Class
 */
class SMSService {
  private config: SMSConfig;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.config = this.loadConfig();
  }

  private loadConfig(): SMSConfig {
    // Try to load from environment variables
    const provider = (import.meta.env.VITE_SMS_PROVIDER as SMSProvider) || 'fast2sms';

    return {
      provider,
      apiKey: import.meta.env.VITE_SMS_API_KEY,
      senderId: import.meta.env.VITE_SMS_SENDER_ID || 'AGRISATH',
      apiUrl: import.meta.env.VITE_SMS_API_URL,
    };
  }

  /**
   * Send OTP via SMS
   */
  async sendOTP(phone: string, otp: string): Promise<SMSResponse> {
    // In development, show OTP in UI
    if (this.isDevelopment) {
      return this.showDevelopmentOTP(phone, otp);
    }

    // Try different SMS providers based on configuration
    switch (this.config.provider) {
      case 'twilio':
        return this.sendViaTwilio(phone, otp);
      case 'messagebird':
        return this.sendViaMessageBird(phone, otp);
      case 'textlocal':
        return this.sendViaTextLocal(phone, otp);
      case 'fast2sms':
        return this.sendViaFast2SMS(phone, otp);
      default:
        return this.sendViaFast2SMS(phone, otp);
    }
  }

  /**
   * Development OTP Display
   */
  private showDevelopmentOTP(phone: string, otp: string): SMSResponse {
    // In development, show OTP in UI
    // Note: OTP is actually stored and verified by MockAuthService
    // This display is just for the user visibility.

    // Create a visible OTP display for development
    const otpDisplay = document.createElement('div');
    otpDisplay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 16px;
      z-index: 9999;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      max-width: 300px;
    `;
    otpDisplay.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">Development OTP</div>
      <div>Phone: ${phone}</div>
      <div style="font-size: 20px; font-weight: bold; margin: 8px 0;">${otp}</div>
      <div style="font-size: 12px; opacity: 0.9;">Valid for 5 minutes</div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 10px;
        background: white;
        color: #10b981;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      ">Dismiss</button>
    `;

    document.body.appendChild(otpDisplay);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (otpDisplay.parentElement) {
        otpDisplay.remove();
      }
    }, 10000);

    return {
      success: true,
      messageId: 'dev-mode',
    };
  }

  /**
   * Send via Twilio
   */
  private async sendViaTwilio(phone: string, otp: string): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'Twilio API key not configured' };
    }

    try {
      const response = await fetch('https://api.twilio.com/2010-04-01/Accounts', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(this.config.apiKey + ':')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: this.config.senderId || '+15017122661',
          Body: `Your AgriSathi OTP is: ${otp}. Valid for 5 minutes.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.sid,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Twilio SMS failed',
      };
    }
  }

  /**
   * Send via MessageBird
   */
  private async sendViaMessageBird(phone: string, otp: string): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'MessageBird API key not configured' };
    }

    try {
      const response = await fetch('https://rest.messagebird.com/messages', {
        method: 'POST',
        headers: {
          'Authorization': `AccessKey ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: [{ phone }],
          originator: this.config.senderId || 'AgriSathi',
          body: `Your AgriSathi OTP is: ${otp}. Valid for 5 minutes.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`MessageBird API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'MessageBird SMS failed',
      };
    }
  }

  /**
   * Send via TextLocal
   */
  private async sendViaTextLocal(phone: string, otp: string): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'TextLocal API key not configured' };
    }

    try {
      const response = await fetch('https://api.textlocal.in/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          apikey: this.config.apiKey,
          numbers: phone,
          sender: this.config.senderId || 'AGRISATH',
          message: `Your AgriSathi OTP is: ${otp}. Valid for 5 minutes.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`TextLocal API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.errors?.[0]?.message || 'TextLocal SMS failed');
      }

      return {
        success: true,
        messageId: data.message_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'TextLocal SMS failed',
      };
    }
  }

  /**
   * Send via Fast2SMS (Free SMS Service for India)
   */
  private async sendViaFast2SMS(phone: string, otp: string): Promise<SMSResponse> {
    try {
      // Fast2SMS provides free SMS service for Indian numbers
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'dlt',
          sender_id: this.config.senderId || 'AGRISATH',
          message: `Your AgriSathi OTP is: ${otp}. Valid for 5 minutes.`,
          language: 'english',
          flash: 0,
          numbers: phone,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fast2SMS API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.return === false) {
        throw new Error(data.message || 'Fast2SMS failed');
      }

      return {
        success: true,
        messageId: data.message_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fast2SMS failed',
      };
    }
  }

  /**
   * Get available SMS providers
   */
  getAvailableProviders(): SMSProvider[] {
    return ['twilio', 'messagebird', 'textlocal', 'fast2sms'];
  }

  /**
   * Check if SMS service is configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey || this.isDevelopment;
  }
}

// Export singleton instance
export const smsService = new SMSService();
