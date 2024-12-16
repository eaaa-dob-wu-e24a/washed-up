import type { Machine } from '@/types';
import { ApiBase } from './base';

export class MachineApi extends ApiBase {
	public async getMachines(): Promise<Machine[]> {
		try {
			const response = await fetch(`${this.baseUrl}/api/machines`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});

			if (!response.ok) {
				return [];
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error getting machines', error);
			return [];
		}
	}

	public async getMachine(id: number): Promise<Machine | null> {
		try {
			const response = await fetch(`${this.baseUrl}/api/machines/${id}`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error getting machine', error);
			return null;
		}
	}

	public async createMachine({
		type,
		location_id,
		status
	}: {
		type: string;
		location_id: number;
		status: number;
	}) {
		try {
			const response = await fetch(`${this.baseUrl}/api/machines`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ type, location_id, status })
			});

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error creating machine', error);
			return null;
		}
	}

	public async updateMachine({
		id,
		body
	}: {
		id: number;
		body: {
			[key: string]: any;
		};
	}) {
		try {
			await fetch(`${this.baseUrl}/api/machines/${id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
		} catch (error) {
			console.error('Error updating machine', error);
		}
	}

	public async deleteMachine(id: number) {
		try {
			await fetch(`${this.baseUrl}/api/machines/${id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});
		} catch (error) {
			console.error('Error deleting machine', error);
		}
	}
}
