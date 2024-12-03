import { Api } from '@/api';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.auth();
	const pathname = event.url.pathname;
	let location = null;

	if (pathname !== '/sign-in' && !session) {
		return redirect(302, '/sign-in');
	}

	if (pathname === '/sign-in' && session) {
		return redirect(302, '/machines');
	}

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
