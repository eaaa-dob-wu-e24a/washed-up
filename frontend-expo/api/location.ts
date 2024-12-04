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

  public async getLocation(): Promise<Location | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/location`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting location", error);
      return null;
    }
  }

  public async getLocationByCode(code: string): Promise<Location | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/locations/code/${code}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting location by code", error);
      return null;
    }
  }
}
