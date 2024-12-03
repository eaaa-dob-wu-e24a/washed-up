import { Schedule } from "types";
import { ApiBase } from "./base";

export class ScheduleApi extends ApiBase {
  public async getSchedules(): Promise<Schedule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/schedules`, {
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
      console.error("Error getting schedules", error);
      return [];
    }
  }

  public async getScheduleById(id: number): Promise<Schedule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/schedules/${id}`, {
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
      console.error("Error getting schedule by machine id", error);
      return [];
    }
  }
}
