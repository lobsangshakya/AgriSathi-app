import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  VITE_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  VITE_OPENAI_API_KEY: z.string().optional().or(z.literal('')),
  VITE_GEMINI_API_KEY: z.string().optional().or(z.literal('')),
  VITE_OPENWEATHER_API_KEY: z.string().optional().or(z.literal('')),
  VITE_PLANT_ID_API_KEY: z.string().optional().or(z.literal('')),
  VITE_HUGGINGFACE_API_KEY: z.string().optional().or(z.literal('')),
  VITE_USE_MOCK_APIS: z.string().transform((val) => val === 'true').optional(),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

const processEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  VITE_OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  VITE_PLANT_ID_API_KEY: import.meta.env.VITE_PLANT_ID_API_KEY,
  VITE_HUGGINGFACE_API_KEY: import.meta.env.VITE_HUGGINGFACE_API_KEY,
  VITE_USE_MOCK_APIS: import.meta.env.VITE_USE_MOCK_APIS,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  // We don't throw here to avoid crashing the app immediately, but logs will show errors
}

export const env = parsed.success ? parsed.data : processEnv as z.infer<typeof envSchema>;

// Helper to check if a service is configured
export const isServiceConfigured = (service: 'supabase' | 'openai' | 'gemini' | 'weather' | 'plantid') => {
  switch (service) {
    case 'supabase':
      return !!env.VITE_SUPABASE_URL && !!env.VITE_SUPABASE_ANON_KEY && env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co';
    case 'openai':
      return !!env.VITE_OPENAI_API_KEY;
    case 'gemini':
      return !!env.VITE_GEMINI_API_KEY;
    case 'weather':
      return !!env.VITE_OPENWEATHER_API_KEY;
    case 'plantid':
      return !!env.VITE_PLANT_ID_API_KEY;
    default:
      return false;
  }
};
