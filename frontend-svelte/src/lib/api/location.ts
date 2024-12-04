import type { Location } from '@/types';
import { ApiBase } from './base';

export class LocationApi extends ApiBase {
	public async getLocation(): Promise<Location | null> {
		try {
			const response = await fetch(`${this.baseUrl}/api/location`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});
			if (!response.ok) {
				return null;
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error getting location', error);
			return null;
		}
	}
}
