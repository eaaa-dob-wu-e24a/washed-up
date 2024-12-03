import { Machine } from "types";
import { ApiBase } from "./base";

export class MachineApi extends ApiBase {
  public async getMachines(): Promise<Machine[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/machines`, {
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
      console.error("Error getting machines", error);
      return [];
    }
  }
}
