'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutClient({ table, order, items }: any) {
  const router = useRouter();
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [points, setPoints] = useState<number | null>(null);

  const subtotal = items.reduce((acc: number, item: any) => acc + item.unitPrice, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const handleLoyaltyLookup = () => {
    // mock loyalty lookup
    setPoints(198);
  };

  const handlePay = () => {
    alert('Payment successful!');
    router.push('/pos/floorplan');
  };

  return (
    <div className="flex h-full w-full" style={{ position: 'relative' }}>
      {/* LEFT PANE - Checkout options */}
      <div className="flex flex-col" style={{ width: '40%', borderRight: '1px solid var(--border-color)', backgroundColor: '#f9fafb', height: '100%', overflowY: 'auto' }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #ccc', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
           <button onClick={() => router.back()} style={{ marginRight: '1rem', background: 'transparent', fontSize: '1rem', color: 'var(--primary)' }}>&lt; Back</button>
           <span style={{ fontSize: '1.1rem' }}>Checkout - {table.name}</span>
        </div>
        
        <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#666', backgroundColor: '#e5e7eb', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Options
        </div>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <span>All on One</span>
          <span style={{ fontWeight: 'bold' }}>✓</span>
        </div>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <span>Split by Seating</span>
          <span style={{ color: '#888' }}>&gt;</span>
        </div>
        
        <div style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#666', backgroundColor: '#e5e7eb', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Payment Options
        </div>
        <div onClick={handlePay} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer' }}>Cash &gt;</div>
        <div onClick={handlePay} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer' }}>Credit Card &gt;</div>
        <div onClick={() => setShowLoyalty(true)} style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', backgroundColor: '#e0f2fe', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>@</span> 
           Loyalty
        </div>
        <div style={{ padding: '1rem', borderBottom: '1px solid #eee', backgroundColor: 'white' }}>Gift Card</div>
      </div>

      {/* RIGHT PANE - Receipt */}
      <div className="flex flex-col items-center justify-center" style={{ flex: '1', backgroundColor: '#9ca3af', height: '100%', overflowY: 'auto' }}>
        
        <div style={{ width: '400px', backgroundColor: '#fff', padding: '2rem 1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', fontFamily: 'monospace', my: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Woodframe</h2>
            <p>1407 Broadway #3701</p>
            <p>New York, NY</p>
            <p>Printed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div style={{ borderBottom: '1px dashed #333', borderTop: '1px dashed #333', padding: '1rem 0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
             <div>
               <p>Order #: {order.id}</p>
               <p>Table: {table.name}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
               <p>1 guest</p>
               <p>Waiter: Admin</p>
             </div>
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
             <div className="flex justify-between" style={{ marginBottom: '0.25rem' }}><span>Food Total:</span><span>${subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between" style={{ marginBottom: '0.25rem' }}><span>Alcohol Total:</span><span>$0.00</span></div>
             
             <div className="flex justify-between" style={{ marginTop: '0.75rem' }}><span>SubTotal:</span><span>${subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between"><span>Tax 1:</span><span>${tax.toFixed(2)}</span></div>
             <div className="flex justify-between" style={{ fontWeight: 'bold', fontSize: '1.4rem', marginTop: '1rem' }}>
                <span>Total:</span><span>${total.toFixed(2)}</span>
             </div>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px dashed #333', paddingTop: '1rem' }}>
             <p style={{ marginBottom: '0.5rem' }}>Thank You<br/>Please Come Again!</p>
             <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>Tip Guide:</p>
             <p>10%=${(subtotal * 0.1).toFixed(2)}  15%=${(subtotal * 0.15).toFixed(2)}  20%=${(subtotal * 0.2).toFixed(2)}</p>
          </div>
        </div>

      </div>

      {/* LOYALTY MODAL */}
      {showLoyalty && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ width: '450px', backgroundColor: 'white', borderRadius: '8px', padding: '2.5rem', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
              <button 
                onClick={() => setShowLoyalty(false)} 
                style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '1.5rem', background: 'transparent', border: 'none', color: '#666' }}
              >
                ✕
              </button>
              
              <div style={{ textAlign: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}>@</div>
                    <h2 style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 'bold' }}>Woodframe <span style={{ fontWeight: 'normal' }}>Loyalty</span></h2>
                 </div>
                 
                 {points === null ? (
                   <div>
                     <div className="flex justify-between" style={{ borderBottom: '2px solid var(--primary)', marginBottom: '1.5rem' }}>
                        <span style={{ padding: '0.5rem', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>EXISTING ACCOUNT</span>
                        <span style={{ padding: '0.5rem', color: '#888', fontSize: '0.9rem' }}>NEW ACCOUNT</span>
                     </div>
                     <div style={{ textAlign: 'left' }}>
                       <label style={{ fontSize: '0.8rem', color: '#666' }}>Phone Number or Email</label>
                       <input type="text" style={{ width: '100%', marginBottom: '0.5rem', padding: '0.75rem', fontSize: '1.1rem', border: 'none', borderBottom: '1px solid #ccc', borderRadius: 0 }} defaultValue="15559993434" />
                       <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2rem' }}>For phone number, enter country code and phone number.</p>
                     </div>
                     <button onClick={handleLoyaltyLookup} className="btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>Search for Loyalty Account</button>
                   </div>
                 ) : (
                   <div>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Lana Avery</h3>
                     <div style={{ border: '2px solid #d93025', padding: '0.5rem', margin: '0 0 1.5rem 0', display: 'inline-block', color: '#d93025', fontWeight: 'bold' }}>
                       Points: {points}
                     </div>
                     <p style={{ color: '#444', marginBottom: '2rem', fontSize: '1.1rem' }}>You've successfully checked in. Your points will be earned upon payment.</p>
                     
                     <div style={{ border: '2px solid #d93025', padding: '1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '1rem' }}>
                       <span style={{ color: '#d93025', fontWeight: 'bold' }}>🎁 Redeem Rewards</span>
                       <span style={{ color: '#d93025' }}>&gt;</span>
                     </div>
                     <div style={{ borderBottom: '1px solid #eee', padding: '1rem', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                       <span>Account Options</span><span style={{ color: '#aaa' }}>&gt;</span>
                     </div>
                     <div style={{ borderBottom: '1px solid #eee', padding: '1rem', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                       <span>Switch Accounts</span><span style={{ color: '#aaa' }}>&gt;</span>
                     </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
