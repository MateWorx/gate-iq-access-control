
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.21041da2316e4e0a8a320edf383313f8',
  appName: 'gate-iq-access-control',
  webDir: 'dist',
  server: {
    url: 'https://21041da2-316e-4e0a-8a32-0edf383313f8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000
    },
    Camera: {
      presentationStyle: 'fullscreen'
    }
  }
};

export default config;
