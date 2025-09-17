import * as table from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateId } from '$lib/server/db/utils';
import { getScheduleItemsByUserId } from '$lib/server/db/services/schedule-service';

export const load: PageServerLoad = (async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  const items = async () => { 
    await new Promise(resolve => setTimeout(resolve, 500));
    return getScheduleItemsByUserId(user.id);
  }

  return { user, streamed: { items: items() }};
});

export const actions = {
  add: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();

    // const title = formData.get('title') as string;
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description') as string;
    // const start = formData.get('start_time') as string;
    const start = formData.get('start_time')?.toString();
    const end = formData.get('end_time') as string;
    const externalUrl = formData.get('external_url') as string;

    if (!title || !start) {
      return { success: false };
      // return fail(400, {
      //   error: 'title and start time are required',
      //   values: {
      //     title: title?.toString() || '',
      //     start_time: start?.toString() || '',
      //   }
      // });
    }

    try {
      // should i just be saving the schedule_id in the user object?
      const [schedule] = (await db.select({ schedule_id: table.schedules.id }).from(table.schedules).where(eq(table.schedules.userId, locals.user.id)).limit(1));

      const item = {
        id: generateId(),
        scheduleId: schedule.schedule_id,
        title,
        description: description || null,
        startTime: new Date(start),
        endTime: end ? new Date(end) : null,
        externalUrl: externalUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(table.schedule_items).values(item).returning();

      return { 
        success: true, 
        message: 'item added successfully',
      };
    } catch (error) {
      console.error('error inserting schedule item:', error);
      return fail(500, { 
        error: 'an error has occurred inserting schedule item' 
      });
    }
  },

  delete: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    const itemId = formData.get('itemId')?.toString();
    console.log('itemId:', itemId);
     
    if (!itemId) {
      return fail(400, { error: 'item ID is required' });
    }

    try {
      await db.delete(table.schedule_items).where(eq(table.schedule_items.id, itemId));
    } catch (error) {
      console.error(`schedule deletion failed: `, { itemId, error });
      fail (500, { error: 'an error has occurred deleting schedule item' });
    }
  },

  update: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/demo/lucia/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();

    const itemId = formData.get('id')?.toString();
    const title = formData.get('title')?.toString().trim();
    const description = formData.get('description') as string;
    const start = formData.get('start_time')?.toString();
    const end = formData.get('end_time') as string;
    const externalUrl = formData.get('external_url') as string;

    if (!itemId) {
      return fail(400, { error: 'item ID is required' });
    }

    if (!title || !start) {
      return fail(400, {
        error: 'title and start time are required',
        values: {
          title: title || '',
          start: start || '',
        }
      });
    }
    
    const item = {
      title,
      description: description || null,
      startTime: new Date(start),
      endTime: end ? new Date(end) : null,
      externalUrl: externalUrl || null,
      // updatedAt: new Date()
    };

    try {
      await db.update(table.schedule_items).set({...item}).where(eq(table.schedule_items.id, itemId));
    } catch (error) {
      console.error(`schedule update failed: `, { itemId, error });
      fail (500, { error: 'an error has occurred updating schedule item' });
    }
  }
}