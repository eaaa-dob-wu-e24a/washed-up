import { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  token: string | null;
  isSignedIn: boolean;
  setToken: (token: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await AsyncStorage.setItem("token", newToken);
    } else {
      await AsyncStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const signOut = async () => {
    await setToken(null);
  };

  const isSignedIn = !!token;
  console.log(token);
  return (
    <AuthContext.Provider value={{ token, setToken, signOut, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
