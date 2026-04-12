import { db } from '@/db';
import { tables, menuCategories, menuItems, menuModifiers, orders, orderItems, staff } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import OrderInterface from './OrderInterface';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function TablePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tableId = parseInt(id);
  const table = db.select().from(tables).where(eq(tables.id, tableId)).get();
  const categories = db.select().from(menuCategories).all();
  const items = db.select().from(menuItems).all();
  const modifiers = db.select().from(menuModifiers).all();
  
  const cookieStore = await cookies();
  const staffIdStr = cookieStore.get('staffId')?.value || '1';
  const staffId = parseInt(staffIdStr);
  const staffMember = db.select().from(staff).where(eq(staff.id, staffId)).get();
  
  // Loading Persistent Table State
  const activeOrder = db.select().from(orders).where(and(eq(orders.tableId, tableId), eq(orders.status, 'open'))).get();
  let existingItems: any[] = [];
  if (activeOrder) {
    existingItems = db.select().from(orderItems).where(eq(orderItems.orderId, activeOrder.id)).all();
  }
  
  if (!table) return <div style={{ padding: '2rem' }}>Table not found</div>;

  return (
    <OrderInterface 
      table={table} 
      categories={categories} 
      menuItems={items} 
      modifiers={modifiers}
      staffId={staffId}
      staffRole={staffMember?.role || 'server'}
      initialOrderItems={existingItems}
    />
  );
}
