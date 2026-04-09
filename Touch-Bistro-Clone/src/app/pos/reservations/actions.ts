'use server'

import { db } from '@/db';
import { reservations, tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getReservations() {
  return db.select({
    reservation: reservations,
    tableName: tables.name
  })
  .from(reservations)
  .leftJoin(tables, eq(reservations.tableId, tables.id))
  .all();
}

export async function createReservation(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const partySize = parseInt(formData.get('partySize') as string, 10);
  const time = Math.floor(Date.now() / 1000); // For now just assign the current time

  db.insert(reservations).values({
    name,
    phone,
    partySize,
    time
  }).run();

  revalidatePath('/pos/reservations');
}

export async function assignTable(reservationId: number, tableId: number | null) {
  db.update(reservations)
    .set({ tableId })
    .where(eq(reservations.id, reservationId))
    .run();
  
  if (tableId) {
    db.update(tables)
      .set({ status: 'reserved' })
      .where(eq(tables.id, tableId))
      .run();
  }

  revalidatePath('/pos/reservations');
  revalidatePath('/pos/floorplan');
}

export async function notifyGuest(reservationId: number, phone: string, name: string) {
  // Simulate Twilio API call
  console.log(`\n[TWILIO SIMULATION] 📱 SMS SENT TO ${phone}:`);
  console.log(`"Hi ${name}, your table at TouchBistro is ready! Please see the host."\n`);

  db.update(reservations)
    .set({ notified: true })
    .where(eq(reservations.id, reservationId))
    .run();
    
  revalidatePath('/pos/reservations');
}

export async function completeReservation(reservationId: number, tableId: number | null) {
  db.delete(reservations).where(eq(reservations.id, reservationId)).run();
  
  if (tableId) {
     db.update(tables)
      .set({ status: 'seated' })
      .where(eq(tables.id, tableId))
      .run();
  }
  revalidatePath('/pos/reservations');
  revalidatePath('/pos/floorplan');
}
