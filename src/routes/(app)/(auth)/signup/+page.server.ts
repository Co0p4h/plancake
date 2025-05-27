import { fail, redirect, type Actions } from "@sveltejs/kit";

export const load = (async ({ locals }) => { 
  const user = locals.user;
  console.log(user);
  
  // if (user) {
  //   throw redirect(303, '/');
  // }
});

export const actions = {
	default: async ({ cookies, request, url }) => {
		const data = await request.formData();
		const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    if (!username || !email || !password) {
      // return fail(400, { email, missing: true });
      return fail(400, {
        error: 'username and email and password are required',
        values: {
          username: username?.toString() || '',
          email: email?.toString() || '',
        }
      });
    }

    const userData = {
      username: username.toString(),
      email: email.toString(),
      password: password.toString()
    };

    try {
    } catch (error) {
    }
    if (url.searchParams.has('redirectTo')) {
      redirect(302, `${url.searchParams.get('redirectTo')}`);
    }
    redirect(302, '/');
	}
} satisfies Actions;