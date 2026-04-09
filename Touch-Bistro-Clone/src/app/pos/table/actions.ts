'use server'
import { db } from '@/db';
import { orders, orderItems, tables, menuItems, kdsTickets } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitOrder(tableId: number, staffId: number, items: Array<{menuItemId: number, seatNumber: number, qty: number, unitPrice: number}>) {
  let order = db.select().from(orders).where(and(eq(orders.tableId, tableId), eq(orders.status, 'open'))).get();
  
  if (!order) {
     order = db.insert(orders).values({ tableId, staffId, status: 'open', total: 0 }).returning().get();
     db.update(tables).set({status: 'seated'}).where(eq(tables.id, tableId)).run();
  }

  const dataToInsert = items.map(item => ({
    orderId: order!.id,
    menuItemId: item.menuItemId,
    seatNumber: item.seatNumber,
    qty: item.qty,
    unitPrice: item.unitPrice,
  }));
  
  if (dataToInsert.length > 0) {
    db.insert(orderItems).values(dataToInsert).run();

    // Map to KDS tickets
    for (const dataItem of dataToInsert) {
      const menuItem = db.select().from(menuItems).where(eq(menuItems.id, dataItem.menuItemId)).get();
      if (menuItem && menuItem.prepStationId) { // Only route items that have a station (ignores drinks)
        let ticket = db.select().from(kdsTickets)
          .where(and(
             eq(kdsTickets.orderId, order!.id), 
             eq(kdsTickets.stationId, menuItem.prepStationId),
             eq(kdsTickets.status, 'new') // Attach to current active ticket
          )).get();
        
        if (!ticket) {
          db.insert(kdsTickets).values({
            orderId: order!.id,
            stationId: menuItem.prepStationId,
            status: 'new',
            createdAt: Date.now()
          }).run();
        }
      }
    }
  }
  
  revalidatePath(`/pos/table/${tableId}`);
  return { success: true, orderId: order!.id };
}
