'use server'
import { db } from '@/db';
import { orders, orderItems, menuItems, kdsTickets, loyaltyAccounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitOnlineOrder(items: Array<{menuItemId: number, qty: number, unitPrice: number}>, phone: string) {
  let loy = null;
  if(phone) {
     loy = db.select().from(loyaltyAccounts).where(eq(loyaltyAccounts.phone, phone)).get();
  }
  
  const order = db.insert(orders).values({ 
    status: 'paid', // Pre-paid online
    total: 0,
    source: 'web'
  }).returning().get();

  const dataToInsert = items.map(item => ({
    orderId: order.id,
    menuItemId: item.menuItemId,
    seatNumber: 1,
    qty: item.qty,
    unitPrice: item.unitPrice,
  }));
  
  db.insert(orderItems).values(dataToInsert).run();

  for (const dataItem of dataToInsert) {
    const menuItem = db.select().from(menuItems).where(eq(menuItems.id, dataItem.menuItemId)).get();
    if (menuItem && menuItem.prepStationId) {
      const ticket = db.select().from(kdsTickets)
        .where(and(
           eq(kdsTickets.orderId, order.id), 
           eq(kdsTickets.stationId, menuItem.prepStationId),
           eq(kdsTickets.status, 'new')
        )).get();
      
      if (!ticket) {
        db.insert(kdsTickets).values({
          orderId: order.id,
          stationId: menuItem.prepStationId,
          status: 'new',
          createdAt: Date.now()
        }).run();
      }
    }
  }
  
  revalidatePath('/pos');
  revalidatePath('/kds');
  
  return { success: true, orderId: order.id, loyalty: loy ? loy.name : null };
}

export async function checkLoyalty(phone: string) {
  const loy = db.select().from(loyaltyAccounts).where(eq(loyaltyAccounts.phone, phone)).get();
  return loy ? { name: loy.name, points: loy.points } : null;
}
