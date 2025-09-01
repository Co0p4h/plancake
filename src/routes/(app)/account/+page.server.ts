import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { deleteUser, getAllUserSettingsByUserId, isUsernameAvailable, updateUsername, updateUserSettings } from '$lib/server/db/services/user-service';
import { deleteSessionTokenCookie } from '$lib/server/session';
import { validateUsername } from '$lib/utils/ss-validate';

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
    const settingsJson = formData.get('user_settings');
    
    if (!settingsJson) {
      return fail(400, { error: 'missing settings data' });
    }

    const settingsData = JSON.parse(settingsJson as string);
    const { display_name, ...settings } = settingsData;

    if (!display_name.trim()) {
      return fail(400, { error: 'display name is required' });
    }

    try {
      if (Math.random() < 0.5) {
        throw new Error('kys');
      }

      const result = await updateUserSettings(locals.user.id, settings, display_name);
      // const languageChanged = result.previousSettings?.settings?.language !== result.user_settings.user_settings?.language;

      return { 
        success: true, 
        message: 'user settings updated successfully',
        updated_settings: result.user_settings,
        // languageChanged
      };
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, { error: error.message });
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

  updateUsername: async (event) => {
    if (!event.locals.user) {
      return redirect(302, `/login?redirectTo=${event.url.pathname}`);
    }

    const formData = await event.request.formData();
    const newUsername = formData.get('new_username')?.toString().trim().toLowerCase();

    if (!validateUsername(newUsername)) {
      return fail(400, {
        username: newUsername,
        message: 'invalid username',
        invalid: true
      });
    }

    const isAvailable = await isUsernameAvailable(newUsername, event.locals.user.id);
    if (!isAvailable) {
      return fail(400, {
        new_username: newUsername,
        message: 'username is already taken',
        invalid: true
      });
    }

    if (newUsername === event.locals.user.username) {
      return fail(400, {
        new_username: newUsername,
        message: 'new username cannot be the same as the current username',
        invalid: true
      });
    }

    try {
      if (Math.random() < 0.5) {
        throw new Error('kys');
      }
      console.log("changeUsername action called with newUsername: ", newUsername);

      const updated_user = await updateUsername(event.locals.user.id, newUsername)

      if (!updated_user) {
        return { success: false, error: 'failed to update username' };
      }

      console.log("updated username: ", updated_user.updatedUser.username);

      return { 
        success: true, 
        message: 'username updated successfully',
        updated_username: updated_user.updatedUser.username         
      };
    } catch (error) {
      if (error instanceof Error) {
        return fail(500, { 
          message: `failed to update username: ${error.message}`,
          username: newUsername,
          invalid: true
        });
      }
      return fail(500, { 
        message: 'unexpected error occurred',
      });
    }
  }
}