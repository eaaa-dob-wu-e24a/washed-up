// This is the configuration file for setting up auth.js with SvelteKit

import { Api } from '@/api';
import { SvelteKitAuth, type DefaultSession, type SvelteKitAuthConfig } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			token: string;
		} & DefaultSession['user'];
	}
}

export const { signIn, signOut, handle } = SvelteKitAuth(async (event) => {
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
						const authApi = new Api();
						const data = await authApi.adminLogin({
							email: credentials.email as string,
							password: credentials.password as string
						});

						if (!data?.access_token) {
							// Instead of throwing an error, return null with an error message
							return null;
						}

						const userApi = new Api(data.access_token);
						const userData = await userApi.getUser();

						return {
							id: data.access_token,
							email: userData?.email,
							name: userData?.name
						};
					} catch (error) {
						console.error(error);
						// Return the error message
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
		},
		pages: {
			signIn: '/sign-in'
		}
	};

	return authOptions;
});
