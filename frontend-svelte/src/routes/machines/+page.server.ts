import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from '../$types';
import { createMachineSchema } from '@/components/create-machine-form.svelte';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from '@sveltejs/kit';
import { Api } from '@/api';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);
	// Fetch the machines
	const machines = await api.getMachines();
	// Return the machines and the form
	return {
		machines,
		form: await superValidate(zod(createMachineSchema))
	};
};

export const actions: Actions = {
	// Create a new machine
	create_machine: async (event) => {
		// Fetch the form data
		const form = await superValidate(event, zod(createMachineSchema));
		// Check if the form is valid
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		// Fetch the session
		const session = await event.locals.auth();
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);
		// Fetch the user
		const user = await api.getUser();
		// Create a new machine
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
		// Fetch the session
		const session = await event.locals.auth();
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);
		// Fetch the form data
		const formdata = await event.request.formData();
		// Get the machine id
		const id = formdata.get('id');
		// Delete the machine
		await api.deleteMachine(Number(id));
	}
};
