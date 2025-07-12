import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agrisathi.app',
  appName: 'AgriSathi',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#22c55e"
    }
  }
};

export default config;
