'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveTickets, advanceTicketStatus } from './actions';

export default function KDSClient({ initialTickets }: { initialTickets: any[] }) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [now, setNow] = useState(() => Date.now());

  // Timer for ticket durations
  useEffect(() => {
     const t = setInterval(() => setNow(Date.now()), 1000);
     return () => clearInterval(t);
  }, []);

  // Polling for live updates
  useEffect(() => {
     const p = setInterval(async () => {
         const latest = await getActiveTickets();
         // Only update if there's no optimistic local interaction happening blindly
         setTickets(latest);
     }, 3000);
     return () => clearInterval(p);
  }, []);

  const handleBump = async (id: number, currentStatus: string) => {
     // Optimistic local state update
     setTickets(prev => {
        if (currentStatus === 'new') {
           return prev.map(t => t.id === id ? { ...t, status: 'cooking' } : t);
        } else {
           // It's going to Ready -> Green -> Removed
           return prev.map(t => t.id === id ? { ...t, status: 'ready' } : t);
        }
     });
     
     await advanceTicketStatus(id, currentStatus);
     
     // Remove it slowly so they see the green flash!
     if (currentStatus === 'cooking') {
         setTimeout(() => {
            setTickets(prev => prev.filter(t => t.id !== id));
         }, 1000);
     }
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
          {tickets.filter(t => t.status !== 'ready').length === 0 && tickets.length === 0 ? (
             <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', fontSize: '1.5rem', marginTop: '10rem' }}>
                No active tickets right now. Good job!
             </div>
          ) : (
             tickets.map((t: any) => {
                const diffSecs = Math.floor((now - t.createdAt) / 1000);
                const isLate = diffSecs > 600; // 10 minutes

                // Color mappings based on strict enterprise flow
                let headerBg = t.status === 'new' ? '#374151' : (t.status === 'cooking' ? '#ea580c' : '#10b981'); // Gray -> Orange -> Green
                if (t.status === 'new' && isLate) headerBg = '#991b1b'; // Dark red if late and untouched
                
                let cardBg = t.status === 'ready' ? '#064e3b' : '#1f2937';

                return (
                   <div key={t.id} style={{ backgroundColor: cardBg, border: `3px solid ${headerBg}`, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', opacity: t.status === 'ready' ? 0.3 : 1 }}>
                      <div style={{ backgroundColor: headerBg, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.3s ease' }}>
                         <div>
                            <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Order #{t.orderId}</div>
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.status} - {t.stationName}</div>
                         </div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            {getTimerString(t.createdAt)}
                         </div>
                      </div>
                      
                      <div style={{ padding: '1.5rem', flex: 1 }}>
                         {t.items.map((i: any) => (
                           <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.2rem', borderBottom: '1px dashed #374151', paddingBottom: '0.5rem' }}>
                              <span><span style={{ color: '#10b981', fontWeight: 'bold', marginRight: '0.5rem' }}>{i.qty}</span> {i.name}</span>
                           </div>
                         ))}
                      </div>

                      <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                         <button 
                           onClick={() => handleBump(t.id, t.status)}
                           style={{ width: '100%', padding: '1rem', fontSize: '1.25rem', fontWeight: 'bold', backgroundColor: t.status === 'new' ? '#2563eb' : '#10b981', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none', transition: 'all 0.2s ease' }}
                         >
                           {t.status === 'new' ? 'START COOKING' : 'MARK READY (BUMP)'}
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
