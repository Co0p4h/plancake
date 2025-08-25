import { Google } from "arctic";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "$env/static/private";

export const google = new Google(
	GOOGLE_CLIENT_ID!,
	GOOGLE_CLIENT_SECRET!,
	GOOGLE_REDIRECT_URI!
);

// export const twitch = new Twitch(
//   process.env.TWITCH_CLIENT_ID!,
//   process.env.TWITCH_CLIENT_SECRET!,
//   process.env.TWITCH_REDIRECT_URI!
// );

// export const twitter = new Twitter(
//   process.env.TWITTER_CLIENT_ID!,
//   process.env.TWITTER_CLIENT_SECRET!,
//   process.env.TWITTER_REDIRECT_URI!
// );

// export const discord = new Discord(
//   env.DISCORD_CLIENT_ID!,
//   env.DISCORD_CLIENT_SECRET!,
//   env.DISCORD_REDIRECT_URI!
// );
