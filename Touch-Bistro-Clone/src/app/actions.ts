'use server'

import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
