import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  try {
    const [schedule] = await db.select({ schedule_id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, user.id)).limit(1);
    const schedule_settings = db.select({ settings: table.schedule_settings.settings }).from(table.schedule_settings).where(eq(table.schedule_settings.scheduleId, schedule.schedule_id));
    return { schedule_settings, user };
  } catch (error) {
    console.error('error getting schedule settings: ', error);
  }
});

export const actions = {
  add: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    console.log("form data: ", formData);

    try {
      console.log('adding schedule_settings');
    } catch (error) {
      console.error('error adding schedule_settings: ', error);
    }
  },
}