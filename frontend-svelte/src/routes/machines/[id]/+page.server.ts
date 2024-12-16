import { Api } from '@/api';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Fetch the machine id from the URL
	const id = event.params.id;

	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);
	// Fetch the machine data
	const machine = await api.getMachine(Number(id));
	// Return the machine data
	return {
		machine
	};
};

export const actions: Actions = {
	// Delete the machine
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
		// Redirect to the machines page
		redirect(302, '/machines');
	},
	// Toggle the machine status
	toggle_status: async (event) => {
		// Fetch the session
		const session = await event.locals.auth();
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);
		// Fetch the form data
		const formdata = await event.request.formData();
		// Get the machine id
		const id = formdata.get('id');
		// Toggle the machine status
		await api.updateMachine({
			id: Number(id),
			body: {
				status: formdata.get('status')
			}
		});
	}
};
