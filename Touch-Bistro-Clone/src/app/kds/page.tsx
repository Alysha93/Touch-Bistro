import { db } from '@/db';
import { kdsTickets, prepStations, orders, tables, orderItems, menuItems } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import KdsClient from './KdsClient';

export const dynamic = 'force-dynamic';

export default async function KDSPage({ searchParams }: any) {
  const { stationId } = await searchParams;
  const id = stationId ? parseInt(stationId) : 1;
  
  const station = db.select().from(prepStations).where(eq(prepStations.id, id)).get();
  const allStations = db.select().from(prepStations).all();
  
  if (!station) {
    return <div>Station not found</div>;
  }

  const tickets = db.select({
    ticketId: kdsTickets.id,
    orderId: kdsTickets.orderId,
    status: kdsTickets.status,
    createdAt: kdsTickets.createdAt,
    tableName: tables.name
  })
    .from(kdsTickets)
    .innerJoin(orders, eq(kdsTickets.orderId, orders.id))
    .innerJoin(tables, eq(orders.tableId, tables.id))
    .where(and(eq(kdsTickets.stationId, id), ne(kdsTickets.status, 'ready')))
    .orderBy(kdsTickets.createdAt)
    .all();

  const ticketsWithItems = tickets.map(ticket => {
    const items = db.select({
      id: orderItems.id,
      name: menuItems.name,
      qty: orderItems.qty,
      prepStatus: orderItems.prepStatus
    })
      .from(orderItems)
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(and(
        eq(orderItems.orderId, ticket.orderId), 
        eq(menuItems.prepStationId, id)
      ))
      .all();
      
    return { ...ticket, items };
  });

  return <KdsClient station={station} allStations={allStations} initialTickets={ticketsWithItems} />;
}
