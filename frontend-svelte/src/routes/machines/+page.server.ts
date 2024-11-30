import type { PageServerLoad } from '../$types';
import { api } from '../../utils/api';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const { data } = await api.get('/machines', {
		headers: {
			Authorization: `Bearer ${session?.user.token}`
		}
	});

	return {
		machines: data
	};
};
