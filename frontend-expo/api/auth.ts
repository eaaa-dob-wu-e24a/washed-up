import { ApiBase } from "./base";

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

      const data = await response.json();
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
    confirm_password,
  }: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          c_password: confirm_password,
        }),
      });

      const data = await response.json();
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
        `${this.baseUrl}/api/clerk-metadata/${user_id}`,
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
}
