import { twitch } from "$lib/server/oauth";
import * as arctic from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import { addAuthMethodToUser, createUserWithAuth, getUserByAuthProvider, getUserByEmail } from "$lib/server/db/services/user-service";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/session";
import dayjs from "dayjs";
import type { AuthProvider } from "$lib/server/db/schema";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("twitch_oauth_state") ?? null;
  
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}

	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
  try {
    tokens = await twitch.validateAuthorizationCode(code);
    console.log("wahhhtokens: ", tokens);
    
  } catch (e) {
    if (e instanceof arctic.OAuth2RequestError) {
      // invalid authorization code, credentials, or redirect uri
      const code = e.code;
      console.error("error validating auth code: ", code);

      return new Response(null, {
        status: 400
      });
    }
    if (e instanceof arctic.ArcticFetchError) {
      // failed to call `fetch()`
      const cause = e.cause;
      console.log(cause);
    }
    // parse error
    return new Response(null, {
      status: 400
    });
  }

  type TwitchIdTokenClaims = {
		sub: string;
		email: string;
		email_verified: boolean;
    preferred_username: string;
		picture?: string;
		[key: string]: unknown;
	};

	const claims = decodeIdToken(tokens.idToken()) as TwitchIdTokenClaims;
  console.log("twitch id token claims: ", claims);

  const twitchUserId = claims.sub;
	const username = null; // TODO: i want to do preferred_username but what if it is taken? 
  const email = claims.email;
	const displayName = claims.preferred_username ?? username;
  const picture = claims.picture;
	const emailVerified = claims.email_verified ?? false;

	const existingUserWithProvider = await getUserByAuthProvider("twitch", twitchUserId);

  if (existingUserWithProvider) {
		console.log("existingUser: ", existingUserWithProvider);
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUserWithProvider.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

  const existingUserWithEmail = await getUserByEmail(email);
	if (existingUserWithEmail) {
		console.log("user exists with email, linking twitch account: ", existingUserWithEmail);

		const authMethod = {
			authType: "twitch" as AuthProvider,
			providerId: twitchUserId,
			passwordHash: null, 
			metadata: {
				email, 
				name: displayName,
				picture
			}
		};

		const wsdklfjl = await addAuthMethodToUser(existingUserWithEmail.id, authMethod);
		console.log("added auth method result: ", wsdklfjl);

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUserWithEmail.id);

		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}

	 // no existing user - create new account
  console.log("creating new user with twitch auth");

	const userData = {
		username,
		displayName,
		email,
		emailVerified,
	};

	const authMethod = {
		authType: "twitch" as AuthProvider,
		providerId: twitchUserId,
		passwordHash: null, 
		metadata: {
			email, 
			name: displayName,
			picture
		}
	};

  const user = await createUserWithAuth(userData, authMethod, dayjs.tz.guess());

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
    
  return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
}