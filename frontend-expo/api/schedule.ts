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

  public async getByScheduleId(id: number): Promise<Schedule[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/schedule/${id}`, {
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
      console.error("Error getting schedule by id", error);
      return [];
    }
  }

  public async cancelSchedule(
    id: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/schedule/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (response.status === 204) {
        return { success: true };
      }

      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Failed to cancel schedule",
      };
    } catch (error) {
      return {
        success: false,
        error: "Network error while cancelling schedule",
      };
    }
  }

  public async setSchedule({
    machine_type,
    machine_id,
    start_time,
    end_time,
  }: {
    machine_type: string;
    machine_id: number;
    start_time: string;
    end_time: string;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/schedules`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machine_type,
          machine_id,
          start_time,
          end_time,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving booking", error);
      return null;
    }
  }
}
