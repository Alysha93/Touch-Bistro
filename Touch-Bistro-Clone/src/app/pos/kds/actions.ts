'use server'

import { db } from '@/db';
import { kdsTickets, orderItems, menuItems, orders, prepStations } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getActiveTickets() {
  const tickets = db.select({
      id: kdsTickets.id,
      orderId: kdsTickets.orderId,
      stationId: kdsTickets.stationId,
      status: kdsTickets.status,
      createdAt: kdsTickets.createdAt,
      stationName: prepStations.name
    })
    .from(kdsTickets)
    .innerJoin(prepStations, eq(kdsTickets.stationId, prepStations.id))
    .where(ne(kdsTickets.status, 'ready'))
    .all();

  // For each ticket, fetch corresponding items
  const populatedTickets = tickets.map(ticket => {
     let items = db.select({
        id: orderItems.id,
        qty: orderItems.qty,
        name: menuItems.name,
        seatNumber: orderItems.seatNumber
     })
     .from(orderItems)
     .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
     .where(
        and(
           eq(orderItems.orderId, ticket.orderId), 
           eq(menuItems.prepStationId, ticket.stationId)
        )
     ).all();
     
     return { ...ticket, items };
  });

  return populatedTickets;
}

export async function bumpTicket(ticketId: number) {
  db.update(kdsTickets)
    .set({ status: 'ready', completedAt: Date.now() })
    .where(eq(kdsTickets.id, ticketId))
    .run();
    
  revalidatePath('/pos/kds');
  return { success: true };
}
