import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getScheduleSettingsByUserId, updateScheduleSettings } from '$lib/server/db/services/schedule-service';
import type { AllScheduleSettings } from '$lib/server/db/schema';

export const load: PageServerLoad = (async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  try {
    return { 
      schedule_settings: getScheduleSettingsByUserId(user.id), 
      // schedule: getScheduleByUserId(user.id),
      user 
    };
  } catch (error) {
    console.error('error getting schedule settings: ', error);
    return { schedule_settings: null, schedule: null, user };
  }
});

export const actions: Actions = {
  updateScheduleSettings: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    try {
      if (Math.random() < 0.2) {
        throw new Error('simulated random failure');
      }

      const formData = await request.formData();
      const settingsData = JSON.parse(formData.get('schedule_settings') as string);

      const { title, description, ...settings } = settingsData;

      if (!title) {
        return fail(400, { error: 'schedule title is required.' });
      }

      if (!settings || typeof settings !== typeof(table.schedule_settings.settings)) {
        return fail(400, { error: 'settings data is missing or invalid.' });
      }

      // TODO: I don't like how we hvae to query for the schedule again here...
      const [schedule] = await db.select({ id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, locals.user.id)).limit(1);
      const updated_schedule = await updateScheduleSettings(schedule.id, settings, title, description); 

      return { 
        success: true, 
        updated_schedule: { title: updated_schedule.schedule.title, description: updated_schedule.schedule.description, ...updated_schedule.schedule_settings } as AllScheduleSettings
      };
    } catch (error) {
      console.error('error updating schedule and settings: ', error);
      return fail(500, { error: 'failed to update schedule and settings' });
    }
  }
}
