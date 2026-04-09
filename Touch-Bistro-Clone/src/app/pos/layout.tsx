import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logout } from '../actions';

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const staffName = cookieStore.get('staffName')?.value;

  if (!staffName) {
    redirect('/');
  }

  return (
    <div className="flex-col h-full w-full">
      <header className="header-bar flex justify-between" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
        <div className="flex items-center" style={{ gap: '1rem' }}>
          <span style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--accent)' }}>Woodframe</span>
          <span style={{ color: '#888' }}>|</span>
          <span style={{ fontSize: '0.9rem' }}>Staff: {staffName}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
