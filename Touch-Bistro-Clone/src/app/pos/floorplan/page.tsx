import { db } from '@/db';
import { tables, orders, kdsTickets } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FloorplanPage() {
  const allTables = db.select().from(tables).all();
  
  // Fetch active tickets to calculate delays
  const activeTickets = db.select({
    tableId: orders.tableId,
    createdAt: kdsTickets.createdAt,
    status: kdsTickets.status
  })
  .from(kdsTickets)
  .innerJoin(orders, eq(kdsTickets.orderId, orders.id))
  .where(and(ne(kdsTickets.status, 'ready'), ne(orders.status, 'paid')))
  .all();

  const now = Date.now();
  const DELAY_THRESHOLD = 15 * 60 * 1000; // 15 minutes

  return (
    <div className="flex flex-col h-full animate-fade-in" style={{ padding: '2.5rem', overflowY: 'auto' }}>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Main Dining Room</h1>
          <p style={{ color: 'var(--text-muted)' }}>{allTables.length} Tables • {allTables.filter(t => t.status === 'open').length} Available</p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Seated</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--danger)' }}></div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Paid</span>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2.5rem' }}>
        {allTables.map(table => {
          const isRegister = table.name.includes('Register');
          const tableTicket = activeTickets.find(t => t.tableId === table.id);
          const isLate = tableTicket && (now - tableTicket.createdAt) > DELAY_THRESHOLD;

          return (
            <Link 
              key={table.id}
              href={`/pos/table/${table.id}`}
              className={`pos-card flex flex-col items-center justify-center transition-all ${isLate ? 'animate-pulse-slow' : ''}`}
              style={{
                height: '180px', 
                borderRadius: isRegister ? 'var(--radius-lg)' : 'var(--radius-full)', 
                background: isLate ? 'rgba(251, 191, 36, 0.2)' : (table.status === 'open' ? 'rgba(255, 255, 255, 0.1)' : (table.status === 'seated' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(248, 113, 113, 0.2)')),
                borderColor: isLate ? '#fbbf24' : (table.status === 'open' ? 'rgba(255, 255, 255, 0.2)' : (table.status === 'seated' ? 'white' : '#fca5a5')),
                borderWidth: (table.status === 'open' && !isLate) ? '1px' : '2.5px',
                textDecoration: 'none',
                boxShadow: isLate ? '0 0 30px rgba(251, 191, 36, 0.3)' : '0 10px 20px -10px rgba(0,0,0,0.2)'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: isLate ? '#fcd34d' : 'var(--text-muted)', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isRegister ? 'Point of Sale' : 'Table'}
              </span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>
                {isRegister ? '01' : table.name}
              </span>
              <div className={`badge ${isLate ? 'badge-warning' : (table.status === 'open' ? 'badge-success' : (table.status === 'seated' ? 'badge-warning' : 'badge-danger'))}`} style={{ marginTop: '1.25rem' }}>
                {isLate ? 'URGENT' : table.status}
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
