'use server'
import { db } from '@/db';
import { kdsTickets, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function advanceTicket(ticketId: number, currentStatus: string) {
  const newStatus = currentStatus === 'new' ? 'in_progress' : 'ready';
  
  db.update(kdsTickets)
    .set({ 
      status: newStatus,
      completedAt: newStatus === 'ready' ? Date.now() : null
    })
    .where(eq(kdsTickets.id, ticketId))
    .run();
    
  revalidatePath('/kds');
}

export async function advanceItem(itemId: number) {
  db.update(orderItems)
    .set({ prepStatus: 'ready' })
    .where(eq(orderItems.id, itemId))
    .run();
    
  revalidatePath('/kds');
}
