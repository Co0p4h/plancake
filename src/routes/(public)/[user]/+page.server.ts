import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, between, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCurrentWeekDates } from '$lib/utils/date';

export const load: PageServerLoad = (async ({ params }) => {
  const [user] = await db.select().from(table.users).where(eq(table.users.username, params.user)); // TODO: i probably shouldn't be passing the entire user object here
  if (!user) {
    return error(404, { message: "user doesn't exist" });
  }

  const [schedule] = await db.select().from(table.schedules).where(eq(table.schedules.userId, user.id)).limit(1);
  if (!schedule) {
    return error(404, { message: "schedule doesn't exist" });
  }

  const [schedule_settings] = await db.select().from(table.schedule_settings).where(eq(table.schedule_settings.scheduleId, schedule.id)).limit(1);

  const { start: startDate, end: endDate } = getCurrentWeekDates(schedule_settings.settings.first_day_of_week);

  const schedule_items = await db.select()
                                  .from(table.schedule_items)
                                  .where(
                                    and(
                                      eq(table.schedule_items.scheduleId, schedule.id),
                                      between(table.schedule_items.startTime, startDate, endDate)
                                    )
                                  )
                                  .orderBy(table.schedule_items.startTime);

  // console.log("schedule_settings.settings.first_day_of_week", schedule_settings.settings.first_day_of_week);

  // const schedule_items_current_week = await db.select().from(table.schedule_items).where(and(eq(table.schedule_items.scheduleId, schedule.id), between(table.schedule_items.startTime, startDate, endDate))).orderBy(table.schedule_items.startTime);
  const [theme] = await db.select().from(table.schedule_themes).where(eq(table.schedule_themes.scheduleId, schedule.id));

  // return { user, schedule, theme, items: schedule_items_current_week };
  return { user, schedule, theme, items: schedule_items };
});

