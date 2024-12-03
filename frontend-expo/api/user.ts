import { User } from "types";
import { ApiBase } from "./base";

export class UserApi extends ApiBase {
  public async getUser(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/user`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error("Error getting user data", error);
      return [];
    }
  }
}
