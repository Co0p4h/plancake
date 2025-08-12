import * as table from '$lib/server/db/schema';
import { db } from "$lib/server/db";
import { eq, and } from 'drizzle-orm';
import { generateId } from './utils';

export async function createUser(userData: table.NewUser) {
  const [user] = await db.insert(table.users).values(userData).returning();
  return user;
}

export async function getUserByUsername(username: string): Promise<typeof table.users.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(table.users)
    .where(eq(table.users.username, username));
    
  return user || null;
}

export async function getUserByAuthProvider(authType: string, providerId: string) {
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
        id: userId
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
        social_links: [
          {
            platform: 'twitter',
            url: 'https://twitter.com/coopa_2'
          },
        ],
        discord_webhook: 'https://discord.com/api/webhooks/1353543991995404449/FhP_5GBqnsfRxDTsW5mP55oH1KHGjodxht0yVXlUxp7KHG8e2SMdsQYPWfzmJ0W7h7st'
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