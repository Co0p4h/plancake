import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/session';
import type { Actions, PageServerLoad } from './$types';
import { validateEmail, validatePassword, validateUsername } from '$lib/utils/validate';
import { createUserWithAuth } from '$lib/server/db/user-service';

export const load: PageServerLoad = (async ({ locals }) => { 
  if (locals.user) {
		return redirect(302, '/');
	}
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
    const email = formData.get('email')?.toString().trim();
		const username = formData.get('username')?.toString().trim();
		const password = formData.get('password')?.toString().trim();

		if (!validateUsername(username)) {
			return fail(400, { 
				username,
				message: 'invalid username',
				invalid: true
			});
		}

		if (!validatePassword(password)) {
			return fail(400, { 
				message: 'invalid password',
				invalid: true
			});
		}

		if (!email || !validateEmail(email)) {
			return fail(400, { 
				email,
				message: 'invalid email',
				invalid: true
			});
		}

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const userData = {
				username,
				displayName: username,
				email,
				// emailVerified: false,
			};

			const authMethod = {
				authType: "password",
				providerId: null,
				passwordHash: passwordHash, 
				metadata: {
					email, 
				}
			};

			const user = await createUserWithAuth(userData, authMethod);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, user.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		} catch {
			// console.error("error: ", e.detail);
			return fail(500, { message: 'an error has occurred', error: true });
		}
		return redirect(302, '/');
	}
} satisfies Actions;