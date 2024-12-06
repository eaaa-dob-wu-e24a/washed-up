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
}
