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

  public async buyCredits({
    amount,
    price,
    currency,
    payment_method,
  }: {
    amount: number;
    price: number;
    currency: string;
    payment_method: string;
  }): Promise<"success" | "error"> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credits`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          price,
          currency,
          payment_method,
        }),
      });

      if (!response.ok) {
        return "error";
      }

      const data = await response.json();
      if (data) {
        return "success";
      }

      return "error";
    } catch (error) {
      console.error("Error buying credits", error);
      return "error";
    }
  }
}
