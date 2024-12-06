import type { ExtendedUser, User } from '@/types';
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

	public async getUsers(): Promise<User[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/users`, {
				headers: { Authorization: `Bearer ${this.accessToken}` }
			});

			if (!response.ok) {
				return [];
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error getting users', error);
			return [];
		}
	}

	public async getUserById(id: string): Promise<ExtendedUser | null> {
		try {
			const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
				headers: { Authorization: `Bearer ${this.accessToken}` }
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error getting user by id', error);
			return null;
		}
	}
}
