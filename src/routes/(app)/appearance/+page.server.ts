import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
// import { themeStore } from './appearance.svelte';
import type { ScheduleTheme } from '$lib/server/db/schema';

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

export const actions = {
  updateTheme: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/demo/lucia/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    console.log('formdata', formData);
    const themeJson = formData.get("theme")
    if (!themeJson || typeof themeJson !== 'string') {
      return fail(400, { error: 'theme data is missing or invalid.' });
    }

    console.log('themJson', themeJson);
    // console.log('1. client theme', themeStore.clientTheme.colours);
    // console.log('1. original theme', themeStore.originalTheme.colours);

    // const colours: table.ColourTheme = {
    //   primary: formData.get("primary"),
    //   background: formData.get("background"),
    //   secondary: formData.get("secondary"),
    //   accent: formData.get("accent"),
    //   text: formData.get("text"),
    // }
    
    // const layout: table.LayoutTheme = {
    //   // gap: parseInt(formData.get("gap")),
    //   gap: 4,
    //   items: "list",
    //   image_position: "right"
    //   // items: formData.get("list"),
    //   // image_position: formData.get("image_position"),
    // }

    // console.log('2. client theme', themeStore.clientTheme.colours);
    // console.log('2. original theme', themeStore.originalTheme.colours);

    try {
      // simulate 50% failure rate
      if (Math.random() < 0.5) {
        throw new Error('simulated random failure');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      const theme: ScheduleTheme = JSON.parse(themeJson);
      console.log('theme', theme);
      const [schedule] = (await db.select({ schedule_id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, locals.user.id)).limit(1));
      const [updated_theme] = await db.update(table.schedule_themes).set({
        colours: theme.colours,
        image: theme.image,
        typography: theme.typography,
        background: theme.background,
        layout: theme.layout,
        item_theme: theme.item_theme,
      }).where(eq(table.schedule_themes.scheduleId, schedule.schedule_id)).returning({ theme: table.schedule_themes });
      console.log("updated_theme: ", updated_theme);
      
      return { updated_theme: updated_theme.theme, success: true };
    } catch (error) {
      console.error(`schedule theme update failed: `, { error });
      return fail (500, { error: 'an error has occurred updating schedule theme' });
    }
  }




    // if (!itemId) {
    //   return fail(400, { error: 'item ID is required' });
    // }

    // if (!title || !start) {
    //   return fail(400, {
    //     error: 'title and start time are required',
    //     values: {
    //       title: title || '',
    //       start: start || '',
    //     }
    //   });
    // }
    
    // const theme = {
    // };

    // try {
    //   await db.update(table.schedule_themes).set({...theme}).where(eq(table.schedule_items.id, itemId));
    // }  catch (error) {
    //   console.error(`schedule deletion failed: `, { itemId, error });
    //   fail (500, { error: 'an error has occurred deleting schedule item' });
    // }
}
