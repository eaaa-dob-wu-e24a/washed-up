import type { Stats } from '@/types';
import { ApiBase } from './base';

export class StatsApi extends ApiBase {
	public async getStats(start: string, end: string): Promise<Stats | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/api/stats?start_date=${start}&end_date=${end}`,
				{
					headers: {
						Authorization: `Bearer ${this.accessToken}`
					}
				}
			);

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching stats', error);
			return null;
		}
	}
}
