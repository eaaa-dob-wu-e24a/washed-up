import { createContext, useContext, useEffect, useState } from "react";
import {
  deleteSecureValue,
  getSecureValue,
  setSecureValue,
} from "~/lib/secure-store";

// Define the shape of our authentication context
interface AuthContextType {
  token: string | null; // Stores the authentication token
  isSignedIn: boolean; // Boolean flag indicating auth status
  setToken: (token: string | null) => Promise<void>; // Function to update token
  signOut: () => Promise<void>; // Function to handle sign out
}

// Create the authentication context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the app to provide authentication context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to store the authentication token
  const [token, setTokenState] = useState<string | null>(null);

  // Effect hook to load the token from secure storage on component mount
  useEffect(() => {
    async function fetchToken() {
      const token = await getSecureValue("token");
      setTokenState(token);
    }
    fetchToken();
  }, []);

  // Function to update token in both state and secure storage
  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await setSecureValue("token", newToken);
    } else {
      await deleteSecureValue("token");
    }
    setTokenState(newToken);
  };

  // Helper function to handle sign out by clearing the token
  const signOut = async () => {
    await setToken(null);
  };

  // Derive signed-in state from token existence
  const isSignedIn = !!token;

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ token, setToken, signOut, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the auth context throughout the app
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
