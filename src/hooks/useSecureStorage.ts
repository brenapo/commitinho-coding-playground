import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

interface SecureStorageHook {
  getValue: (key: string) => Promise<string | null>;
  setValue: (key: string, value: string) => Promise<void>;
  removeValue: (key: string) => Promise<void>;
  isNative: boolean;
}

export const useSecureStorage = (): SecureStorageHook => {
  const isNative = Capacitor.isNativePlatform();

  const getValue = async (key: string): Promise<string | null> => {
    try {
      if (isNative) {
        const { value } = await Preferences.get({ key });
        return value;
      } else {
        // Web fallback to localStorage
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error getting secure storage value:', error);
      return null;
    }
  };

  const setValue = async (key: string, value: string): Promise<void> => {
    try {
      if (isNative) {
        await Preferences.set({ key, value });
      } else {
        // Web fallback to localStorage
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error setting secure storage value:', error);
      throw error;
    }
  };

  const removeValue = async (key: string): Promise<void> => {
    try {
      if (isNative) {
        await Preferences.remove({ key });
      } else {
        // Web fallback to localStorage
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing secure storage value:', error);
      throw error;
    }
  };

  return {
    getValue,
    setValue,
    removeValue,
    isNative
  };
};