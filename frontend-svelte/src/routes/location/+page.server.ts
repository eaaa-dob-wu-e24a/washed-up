import { Api } from '@/api';
import type { PageServerLoad } from '../$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	// Fetch the session
	const session = await event.locals.auth();
	let location = null;

	if (session) {
		// Create a new Api instance with the session token
		const api = new Api(session?.user.token);
		// Fetch the location data
		const data = await api.getLocation();
		// Set the location data to the location variable
		location = data;
	}

	// Return the session and location data
	return {
		session,
		location
	};
};

export const actions: Actions = {
	// Update the pricing for the location
	update_pricing: async (event) => {
		// Fetch the session
		const session = await event.locals.auth();
		// Fetch the form data
		const data = await event.request.formData();
		// Get the price per credit and currency
		const pricePerCredit = data.get('pricePerCredit') as string;
		const currency = data.get('currency') as string;

		// Check if the currency and price per credit are valid
		if (currency && pricePerCredit) {
			// Create a new Api instance with the session token
			const api = new Api(session?.user.token);
			// Update the pricing for the location
			await api.updatePricing(pricePerCredit, currency);
		}
	}
};
