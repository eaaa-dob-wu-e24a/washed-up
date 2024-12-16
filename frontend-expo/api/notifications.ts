import { Location } from "types";
import { ApiBase } from "./base";

export class NotificationsApi extends ApiBase {
  public async registerToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/expo-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error registering token", error);
      return false;
    }
  }

  public async removeToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/expo-token`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error removing token", error);
      return false;
    }
  }
}
