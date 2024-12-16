import { Api } from '@/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);

	// Fetch the users
	const users = await api.getUsers();

	return {
		session,
		users
	};
};
