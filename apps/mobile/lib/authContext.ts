import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextType {
  isAuthorized: boolean;
  setIsAuthorized: Dispatch<SetStateAction<boolean>>;
}

//providers in root _layout.tsx

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
