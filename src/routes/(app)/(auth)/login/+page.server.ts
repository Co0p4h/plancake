import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = (async ({ locals }) => { 
  // const session = await locals.user;
  // if (session) {
  //   throw redirect(303, '/');
  // }
});

export const actions = {
	default: async ({ cookies, request, url }) => {
		const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return fail(400, {
        missing: true,
        error: 'username and email and password are required',
        email
      });
    };
    
    try {
    } catch (error) {
    }
	}
} satisfies Actions;