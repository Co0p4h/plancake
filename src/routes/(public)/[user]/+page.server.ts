import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ params }) => {
  const [user] = (await db.select().from(table.users).where(eq(table.users.username, params.user))); // TODO: i probably shouldn't be passing the entire user object here
  if (!user) {
    return error(404, { message: "user doesn't exist" });
  }

  const [schedule] = (await db.select().from(table.schedules).where(eq(table.schedules.userId, user.id)).limit(1));
  if (!schedule) {
    return error(404, { message: "schedule doesn't exist" });
  }

  const schedule_items = await db.select().from(table.schedule_items).where(eq(table.schedule_items.scheduleId, schedule.id));
  const [theme] = (await db.select().from(table.schedule_themes).where(eq(table.schedule_themes.scheduleId, schedule.id)));

  return { user, schedule, theme, items: schedule_items };
});

