import { isUsernameAvailable, markUserSetupComplete, updateUsername } from '$lib/server/db/services/user-service.js'
import { validateUsername } from '$lib/utils/validate.js';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  updateUsername: async ({ request, locals, url }) => {
    if (!locals.user) {
      return redirect(302, `/login?redirectTo=${url.pathname}`);
    }

    const formData = await request.formData();
    const username = formData.get('username')?.toString().trim().toLowerCase();

    console.log("updating username to: ", username);

    if (!validateUsername(username)) {
      return fail(400, {
        username: username,
        message: 'invalid username',
        invalid: true
      });
    }

    const isAvailable = await isUsernameAvailable(username, locals.user.id);
    if (!isAvailable) {
      return fail(400, {
        username,
        message: 'username is already taken',
        invalid: true
      });
    }

    try {
      const updated_user = await updateUsername(locals.user.id, username)
      console.log("updated username: ", updated_user);

      if (!updated_user) {
        return { success: false, error: 'failed to update username' };
      }
      await markUserSetupComplete(locals.user.id);

    } catch (error) {
      console.error('error updating username:', error);

      return fail(500, {
        username,
        message: 'internal server error',
        invalid: true
      });
    }

    return redirect(302, '/schedule');
}}