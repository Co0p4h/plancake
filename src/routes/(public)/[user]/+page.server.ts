// import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getScheduleByUsername } from '$lib/server/db/services/schedule-service';
import { getUserSettingsByUserId } from '$lib/server/db/services/user-service';

export const load: PageServerLoad = async ({ params }) => {
  // const schedule_data = await getScheduleByUsername(params.user);
  
  // if (!schedule_data) {
  //   return error(404, { message: `user @${params.user} not found` });
  // }

  // return { ...schedule_data };
  const schedule_data = await getScheduleByUsername(params.user); 
  const user_settings = await getUserSettingsByUserId(schedule_data.user.id);

  return { schedule_data, user_settings } // i think that the public route shouldn't stream data in? 

};

