import { Api } from '@/api';
import type { PageServerLoad } from '../$types';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	let location = null;

	if (session) {
		const api = new Api(session?.user.token);
		const data = await api.getLocation();

		location = data;
	}

	return {
		session,
		location
	};
};

export const actions: Actions = {
	update_pricing: async (event) => {
		const session = await event.locals.auth();
		const data = await event.request.formData();
		const pricePerCredit = data.get('pricePerCredit') as string;
		const currency = data.get('currency') as string;

		if (currency && pricePerCredit) {
			const api = new Api(session?.user.token);
			await api.updatePricing(pricePerCredit, currency);
		}
	}
};
