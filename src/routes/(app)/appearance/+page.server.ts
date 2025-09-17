import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ScheduleTheme } from '$lib/server/db/schema';
import { getWholeScheduleByUserId } from '$lib/server/db/services/schedule-service';

export const load: PageServerLoad = (async ({ locals, url }) => {
  const user = locals.user;

  if (!user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  return { schedule_data: await getWholeScheduleByUserId(user.id) };
});

export const actions = {
  updateTheme: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    // console.log('formdata', formData);

    const themeJson = formData.get("theme")

    if (!themeJson || typeof themeJson !== 'string') {
      return fail(400, { error: 'theme data is missing or invalid.' });
    }

    try {
      const theme: ScheduleTheme = JSON.parse(themeJson);

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // simulate 20% failure rate
      if (Math.random() < 0.2) {
        throw new Error('simulated random failure');
      }

      const [schedule] = await db.select({ schedule_id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, locals.user.id)).limit(1);

      const [updated_theme] = await db
        .update(table.schedule_themes)
        .set({
          colours: theme.colours,
          image: theme.image,
          typography: theme.typography,
          background: theme.background,
          layout: theme.layout,
          item_theme: theme.item_theme,
        })
        .where(eq(table.schedule_themes.scheduleId, schedule.schedule_id))
        .returning({ theme: table.schedule_themes });

      // console.log("updated_theme: ", updated_theme);
      
      return { 
        updated_theme: updated_theme.theme, 
        success: true,
        message: 'theme updated successfully!'
      };

    } catch (error) {
      console.error(`schedule theme update failed: `, { error });
      return fail (500, { error: 'an error has occurred updating schedule theme' });
    }
  }
}
