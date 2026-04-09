'use server'
import { db } from '@/db';
import { orders, orderItems, tables } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitOrder(tableId: number, staffId: number, items: Array<{menuItemId: number, seatNumber: number, qty: number, unitPrice: number}>) {
  // Check if open order exists
  let order = db.select().from(orders).where(and(eq(orders.tableId, tableId), eq(orders.status, 'open'))).get();
  
  if (!order) {
     order = db.insert(orders).values({ tableId, staffId, status: 'open', total: 0 }).returning().get();
     // update table status
     db.update(tables).set({status: 'seated'}).where(eq(tables.id, tableId)).run();
  }

  // Insert items
  const dataToInsert = items.map(item => ({
    orderId: order!.id,
    menuItemId: item.menuItemId,
    seatNumber: item.seatNumber,
    qty: item.qty,
    unitPrice: item.unitPrice,
  }));
  
  if (dataToInsert.length > 0) {
    db.insert(orderItems).values(dataToInsert).run();
  }
  
  revalidatePath(`/pos/table/${tableId}`);
  return { success: true, orderId: order.id };
}
