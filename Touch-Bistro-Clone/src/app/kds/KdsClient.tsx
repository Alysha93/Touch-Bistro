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
    <div className="flex h-screen w-full animate-fade-in" style={{ backgroundColor: 'transparent', color: 'white' }}>
       {/* Sidebar for multiple KDS routing */}
       <div style={{ width: '120px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--glass-border)', backdropFilter: 'blur(15px)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5rem' }}>
          <div style={{ fontWeight: '900', marginBottom: '3rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textTransform: 'uppercase', letterSpacing: '4px' }}>prep stations</div>
          {allStations.map((s: any) => (
             <button 
               key={s.id}
               onClick={() => handleStationChange(s.id)}
               className="pos-card flex items-center justify-center transition-all"
               style={{
                 width: '70px', height: '70px', borderRadius: '22px', 
                 background: station.id === s.id ? 'white' : 'rgba(255,255,255,0.05)',
                 color: station.id === s.id ? '#0f172a' : 'white', 
                 border: '1px solid rgba(255,255,255,0.1)',
                 marginBottom: '1.5rem', cursor: 'pointer',
                 fontSize: '0.9rem', fontWeight: '900',
                 boxShadow: station.id === s.id ? '0 10px 25px rgba(255,255,255,0.2)' : 'none',
               }}
             >
               {s.name.substring(0,4)}
             </button>
          ))}
       </div>

       {/* Main Kitchen Canvas */}
       <div style={{ flex: 1, padding: '3.5rem', overflowY: 'auto', background: 'rgba(255,255,255,0.01)' }}>
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-8">
             <div>
                <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>{station.name} Display</h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Prep Queue • {tickets.length} Orders</p>
             </div>
             <div className="flex flex-col items-end">
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }}>
                  {mounted && new Date(currentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                   <span style={{ fontWeight: '800', color: 'var(--success)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Live System</span>
                </div>
             </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '3rem', alignItems: 'start' }}>
             {tickets.map((ticket: any) => {
                const waitMin = Math.floor((currentTime - ticket.createdAt) / 60000);
                const isLate = waitMin > 10;
                const isUrgent = waitMin > 20;
                
                const headerColor = isUrgent ? 'rgba(248, 113, 113, 0.3)' : (isLate ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255,255,255,0.15)');
                const accentColor = isUrgent ? '#fca5a5' : (isLate ? '#fcd34d' : 'white');
                
                return (
                  <div key={ticket.ticketId} className="animate-slide-up glass" style={{ 
                     background: 'rgba(255,255,255,0.05)',
                     borderRadius: '28px', overflow: 'hidden', 
                     boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                     display: 'flex', flexDirection: 'column',
                     border: `1.5px solid ${isUrgent ? 'rgba(248, 113, 113, 0.4)' : 'rgba(255,255,255,0.1)'}`
                  }}>
                     <div style={{ 
                        background: headerColor,
                        padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        backdropFilter: 'blur(10px)'
                     }}>
                        <div className="flex flex-col">
                           <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'white', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Location</span>
                           <span style={{ fontSize: '2rem', fontWeight: '950', color: 'white', letterSpacing: '-0.5px' }}>{ticket.tableName}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'white', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Wait Time</span>
                           <span style={{ fontSize: '2rem', fontWeight: '950', color: accentColor }}>{getFormatTime(ticket.createdAt)}</span>
                        </div>
                     </div>
                     
                     <div style={{ padding: '1.25rem 2rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '800', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>ORD #{ticket.orderId.toString().padStart(4, '0')}</span>
                        <span style={{ fontWeight: '800', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>PREMIUM-POS</span>
                     </div>

                     <div style={{ padding: '2rem', minHeight: '220px', flex: 1 }}>
                        <div className="flex flex-col gap-6">
                           {ticket.items.map((item: any) => (
                             <div 
                               key={item.id} 
                               onClick={() => advanceItem(item.id)}
                               style={{ 
                                 display: 'flex', gap: '1.25rem', cursor: 'pointer',
                                 opacity: item.prepStatus === 'ready' ? 0.3 : 1,
                                 transition: 'all 0.2s'
                               }}
                             >
                               <span style={{ fontWeight: '950', fontSize: '1.75rem', color: 'white', minWidth: '40px' }}>{item.qty}</span>
                               <div className="flex flex-col">
                                  <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'white', textDecoration: item.prepStatus === 'ready' ? 'line-through' : 'none', letterSpacing: '-0.5px' }}>{item.name}</span>
                                  {item.prepStatus === 'ready' && <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--success)', textTransform: 'uppercase', marginTop: '4px' }}>Ready for service ✓</span>}
                               </div>
                             </div>
                           ))}
                        </div>
                     </div>
                     
                     <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                        <button 
                          onClick={() => advanceTicket(ticket.ticketId, ticket.status)}
                          className={`btn w-full py-6 text-2xl font-black transition-all ${ticket.status === 'in_progress' ? '' : ''}`}
                          style={{ 
                            borderRadius: '16px', 
                            background: ticket.status === 'in_progress' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            border: `1.5px solid ${ticket.status === 'in_progress' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                            color: ticket.status === 'in_progress' ? '#6ee7b7' : 'white',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                          }}
                        >
                          {ticket.status === 'in_progress' ? 'BUMP TRANSACTION' : 'START PREPARATION'}
                        </button>
                     </div>
                  </div>
                )
             })}
          </div>

          {tickets.length === 0 && (
            <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
               <span style={{ fontSize: '12rem', filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))' }}>🍳</span>
               <h2 style={{ fontSize: '3rem', fontWeight: '950', marginTop: '2rem', letterSpacing: '-1.5px' }}>Kitchen Clear</h2>
               <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'rgba(255,255,255,0.5)' }}>No active preparatory tickets for {station.name}</p>
            </div>
          )}
       </div>
    </div>
  )
}
