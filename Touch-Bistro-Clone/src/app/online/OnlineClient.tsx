'use client'
import { useState } from 'react';
import { submitOnlineOrder, checkLoyalty } from './actions';

export default function OnlineClient({ categories, items }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [loyaltyPhone, setLoyaltyPhone] = useState('');
  const [loyaltyAccount, setLoyaltyAccount] = useState<any>(null);
  const [checkoutState, setCheckoutState] = useState<'shopping' | 'success'>('shopping');

  const displayedItems = items.filter((i: any) => i.categoryId === activeCategory);

  const addToCart = (item: any) => {
    setCart([...cart, { ...item, qty: 1, unitPrice: item.price }]);
  };

  const handleLogin = async () => {
    const res = await checkLoyalty(loyaltyPhone);
    if(res) {
      setLoyaltyAccount(res);
    } else {
      alert("Account not found. Try '15559993434'");
    }
  };

  const submitOrder = async () => {
    if(cart.length === 0) return;
    const res = await submitOnlineOrder(
      cart.map(i => ({ menuItemId: i.id, qty: i.qty, unitPrice: i.unitPrice })),
      loyaltyAccount ? loyaltyPhone : ''
    );
    if(res.success) {
      setCheckoutState('success');
      setCart([]);
    }
  };

  const total = cart.reduce((acc, i) => acc + i.unitPrice, 0);

  if (checkoutState === 'success') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4' }}>
         <h1 style={{ fontSize: '3rem', color: '#166534', fontWeight: 'bold' }}>Success!</h1>
         <p style={{ fontSize: '1.5rem', color: '#15803d', marginTop: '1rem' }}>Your order has been routed to the kitchen.</p>
         {loyaltyAccount && <p style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>Loyalty Points have been credited to {loyaltyAccount.name}!</p>}
         <button onClick={() => setCheckoutState('shopping')} className="btn-primary" style={{ padding: '1rem 3rem', marginTop: '3rem', borderRadius: '8px' }}>Order Again</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
       {/* Header */}
       <header style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-md)', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>TouchBistro Takeout</span>
          </div>
          <div>
            {!loyaltyAccount ? (
               <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Loyalty Member?</span>
                  <input type="text" placeholder="Phone e.g. 15559993434" value={loyaltyPhone} onChange={(e) => setLoyaltyPhone(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', width: '180px' }} />
                  <button onClick={handleLogin} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#e2e8f0', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
               </div>
            ) : (
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 1.5rem', borderRadius: '24px' }}>
                  <span style={{ fontWeight: 'bold' }}>👋 {loyaltyAccount.name}</span>
                  <span style={{ backgroundColor: 'white', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>{loyaltyAccount.points} pts</span>
               </div>
            )}
          </div>
       </header>

       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Menu Catalog */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
             {/* Category Nav */}
             <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', padding: '0 1.5rem' }}>
                {categories.map((c: any) => (
                  <div key={c.id} onClick={() => setActiveCategory(c.id)} style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', borderBottom: activeCategory === c.id ? `3px solid var(--primary)` : '3px solid transparent', fontWeight: activeCategory === c.id ? 'bold' : 'normal', color: activeCategory === c.id ? 'var(--primary)' : '#64748b', fontSize: '1.1rem' }}>
                     {c.name}
                  </div>
                ))}
             </div>
             
             {/* Items Grids */}
             <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', alignContent: 'start' }}>
                {displayedItems.map((item: any) => (
                   <div key={item.id} onClick={() => { if(item.isAvailable) addToCart(item) }} style={{ cursor: item.isAvailable ? 'pointer' : 'not-allowed', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid #e2e8f0', transition: 'transform 0.2s', opacity: item.isAvailable ? 1 : 0.5 }}>
                      <div style={{ height: '160px', backgroundColor: item.imageColor || '#94a3b8', position: 'relative' }}>
                         {item.isAvailable && (
                           <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'white', padding: '0.5rem 1rem', borderTopLeftRadius: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                              + Add
                           </div>
                         )}
                         {!item.isAvailable && (
                           <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                              Sold Out
                           </div>
                         )}
                      </div>
                      <div style={{ padding: '1.25rem' }}>
                         <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>{item.name}</h3>
                         <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>${item.price.toFixed(2)}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Cart Pane */}
          <div style={{ width: '380px', backgroundColor: '#f1f5f9', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
             <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', display: 'flex', justifyContent: 'space-between' }}>
                   <span>Your Cart</span>
                   <span style={{ backgroundColor: 'var(--primary)', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{cart.length}</span>
                </h2>
             </div>
             <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {cart.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '3rem', fontSize: '1.1rem' }}>Cart is empty</p>}
                {cart.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '8px', marginBottom: '0.75rem', boxShadow: 'var(--shadow-sm)' }}>
                     <span style={{ fontWeight: '500' }}>{c.qty}x {c.name}</span>
                     <span style={{ fontWeight: 'bold', color: '#0f172a' }}>${c.unitPrice.toFixed(2)}</span>
                  </div>
                ))}
             </div>
             <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                   <span>Order Total</span>
                   <span>${total.toFixed(2)}</span>
                </div>
                <button onClick={submitOrder} className={cart.length > 0 ? "btn-primary" : "btn"} disabled={cart.length === 0} style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', borderRadius: '8px', cursor: cart.length > 0 ? 'pointer' : 'not-allowed', opacity: cart.length > 0 ? 1 : 0.5 }}>
                   {cart.length > 0 ? 'Place Takeout Order' : 'Cart Empty'}
                </button>
             </div>
          </div>
       </div>
    </div>
  )
}
