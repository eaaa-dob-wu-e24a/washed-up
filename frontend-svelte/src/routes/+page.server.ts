import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';

// Redirect to the machines page
export const load: PageServerLoad = async () => {
	return redirect(302, '/machines');
};
