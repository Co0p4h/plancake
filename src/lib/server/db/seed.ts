import { db } from "./index";
import { sessions, schedules, schedule_themes, users, user_settings, schedule_items, schedule_settings, type ScheduleSettings } from '$lib/server/db/schema';
import { generateId } from "./utils";

// async function main() {
//   await db.delete(sessions); 
//   await db.delete(schedule_themes);
//   await db.delete(schedule_items);
//   await db.delete(schedule_settings);
//   await db.delete(schedules);
//   await db.delete(user_settings);
//   await db.delete(users);
// }

export async function add_schedule_settings() {
  const schedule_settings_data: ScheduleSettings = {
    show_empty_days: true,
    empty_day_text: "nothing scheduled",
    show_past_events: true,
    use_24_hour_time: true,
    show_social_links: true,
    first_day_of_week: true,
    show_logo: true,
  };
  
  await db.insert(schedule_settings).values({
    id: generateId(),
    scheduleId: "ughosewqoqcz7neblyb4vxr5", 
    updatedAt: new Date(),
    createdAt: new Date(),
    settings: schedule_settings_data
  })
}

// main();

// const add_schedule_settings = async () => {
//   await db.insert(schedule_settings).values({
    
//   });
// };

// const add_schedule_theme
