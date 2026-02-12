/**
 * Environment configuration and validation.
 * Required keys: none (app runs with mock when keys missing).
 * Optional: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_OPENWEATHER_API_KEY,
 * VITE_PLANT_ID_API_KEY, VITE_AGRICULTURE_API_KEY, VITE_USE_MOCK_APIS.
 */

const env = import.meta.env;

export const envConfig = {
  supabaseUrl: env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY as string | undefined,
  useMockApis: env.VITE_USE_MOCK_APIS !== 'false',
  openWeatherKey: env.VITE_OPENWEATHER_API_KEY as string | undefined,
  plantIdKey: env.VITE_PLANT_ID_API_KEY as string | undefined,
  agricultureKey: env.VITE_AGRICULTURE_API_KEY as string | undefined,
};

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!envConfig.supabaseUrl || envConfig.supabaseUrl === 'https://your-project-id.supabase.co') {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!envConfig.supabaseAnonKey || String(envConfig.supabaseAnonKey).includes('your_')) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }
  return { valid: missing.length === 0, missing };
}
