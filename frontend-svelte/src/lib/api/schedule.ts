import type { Schedule } from '@/types';
import { ApiBase } from './base';

export class ScheduleApi extends ApiBase {
	public async cancelSchedule(id: number): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/api/schedules/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});
			if (!response.ok) {
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error cancelling schedule', error);
			return false;
		}
	}

	public async getSchedules(): Promise<Schedule[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/admin/schedules`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});
			if (!response.ok) {
				return [];
			}
			return await response.json();
		} catch (error) {
			console.error('Error getting schedules', error);
			return [];
		}
	}
}
