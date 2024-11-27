import { SvelteKitAuth, type DefaultSession, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
// Your own logic for dealing with plaintext password strings; be careful!

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			token: string;
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession['user'];
	}
}

export const { signIn, signOut, handle } = SvelteKitAuth(async (event) => {
	const error = event.url.searchParams.get('error');
	if (error) {
		redirect(302, '/sign-in');
	}
	const authOptions: SvelteKitAuthConfig = {
		trustHost: true,
		providers: [
			Credentials({
				// You can specify which fields should be submitted, by adding keys to the `credentials` object.
				// e.g. domain, username, password, 2FA token, etc.
				credentials: {
					email: {},
					password: {}
				},
				authorize: async (credentials) => {
					try {
						let user = null;

						const raw = JSON.stringify({
							email: credentials.email,
							password: credentials.password
						});

						const response = await fetch(`${env.API_URL}/api/login`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: raw
						});

						const data = await response.json();

						const cred = data;

						if (!cred?.access_token) {
							// No user found, so this is their first attempt to login
							// Optionally, this is also the place you could do a user registration
							throw new Error('Invalid credentials.');
						} else {
							const response = await fetch(`${env.API_URL}/api/user`, {
								headers: {
									Authorization: `Bearer ${cred.access_token}`
								}
							});

							const data = await response.json();

							// return JSON object with the user data
							return {
								id: cred.access_token,
								email: data.email,
								name: data.name
							};
						}
					} catch (error) {
						console.error(error);
						return null;
					}
				}
			})
		],
		callbacks: {
			session: async ({ session, token }) => {
				return {
					user: {
						name: session.user.name,
						email: session.user.email,
						token: token.sub
					},
					expires: session.expires
				};
			}
		}
	};

	return authOptions;
});
