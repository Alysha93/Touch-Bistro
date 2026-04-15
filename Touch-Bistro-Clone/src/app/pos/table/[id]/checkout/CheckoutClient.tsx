'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initiateCFDPayment, checkOrderStatus, completeLocalPayment } from '../../actions';
import Link from 'next/link';

export default function CheckoutClient({ table, order, items }: any) {
  const router = useRouter();
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [awaitingCFD, setAwaitingCFD] = useState(false);
  
  // Split Bill Engine
  const [splitMode, setSplitMode] = useState<'all' | 'even' | 'seat'>('all');
  const [splitCount, setSplitCount] = useState(2);
  const [activePaymentTotal, setActivePaymentTotal] = useState<number>(0);
  const [customTip, setCustomTip] = useState('');

  const subtotal = items.reduce((acc: number, item: any) => acc + (item.unitPrice * item.qty), 0);
  const tax = subtotal * 0.13;
  const grandTotal = subtotal + tax;

  const handleLoyaltyLookup = () => setPoints(198);

  const handleCFDPay = async () => {
    await initiateCFDPayment(order.id);
    setAwaitingCFD(true);
  };

  const startLocalPayment = (method: string, requiredAmount: number) => {
    setPaymentMethod(method);
    setActivePaymentTotal(requiredAmount);
    setCustomTip('');
    setShowTipModal(true);
  };

  const processPaymentWithTip = async (tipValue: number) => {
    // For this demo, charging any sub-seat or split completely closes the ticket
    await completeLocalPayment(order.id, tipValue, paymentMethod);
    setShowTipModal(false);
    alert(`Payment of $${(activePaymentTotal + tipValue).toFixed(2)} completed successfully via ${paymentMethod}!`);
    router.push('/pos/floorplan');
  };

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

  // Group items by Seat
  const seatGroups = items.reduce((acc: any, item: any) => {
    const s = item.seatNumber || 1;
    if (!acc[s]) acc[s] = [];
    acc[s].push(item);
    return acc;
  }, {});
  const activeSeats = Object.keys(seatGroups);

  const renderStandardReceipt = (seatLabel = 'Master Receipt', targetItems = items, receiptTotal = grandTotal, receiptSub = subtotal, receiptTax = tax) => (
    <div className="receipt-content" style={{ width: '360px', backgroundColor: '#fff', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', fontFamily: 'var(--font-sans)', borderRadius: '4px', position: 'relative', color: '#1a1b1e' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #1a1b1e', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1a1b1e', letterSpacing: '-1px' }}>Touch Bistro Cafe</h2>
        <p style={{ fontWeight: '700', opacity: 0.6, fontSize: '0.9rem' }}>{seatLabel}</p>
      </div>
      
      <div style={{ borderBottom: '1px dashed #ced4da', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700' }}>
         <div><p>Order: #{order.id.toString().padStart(4, '0')}</p></div>
         <div style={{ textAlign: 'right' }}><p>Table: {table.name}</p></div>
      </div>
      
      <div style={{ marginBottom: '1.5rem', minHeight: '120px' }}>
         {targetItems.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between" style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: '600' }}>
              <span style={{ color: '#1a1b1e' }}>{item.qty > 1 ? `${item.qty}x ` : ''}{item.name}</span>
              <span style={{ fontWeight: '800' }}>${(item.unitPrice * item.qty).toFixed(2)}</span>
            </div>
         ))}
      </div>
      
      <div style={{ borderTop: '2px solid #1a1b1e', paddingTop: '1.25rem', fontSize: '1.1rem' }}>
         <div className="flex justify-between" style={{ marginTop: '0.5rem', opacity: 0.7 }}><span>SubTotal</span><span>${receiptSub.toFixed(2)}</span></div>
         <div className="flex justify-between" style={{ opacity: 0.7 }}><span>Tax (13%)</span><span>${receiptTax.toFixed(2)}</span></div>
         <div className="flex justify-between" style={{ fontWeight: '900', fontSize: '1.6rem', marginTop: '1.25rem', color: '#1a1b1e' }}>
            <span>TOTAL</span><span>${receiptTotal.toFixed(2)}</span>
         </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
         Thank You
      </div>

      {/* Inline Sub-Receipt Payment Hook */}
      {splitMode !== 'all' && (
        <div className="no-print" style={{ marginTop: '2rem', display: 'grid', gap: '0.75rem' }}>
           <button onClick={() => startLocalPayment('Credit', receiptTotal)} className="btn" style={{ background: '#1a1b1e', color: 'white', padding: '1rem', width: '100%', fontSize: '1rem', borderRadius: '12px' }}>Pay ${receiptTotal.toFixed(2)} Card</button>
           <button onClick={() => startLocalPayment('Cash', receiptTotal)} style={{ padding: '1rem', width: '100%', fontSize: '1rem', backgroundColor: '#f1f5f9', color: '#1a1b1e', border: '1px solid #ced4da', borderRadius: '12px', cursor: 'pointer', fontWeight: '900' }}>Pay ${receiptTotal.toFixed(2)} Cash</button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full w-full" style={{ position: 'relative' }}>
      
      {/* CHECKOUT COMMAND PANE */}
      <div className="flex flex-col animate-slide-right" style={{ width: '400px', borderRight: '1px solid var(--glass-border)', backgroundColor: 'rgba(18, 20, 23, 0.95)', height: '100%', overflowY: 'auto', flexShrink: 0, backdropFilter: 'blur(30px)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all" style={{ border: 'none', color: 'white', cursor: 'pointer' }}>&larr;</button>
           <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Checkout</span>
        </div>
        
        {awaitingCFD ? (
           <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💳</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sending to Display...</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>Waiting for the customer to tip and sign on the Customer Facing Display terminal.</p>
           </div>
        ) : (
           <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Split Engine */}
              <div>
                  <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 900, marginBottom: '1rem', letterSpacing: '2px' }}>Split Options</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div onClick={() => setSplitMode('all')} className="pos-card" style={{ padding: '1.25rem', borderRadius: '16px', border: splitMode === 'all' ? '2px solid var(--pink)' : '1.5px solid var(--glass-border)', background: splitMode === 'all' ? 'rgba(246, 27, 141, 0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: splitMode === 'all' ? 'white' : 'rgba(255,255,255,0.7)' }}>All on One Master Receipt</span>
                      {splitMode === 'all' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 10px var(--pink)' }} />}
                    </div>
                    <div onClick={() => setSplitMode('seat')} className="pos-card" style={{ padding: '1.25rem', borderRadius: '16px', border: splitMode === 'seat' ? '2px solid var(--pink)' : '1.5px solid var(--glass-border)', background: splitMode === 'seat' ? 'rgba(246, 27, 141, 0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: splitMode === 'seat' ? 'white' : 'rgba(255,255,255,0.7)' }}>Split By Seat ({activeSeats.length})</span>
                      {splitMode === 'seat' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 10px var(--pink)' }} />}
                    </div>
                    <div onClick={() => setSplitMode('even')} className="pos-card" style={{ padding: '1.25rem', borderRadius: '16px', border: splitMode === 'even' ? '2px solid var(--pink)' : '1.5px solid var(--glass-border)', background: splitMode === 'even' ? 'rgba(246, 27, 141, 0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.05rem', color: splitMode === 'even' ? 'white' : 'rgba(255,255,255,0.7)' }}>Split Evenly By Value</span>
                      {splitMode === 'even' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 10px var(--pink)' }} />}
                    </div>
                  </div>

                  {splitMode === 'even' && (
                     <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '900', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>PORTIONS</span>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-black" style={{ border: 'none', color: 'white' }}>-</button>
                          <span style={{ fontWeight: '900', fontSize: '1.4rem' }}>{splitCount}</span>
                          <button onClick={() => setSplitCount(Math.min(10, splitCount + 1))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-black" style={{ border: 'none', color: 'white' }}>+</button>
                        </div>
                     </div>
                  )}
              </div>

               {/* Master Payments */}
              {splitMode === 'all' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 900, marginBottom: '0rem', letterSpacing: '2px' }}>Process Master Receipt</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button onClick={() => startLocalPayment('Credit', grandTotal)} className="btn hover:scale-[1.02]" style={{ padding: '1.5rem', background: 'var(--pink)', border: 'none', color: 'white', borderRadius: '16px', fontWeight: '900', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 10px 30px rgba(246, 27, 141, 0.2)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💳</span> 
                        <div className="flex flex-col">
                           <span>Terminal Payment</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '700' }}>Integrated Credit / Debit</span>
                        </div>
                      </button>
                      <button onClick={() => startLocalPayment('Cash', grandTotal)} className="btn hover:scale-[1.02]" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1.5px solid var(--glass-border)', color: 'white', borderRadius: '16px', fontWeight: '900', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>💵</span> 
                        <div className="flex flex-col">
                           <span>Exact Cash</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: '700' }}>Register Open Required</span>
                        </div>
                      </button>
                      <button onClick={handleCFDPay} className="btn hover:scale-[1.02]" style={{ padding: '1.5rem', background: '#334155', border: '1.5px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '16px', fontWeight: '900', textAlign: 'left', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }}>🖥️</span> 
                        <div className="flex flex-col">
                           <span>Push to Display</span>
                           <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: '700' }}>Customer-Facing Terminal</span>
                        </div>
                      </button>
                   </div>
                </div>
              )}

               {/* Actions */}
              <div>
                 <h3 style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 900, marginBottom: '1rem', letterSpacing: '2px' }}>Quick Actions</h3>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black transition-all">🖨️ PRINT</button>
                    <button onClick={() => setShowLoyalty(true)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black transition-all">🎁 LOYALTY</button>
                 </div>
              </div>

           </div>
        )}
      </div>

      {/* POS RECEIPT VISUALIZER PANE */}
      <div className="flex-1 flex items-center justify-center custom-print-container" style={{ position: 'relative', overflowY: 'auto', padding: '4rem 2rem' }}>
         <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(circle at center, rgba(80, 199, 199, 0.15) 0%, transparent 70%)' }} />

        
        {splitMode === 'all' && renderStandardReceipt('Master Order')}
        
        {splitMode === 'even' && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {Array.from({ length: splitCount }).map((_, i) => (
               <div key={i}>
                 {renderStandardReceipt(`Even Split ${i+1} of ${splitCount}`, items, grandTotal / splitCount, subtotal / splitCount, tax / splitCount)}
               </div>
            ))}
          </div>
        )}

        {splitMode === 'seat' && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {activeSeats.map(seat => {
               const seatItems = seatGroups[seat];
               const sSub = seatItems.reduce((acc: number, item: any) => acc + (item.unitPrice * item.qty), 0);
               const sTax = sSub * 0.13;
               return (
                 <div key={seat}>
                   {renderStandardReceipt(`Guest Seat ${seat}`, seatItems, sSub + sTax, sSub, sTax)}
                 </div>
               )
            })}
          </div>
        )}

      </div>

      {/* DYNAMIC TIP MODAL */}
      {showTipModal && (
        <div className="no-print" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(10px)' }}>
           <div style={{ width: '550px', backgroundColor: 'white', borderRadius: '30px', padding: '3rem', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', color: 'black' }}>
              <button onClick={() => setShowTipModal(false)} style={{ position: 'absolute', top: '30px', right: '30px', fontSize: '1.5rem', background: 'rgba(0,0,0,0.05)', width: '40px', height: '40px', borderRadius: '20px', border: 'none', color: '#1a1b1e', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', textAlign: 'center', color: '#1a1b1e', letterSpacing: '-1px' }}>Enter Tip</h2>
              <p style={{ textAlign: 'center', color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: '600' }}>
                Method: <span style={{ color: 'var(--pink)' }}>{paymentMethod}</span> • Total: <span style={{ color: '#1a1b1e' }}>${activePaymentTotal.toFixed(2)}</span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                 <button onClick={() => processPaymentWithTip(activePaymentTotal * 0.15)} style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                   <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a1b1e' }}>15%</span><br/>
                   <span style={{fontSize:'1rem', color: 'var(--pink)', fontWeight:'700'}}>${(activePaymentTotal * 0.15).toFixed(2)}</span>
                 </button>
                 <button onClick={() => processPaymentWithTip(activePaymentTotal * 0.18)} style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                   <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a1b1e' }}>18%</span><br/>
                   <span style={{fontSize:'1rem', color: 'var(--pink)', fontWeight:'700'}}>${(activePaymentTotal * 0.18).toFixed(2)}</span>
                 </button>
                 <button onClick={() => processPaymentWithTip(activePaymentTotal * 0.20)} style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }}>
                   <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1a1b1e' }}>20%</span><br/>
                   <span style={{fontSize:'1rem', color: 'var(--pink)', fontWeight:'700'}}>${(activePaymentTotal * 0.20).toFixed(2)}</span>
                 </button>
              </div>

              <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '2rem', display: 'flex', gap: '1.25rem' }}>
                 <div style={{ flex: '1' }}>
                   <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Amount ($)</label>
                   <input type="number" value={customTip} onChange={(e) => setCustomTip(e.target.value)} style={{ width: '100%', padding: '1.25rem', fontSize: '1.5rem', borderRadius: '16px', border: '2px solid #e2e8f0', color: '#1a1b1e', fontWeight: '900' }} placeholder="0.00" />
                 </div>
                 <button onClick={() => processPaymentWithTip(Number(customTip) || 0)} className="btn" style={{ flex: '1', height: '62px', background: '#1a1b1e', color: 'white', fontSize: '1.2rem', alignSelf: 'flex-end', borderRadius: '16px', fontWeight: '900' }}>Confirm</button>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                 <button onClick={() => processPaymentWithTip(0)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: '900', fontSize: '1rem', textDecoration: 'underline', cursor: 'pointer', letterSpacing: '0.5px' }}>NO TIP</button>
              </div>
           </div>
        </div>
      )}

      {/* Dynamic Print Stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `...`}} />
    </div>
  );
}
