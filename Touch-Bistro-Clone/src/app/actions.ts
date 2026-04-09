'use server'

import { db } from '@/db';
import { staff, timeclocks } from '@/db/schema';
import { eq, desc, and, isNull } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginWithPin(pin: string) {
  const user = db.select().from(staff).where(eq(staff.pin, pin)).get();
  if (user) {
    const cookieStore = await cookies();
    cookieStore.set('staffId', user.id.toString());
    cookieStore.set('staffName', user.name);
    redirect('/pos/floorplan');
  } else {
    return { error: 'Invalid passcode' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('staffId');
  cookieStore.delete('staffName');
  redirect('/');
}
export async function clockInOrOut(pin: string) {
  const user = db.select().from(staff).where(eq(staff.pin, pin)).get();
  if (!user) {
    return { error: 'Invalid passcode' };
  }

  // Check if currently clocked in
  const activeSession = db.select().from(timeclocks)
    .where(and(eq(timeclocks.staffId, user.id), isNull(timeclocks.clockOut)))
    .orderBy(desc(timeclocks.clockIn))
    .get();

  const now = Math.floor(Date.now() / 1000);

  if (activeSession) {
    // Clock Out
    db.update(timeclocks)
      .set({ clockOut: now })
      .where(eq(timeclocks.id, activeSession.id))
      .run();
    return { success: `Clocked out ${user.name} at ${new Date().toLocaleTimeString()}` };
  } else {
    // Clock In
    db.insert(timeclocks).values({
      staffId: user.id,
      clockIn: now
    }).run();
    return { success: `Clocked in ${user.name} at ${new Date().toLocaleTimeString()}` };
  }
}
