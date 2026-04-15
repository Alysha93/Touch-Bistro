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
    <div className="flex-col h-full w-full">
      <header className="header-bar flex justify-between" style={{ backgroundColor: 'var(--bg-dark)', color: 'white' }}>
        <div className="flex items-center" style={{ gap: '0.75rem' }}>
          <span style={{ color: 'white', fontSize: '1.4rem' }}>🍽</span>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>TouchBistro</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.5rem' }}>|</span>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Staff: {staffName}</span>
          <div style={{ marginLeft: '1rem' }}>
            <SyncMonitor />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {webOrders > 0 && (
            <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.2rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
               <span>📦</span> {webOrders} Online
            </div>
          )}
          <Link href="/pos/settings" style={{ color: 'white', textDecoration: 'underline', fontSize: '0.9rem' }}>⚙️ Settings</Link>
          <form action={logout}>
            <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: '#333', color: 'white' }}>Logout</button>
          </form>
        </div>
      </header>
      <main className="flex-1" style={{ overflow: 'hidden', height: 'calc(100vh - 60px)' }}>
        {children}
      </main>
    </div>
  );
}
