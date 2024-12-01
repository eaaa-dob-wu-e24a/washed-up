import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from '../$types';
import { api } from '../../utils/api';
import { createMachineSchema } from '@/components/create-machine-form.svelte';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const { data } = await api.get('/machines', {
		headers: {
			Authorization: `Bearer ${session?.user.token}`
		}
	});

	return {
		machines: data,
		form: await superValidate(zod(createMachineSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createMachineSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await event.locals.auth();

		console.log(session);

		const { data: user } = await api.get('/user', {
			headers: {
				Authorization: `Bearer ${session?.user.token}`
			}
		});

		await api.post(
			'/machines',
			{
				type: form.data.type,
				location_id: user.location_id,
				status: 1
			},
			{
				headers: {
					Authorization: `Bearer ${session?.user.token}`
				}
			}
		);

		return {
			form
		};
	}
};
