import type { NotifyableUser } from '@/types';
import { ApiBase } from './base';

export class NotifyerApi extends ApiBase {
	public async sendNotification({
		users,
		title,
		body
	}: {
		users: number[];
		title: string;
		body: string;
	}) {
		try {
			const response = await fetch(`${this.baseUrl}/api/notifyer/send`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.accessToken}`
				},
				body: JSON.stringify({
					users,
					title,
					body
				})
			});

			if (!response.ok) {
				return false;
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error sending notification', error);
			return false;
		}
	}

	public async getNotifyableUsers(): Promise<NotifyableUser[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/notifyer/users`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});

			if (!response.ok) {
				return [];
			}
			return await response.json();
		} catch (error) {
			console.error('Error getting notifyable users', error);
			return [];
		}
	}
}
