import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { generateId } from '$lib/server/db/utils';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/demo/lucia');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const results = await db.select().from(table.users).where(eq(table.users.username, username));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/demo/lucia');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'invalid password' });
		}

		const userId = generateId();
		const scheduleId = generateId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const user = await db.insert(table.users).values({ id: userId, username, passwordHash, email: `${username}@email.com` }).returning({id: table.users.id});
			console.log("new user created with id: ", user);

			await db.insert(table.user_settings).values({
				id: generateId(),
				userId,
				settings: {
					language: 'ja',
					timezone: 'Asia/Tokyo',
					social_links: [
						{
							name: 'twitter',
							url: 'https://twitter.com/coopa_2'
						},
					],
					discord_webhook: 'https://discord.com/api/webhooks/1353543991995404449/FhP_5GBqnsfRxDTsW5mP55oH1KHGjodxht0yVXlUxp7KHG8e2SMdsQYPWfzmJ0W7h7st'
				}
			});

			await db.insert(table.schedules).values({
				id: scheduleId,
				userId,
				title: 'My Schedule',
				description: 'My schedule description'
			});

			await db.insert(table.schedule_themes).values({
				id: generateId(),
				scheduleId: scheduleId
			});

			await db.insert(table.schedule_items).values([
				{
					id: generateId(),
					scheduleId: scheduleId,
					title: 'my schedule item',
					description: 'my schedule item description',
					startTime: new Date(),
					endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
					externalUrl: 'https://example.com',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: generateId(),
					scheduleId: scheduleId,
					title: 'my schedule item 2',
					description: 'my schedule item 2 description',
					startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), 
					endTime: new Date(new Date().getTime() + 25 * 60 * 60 * 1000), 
					externalUrl: 'https://youtube.com',
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					id: generateId(),
					scheduleId: scheduleId,
					title: 'my schedule item 3',
					description: 'my schedule item 3 description',
					startTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
					endTime: new Date(new Date().getTime() + 2 * 25 * 60 * 60 * 1000),
					createdAt: new Date(),
					updatedAt: new Date()
				}
			]);

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/demo/lucia');
	}
};

function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}

