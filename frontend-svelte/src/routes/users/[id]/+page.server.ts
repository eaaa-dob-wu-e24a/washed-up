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

export const actions = {
	cancel: async (event) => {
		const session = await event.locals.auth();
		const api = new Api(session?.user.token);

		const formdata = await event.request.formData();
		const id = formdata.get('id');

		console.log(id);

		await api.cancelSchedule(Number(id));
	}
};
