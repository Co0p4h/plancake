import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getScheduleByUsername } from '$lib/server/db/schedule-service';

export const load: PageServerLoad = (async ({ params }) => {
  const schedule_data = await getScheduleByUsername(params.user);
  
  if (!schedule_data) {
    return error(404, { message: `user @${params.user} not found` });
  }

  return { ...schedule_data };
});

