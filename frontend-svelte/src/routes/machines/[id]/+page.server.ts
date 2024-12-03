import { redirect } from '@sveltejs/kit';
import { api } from '../../../utils/api';
import type { Actions, PageServerLoad } from './$types';

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

export const actions: Actions = {
	delete_machine: async (event) => {
		const session = await event.locals.auth();

		const formdata = await event.request.formData();

		const id = formdata.get('id');

		await api.delete(`/machines/${id}`, {
			headers: {
				Authorization: `Bearer ${session?.user.token}`
			}
		});

		redirect(302, '/machines');
	},

	toggle_status: async (event) => {
		const session = await event.locals.auth();

		const formdata = await event.request.formData();

		const id = formdata.get('id');

		await api.put(
			`/machines/${id}`,
			{
				status: formdata.get('status')
			},
			{
				headers: {
					Authorization: `Bearer ${session?.user.token}`
				}
			}
		);
	}
};
