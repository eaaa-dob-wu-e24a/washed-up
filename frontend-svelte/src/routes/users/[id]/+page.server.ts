import { Api } from '@/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const api = new Api(session?.user.token);

	const user = await api.getUserById(event.params.id);

	return {
		user
	};
};
