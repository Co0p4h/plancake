import { generateState } from "arctic";
import { twitch } from "$lib/server/oauth";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = twitch.createAuthorizationURL(state, ["user:read:email", "openid"]);
	url.searchParams.append('claims', '{ "id_token": { "email": null, "email_verified": null, "preferred_username": null, "picture": null } }')

	event.cookies.set("twitch_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}