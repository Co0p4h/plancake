import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ locals }) => {
  if (!locals.user) {
    return redirect(302, '/demo/lucia/login');
    // return error(401, { message: 'unauthorised' });
  }

  const user = locals.user;

  const [schedule] = await db.select().from(table.schedules).where(eq(table.schedules.userId, user.id)).limit(1);
  if (!schedule) {
    return error(404, { message: "schedule doesn't exist" });
  }

  const [theme] = await db.select().from(table.schedule_themes).where(eq(table.schedule_themes.scheduleId, schedule.id));
  if (!theme) {
    throw error(404, { message: 'theme configuration is missing for this user... please contact support.' });
  }

  const schedule_items = await db.select().from(table.schedule_items).where(eq(table.schedule_items.scheduleId, schedule.id));

  return { user, schedule, theme, items: schedule_items };
});

