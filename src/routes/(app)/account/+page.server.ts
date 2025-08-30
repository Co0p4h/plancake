import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteUser, getAllUserSettingsByUserId, updateUserSettings } from '$lib/server/db/services/user-service';
import { deleteSessionTokenCookie } from '$lib/server/session';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  const user = locals.user;

  const user_settings = async () => { 
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getAllUserSettingsByUserId(user.id);
  }

  try {
    return { streamed: { user_settings: user_settings() }, user };
  } catch (error) {
    console.error('error getting user settings: ', error);
    return { streamed: { user_settings: null }, user };
  }
};

export const actions = {
  updateUserSettings: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    const settingsData = JSON.parse(formData.get('user_settings') as string);
    console.log('settingsData: ', settingsData);

    const { display_name, ...settings } = settingsData;

    try {
      if (Math.random() < 0.5) {
        throw new Error('kys');
      }

      const result = await updateUserSettings(locals.user.id, settings, display_name);
      const languageChanged = result.previousSettings?.settings?.language !== result.user_settings.user_settings?.language;

      return { 
        success: true, 
        message: 'user settings updated successfully',
        updated_settings: result.user_settings,
        languageChanged
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
  },

  changeUsername: async (event) => {
    if (!event.locals.user) {
      return redirect(302, `/login?redirectTo=${event.url.pathname}`);
    }

    const formData = await event.request.formData();
    const newUsername = formData.get('new_username') as string;

    if (!newUsername || newUsername.trim().length === 0) {
      return fail(400, { error: 'username is required' });
    }

    try {
      if (Math.random() < 0.5) {
        throw new Error('kys');
      }

      console.log("changeUsername action called with newUsername: ", newUsername);

      // const { updatedUser } = await updateUsername(event.locals.user.id, newUsername.trim());

      // if (updatedUser) {
      //   event.locals.user.username = updatedUser.username;
      //   event.locals.user.displayName = updatedUser.displayName;
      // }

      return { 
        success: true, 
        message: 'username updated successfully',
        // updatedUser 
      };
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, { error: `failed to update username: ${error.message}` });
      }
      return fail(500, { error: 'unexpected error occurred' });
    }
  }
}