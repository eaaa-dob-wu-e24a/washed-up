import { redirect } from '@sveltejs/kit';
import { api } from '../../utils/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	if (!session?.user) {
		throw redirect(302, '/sign-in');
	}

	const { data } = await api('/books', {
		headers: {
			Authorization: `Bearer ${session?.user.token}`
		}
	});

	return { books: data };
};
