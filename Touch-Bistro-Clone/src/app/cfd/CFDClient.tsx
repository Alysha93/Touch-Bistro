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
         <div style={{ width: '450px', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
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
    <div className="flex h-screen w-screen animate-fade-in" style={{ backgroundColor: '#F8FAFC', overflow: 'hidden' }}>
      
      {/* LEFT PANE - Itemized Receipt Area */}
      <div style={{ width: '40%', backgroundColor: 'white', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '20px 0 50px rgba(0,0,0,0.03)', zIndex: 10 }}>
         <div style={{ padding: '3rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'white' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>Your Receipt</h2>
            <p style={{ opacity: 0.7, fontWeight: '600' }}>Table {order.tableName || '01'} • Order #{order.id}</p>
         </div>
         
         <div style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
            <div className="flex flex-col gap-8">
               {items.map((it: any, i: number) => (
                 <div key={i} className="flex justify-between items-start">
                   <div className="flex gap-4">
                      <span style={{ fontWeight: '900', fontSize: '1.25rem', color: 'var(--primary)', minWidth: '30px' }}>{it.qty}</span>
                      <div className="flex flex-col">
                         <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>{it.name}</span>
                         <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', marginTop: '4px' }}>Artisanal Preparation</span>
                      </div>
                   </div>
                   <span style={{ fontSize: '1.25rem', fontWeight: '900' }}>${it.unitPrice.toFixed(2)}</span>
                 </div>
               ))}
            </div>
         </div>
         
         <div style={{ padding: '3rem', borderTop: '2px dashed var(--border-color)', backgroundColor: '#F8FAFC' }}>
            <div className="flex justify-between mb-3">
               <span style={{ color: 'var(--text-light)', fontWeight: '700' }}>Subtotal</span>
               <span style={{ fontWeight: '800' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
               <span style={{ color: 'var(--text-light)', fontWeight: '700' }}>Tax (13%)</span>
               <span style={{ fontWeight: '800' }}>${tax.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between mb-6 animate-slide-up">
                 <span style={{ color: 'var(--success)', fontWeight: '900' }}>Gratuity</span>
                 <span style={{ fontWeight: '900', color: 'var(--success)' }}>${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-end mt-4">
               <span style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>Total Due</span>
               <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>${(total + tipAmount).toFixed(2)}</span>
            </div>
         </div>
      </div>

      {/* RIGHT PANE - Interaction Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-10" style={{ backgroundColor: '#F8FAFC' }}>
         
         {!tipScreen && !payScreen && !signScreen && (
            <div className="animate-fade-in flex flex-col items-center text-center max-w-2xl">
               <div style={{ width: '140px', height: '140px', borderRadius: '40px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
                 💰
               </div>
               <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>Ready for Checkout?</h1>
               <p style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '4rem', lineHeight: 1.5 }}>Please verify your order details on the left. When you&apos;re ready, tap the button below to proceed to payment.</p>
               
               <button onClick={() => setTipScreen(true)} className="btn btn-primary" style={{ padding: '1.75rem 5rem', fontSize: '1.75rem', borderRadius: '24px' }}>
                  Proceed to Payment
               </button>
            </div>
         )}
         
         {tipScreen && (
            <div className="animate-fade-in text-center w-full max-w-4xl">
               <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '4rem', letterSpacing: '-1.5px' }}>Choose Gratuity</h1>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
                  {[0.15, 0.20, 0.25].map(pct => (
                    <button 
                      key={pct}
                      onClick={() => handleTip(pct)} 
                      className="pos-card transition-all"
                      style={{ 
                        padding: '4rem 0', 
                        backgroundColor: pct === 0.20 ? 'var(--primary)' : 'white', 
                        color: pct === 0.20 ? 'white' : 'var(--text-main)',
                        border: 'none',
                        transform: pct === 0.20 ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: pct === 0.20 ? '0 20px 40px rgba(0,0,0,0.2)' : 'var(--shadow-md)'
                      }}
                    >
                       <span style={{ fontSize: '3rem', fontWeight: '900' }}>{pct * 100}%</span>
                       <br/>
                       <span style={{ opacity: 0.8, fontSize: '1.25rem', fontWeight: '600' }}>${(subtotal * pct).toFixed(2)}</span>
                    </button>
                  ))}
               </div>
               <button 
                  onClick={() => handleTip(0)} 
                  className="btn"
                  style={{ background: 'transparent', fontSize: '1.5rem', color: 'var(--text-light)', fontWeight: '700', textDecoration: 'underline' }}
               >
                  No Gratuity
               </button>
            </div>
         )}

         {payScreen && (
            <div className="animate-fade-in text-center">
               <div className="flex flex-col items-center gap-10">
                  <div className="animate-pulse" style={{ width: '200px', height: '200px', backgroundColor: 'var(--primary)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(13, 110, 253, 0.4)' }}>
                     <span style={{ fontSize: '7rem' }}>💳</span>
                  </div>
                  <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>Please Tap or Insert Card</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.5rem' }}>Securely processing your payment via TouchBistro Terminal...</p>

                  </div>
               </div>
            </div>
         )}
         
         {signScreen && (
            <div className="animate-fade-in text-center w-full max-w-4xl">
               <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '3rem' }}>Authorized Signature</h1>
               <div className="surface" style={{ width: '100%', height: '400px', marginBottom: '4rem', display: 'flex', alignItems: 'flex-end', padding: '3rem', backgroundColor: '#F1F5F9', border: '3px dashed #CBD5E1' }}>
                  <div style={{ borderBottom: '4px solid #0F172A', width: '100%', marginBottom: '1rem' }}></div>
               </div>
               <button onClick={handleDone} className="btn btn-primary" style={{ padding: '1.75rem 8rem', fontSize: '2rem', borderRadius: '24px' }}>
                  Complete Checkout
               </button>
            </div>
         )}

      </div>
    </div>
  )
}
