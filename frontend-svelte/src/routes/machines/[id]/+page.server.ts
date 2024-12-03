import { Api } from '@/api';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const id = event.params.id;

	const api = new Api(session?.user.token);

	const machine = await api.getMachine(Number(id));

	return {
		machine
	};
};

export const actions: Actions = {
	delete_machine: async (event) => {
		const session = await event.locals.auth();

		const api = new Api(session?.user.token);

		const formdata = await event.request.formData();

		const id = formdata.get('id');

		await api.deleteMachine(Number(id));

		redirect(302, '/machines');
	},

	toggle_status: async (event) => {
		const session = await event.locals.auth();
		const api = new Api(session?.user.token);

		const formdata = await event.request.formData();

		const id = formdata.get('id');

		await api.updateMachine({
			id: Number(id),
			body: {
				status: formdata.get('status')
			}
		});
	}
};
