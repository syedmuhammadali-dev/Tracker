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
  isSharing: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setSharing: (sharing: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,
  isSharing: false,
  setUser: user => set({ user, isLoading: false }),
  setLoading: loading => set({ isLoading: loading }),
  setSharing: sharing => set({ isSharing: sharing }),
  logout: () => set({ user: null, isLoading: false, isSharing: false }),
}));
