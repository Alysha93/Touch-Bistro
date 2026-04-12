import { db } from '@/db';
import { tables, menuCategories, menuItems, menuModifiers } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  const staffId = cookieStore.get('staffId')?.value || '1';
  
  if (!table) return <div style={{ padding: '2rem' }}>Table not found</div>;

  return (
    <OrderInterface 
      table={table} 
      categories={categories} 
      menuItems={items} 
      modifiers={modifiers}
      staffId={parseInt(staffId)} 
    />
  );
}
