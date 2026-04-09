'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveTickets, bumpTicket } from './actions';

export default function KDSClient({ initialTickets }: { initialTickets: any[] }) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [now, setNow] = useState(Date.now());

  // Timer for ticket durations
  useEffect(() => {
     const t = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(t);
  }, []);

  // Polling for live updates
  useEffect(() => {
     const p = setInterval(async () => {
         const latest = await getActiveTickets();
         setTickets(latest);
     }, 3000);
     return () => clearInterval(p);
  }, []);

  const handleBump = async (id: number) => {
     // Optimistic update
     setTickets(prev => prev.filter(t => t.id !== id));
     await bumpTicket(id);
  };

  const getTimerString = (msString: number) => {
     const diff = Math.floor((now - msString) / 1000);
     const minutes = Math.floor(diff / 60);
     const seconds = diff % 60;
     return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ backgroundColor: '#111827', width: '100vw', height: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
       {/* Global Header */}
       <div style={{ padding: '1rem 2rem', backgroundColor: '#1f2937', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
             <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TouchBistro KDS</h1>
             <span style={{ color: '#9ca3af' }}>{new Date().toLocaleTimeString()}</span>
          </div>
          <button onClick={() => router.push('/pos/settings')} style={{ background: 'transparent', border: '1px solid #4b5563', padding: '0.5rem 1rem', color: 'white', cursor: 'pointer', borderRadius: '4px' }}>
            Exit to Settings
          </button>
       </div>

       {/* Tickets Grid */}
       <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', overflowY: 'auto', flex: 1, alignItems: 'start' }}>
          {tickets.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', fontSize: '1.5rem', marginTop: '10rem' }}>
                No active tickets right now. Good job!
             </div>
          ) : (
             tickets.map((t: any) => {
                const diffSecs = Math.floor((now - t.createdAt) / 1000);
                const isLate = diffSecs > 600; // 10 minutes

                return (
                   <div key={t.id} style={{ backgroundColor: '#1f2937', border: `2px solid ${isLate ? '#ef4444' : '#374151'}`, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ backgroundColor: isLate ? '#7f1d1d' : '#374151', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Order #{t.orderId}</div>
                            <div style={{ color: '#d1d5db', fontSize: '0.9rem' }}>{t.stationName}</div>
                         </div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isLate ? '#fca5a5' : '#9ca3af' }}>
                            {getTimerString(t.createdAt)}
                         </div>
                      </div>
                      
                      <div style={{ padding: '1rem', flex: 1 }}>
                         {t.items.map((i: any) => (
                           <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.1rem', borderBottom: '1px dashed #374151', paddingBottom: '0.5rem' }}>
                              <span><span style={{ color: '#10b981', fontWeight: 'bold', marginRight: '0.5rem' }}>{i.qty}</span> {i.name}</span>
                           </div>
                         ))}
                      </div>

                      <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                         <button 
                           onClick={() => handleBump(t.id)}
                           style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', fontWeight: 'bold', backgroundColor: '#2563eb', color: 'white', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
                         >
                           BUMP
                         </button>
                      </div>
                   </div>
                );
             })
          )}
       </div>
    </div>
  );
}
