import * as table from '$lib/server/db/schema';
import { db } from "$lib/server/db";
import { eq } from 'drizzle-orm';

export async function getUserByUsername(username: string): Promise<typeof table.users.$inferSelect | null> {
  const [user] = await db
    .select()
    .from(table.users)
    .where(eq(table.users.username, username));
    
  return user || null;
}