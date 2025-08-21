import type { fontSizes } from '$lib/utils/font';
import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, jsonb, check, index, varchar, unique, boolean } from 'drizzle-orm/pg-core';

const baseEntity = {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull().$onUpdate(() => new Date())
};

export type UserSettings = {
	language: "en" | "ja"; 
	timezone: string;
	social_links: {
		platform: string;
		url: string;
	}[];
	discord_webhook?: string;
}

export type ScheduleSettings = {
	show_empty_days: boolean;
	empty_day_text: string | null;
	show_past_events: boolean;
	use_24_hour_time: boolean;
	show_social_links: boolean;
	first_day_of_week: "monday" | "sunday";
	show_logo: boolean;
	show_schedule_description: boolean;
	// custom_url: string;
	// sharing_preview: jsonb; // I think this should be a different table? 
}

export type ThemeCategories = "background" | "image" | "colours" | "item" | "typography" | "layout" | null;

export type ColourTheme = {
	primary: string; // #RRGGBB format 
	secondary: string;
	background: string;
	text: string;
	accent: string;
	// highlight: string;
	// shadow: string;
}

export type ScheduleImage = {
	url?: string;
	alt?: string;
	artist_name?: string;
	artist_url?: string;
}
export type ColourThemeKey = keyof ColourTheme

export type FontSize = keyof typeof fontSizes;

export type ElementTypography = {
	font?: string;
	size: FontSize;
	weight: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
	capitalisation?: "uppercase" | "lowercase" | "none";
	decoration?: "none" | "underline" | "line-through";
	style: "normal" | "italic";
	letter_spacing?: string; // e.g. "0.5px" | "1px"
	// colour?: ColourThemeKey; // e.g., "primary", "text"
}

export type TypographyTheme = {
	base_font: string;
	header_title: ElementTypography;
	item_title: ElementTypography;
	item_description: ElementTypography;
	header_description: ElementTypography;
	item_date: ElementTypography;
	item_time: ElementTypography;
	body: ElementTypography;
	empty_day: ElementTypography;
}

export type ItemTheme = {
	border_style: "solid" | "none";
	border_radius: number;
	shadow_style: "soft" | "hard" | "none";
	// empty_state_style: "faded" | "hidden";
}

export type LayoutTheme = {
	items: "list" | "grid";
	image_position: "left" | "right" | "none";
	gap: number; // e.g. "4px" | "8px" | "16px"
	// image_overlap: string; // e.g., "20px", "-10%"
	// content_padding: string; // e.g., "16px"
}

