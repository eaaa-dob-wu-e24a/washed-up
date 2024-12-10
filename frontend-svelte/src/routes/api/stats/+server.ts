import { Api } from '@/api';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth();
	if (!session) {
		return new Response('Unauthorized', { status: 401 });
	}

	const start = url.searchParams.get('start') ?? '0';
	const end = url.searchParams.get('end') ?? '1';

	const api = new Api(session.user.token);
	const data = await api.getStats(start, end);

	return new Response(JSON.stringify(data));
};
