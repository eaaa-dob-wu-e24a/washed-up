import { ApiBase } from './base';

export class AuthApi extends ApiBase {
	public async adminLogin({ email, password }: { email: string; password: string }) {
		try {
			const response = await fetch(`${this.baseUrl}/api/admin-login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error logging in', error);
			return null;
		}
	}
}
