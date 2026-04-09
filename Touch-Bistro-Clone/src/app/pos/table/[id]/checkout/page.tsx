import { db } from '@/db';
import { orders, orderItems, tables, menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({ params, searchParams }: any) {
  const { id } = await params;
  const tableId = parseInt(id);
  const table = db.select().from(tables).where(eq(tables.id, tableId)).get();
  
  const { orderId } = await searchParams;
  
  if (!orderId) {
    return <div>No order ID provided.</div>;
  }
  
  const order = db.select().from(orders).where(eq(orders.id, parseInt(orderId))).get();
  const items = db.select({
    id: orderItems.id,
    qty: orderItems.qty,
    unitPrice: orderItems.unitPrice,
    name: menuItems.name
  })
    .from(orderItems)
    .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
    .where(eq(orderItems.orderId, parseInt(orderId)))
    .all();
  
  return <CheckoutClient table={table} order={order} items={items} />;
}
