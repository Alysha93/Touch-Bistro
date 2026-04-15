'use client'
import { useState, useEffect } from 'react';
import { getActiveCFDOrder, completeCFDPayment } from '../pos/table/actions';

export default function CFDClient() {
  const [activeData, setActiveData] = useState<any>(null);
  const [tipScreen, setTipScreen] = useState(false);
  const [payScreen, setPayScreen] = useState(false);
  const [signScreen, setSignScreen] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (tipScreen || signScreen || payScreen) return; 
      const data = await getActiveCFDOrder();
      if (data) {
        setActiveData(data);
      } else {
        setActiveData(null);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [tipScreen, signScreen, payScreen]);

  if (!activeData) {
    return (
      <div className="flex h-screen w-screen animate-fade-in" style={{ backgroundColor: 'white' }}>
         <div className="flex-1 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1550966841-3ee7adac1661?auto=format&fit=crop&q=80&w=2000" 
              alt="Restaurant Atmosphere" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), transparent)' }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '8%', color: 'white', maxWidth: '600px' }}>
               <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-2px' }}>Welcome to<br/>TouchBistro</h1>
               <p style={{ fontSize: '1.75rem', opacity: 0.8, fontWeight: '500' }}>Please enjoy your dining experience. Your order details will appear here as they are prepared.</p>

               <div className="flex gap-4 mt-12">
                  <div className="badge badge-primary px-6 py-2 text-lg">Hospitality Reimagined</div>
                  <div className="badge badge-success px-6 py-2 text-lg">Live Support</div>
               </div>
            </div>
         </div>
         <div style={{ width: '450px', backgroundColor: '#121417', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', opacity: 0.1, fontSize: '8rem', fontWeight: '900', marginBottom: '2rem', userSelect: 'none' }}>
               TOUCHBISTRO PRO
            </div>
         </div>
      </div>
    );
  }

  const { order, items } = activeData;
  const subtotal = items.reduce((acc: number, item: any) => acc + item.unitPrice, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleTip = (percent: number) => {
    setTipAmount(subtotal * percent);
    setTipScreen(false);
    setPayScreen(true);
    setTimeout(() => {
      setPayScreen(false);
      setSignScreen(true);
    }, 2500);
  };

  const handleDone = async () => {
    await completeCFDPayment(order.id, tipAmount);
    setSignScreen(false);
    setActiveData(null);
  };

  return (
    <div className="flex h-screen w-screen animate-fade-in" style={{ backgroundColor: '#121417', overflow: 'hidden' }}>
      
      {/* Background Mesh Gradient */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 0, 
        background: `
          radial-gradient(at 0% 0%, hsla(180, 50%, 15%, 1) 0, transparent 50%), 
          radial-gradient(at 50% 0%, hsla(0, 0%, 10%, 1) 0, transparent 60%), 
          radial-gradient(at 100% 0%, hsla(330, 80%, 25%, 0.6) 0, transparent 40%),
          radial-gradient(at 100% 100%, hsla(180, 30%, 10%, 1) 0, transparent 50%),
          radial-gradient(at 0% 100%, hsla(0, 0%, 7%, 1) 0, transparent 50%)
        `
      }} />

      {/* LEFT PANE - Itemized Receipt Area */}
      <div className="glass" style={{ width: '42%', borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
         <div style={{ padding: '3.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px', color: '#50c7c7' }}>Your Receipt</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '1.1rem', marginTop: '0.5rem' }}>Table {order.tableName || '01'} • Order #{order.id.toString().padStart(4, '0')}</p>
         </div>
         
         <div style={{ flex: 1, overflowY: 'auto', padding: '3.5rem' }}>
            <div className="flex flex-col gap-10">
               {items.map((it: any, i: number) => (
                 <div key={i} className="flex justify-between items-start animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                   <div className="flex gap-6">
                      <span style={{ fontWeight: '950', fontSize: '1.5rem', color: 'white', minWidth: '40px' }}>{it.qty}</span>
                      <div className="flex flex-col">
                         <span style={{ fontSize: '1.5rem', fontWeight: '850', color: 'white', lineHeight: 1.1, letterSpacing: '-0.5px' }}>{it.name}</span>
                         <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '6px' }}>Curated Selection</span>
                      </div>
                   </div>
                   <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>${it.unitPrice.toFixed(2)}</span>
                 </div>
               ))}
            </div>
         </div>
         
         <div style={{ padding: '3.5rem', borderTop: '2px dashed var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex justify-between mb-4">
               <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '1.1rem' }}>Subtotal</span>
               <span style={{ fontWeight: '800', color: 'white', fontSize: '1.25rem' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6">
               <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '1.1rem' }}>Tax (13%)</span>
               <span style={{ fontWeight: '800', color: 'white', fontSize: '1.25rem' }}>${tax.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between mb-8 animate-slide-up" style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                 <span style={{ color: '#6ee7b7', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Gratuity</span>
                 <span style={{ fontWeight: '900', color: '#6ee7b7', fontSize: '1.5rem' }}>${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-end mt-4">
               <span style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px', color: '#F61B8D' }}>Total Due</span>
               <span style={{ fontSize: '4.5rem', fontWeight: '950', color: '#F61B8D', lineHeight: 0.9, textShadow: '0 0 40px rgba(246, 27, 141, 0.2)' }}>${(total + tipAmount).toFixed(2)}</span>
            </div>
         </div>
      </div>

      {/* RIGHT PANE - Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 relative" style={{ zIndex: 10 }}>
         
         {!tipScreen && !payScreen && !signScreen && (
            <div className="animate-fade-in flex flex-col items-center text-center max-w-2xl">
               <div style={{ width: '180px', height: '180px', borderRadius: '54px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', marginBottom: '3rem', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
                 💰
               </div>
               <h1 style={{ fontSize: '4.5rem', fontWeight: '950', marginBottom: '1.5rem', letterSpacing: '-2px', color: 'white' }}>Finalize Order</h1>
               <p style={{ fontSize: '1.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '5rem', lineHeight: 1.4, maxWidth: '80%' }}>Review your selection on the left. Once confirmed, let&apos;s proceed to completion.</p>
               
               <button onClick={() => setTipScreen(true)} className="btn btn-primary" style={{ padding: '2rem 6rem', fontSize: '2rem', borderRadius: '32px', background: 'white', color: '#0f172a', fontWeight: '900' }}>
                  Complete Payment
               </button>
            </div>
         )}
         
         {tipScreen && (
            <div className="animate-fade-in text-center w-full max-w-5xl">
               <h1 style={{ fontSize: '4.5rem', fontWeight: '950', marginBottom: '5rem', letterSpacing: '-2.5px', color: 'white' }}>Choose Gratuity</h1>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', marginBottom: '5rem' }}>
                  {[0.15, 0.20, 0.25].map(pct => (
                    <button 
                      key={pct}
                      onClick={() => handleTip(pct)} 
                      className="pos-card transition-all"
                      style={{ 
                        padding: '5rem 0', 
                        background: pct === 0.20 ? 'white' : 'rgba(255,255,255,0.08)', 
                        color: pct === 0.20 ? '#0f172a' : 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transform: pct === 0.20 ? 'scale(1.08)' : 'scale(1)',
                        boxShadow: pct === 0.20 ? '0 30px 60px rgba(255,255,255,0.2)' : 'none',
                        borderRadius: '36px'
                      }}
                    >
                       <span style={{ fontSize: '4rem', fontWeight: '950', letterSpacing: '-2px' }}>{pct * 100}%</span>
                       <br/>
                       <span style={{ opacity: 0.8, fontSize: '1.5rem', fontWeight: '700', marginTop: '1rem', display: 'block' }}>${(subtotal * pct).toFixed(2)}</span>
                    </button>
                  ))}
               </div>
               <button 
                  onClick={() => handleTip(0)} 
                  className="btn"
                  style={{ background: 'transparent', fontSize: '1.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}
               >
                  Skip Gratuity
               </button>
            </div>
         )}

         {payScreen && (
            <div className="animate-fade-in text-center">
               <div className="flex flex-col items-center gap-12">
                  <div className="animate-pulse" style={{ width: '240px', height: '240px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(30px)', boxShadow: '0 0 100px rgba(255, 255, 255, 0.15)' }}>
                     <span style={{ fontSize: '8rem' }}>💳</span>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '4rem', fontWeight: '950', color: 'white', marginBottom: '1.5rem', letterSpacing: '-2px' }}>Processing Payment</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.75rem', fontWeight: '600' }}>Please tap or insert your card into the reader...</p>
                  </div>
               </div>
            </div>
         )}
         
         {signScreen && (
            <div className="animate-fade-in text-center w-full max-w-5xl">
               <h1 style={{ fontSize: '4rem', fontWeight: '950', color: 'white', marginBottom: '4rem', letterSpacing: '-2px' }}>Authorize Transaction</h1>
               <div className="glass" style={{ width: '100%', height: '450px', marginBottom: '5rem', display: 'flex', alignItems: 'flex-end', padding: '4rem', borderRadius: '40px', border: '2px dashed rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ borderBottom: '4px solid rgba(255,255,255,0.4)', width: '100%', marginBottom: '2rem' }}></div>
               </div>
               <button onClick={handleDone} className="btn btn-primary" style={{ padding: '2rem 10rem', fontSize: '2.5rem', borderRadius: '32px', background: 'white', color: '#0f172a', fontWeight: '950' }}>
                  Complete Checkout
               </button>
            </div>
         )}

      </div>
    </div>
  )
}
