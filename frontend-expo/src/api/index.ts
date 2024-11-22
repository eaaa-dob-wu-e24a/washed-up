import { Machine } from "@/types";

export class Api {
  private accessToken: unknown | undefined;
  private baseUrl = process.env.EXPO_PUBLIC_API_URL;

  constructor(accessToken?: unknown | undefined) {
    this.accessToken = accessToken;
  }

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

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error signing up", error);
      return null;
    }
  }

  public async validateCredentials({
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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/validate`,
        {
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
        }
      );

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error validating credentials", error);
      return null;
    }
  }

  public async updateClerkMetadata({
    access_token,
    metadata,
    user_id,
  }: {
    access_token: string;
    metadata: {
      [key: string]: any;
    };
    user_id: string;
  }) {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/clerk-metadata/${user_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            public_metadata: metadata,
          }),
        }
      );

      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.error("Error updating metadata", error);
      return null;
    }
  }

  public async getMachines(): Promise<Machine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/machines`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting machines", error);
      return [];
    }
  }
}
