import { db } from '@/db';
import { tables } from '@/db/schema';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FloorplanPage() {
  const allTables = db.select().from(tables).all();

  return (
    <div className="flex flex-col h-full" style={{ padding: '2rem', overflowY: 'auto' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'bold' }}>Main Floorplan</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {allTables.map(table => (
          <Link 
            key={table.id}
            href={`/pos/table/${table.id}`}
            style={{
              width: '140px', height: '140px', 
              borderRadius: table.name === 'Cash Register' ? 'var(--radius-md)' : '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: table.status === 'reserved' ? '#eab308' : (table.status === 'open' ? 'var(--bg-panel)' : 'var(--primary)'),
              color: table.status === 'open' ? 'var(--text-main)' : 'var(--text-inverse)',
              border: '2px solid',
              borderColor: table.status === 'reserved' ? '#ca8a04' : (table.status === 'open' ? 'var(--border-color)' : 'var(--primary)'),
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
