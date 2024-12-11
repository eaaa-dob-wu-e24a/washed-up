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

	public async updatePricing(price_per_credit: string, currency: string): Promise<boolean> {
		try {
			const response = await fetch(`${this.baseUrl}/api/location/pricing`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.accessToken}`
				},
				body: JSON.stringify({ price_per_credit, currency })
			});
			if (!response.ok) {
				return false;
			}
			return true;
		} catch (error) {
			console.error('Error updating pricing', error);
			return false;
		}
	}
}
