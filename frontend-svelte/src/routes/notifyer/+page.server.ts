import { Api } from '@/api/index.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);
	// Fetch the notifyable users
	const users = await api.getNotifyableUsers();

	return {
		users
	};
};