export const users = pgTable('users', {
	...baseEntity,
	username: varchar('username', { length: 63 }).notNull().unique(),
	displayName: varchar('display_name', { length: 63 }),
	email: varchar('email', { length: 127 }).notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
}, (table) => [
  check("valid_email", sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`),
  check("username_length", sql`length(${table.username}) >= 3`),
  check("username_format", sql`${table.username} ~* '^[a-zA-Z0-9_-]+$'`)
]);

export const userAuthMethods = pgTable('user_auth_methods', {
	...baseEntity,
  userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
  authType: varchar('auth_type', { length: 50 }).notNull(), // 'password', 'google', 'github', etc.
  providerId: varchar('provider_id', { length: 255 }), // OAuth provider's user ID
  passwordHash: varchar('password_hash', { length: 255 }), // only for password auth
  metadata: jsonb('metadata'), // store additional provider data
}, (table) => [
  index('idx_user_auth_methods_user_id').on(table.userId),
  index('idx_user_auth_methods_provider').on(table.authType, table.providerId),
  unique('unique_auth_provider').on(table.authType, table.providerId),
  unique('unique_user_auth_type').on(table.userId, table.authType)
]);

export const user_settings = pgTable('user_settings', {
	...baseEntity,
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	settings: jsonb('settings').$type<UserSettings>(),
});

export const sessions = pgTable('sessions', {
	...baseEntity,
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const schedules = pgTable('schedules', {
	...baseEntity,
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' })
		.unique(),
	title: text('title').notNull(),
	description: text('description'),
});

export const schedule_themes = pgTable('schedule_themes', {
	...baseEntity,
	scheduleId: text('schedule_id')
		.notNull()
		.references(() => schedules.id, { onDelete: 'cascade' })
		.unique(),
	colours: jsonb('colour').$type<ColourTheme>().default({
    primary: '#000000',
    secondary: '#ffffff',
    background: '#f5f5f5',
    text: '#333333',
    accent: '#0066cc'
	}).notNull(),
	image: jsonb('image').$type<ScheduleImage>().default({
		url: 'https://i.pinimg.com/736x/8c/34/dd/8c34ddbe9d9c3f5b0af2b14bfe989a2c.jpg',
		alt: 'schedule image',
		artist_name: 'artist name',
		artist_url: "google.com"
	}),
	typography: jsonb('typography').$type<TypographyTheme>().default({
		base_font: 'Inter', 
		header_title: {
			font: 'Arial',
			size: '2xl',
			weight: '700',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		header_description: {
			font: 'Arial',
			size: 'base',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		item_title: {
			font: 'Arial',
			size: 'lg',
			weight: '700',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		item_description: {
			font: 'Arial',
			size: 'base',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		item_date: {
			font: 'Arial',
			size: 'base',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		item_time: {
			font: 'Arial',
			size: 'base',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		body: {
			font: 'Arial',
			size: 'sm',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		},
		empty_day: {
			font: 'Arial',
			size: 'base',
			weight: '400',
			letter_spacing: '0px',
			capitalisation: 'none',
			decoration: 'none',
			style: 'normal',
		}
	}).notNull(),
	background: text('background').$type<"solid" | "gradient">().default('solid').notNull(),
	layout: jsonb('layout').$type<LayoutTheme>().default({
		items: "list",
		image_position: "right",
		gap: 4
	}).notNull(),
	item_theme: jsonb('item_theme').$type<ItemTheme>().default({
		border_style: "solid",
		border_radius: 0,
		shadow_style: "none",	
	}).notNull(),
})

export const schedule_settings = pgTable('schedule_settings', {
	...baseEntity,
	scheduleId: text('schedule_id')
		.notNull()
		.references(() => schedules.id, { onDelete: 'cascade' })
		.unique(),
	settings: jsonb('settings').$type<ScheduleSettings>().default({
		show_empty_days: true,
		empty_day_text: "",
		show_past_events: false,
		use_24_hour_time: false,
		show_social_links: false,
		first_day_of_week: "monday", 
		show_logo: true,
		show_schedule_description: false
	}).notNull(),
});

export const schedule_items = pgTable('schedule_items', {
	...baseEntity,
	scheduleId: text('schedule_id')
		.notNull()
		.references(() => schedules.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	description: text('description'),
	startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull(),
	endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }),
	externalUrl: text('external_url')
}
, 
(table) =>[ 
	index('items_schedule_id_idx').on(table.scheduleId),
	index('items_start_time_idx').on(table.startTime),
	check("check_start_end_time", sql`${table.endTime} IS NULL OR ${table.startTime} < ${table.endTime}`),
	]
);

// performance tables?
// export const schedule_public_view = pgTable('schedule_public_view', {
//   schedule_id: text('schedule_id').primaryKey(),
//   username: varchar('username', { length: 63 }).notNull(),
//   title: text('title').notNull(),
//   description: text('description'),
//   theme_preview: jsonb('theme_preview'), // minimal theme data for previews?
//   item_count: integer('item_count'),
//   last_updated: timestamp('last_updated', { withTimezone: true, mode: 'date' }),
// });

// relations
export const ScheduleRelations = relations(schedules, ({ many }) => {
	return {
		schedule_items: many(schedule_items),
		// schedule_settings: one(schedule_settings),
		// schedule_themes: one(schedule_themes),
		// user: one(users, {
		// 	fields: [schedules.userId],
		// 	references: [users.id]
		// }),
	}
})

export const ScheduleItemRelations = relations(schedule_items, ({ one }) => {
	return {
		schedule: one(schedules, { 
			fields: [schedule_items.scheduleId],
			references: [schedules.id]	
		})
	}
})

export const usersRelations = relations(users, ({ many }) => {
	return {
		authMethods: many(userAuthMethods)
	}
});

export const userAuthMethodsRelations = relations(userAuthMethods, ({ one }) => {
	return {
		user: one(users, {
			fields: [userAuthMethods.userId],
			references: [users.id]	
		})
	}
});

// export const ScheduleThemeRelations = relations(schedule_themes, ({ one }) => {
// 	return {
// 		schedule: one(schedules, { 
// 			fields: [schedule_themes.scheduleId],
// 			references: [schedules.id]	
// 		})
// 	}
// })

// export const ScheduleSettingsRelations = relations(schedule_settings, ({ one }) => {
// 	return {
// 		schedule: one(schedules, { 
// 			fields: [schedule_settings.scheduleId],
// 			references: [schedules.id]	
// 		})
// 	}
// })

// export const UserRelations = relations(users, ({ one, many }) => {
// 	return {
// 		user_settings: one(user_settings),
// 		schedules: one(schedules),
// 		sessions: many(sessions)
// 	}
// })

// export const UserSettingsRelations = relations(user_settings, ({ one }) => {
// 	return {
// 		user: one(users, { 
// 			fields: [user_settings.userId],
// 			references: [users.id]	
// 		})
// 	}
// })

export type Session = typeof sessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserAuthMethod = typeof userAuthMethods.$inferSelect;
export type NewUserAuthMethod = typeof userAuthMethods.$inferInsert;
export type Schedule = typeof schedules.$inferSelect;
export type ScheduleTheme = typeof schedule_themes.$inferSelect;
export type ScheduleSetting = typeof schedule_settings.$inferSelect;
export type ScheduleItem = typeof schedule_items.$inferSelect;