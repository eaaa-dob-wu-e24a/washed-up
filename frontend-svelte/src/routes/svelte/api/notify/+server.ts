import { Api } from '@/api';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Fetch the session
	const session = await locals.auth();
	// Check if the session is valid
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Parse the request body
	const { title, body, users } = await request.json();

	// Create a new Api instance with the session token
	const api = new Api(session.user.token);

	// Send the notification
	const data = await api.sendNotification({
		title,
		body,
		users
	});

	return new Response(JSON.stringify(data));
};
