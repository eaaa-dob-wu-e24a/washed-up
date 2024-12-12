import { Api } from '@/api';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth();
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { title, body, users } = await request.json();

	const api = new Api(session.user.token);

	const data = await api.sendNotification({
		title,
		body,
		users
	});

	return new Response(JSON.stringify(data));
};
