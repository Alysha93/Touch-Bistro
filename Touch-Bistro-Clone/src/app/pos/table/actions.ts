'use server'
import { db } from '@/db';
import { orders, orderItems, tables, menuItems, kdsTickets } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitOrder(tableId: number, staffId: number, items: Array<{menuItemId: number, name: string, seatNumber: number, qty: number, unitPrice: number}>) {
  let order = db.select().from(orders).where(and(eq(orders.tableId, tableId), eq(orders.status, 'open'))).get();
  
  if (!order) {
     order = db.insert(orders).values({ tableId, staffId, status: 'open', total: 0 }).returning().get();
     db.update(tables).set({status: 'seated'}).where(eq(tables.id, tableId)).run();
  }

  const dataToInsert = items.map(item => ({
    orderId: order!.id,
    menuItemId: item.menuItemId,
    name: item.name,
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

export async function initiateCFDPayment(orderId: number) {
  db.update(orders).set({ status: 'awaiting_payment' }).where(eq(orders.id, orderId)).run();
  revalidatePath('/pos/table');
}

export async function completeCFDPayment(orderId: number, tipAmount: number) {
  db.update(orders).set({ status: 'paid', tipAmount }).where(eq(orders.id, orderId)).run();
  revalidatePath('/pos/table');
}

export async function getActiveCFDOrder() {
  const order = db.select().from(orders).where(eq(orders.status, 'awaiting_payment')).get();
  if (!order) return null;
  const items = db.select({
      qty: orderItems.qty,
      unitPrice: orderItems.unitPrice,
      name: menuItems.name
    })
    .from(orderItems)
    .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(eq(orderItems.orderId, order.id)).all();
    
  return { order, items };
}

export async function checkOrderStatus(orderId: number) {
  const o = db.select().from(orders).where(eq(orders.id, orderId)).get();
  return o?.status;
}

export async function completeLocalPayment(orderId: number, tipAmount: number, paymentMethod: string) {
  const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (order) {
    db.update(orders).set({ status: 'paid', tipAmount: tipAmount }).where(eq(orders.id, orderId)).run();
    db.update(tables).set({ status: 'paid' }).where(eq(tables.id, order.tableId!)).run();
    revalidatePath(`/pos/table`);
    revalidatePath(`/pos/floorplan`);
  }
}

export async function fastCheckout(tableId: number, staffId: number, items: Array<any>, tipAmount: number, paymentMethod: string) {
  // Submit the order items internally
  const res = await submitOrder(tableId, staffId, items);
  // Complete the payment
  await completeLocalPayment(res.orderId, tipAmount, paymentMethod);
  return res;
}

export async function deleteOrderItem(itemId: number, tableId: number) {
  db.delete(orderItems).where(eq(orderItems.id, itemId)).run();
  
  // also delete associated KDS tickets? In a real system, you'd send a void ticket.
  // For simplicity, we just delete or ignore it.
  
  revalidatePath(`/pos/table/${tableId}`);
  return { success: true };
}
