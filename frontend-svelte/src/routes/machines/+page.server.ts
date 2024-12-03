import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from '../$types';
import { createMachineSchema } from '@/components/create-machine-form.svelte';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';
import { Api } from '@/api';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();

	const api = new Api(session?.user.token);

	const machines = await api.getMachines();
	return {
		machines,
		form: await superValidate(zod(createMachineSchema))
	};
};

export const actions: Actions = {
	create_machine: async (event) => {
		const form = await superValidate(event, zod(createMachineSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await event.locals.auth();

		const api = new Api(session?.user.token);

		const user = await api.getUser();

		await api.createMachine({
			type: form.data.type,
			location_id: user?.location_id ?? 1,
			status: 1
		});

		return {
			form
		};
	},

	delete_machine: async (event) => {
		const session = await event.locals.auth();

		const api = new Api(session?.user.token);

		const formdata = await event.request.formData();

		const id = formdata.get('id');

		await api.deleteMachine(Number(id));
	}
};
