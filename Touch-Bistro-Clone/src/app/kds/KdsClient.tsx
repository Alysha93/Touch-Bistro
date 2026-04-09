'use client'
import { useState, useEffect } from 'react';
import { advanceTicket, advanceItem } from './actions';
import { useRouter, useSearchParams } from 'next/navigation';

export default function KdsClient({ station, allStations, initialTickets }: any) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const handleStationChange = (id: number) => {
    router.push(`/kds?stationId=${id}`);
  };

  const getFormatTime = (createdAt: number) => {
    const minDiff = Math.floor((currentTime - createdAt) / 60000);
    return `${minDiff < 0 ? 0 : minDiff}m`;
  };

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: '#111827', color: 'white', fontFamily: 'sans-serif' }}>
       {/* Sidebar for multiple KDS routing simulation */}
       <div style={{ width: '80px', backgroundColor: '#1f2937', borderRight: '1px solid #374151', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2rem', fontSize: '0.8rem', color: '#9ca3af', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textTransform: 'uppercase' }}>Stations</div>
          {allStations.map((s: any) => (
             <button 
               key={s.id}
               onClick={() => handleStationChange(s.id)}
               style={{
                 width: '50px', height: '50px', borderRadius: '8px', 
                 backgroundColor: station.id === s.id ? 'var(--primary)' : '#374151',
                 color: 'white', border: 'none', marginBottom: '1rem', cursor: 'pointer',
                 fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}
             >
               {s.name.substring(0,4)}
             </button>
          ))}
       </div>

       {/* Main Canvas */}
       <div style={{ flex: 1, padding: '2rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #374151', paddingBottom: '1rem' }}>
             <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{station.name} Display <span style={{ color: '#10b981', fontSize: '1rem', marginLeft: '1rem', fontWeight: 'normal', backgroundColor: '#064e3b', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Online</span></h1>
             <div style={{ fontSize: '1.5rem', color: '#9ca3af', fontWeight: 'bold' }}>{new Date().toLocaleTimeString()}</div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
             {tickets.length === 0 && (
                <div style={{ color: '#6b7280', fontSize: '1.5rem', textAlign: 'center', width: '100%', marginTop: '4rem' }}>
                   No active tickets for {station.name}.
                </div>
             )}
             {tickets.map((ticket: any) => {
                const isLate = (currentTime - ticket.createdAt) > 600000; // 10 mins threshold
                
                return (
                  <div key={ticket.ticketId} style={{ 
                     width: '280px', flexShrink: 0,
                     backgroundColor: ticket.status === 'in_progress' ? '#374151' : 'white', 
                     color: ticket.status === 'in_progress' ? 'white' : 'black',
                     borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                     border: ticket.status === 'in_progress' ? '2px solid var(--primary)' : isLate ? '2px solid #ef4444' : 'none'
                  }}>
                     <div style={{ 
                        backgroundColor: isLate ? '#ef4444' : ticket.status === 'in_progress' ? 'var(--primary)' : '#e5e7eb',
                        color: isLate ? 'white' : ticket.status === 'in_progress' ? 'white' : 'black',
                        padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem'
                     }}>
                        <span>Tbl {ticket.tableName}</span>
                        <span>{getFormatTime(ticket.createdAt)}</span>
                     </div>
                     
                     <div style={{ padding: '0.5rem 1rem', backgroundColor: isLate ? '#fee2e2' : ticket.status === 'in_progress' ? '#4b5563' : '#f9fafb', color: isLate ? '#991b1b' : 'inherit', borderBottom: ticket.status === 'in_progress' ? '1px solid #6b7280' : '1px solid #e5e7eb', fontSize: '0.9rem' }}>
                        Order #{ticket.orderId}
                     </div>

                     <div style={{ padding: '1rem', minHeight: '200px' }}>
                        {ticket.items.map((item: any) => (
                           <div 
                             key={item.id} 
                             onClick={() => advanceItem(item.id)}
                             style={{ 
                               display: 'flex', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer',
                               textDecoration: item.prepStatus === 'ready' ? 'line-through' : 'none',
                               opacity: item.prepStatus === 'ready' ? 0.3 : 1,
                               fontSize: '1.2rem'
                             }}
                           >
                             <span style={{ fontWeight: 'bold' }}>{item.qty}</span>
                             <span>{item.name}</span>
                           </div>
                        ))}
                     </div>
                     
                     <button 
                       onClick={() => advanceTicket(ticket.ticketId, ticket.status)}
                       style={{ 
                         width: '100%', padding: '1rem', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                         backgroundColor: ticket.status === 'in_progress' ? '#10b981' : '#3b82f6',
                         color: 'white', textTransform: 'uppercase', letterSpacing: '1px'
                       }}>
                       {ticket.status === 'in_progress' ? 'BUMP ➡️' : 'START PREP 🕑'}
                     </button>
                  </div>
                )
             })}
          </div>
       </div>
    </div>
  )
}
