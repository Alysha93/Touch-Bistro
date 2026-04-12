'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initiateCFDPayment, checkOrderStatus, completeLocalPayment } from '../../actions';

export default function CheckoutClient({ table, order, items }: any) {
  const router = useRouter();
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [awaitingCFD, setAwaitingCFD] = useState(false);
  const [customTip, setCustomTip] = useState('');

  const subtotal = items.reduce((acc: number, item: any) => acc + item.unitPrice, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleLoyaltyLookup = () => {
    setPoints(198);
  };

  const handleCFDPay = async () => {
    await initiateCFDPayment(order.id);
    setAwaitingCFD(true);
  };

  const startLocalPayment = (method: string) => {
    setPaymentMethod(method);
    setShowTipModal(true);
  };

  const processPaymentWithTip = async (tipValue: number) => {
    await completeLocalPayment(order.id, tipValue, paymentMethod);
    setShowTipModal(false);
    alert(`Payment of $${(total + tipValue).toFixed(2)} completed successfully via ${paymentMethod}!`);
    router.push('/pos/floorplan');
  };

  // Poll for payment completion
  useEffect(() => {
    if (!awaitingCFD) return;
    
    const interval = setInterval(async () => {
      const status = await checkOrderStatus(order.id);
      if (status === 'paid') {
        clearInterval(interval);
        alert('Payment was successful on CFD!');
        router.push('/pos/floorplan');
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [awaitingCFD, order.id, router]);

  return (
    <div className="flex h-full w-full" style={{ position: 'relative' }}>
      {/* LEFT PANE - Checkout options */}
      <div className="flex flex-col" style={{ width: '40%', borderRight: '1px solid var(--border-color)', backgroundColor: '#f9fafb', height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #ccc', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
           <button onClick={() => router.back()} style={{ marginRight: '1rem', background: 'transparent', fontSize: '1rem', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}>&lt; Back</button>
           <span style={{ fontSize: '1.1rem' }}>Checkout - {table.name}</span>
        </div>
        
        {awaitingCFD ? (
           <div style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💳</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sending to Display</h2>
              <p style={{ color: '#666' }}>Waiting for customer to tip and sign on the Customer Facing Display...</p>
           </div>
        ) : (
           <>
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#666', backgroundColor: '#e5e7eb', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Options
              </div>
              <div style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <span>All on One</span>
                <span style={{ fontWeight: 'bold' }}>✓</span>
              </div>
              
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#666', backgroundColor: '#e5e7eb', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Payment Options
              </div>
              <div onClick={() => startLocalPayment('Credit')} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary)' }}>Credit / Debit (Local) &gt;</div>
              <div onClick={() => startLocalPayment('Cash')} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary)' }}>Cash &gt;</div>
              <div onClick={handleCFDPay} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer' }}>Push to Customer Display (CFD) &gt;</div>
              <div onClick={() => window.print()} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer' }}>Print Receipt &gt;</div>
              <div onClick={() => setShowLoyalty(true)} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#ccfbf1', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>@</span> 
                 Loyalty
              </div>
           </>
        )}
      </div>

      {/* RIGHT PANE - Receipt */}
      <div className="flex flex-col items-center justify-center custom-print-container" style={{ flex: '1', backgroundColor: '#9ca3af', height: '100%', overflowY: 'auto' }}>
        <div className="receipt-content" style={{ width: '400px', backgroundColor: '#fff', padding: '2rem 1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', fontFamily: 'monospace', margin: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>TouchBistro</h2>
            <p>1407 Broadway #3701</p>
            <p>Printed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style={{ borderBottom: '1px dashed #333', borderTop: '1px dashed #333', padding: '1rem 0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
             <div><p>Order #: {order.id}</p><p>Table: {table.name}</p></div>
             <div style={{ textAlign: 'right' }}><p>1 guest</p><p>Waiter: Admin</p></div>
          </div>
          
          <div style={{ marginBottom: '1.5rem', minHeight: '150px' }}>
             {items.map((item: any) => (
                <div key={item.id} className="flex justify-between" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  <span>{item.qty} {item.name}</span>
                  <span>${item.unitPrice.toFixed(2)}</span>
                </div>
             ))}
          </div>
          
          <div style={{ borderTop: '1px dashed #333', paddingTop: '1rem', fontSize: '1.1rem' }}>
             <div className="flex justify-between" style={{ marginTop: '0.75rem' }}><span>SubTotal:</span><span>${subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between"><span>Tax 1:</span><span>${tax.toFixed(2)}</span></div>
             <div className="flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.4rem', marginTop: '1rem' }}>
                <span>Total:</span><span>${total.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>

      {/* TIP MODAL */}
      {showTipModal && (
        <div className="no-print" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
           <div style={{ width: '500px', backgroundColor: 'white', borderRadius: '12px', padding: '2rem', position: 'relative', boxShadow: 'var(--shadow-xl)' }}>
              <button onClick={() => setShowTipModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
              
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>Enter Tip</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>Payment Method: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{paymentMethod}</span></p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                 <button onClick={() => processPaymentWithTip(total * 0.15)} className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#f1f5f9' }}>15%<br/><span style={{fontSize:'0.85rem'}}>${(total * 0.15).toFixed(2)}</span></button>
                 <button onClick={() => processPaymentWithTip(total * 0.18)} className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#f1f5f9' }}>18%<br/><span style={{fontSize:'0.85rem'}}>${(total * 0.18).toFixed(2)}</span></button>
                 <button onClick={() => processPaymentWithTip(total * 0.20)} className="btn-secondary" style={{ padding: '1rem', fontSize: '1.1rem', backgroundColor: '#f1f5f9' }}>20%<br/><span style={{fontSize:'0.85rem'}}>${(total * 0.20).toFixed(2)}</span></button>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                 <div style={{ flex: '1' }}>
                   <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>Custom Tip Amount ($)</label>
                   <input type="number" value={customTip} onChange={(e) => setCustomTip(e.target.value)} style={{ width: '100%', padding: '0.75rem', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="0.00" />
                 </div>
                 <button onClick={() => processPaymentWithTip(Number(customTip) || 0)} className="btn-primary" style={{ flex: '1', padding: '0.75rem', fontSize: '1.1rem' }}>Apply Tip</button>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                 <button onClick={() => processPaymentWithTip(0)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}>No Tip</button>
              </div>
           </div>
        </div>
      )}

      {/* LOYALTY MODAL */}
      {showLoyalty && (
        <div className="no-print" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ width: '450px', backgroundColor: 'white', borderRadius: '8px', padding: '2.5rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
              <button onClick={() => setShowLoyalty(false)} style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '1.5rem', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>✕</button>
              
              <div style={{ textAlign: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 'bold' }}>TouchBistro <span style={{ fontWeight: 'normal' }}>Loyalty</span></h2>
                 </div>
                 
                 {points === null ? (
                   <div>
                     <input type="text" style={{ width: '100%', marginBottom: '0.5rem', padding: '0.75rem', fontSize: '1.1rem', border: '1px solid #ccc' }} defaultValue="15559993434" />
                     <button onClick={handleLoyaltyLookup} className="btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>Search for Loyalty Account</button>
                   </div>
                 ) : (
                   <div>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Lana Avery</h3>
                     <div style={{ border: '2px solid #d93025', padding: '0.5rem', margin: '0 0 1.5rem 0', display: 'inline-block', color: '#d93025', fontWeight: 'bold' }}>Points: {points}</div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
      
      {/* Dynamic Print Stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-content, .receipt-content * {
            visibility: visible;
          }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
