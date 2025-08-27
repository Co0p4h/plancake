import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteUser, getUserSettingsByUserId, updateUserSettingsByUserId } from '$lib/server/db/services/user-service';
import { deleteSessionTokenCookie } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  const user_settings = async () => { 
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getUserSettingsByUserId(user.id);
  }

  // const user_settings = getUserSettingsByUserId(user.id);
  return { streamed: { user_settings: user_settings() }, user };
};

export const actions = {
  updateUserSettings: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    const language = formData.get('language') as 'en' | 'ja';
    const timezone = formData.get('timezone') as string;
    const discord_webhook = formData.get('discord_webhook') as string;
    const socialLinksJson = formData.get('socialLinks') as string;

    try {
      const social_links = JSON.parse(socialLinksJson as string);

      if (Math.random() < 0.5) {
        throw new Error('kys');
      }

      const updated_settings = await updateUserSettingsByUserId(locals.user.id, { language, timezone, discord_webhook, social_links });

      return { 
        success: true, 
        message: 'user settings updated successfully',
        updated_settings 
      };
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, { error: `failed to update user settings: ${error.message}` });
      }
      return fail(500, { error: 'unexpected error occurred' });
    }
  },

  deleteUser: async (event) => {
    if (!event.locals.user) {
      return redirect(302, `/login?redirectTo=${event.url.pathname}`);
    }
    
    try {
      // await new Promise(resolve => setTimeout(resolve, 3000)); 
      await deleteUser(event.locals.user.id);
      deleteSessionTokenCookie(event);
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, { error: `failed to delete user: ${error.message}` });
      }
      return fail(500, { error: 'unexpected error occurred' });
    }

    return redirect(302, '/');
  }
}