import { CreditPurchase, CreditUsage } from "types";
import { ApiBase } from "./base";

export class TransactionsApi extends ApiBase {
  public async getCreditPurchases(): Promise<CreditPurchase[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credit-purchases`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getCreditPurchase(id: number): Promise<CreditPurchase | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/credit-purchases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getCreditUsages(): Promise<CreditUsage[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credit-usages`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getCreditUsage(id: number): Promise<CreditUsage | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/credit-usages/${id}`, {
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
      console.error(error);
      return null;
    }
  }
}
