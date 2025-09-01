import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const user = locals.user;

  if (!user) {
    return redirect(302, `/login?redirectTo=${url.pathname}`);
  }

  if (!user.setupComplete || !user.username) {
    if (!url.pathname.startsWith("/onboarding")) {
      return redirect(302, `/onboarding/username`);
    }
  }

  return { user };
};
