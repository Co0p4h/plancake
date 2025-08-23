import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getScheduleSettingsByUserId, getScheduleByUserId, updateSchedule } from '$lib/server/db/schedule-service';

export const load: PageServerLoad = (async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  try {
    return { 
      schedule_settings: getScheduleSettingsByUserId(user.id), 
      schedule: getScheduleByUserId(user.id),
      user 
    };
  } catch (error) {
    console.error('error getting schedule settings: ', error);
    return { schedule_settings: null, schedule: null, user };
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

  updateSchedule: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    try {
      const formData = await request.formData();
      const title = formData.get('title')?.toString().trim();
      const description = formData.get('description')?.toString().trim();

      if (!title) {
        return fail(400, { error: 'Schedule title is required.' });
      }

      await updateSchedule(locals.user.id, title, description);

      return { 
        success: true, 
        updated_schedule: { title, description }
      };
    } catch (error) {
      console.error('error updating schedule: ', error);
      return fail(500, { error: 'failed to update schedule' });
    }
  },
}