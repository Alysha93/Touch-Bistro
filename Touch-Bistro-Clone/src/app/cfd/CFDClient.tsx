'use client'
import { useState, useEffect } from 'react';
import { getActiveCFDOrder, completeCFDPayment } from '../pos/table/actions';

export default function CFDClient() {
  const [activeData, setActiveData] = useState<any>(null);
  const [tipScreen, setTipScreen] = useState(false);
  const [signScreen, setSignScreen] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);

  useEffect(() => {
    // Poll for awaiting_payment orders
    const interval = setInterval(async () => {
      if (tipScreen || signScreen) return; // Don't interrupt flow if customer is already acting
      const data = await getActiveCFDOrder();
      if (data) {
        setActiveData(data);
      } else {
        setActiveData(null);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [tipScreen, signScreen]);

  if (!activeData) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', backgroundColor: '#f8fafc' }}>
         <div style={{ flex: 1, borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: '#94a3b8', fontSize: '2rem' }}>Welcome to TouchBistro</h1>
         </div>
         <div style={{ flex: 2, backgroundImage: 'url("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80")', backgroundSize: 'cover' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
               <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>Join our Loyalty Program!</h1>
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
    setSignScreen(true);
  };

  const handleDone = async () => {
    await completeCFDPayment(order.id, tipAmount);
    setSignScreen(false);
    setActiveData(null); // Return to idle
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT PANE - Itemized List */}
      <div style={{ flex: 1, backgroundColor: 'white', boxShadow: 'var(--shadow-lg)', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '2rem', backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>TouchBistro</h2>
         </div>
         
         <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            {items.map((it: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                <span>{it.qty} {it.name}</span>
                <span>${it.unitPrice.toFixed(2)}</span>
              </div>
            ))}
         </div>
         
         <div style={{ padding: '2rem', borderTop: '2px dashed #cbd5e1', backgroundColor: '#f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginBottom: '0.5rem', color: '#64748b' }}>
               <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginBottom: '1rem', color: '#64748b' }}>
               <span>Tax</span><span>${tax.toFixed(2)}</span>
            </div>
            {(tipAmount > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', marginBottom: '1rem', color: '#64748b' }}>
                 <span>Tip</span><span>${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>
               <span>Total</span><span>${(total + tipAmount).toFixed(2)}</span>
            </div>
         </div>
      </div>

      {/* RIGHT PANE - Interaction */}
      <div style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '4rem' }}>
         
         {!tipScreen && !signScreen && (
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Please Verify Your Order</h1>
               <div style={{ display: 'inline-block', backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                 <p style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '2rem' }}>Balance Due</p>
                 <p style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)' }}>${total.toFixed(2)}</p>
               </div>
               <div style={{ marginTop: '3rem' }}>
                 <button onClick={() => setTipScreen(true)} className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1.5rem', borderRadius: '8px' }}>
                    Pay ${total.toFixed(2)}
                 </button>
               </div>
            </div>
         )}
         
         {tipScreen && (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
               <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '3rem' }}>Add a Tip</h1>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <button onClick={() => handleTip(0.15)} style={{ backgroundColor: 'white', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '3rem 0', fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                     15% <br/><span style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 'normal' }}>${(subtotal * 0.15).toFixed(2)}</span>
                  </button>
                  <button onClick={() => handleTip(0.20)} style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '3rem 0', fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-md)', transform: 'scale(1.05)' }}>
                     20% <br/><span style={{ color: '#e0f2fe', fontSize: '1.2rem', fontWeight: 'normal' }}>${(subtotal * 0.20).toFixed(2)}</span>
                  </button>
                  <button onClick={() => handleTip(0.25)} style={{ backgroundColor: 'white', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '3rem 0', fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
                     25% <br/><span style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 'normal' }}>${(subtotal * 0.25).toFixed(2)}</span>
                  </button>
               </div>
               <button onClick={() => handleTip(0)} style={{ padding: '1rem 3rem', background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.5rem', textDecoration: 'underline', cursor: 'pointer' }}>
                  No Tip
               </button>
            </div>
         )}
         
         {signScreen && (
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
               <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Please Sign</h1>
               <div style={{ backgroundColor: 'white', width: '100%', height: '400px', borderRadius: '12px', border: '2px dashed #cbd5e1', marginBottom: '3rem', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
                  <div style={{ borderBottom: '2px solid #0f172a', width: '100%' }}></div>
               </div>
               <button onClick={handleDone} className="btn-primary" style={{ padding: '1.5rem 6rem', fontSize: '2rem', borderRadius: '8px' }}>
                  Done
               </button>
            </div>
         )}

      </div>
    </div>
  )
}
