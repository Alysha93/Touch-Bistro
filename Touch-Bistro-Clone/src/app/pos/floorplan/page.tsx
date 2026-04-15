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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '2rem' }}>
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
                height: '160px', 
                borderRadius: isRegister ? 'var(--radius-lg)' : 'var(--radius-full)', 
                backgroundColor: isLate ? '#FFFBEB' : (table.status === 'open' ? 'white' : (table.status === 'seated' ? 'var(--primary-light)' : '#FEF2F2')),
                borderColor: isLate ? '#F59E0B' : (table.status === 'open' ? 'var(--border-color)' : (table.status === 'seated' ? 'var(--primary)' : 'var(--danger)')),
                borderWidth: (table.status === 'open' && !isLate) ? '1px' : '2px',
                textDecoration: 'none',
                boxShadow: isLate ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'var(--shadow-sm)'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: isLate ? '#B45309' : 'var(--text-light)', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                {isRegister ? 'Point of Sale' : 'Table'}
              </span>
              <span style={{ fontSize: '1.75rem', fontWeight: '900', color: isLate ? '#92400E' : 'var(--text-main)' }}>
                {isRegister ? '01' : table.name}
              </span>
              <div className={`badge ${isLate ? 'badge-warning' : (table.status === 'open' ? 'badge-success' : (table.status === 'seated' ? 'badge-warning' : 'badge-danger'))}`} style={{ marginTop: '1rem', backgroundColor: isLate ? '#F59E0B' : undefined }}>
                {isLate ? 'URGENT' : table.status}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
