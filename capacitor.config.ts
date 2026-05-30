import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitflow.app',
  appName: 'FitFlow',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#f8fafc',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#6366f1',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      showSpinner: false,
    },
  },
};

export default config;
