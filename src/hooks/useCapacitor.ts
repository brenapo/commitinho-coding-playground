import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

export const useCapacitor = () => {
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();

  // Initialize native features
  useEffect(() => {
    if (isNative) {
      // Configure status bar
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#0f172a' });
      
      // Hide splash screen after app loads
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    }
  }, [isNative]);

  // Haptic feedback for success
  const hapticSuccess = async () => {
    if (isNative) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
        setTimeout(() => Haptics.impact({ style: ImpactStyle.Medium }), 100);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };

  // Haptic feedback for error
  const hapticError = async () => {
    if (isNative) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  };

  // Share function
  const shareProgress = async (title: string, text: string, url?: string) => {
    if (isNative) {
      try {
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'Compartilhar Progresso'
        });
      } catch (error) {
        console.log('Share not available:', error);
      }
    } else {
      // Web fallback
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (error) {
          console.log('Web Share API not available:', error);
        }
      }
    }
  };

  return {
    isNative,
    platform,
    hapticSuccess,
    hapticError,
    shareProgress
  };
};