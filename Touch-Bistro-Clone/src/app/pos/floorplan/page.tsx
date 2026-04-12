import { db } from '@/db';
import { tables } from '@/db/schema';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FloorplanPage() {
  const allTables = db.select().from(tables).all();

  return (
    <div className="flex flex-col h-full" style={{ padding: '2rem', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'bold', color: 'var(--text-light)' }}>Main Floorplan</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {allTables.map(table => (
          <Link 
            key={table.id}
            href={`/pos/table/${table.id}`}
            style={{
              width: '140px', height: '140px', 
              borderRadius: table.name === 'Cash Register' ? 'var(--radius-md)' : '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: table.status === 'open' ? 'var(--success)' : (table.status === 'seated' ? '#F59E0B' : 'var(--danger)'),
              color: 'var(--text-inverse)',
              border: '2px solid',
              borderColor: table.status === 'open' ? '#059669' : (table.status === 'seated' ? '#D97706' : '#B91C1C'),
              fontSize: '1.25rem', fontWeight: 600,
              boxShadow: 'var(--shadow-md)',
              textDecoration: 'none',
              transition: 'transform 0.1s'
            }}
          >
            {table.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
