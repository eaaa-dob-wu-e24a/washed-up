import { Credits } from "types";
import { ApiBase } from "./base";

export class CreditsApi extends ApiBase {
  public async getCredits(): Promise<Credits | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credits`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting locations", error);
      return null;
    }
  }
}
