import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session) {
		throw redirect(302, '/sign-in');
	}

	return {
		session
	};
};
