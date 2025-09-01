import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { google } from "$lib/server/oauth";
import { getUserByAuthProvider, createUserWithAuth, getUserByEmail, addAuthMethodToUser } from "$lib/server/db/services/user-service";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import type { AuthProvider } from "$lib/server/db/schema";
import dayjs from "dayjs";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
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
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (error) {
		// invalid code or client credentials
    console.error("error validating auth code: ", error);
		return new Response(null, {
			status: 400
		});
	}

	type GoogleIdTokenClaims = {
		sub: string;
		name: string;
		email: string;
		picture?: string;
		email_verified: boolean;
		[key: string]: unknown;
	};

	const claims = decodeIdToken(tokens.idToken()) as GoogleIdTokenClaims;
	console.log("Google ID Token Claims: ", claims);

	const googleUserId = claims.sub;
	const username = null;
  const email = claims.email;
	const displayName = claims.name ?? username;
  const picture = claims.picture;
	const emailVerified = claims.email_verified ?? false;

	const existingUserWithProvider = await getUserByAuthProvider("google", googleUserId);

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
		console.log("user exists with email, linking google account: ", existingUserWithEmail);

		const authMethod = {
			authType: "google" as AuthProvider,
			providerId: googleUserId,
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
  console.log("creating new user with google auth");

	const userData = {
		username,
		displayName,
		email,
		emailVerified,
	};

	const authMethod = {
		authType: "google" as AuthProvider,
		providerId: googleUserId,
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
