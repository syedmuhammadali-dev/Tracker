import { create } from 'zustand';

interface User {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
  groupId?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,
  setUser: user => set({ user, isLoading: false }),
  setLoading: loading => set({ isLoading: loading }),
  logout: () => set({ user: null, isLoading: false }),
}));
