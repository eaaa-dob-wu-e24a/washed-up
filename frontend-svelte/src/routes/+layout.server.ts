import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	// Get the pathname
	const pathname = event.url.pathname;

	// If the user is not signed in, and the path is not the sign-in page, redirect to the sign-in page
	if (pathname !== '/sign-in' && !session) {
		return redirect(302, '/sign-in');
	}

	// If the user is signed in, and the path is the sign-in page, redirect to the machines page
	if (pathname === '/sign-in' && session) {
		return redirect(302, '/machines');
	}

	return {
		session
	};
};
