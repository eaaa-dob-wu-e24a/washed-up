import { env } from '$env/dynamic/private';

export class ApiBase {
	protected accessToken: unknown | undefined;
	protected baseUrl = env.API_URL;

	constructor(accessToken?: unknown | undefined) {
		this.accessToken = accessToken;
	}
}
