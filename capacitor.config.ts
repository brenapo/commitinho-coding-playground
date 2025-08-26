// capacitor.config.ts  (edite este ARQUIVO, não o terminal)
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.commitinho.app',
  appName: 'commitinho',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    appendUserAgent: 'Commitinho/1.0',
    overrideUserAgent: 'Commitinho Mobile App',
    backgroundColor: '#ffffff',
    toolbarColor: '#1a1a1a',
    navigationBarColor: '#1a1a1a',
    hideLogs: true
  },
  ios: {
    scheme: 'Commitinho',
    backgroundColor: '#1a1a1a',
    contentInset: 'automatic',
    scrollEnabled: true,
    webContentsDebuggingEnabled: false,
    limitsNavigationsToAppBoundDomains: true,
    handleApplicationEvents: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a1a',
      overlay: false
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    Haptics: {
      enabled: true
    }
  }
};

export default config;
