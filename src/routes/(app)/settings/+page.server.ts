import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

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
    return { schedule_settings: null, user };
  }
});

export const actions: Actions = {
  updateSettings: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    try {

      if (Math.random() < 0.5) {
        throw new Error('simulated random failure');
      }

      const formData = await request.formData();
      const settings = JSON.parse(formData.get('settings') as string) as table.ScheduleSettings;

      if (!settings || typeof settings !== typeof(table.schedule_settings.settings)) {
        return fail(400, { error: 'settings data is missing or invalid.' });
      }
      console.log('settings: ', settings);
      
      const [schedule] = await db.select({ id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, locals.user.id)).limit(1);
      
      await db.update(table.schedule_settings)
        .set({ 
          settings: settings,
          updatedAt: new Date()
        })
        .where(eq(table.schedule_settings.scheduleId, schedule.id));


      return { 
        success: true, 
        updated_settings: settings 
      };
    } catch (error) {
      console.error('error updating schedule settings: ', error);
      return fail(500, { error: 'failed to update settings' });
    }
  },
}