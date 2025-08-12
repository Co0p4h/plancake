import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserSettingsByUserId } from '$lib/server/db/user-service';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  try {
    const user_settings = await getUserSettingsByUserId(user.id);
    return { user_settings, user };
  } catch (error) {
    console.error('error getting user settings: ', error);
  }
};

export const actions = {
  updateUserSettings: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    const language = formData.get('language');
    const timezone = formData.get('timezone');
    const discord_webhook = formData.get('discord_webhook');

    try {
      console.log('updating user settings');
      return { 
        success: true, 
        message: 'user settings updated successfully',
        updated_settings: {
          language,
          timezone,
          discord_webhook
        }
      };
    } catch (error) {
      console.error('error updating user settings: ', error);
    }
  },

  updateSocialLinks: async ({ request, locals, url }) => {
    if (!locals.user) {
      throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }

    const data = await request.formData();
    const socialLinksJson = data.get('socialLinks');

    if (!socialLinksJson) {
      return fail(400, { error: 'Social links data is required' });
    }
    
    try {
      const socialLinks = JSON.parse(socialLinksJson as string);
      // const updatedLinks = await usersService.updateSocialLinks(session.token, socialLinks);
      console.log("social links: ", socialLinks);
      return { success: true, socialLinks };
    } catch (error) {
      console.error(`failed to update social links: ${error}`, {  error });
      return fail(400, { error });
    }
  },
}