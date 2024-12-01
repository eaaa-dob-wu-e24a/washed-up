import { api } from '../../../utils/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth();

	const id = params.id;

	const { data: machine } = await api.get(`/machines/${id}`, {
		headers: {
			Authorization: `Bearer ${session?.user.token}`
		}
	});

	return {
		machine
	};
};
