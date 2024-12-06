import { Api } from '@/api';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	let location = null;

	if (session) {
		const api = new Api(session?.user.token);
		const data = await api.getLocation();

		location = data;
	}

	return {
		session,
		location
	};
};
