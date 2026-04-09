'use server'

import { db } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleMenuItemAvailability(id: number, currentStatus: boolean) {
  db.update(menuItems)
    .set({ isAvailable: !currentStatus })
    .where(eq(menuItems.id, id))
    .run();
  
  revalidatePath('/pos/admin/menu');
  revalidatePath('/pos/table/[id]');
  revalidatePath('/online');
}
