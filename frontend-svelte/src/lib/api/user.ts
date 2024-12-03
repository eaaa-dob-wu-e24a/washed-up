import type { User } from '@/types';
import { ApiBase } from './base';

export class UserApi extends ApiBase {
	public async getUser(): Promise<User | null> {
		try {
			const response = await fetch(`${this.baseUrl}/api/user`, {
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
			console.error('Error getting user', error);
			return null;
		}
	}
}
