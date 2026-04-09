import { db } from '@/db';
import { menuItems, menuCategories } from '@/db/schema';
import OnlineClient from './OnlineClient';

export const dynamic = 'force-dynamic';

export default async function OnlineOrderingPage() {
  const categories = db.select().from(menuCategories).all();
  const items = db.select().from(menuItems).all();
  
  return <OnlineClient categories={categories} items={items} />;
}
