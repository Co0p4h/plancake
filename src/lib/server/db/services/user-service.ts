import * as table from '$lib/server/db/schema';
import { db } from "$lib/server/db";
import { eq, and, ne } from 'drizzle-orm';
import { generateId } from '../utils';
import { validateUsername } from '$lib/utils/validate';

export async function createUser(userData: table.NewUser) {
  const [user] = await db.insert(table.users).values(userData).returning();
  return user;
}

export async function deleteUser(userId: string) {
  await db.delete(table.users)
    .where(eq(table.users.id, userId));
}

export async function isUsernameAvailable(username: unknown, excludeUserId?: string): Promise<boolean> {
  if (!validateUsername(username)) {
    return false;
  }

  try {
    const baseCondition = eq(table.users.username, username);
    
    // if updating existing user, exclude their current record
    const whereCondition = excludeUserId 
      ? and(baseCondition, ne(table.users.id, excludeUserId))!
      : baseCondition;

    const existing = await db
      .select({ id: table.users.id })
      .from(table.users)
      .where(whereCondition)
      .limit(1);

    return existing.length === 0;
    
  } catch (error) {
    console.error('error checking username availability:', error);
    return false;
  }
}

export async function getUserByUsername(username: string): Promise<typeof table.users.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(table.users)
    .where(eq(table.users.username, username));
    
  return user || null;
}

export async function getUserByAuthProvider(authType: table.AuthProvider, providerId: string) {
  const result = await db
    .select()
    .from(table.users)
    .innerJoin(table.userAuthMethods, eq(table.users.id, table.userAuthMethods.userId))
    .where(
      and(
        eq(table.userAuthMethods.authType, authType),
        eq(table.userAuthMethods.providerId, providerId)
      )
    )
    .limit(1);

    console.log("getUserByAuthProvider result: ", result);
    

  return result[0]?.users || null;
}


export async function createUserWithAuth(
  userData: Omit<typeof table.users.$inferInsert, 'id'>,
  authMethod: Omit<typeof table.userAuthMethods.$inferInsert, 'id' | 'userId'>
) {
  return await db.transaction(async (tx) => {
    const userId = generateId();
    const [user] = await tx
      .insert(table.users)
      .values({
        ...userData,
        id: userId,
        setupComplete: authMethod.authType === 'password' ? true : false
      })
      .returning();

    const authMethodId = generateId();
    await tx.insert(table.userAuthMethods).values({
      ...authMethod,
      id: authMethodId,
      userId: user.id
    });

    // create user settings
    await tx.insert(table.user_settings).values({
      id: generateId(),
      userId: user.id,
      settings: {
        language: 'ja',
        timezone: 'Asia/Tokyo',
        social_links: [],
        discord_webhook: ''
      }
    });

    // create default schedule
    const scheduleId = generateId();
    await tx.insert(table.schedules).values({
      id: scheduleId,
      userId: user.id,
      title: 'My Schedule',
      description: 'my schedule description'
    });

    // create schedule theme
    await tx.insert(table.schedule_themes).values({
      id: generateId(),
      scheduleId: scheduleId
    });

    // Create schedule settings
    await tx.insert(table.schedule_settings).values({
      id: generateId(),
      scheduleId: scheduleId
    });

    // create some default schedule items
    const now = new Date();
    await tx.insert(table.schedule_items).values([
      {
        id: generateId(),
        scheduleId: scheduleId,
        title: 'my schedule item',
        description: 'my schedule item description',
        startTime: now,
        endTime: new Date(now.getTime() + 60 * 60 * 1000),
        externalUrl: 'https://example.com',
        createdAt: now,
        updatedAt: now
      },
      {
        id: generateId(),
        scheduleId: scheduleId,
        title: 'my schedule item 2',
        description: 'my schedule item 2 description',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), 
        endTime: new Date(now.getTime() + 25 * 60 * 60 * 1000), 
        externalUrl: 'https://youtube.com',
        createdAt: now,
        updatedAt: now
      },
      {
        id: generateId(),
        scheduleId: scheduleId,
        title: 'my schedule item 3',
        description: 'my schedule item 3 description',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 2 * 25 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now
      }
    ]);

    return user;
  });
}

export async function getUserSettingsByUserId(userId: string) {
  const [user_settings] = await db
    .select({ settings: table.user_settings.settings })
    .from(table.user_settings)
    .where(eq(table.user_settings.userId, userId))
    .limit(1);
  
  return user_settings.settings;
}

export async function updateUserSettingsByUserId(userId: string, settings: typeof table.user_settings.$inferSelect.settings) {
  const [updated_settings] = await db.update(table.user_settings).set({ settings: settings }).where(eq(table.user_settings.userId, userId)).returning();
  return updated_settings.settings;
}

export async function updateUsername(userId: string, newUsername: string) {
  try {
    const [updatedUser] = await db
      .update(table.users)
      .set({ 
        username: newUsername 
      })
      .where(eq(table.users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new Error('user_not_found');
    }

    return { updatedUser };

  } catch (error) {
    console.error('error updating username:', error);
    throw error;
  }
}

export async function markUserSetupComplete(userId: string) {
  const [updatedUser] = await db.update(table.users).set({ setupComplete: true }).where(eq(table.users.id, userId)).returning();
  return updatedUser;
}