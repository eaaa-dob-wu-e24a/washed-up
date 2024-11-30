import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const pathname = event.url.pathname;

	if (pathname !== '/sign-in' && !session) {
		return redirect(302, '/sign-in');
	}

	if (pathname === '/sign-in' && session) {
		return redirect(302, '/machines');
	}

	return {
		session
	};
};
