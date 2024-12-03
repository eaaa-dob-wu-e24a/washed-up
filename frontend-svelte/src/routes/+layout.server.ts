import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { api } from '../utils/api';

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
		const { data } = await api.get('/location', {
			headers: {
				Authorization: `Bearer ${session?.user.token}`
			}
		});

		location = data;
	}

	return {
		session,
		location
	};
};
