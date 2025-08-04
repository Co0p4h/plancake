import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/session';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { generateId } from '$lib/server/db/utils';
import { validatePassword, validateUsername } from '$lib/utils/validate';

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
			return fail(400, { message: 'invalid username' });
		}

		if (!validatePassword(password)) {
			return fail(400, { message: 'invalid password' });
		}

    if (!email) {
      return fail(400, { message: 'email is required' });
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
			const user = await db.insert(table.users).values({ id: userId, username, passwordHash, email }).returning({id: table.users.id});
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

			await db.insert(table.schedule_settings).values({
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
		return redirect(302, '/');
	}
} satisfies Actions;