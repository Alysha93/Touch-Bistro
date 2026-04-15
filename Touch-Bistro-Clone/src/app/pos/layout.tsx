import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '../actions';
import { db } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import SyncMonitor from '@/components/SyncMonitor';

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const staffName = cookieStore.get('staffName')?.value;

  if (!staffName) {
    redirect('/');
  }

  const webOrders = db.select().from(orders).where(eq(orders.source, 'web')).all().length;

  return (
    <div className="flex flex-col h-full w-full">
      <header className="header-bar flex justify-between">
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🍽</span>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>TouchBistro</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.5rem' }}>|</span>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Staff: {staffName}</span>
          <div style={{ marginLeft: '1rem' }}>
            <SyncMonitor />
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '1rem' }}>
          {webOrders > 0 && (
            <div className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <span>📦</span> {webOrders} Online
            </div>
          )}
          <Link href="/pos/settings" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>⚙️ Settings</Link>
          <form action={logout}>
            <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Logout</button>
          </form>
        </div>
      </header>
      <main className="flex-1" style={{ overflow: 'hidden' }}>

        {children}
      </main>
    </div>
  );
}
