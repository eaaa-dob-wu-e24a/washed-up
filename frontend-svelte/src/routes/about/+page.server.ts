import { env } from '$env/dynamic/private';

export async function load() {
	const response = await fetch(`${env.API_URL}/api/books`);
	const books = await response.json();
	return { books };
}
