import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pocketog.app',
  appName: 'Pocket OG',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
