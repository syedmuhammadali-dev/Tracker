import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../constants/translations';

interface SettingsState {
  language: Language;
  lowInternetMode: boolean;
  batteryOptimization: 'high' | 'medium' | 'low';
  setLanguage: (lang: Language) => void;
  setLowInternetMode: (enabled: boolean) => void;
  setBatteryOptimization: (mode: 'high' | 'medium' | 'low') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      language: 'en',
      lowInternetMode: false,
      batteryOptimization: 'high',
      setLanguage: lang => set({ language: lang }),
      setLowInternetMode: enabled => set({ lowInternetMode: enabled }),
      setBatteryOptimization: mode => set({ batteryOptimization: mode }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
