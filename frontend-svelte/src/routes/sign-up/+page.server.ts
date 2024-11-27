import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { api } from '../../utils/api.js';
import type { Location } from '@/types/index.js';

export const load: PageServerLoad = async () => {
	const { data }: { data: Location[] } = await api.get('/locations');
	return {
		form: await superValidate(zod(formSchema)),
		locations: data
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const { data } = await api.post('/register', form.data);

		console.log(data);
	}
};
