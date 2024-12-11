import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteSecureValue,
  getSecureValue,
  setSecureValue,
} from "~/lib/secure-store";

interface AuthContextType {
  token: string | null;
  isSignedIn: boolean;
  setToken: (token: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      const token = await getSecureValue("token");
      setTokenState(token);
    }
    fetchToken();
  }, []);

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await setSecureValue("token", newToken);
    } else {
      await deleteSecureValue("token");
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
