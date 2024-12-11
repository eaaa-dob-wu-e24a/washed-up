import { ApiBase } from "./base";

// api/auth.ts
export class AuthApi extends ApiBase {
  public async signUp({
    name,
    email,
    password,
    location,
  }: {
    name: string;
    email: string;
    password: string;
    location: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          c_password: password,
          location_id: location,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error signing up", error);
      return null;
    }
  }

  public async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      return {
        token: data.access_token,
        tokenType: data.token_type,
        role: data.role,
      };
    } catch (error) {
      console.error("Error signing in", error);
      throw error;
    }
  }

  public async validateEmail(email: string) {
    try {
      const response = await fetch(`${this.baseUrl}/api/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error validating email", error);
      return null;
    }
  }
}
