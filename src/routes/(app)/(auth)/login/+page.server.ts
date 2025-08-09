import { fail, redirect } from '@sveltejs/kit';
import { validatePassword, validateUsername } from '$lib/utils/validate';
import { verify } from '@node-rs/argon2';
import { eq, and } from 'drizzle-orm';
import * as auth from '$lib/server/session';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ locals }) => { 
	if (locals.user) {
		return redirect(302, '/');
	}
	return {};
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'invalid username (min 3, max 31 characters, alphanumeric only)',
				invalid: true
			});
		}

		if (!validatePassword(password)) {
			return fail(400, { 
				message: 'invalid password (min 6, max 255 characters)', 
				invalid: true
			 });
		}

		// const results = await db.select().from(table.users).where(eq(table.users.username, username));
		const results = await db
		.select({
				userId: table.users.id,
				passwordHash: table.userAuthMethods.passwordHash
		})
		.from(table.users)
		.innerJoin(table.userAuthMethods, eq(table.users.id, table.userAuthMethods.userId))
		.where(
			and(
				eq(table.users.username, username),
				eq(table.userAuthMethods.authType, 'password')
			)
		);

		const userAuth = results.at(0);
		
		if (!userAuth || !userAuth.passwordHash) {
			return fail(400, { 
				message: 'incorrect username or password',
				incorrect: true
			 });
		}

		const validPassword = await verify(userAuth.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, { 
				message: 'incorrect username or password',
				incorrect: true
			});
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userAuth.userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/schedule');
	}
} satisfies Actions;