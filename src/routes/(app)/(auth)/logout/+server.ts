import * as auth from '$lib/server/session';
import { redirect } from "@sveltejs/kit";

export async function POST(event) {
  if (!event.locals.session) {
    return new Response("no one logged in");
    // return fail(401);
  }
  await auth.invalidateSession(event.locals.session.id);
  auth.deleteSessionTokenCookie(event);

  return new Response(`logged ${event.locals.session.userId} out`);
  return redirect(302, '/login');
};
