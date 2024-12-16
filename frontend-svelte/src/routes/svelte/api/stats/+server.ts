import { Api } from '@/api';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	// Fetch the session
	const session = await locals.auth();
	// Check if the session is valid
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	// Get the start and end dates from the url
	const start = url.searchParams.get('start') ?? '0';
	const end = url.searchParams.get('end') ?? '1';

	// Create a new Api instance with the session token
	const api = new Api(session.user.token);
	// Fetch the stats
	const data = await api.getStats(start, end);

	return new Response(JSON.stringify(data));
};
