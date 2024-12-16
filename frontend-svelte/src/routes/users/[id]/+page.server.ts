import { Api } from '@/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);

	const user = await api.getUserById(event.params.id);

	return {
		user
	};
};

export const actions = {
	// Cancel a schedule
	cancel: async (event) => {
		// Fetch the session
		const session = await event.locals.auth();
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);

		// Parse the form data
		const formdata = await event.request.formData();
		// Get the id
		const id = formdata.get('id');
		// Cancel the schedule
		await api.cancelSchedule(Number(id));
	}
};
