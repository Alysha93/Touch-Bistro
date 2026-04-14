'use client'
import { useState, useEffect } from 'react';
import { advanceTicket, advanceItem } from './actions';
import { useRouter } from 'next/navigation';

export default function KdsClient({ station, allStations, initialTickets }: any) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex h-screen w-full animate-fade-in" style={{ backgroundColor: '#0F172A', color: 'white' }}>
       {/* Sidebar for multiple KDS routing */}
       <div style={{ width: '100px', backgroundColor: '#1E293B', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
          <div style={{ fontWeight: '900', marginBottom: '2.5rem', fontSize: '0.75rem', color: '#94A3B8', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textTransform: 'uppercase', letterSpacing: '2px' }}>Stations</div>
          {allStations.map((s: any) => (
             <button 
               key={s.id}
               onClick={() => handleStationChange(s.id)}
               style={{
                 width: '60px', height: '60px', borderRadius: '16px', 
                 backgroundColor: station.id === s.id ? 'var(--primary)' : '#334155',
                 color: 'white', border: 'none', marginBottom: '1.5rem', cursor: 'pointer',
                 fontSize: '0.85rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 boxShadow: station.id === s.id ? '0 0 20px var(--primary)' : 'none',
                 transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
             >
               {s.name.substring(0,4)}
             </button>
          ))}
       </div>

       {/* Main Kitchen Canvas */}
       <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
             <div>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-1px' }}>{station.name} Display</h1>
                <p style={{ color: '#94A3B8', fontWeight: '700' }}>Active Prep Queue • {tickets.length} Orders</p>
             </div>
             <div className="flex flex-col items-end">
                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white' }}>
                  {mounted && new Date(currentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <span className="badge badge-success" style={{ padding: '0.2rem 1rem' }}>Live Connection</span>
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
             {tickets.map((ticket: any) => {
                const waitMin = Math.floor((currentTime - ticket.createdAt) / 60000);
                const isLate = waitMin > 10;
                const isUrgent = waitMin > 20;
                
                const headerColor = isUrgent ? 'var(--danger)' : (isLate ? 'var(--warning)' : (ticket.status === 'in_progress' ? 'var(--primary)' : '#475569'));
                
                return (
                  <div key={ticket.ticketId} className="animate-slide-up" style={{ 
                     backgroundColor: 'white', 
                     color: 'var(--text-main)',
                     borderRadius: '20px', overflow: 'hidden', 
                     boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                     display: 'flex', flexDirection: 'column'
                  }}>
                     <div style={{ 
                        backgroundColor: headerColor,
                        color: 'white',
                        padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                     }}>
                        <div className="flex flex-col">
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', opacity: 0.8, textTransform: 'uppercase' }}>Table</span>
                          <span style={{ fontSize: '1.75rem', fontWeight: '900' }}>{ticket.tableName}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span style={{ fontSize: '0.75rem', fontWeight: '900', opacity: 0.8, textTransform: 'uppercase' }}>Wait</span>
                          <span style={{ fontSize: '1.75rem', fontWeight: '900' }}>{getFormatTime(ticket.createdAt)}</span>
                        </div>
                     </div>
                     
                     <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '800', color: 'var(--text-light)', fontSize: '0.85rem' }}>ORD #{ticket.orderId}</span>
                        <span style={{ fontWeight: '800', color: 'var(--text-light)', fontSize: '0.85rem' }}>BSTR-PRO</span>
                     </div>

                     <div style={{ padding: '1.5rem', minHeight: '180px', flex: 1 }}>
                        <div className="flex flex-col gap-4">
                           {ticket.items.map((item: any) => (
                             <div 
                               key={item.id} 
                               onClick={() => advanceItem(item.id)}
                               style={{ 
                                 display: 'flex', gap: '1rem', cursor: 'pointer',
                                 opacity: item.prepStatus === 'ready' ? 0.3 : 1,
                               }}
                             >
                               <span style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--primary)', minWidth: '30px' }}>{item.qty}</span>
                               <div className="flex flex-col">
                                  <span style={{ fontWeight: '700', fontSize: '1.2rem', textDecoration: item.prepStatus === 'ready' ? 'line-through' : 'none' }}>{item.name}</span>
                                  {item.prepStatus === 'ready' && <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--success)', textTransform: 'uppercase' }}>Prepared ✓</span>}
                               </div>
                             </div>
                           ))}
                        </div>
                     </div>
                     
                     <div style={{ padding: '1rem', backgroundColor: '#F1F5F9' }}>
                        <button 
                          onClick={() => advanceTicket(ticket.ticketId, ticket.status)}
                          className={`btn w-full py-5 text-xl font-black ${ticket.status === 'in_progress' ? 'btn-success' : 'btn-primary'}`}
                          style={{ borderRadius: '12px' }}
                        >
                          {ticket.status === 'in_progress' ? 'BUMP NOW' : 'START PREP'}
                        </button>
                     </div>
                  </div>
                )
             })}
          </div>

          {tickets.length === 0 && (
            <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
               <span style={{ fontSize: '10rem' }}>🍳</span>
               <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '2rem' }}>Kitchen Clear</h2>
               <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>No active tickets in queue for {station.name}</p>
            </div>
          )}
       </div>
    </div>
  )
}
