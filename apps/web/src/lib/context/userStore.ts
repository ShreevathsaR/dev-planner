import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "firebase/auth";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
