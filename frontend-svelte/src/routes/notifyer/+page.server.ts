import { Api } from '@/api/index.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	const notifyer = new Api(session?.user.token);
	const users = await notifyer.getNotifyableUsers();

	return {
		users
	};
};
