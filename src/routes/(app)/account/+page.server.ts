import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserSettingsByUserId } from '$lib/server/db/user-service';

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
    const language = formData.get('language');
    const timezone = formData.get('timezone');
    const discord_webhook = formData.get('discord_webhook');
    const socialLinksJson = formData.get('socialLinks');

    try {
      const social_links = JSON.parse(socialLinksJson as string);
      console.log('updating user settings', { language, timezone, discord_webhook, social_links});

      if (Math.random() < 0.5) {
        throw new Error('kys');
      }

      return { 
        success: true, 
        message: 'user settings updated successfully',
        updated_settings: {
          language,
          timezone,
          discord_webhook,
          social_links
        }
      };
    } catch (error) {
      console.error('error updating user settings: ', error);
      return fail(500, { error: 'failed to update user settings' });
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