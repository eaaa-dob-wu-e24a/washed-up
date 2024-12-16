import { Api } from '@/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Create a new Api instance with the session token
	const api = new Api(session?.user.token);
	// Fetch the schedules
	const schedules = await api.getSchedules();

	// Return the schedules
	return {
		schedules
	};
};

export const actions = {
	cancel: async (event) => {
		// Fetch the session
		const session = await event.locals.auth();
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);
		// Fetch the form data
		const formdata = await event.request.formData();
		// Get the id
		const id = formdata.get('id');
		// Cancel the schedule
		await api.cancelSchedule(Number(id));
	}
};
