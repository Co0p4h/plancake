import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq, between, and } from 'drizzle-orm';
import { getCurrentWeekDates } from '$lib/utils/date';
import { error } from '@sveltejs/kit';

export interface ScheduleData {
  user: typeof table.users.$inferSelect;
  schedule: typeof table.schedules.$inferSelect;
  theme: typeof table.schedule_themes.$inferSelect;
  items: typeof table.schedule_items.$inferSelect[];
  schedule_settings: typeof table.schedule_settings.$inferSelect;
}

export async function getWholeScheduleByUsername(username: string): Promise<ScheduleData> {
  const [user] = await db
    .select()
    .from(table.users)
    .where(eq(table.users.username, username));

  if (!user) return error(404, { message: `user @${username} not found` });

  const [schedule] = await db
    .select()
    .from(table.schedules)
    .where(eq(table.schedules.userId, user.id))
    .limit(1);

  const [schedule_settings] = await db
    .select()
    .from(table.schedule_settings)
    .where(eq(table.schedule_settings.scheduleId, schedule.id))
    .limit(1);

  const [theme] = await db
    .select()
    .from(table.schedule_themes)
    .where(eq(table.schedule_themes.scheduleId, schedule.id));

  const { start: startDate, end: endDate } = getCurrentWeekDates(
    schedule_settings.settings.first_day_of_week
  );

  const items = await db
    .select()
    .from(table.schedule_items)
    .where(
      and(
        eq(table.schedule_items.scheduleId, schedule.id),
        between(table.schedule_items.startTime, startDate, endDate)
      )
    )
    .orderBy(table.schedule_items.startTime);

  return { user, schedule, theme, items, schedule_settings };
}

export async function getWholeScheduleByUserId(userId: string): Promise<ScheduleData> {
  const [user] = await db
    .select()
    .from(table.users)
    .where(eq(table.users.id, userId));

  if (!user) return error(404, { message: `user with id ${userId} not found` });

  const [schedule] = await db
    .select()
    .from(table.schedules)
    .where(eq(table.schedules.userId, user.id))
    .limit(1);

  const [schedule_settings] = await db
    .select()
    .from(table.schedule_settings)
    .where(eq(table.schedule_settings.scheduleId, schedule.id))
    .limit(1);

  const [theme] = await db
    .select()
    .from(table.schedule_themes)
    .where(eq(table.schedule_themes.scheduleId, schedule.id));

  const { start: startDate, end: endDate } = getCurrentWeekDates(
    schedule_settings.settings.first_day_of_week
  );

  const items = await db
    .select()
    .from(table.schedule_items)
    .where(
      and(
        eq(table.schedule_items.scheduleId, schedule.id),
        between(table.schedule_items.startTime, startDate, endDate)
      )
    )
    .orderBy(table.schedule_items.startTime);

  return { user, schedule, theme, items, schedule_settings };
}

export async function getScheduleItemsByUserId(
  userId: string,
  // startDate: Date,
  // endDate: Date
): Promise<typeof table.schedule_items.$inferSelect[]> {
  const [schedule] = await db
  .select({ schedule_id: table.schedules.id })
  .from(table.schedules)
  .where(eq(table.schedules.userId, userId))
  .limit(1);
  
  return db
    .select()
    .from(table.schedule_items)
    .where(
      and(
        eq(table.schedule_items.scheduleId, schedule.schedule_id),
        // between(table.schedule_items.startTime, startDate, endDate)
      )
    )
}

export async function getScheduleSettingsByUserId(userId: string) {
  const [result] = await db
    .select({
      schedule: table.schedules,
      schedule_settings: table.schedule_settings.settings
    })
    .from(table.schedules)
    .innerJoin(table.schedule_settings, eq(table.schedules.id, table.schedule_settings.scheduleId))
    .where(eq(table.schedules.userId, userId))
    .limit(1);
    await new Promise(resolve => setTimeout(resolve, 1000));

  return result;
}

export async function getScheduleByUserId(userId: string): Promise<typeof table.schedules.$inferSelect> {
  const [schedule] = await db
    .select()
    .from(table.schedules)
    .where(eq(table.schedules.userId, userId))
    .limit(1);

  return schedule;
}

// export async function updateSchedule(userId: string, title: string, description?: string): Promise<void> {
//   await db
//     .update(table.schedules)
//     .set({ 
//       title,
//       description: description || null,
//     })
//     .where(eq(table.schedules.userId, userId));
// }

export async function updateScheduleSettings(scheduleId: string, settings: typeof table.schedule_settings.$inferSelect.settings, title: string, description?: string) {
  const result = await db.transaction(async (tx) => {
    await tx.update(table.schedules)
      .set({ 
        title,
        description
      })
      .where(eq(table.schedules.id, scheduleId));

    await tx.update(table.schedule_settings)
      .set({ 
        settings,
      })
      .where(eq(table.schedule_settings.scheduleId, scheduleId));

    const [schedule_settings] = await tx
      .select({ schedule: table.schedules, schedule_settings: table.schedule_settings.settings })
      .from(table.schedules)
      .leftJoin(table.schedule_settings, eq(table.schedules.id, table.schedule_settings.scheduleId))
      .where(eq(table.schedules.id, scheduleId))

    return { schedule_settings };
  });

  return result.schedule_settings;
}