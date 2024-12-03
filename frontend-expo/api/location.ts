import { Location } from "types";
import { ApiBase } from "./base";

export class LocationApi extends ApiBase {
  public async getLocations(): Promise<Location[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/locations`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting locations", error);
      return [];
    }
  }
}
