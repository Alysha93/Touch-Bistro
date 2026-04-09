'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder } from '../actions';

type MenuItem = { id: number, categoryId: number, name: string, price: number, imageColor: string | null };

export default function OrderInterface({ table, categories, menuItems, staffId }: any) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 1);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [activeSeat, setActiveSeat] = useState(1);

  const displayedItems = menuItems.filter((i: MenuItem) => i.categoryId === activeCategory);

  const addItem = (item: MenuItem) => {
    setOrderItems([...orderItems, { ...item, menuItemId: item.id, seatNumber: activeSeat, qty: 1, unitPrice: item.price }]);
  };

  const handleCheckout = async () => {
    if (orderItems.length === 0) {
      router.push(`/pos/table/${table.id}/checkout`);
      return;
    }
    const res = await submitOrder(table.id, staffId, orderItems);
    if (res.success) {
      router.push(`/pos/table/${table.id}/checkout?orderId=${res.orderId}`);
    }
  };

  const total = orderItems.reduce((acc, curr) => acc + curr.price, 0);
  const isRegister = table.name.includes("Register");

  return (
    <div className="flex h-full w-full">
      {/* LEFT PANE - MENU */}
      <div className="flex-col" style={{ flex: '2', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', height: '100%' }}>
        {/* Top Header categories */}
        <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'white', overflowX: 'auto', flexShrink: 0 }}>
           <div style={{ padding: '1rem', cursor: 'pointer', borderRight: '1px solid #333' }} onClick={() => router.push('/pos/floorplan')}>
             &larr; Back
           </div>
           {categories.map((c: any) => (
             <div 
               key={c.id} 
               onClick={() => setActiveCategory(c.id)}
               style={{ 
                 padding: '1rem 1.5rem', cursor: 'pointer', whiteSpace: 'nowrap',
                 backgroundColor: activeCategory === c.id ? '#334155' : 'transparent',
                 fontWeight: activeCategory === c.id ? 'bold' : 'normal',
                 borderBottom: activeCategory === c.id ? '3px solid var(--accent)' : '3px solid transparent'
               }}
             >
               {c.name}
             </div>
           ))}
        </div>

        {/* Menu Items Grid */}
        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', overflowY: 'auto' }}>
          {displayedItems.map((item: MenuItem) => (
             <div 
               key={item.id} 
               onClick={() => addItem(item)}
               style={{
                 height: '130px', borderRadius: 'var(--radius-sm)',
                 backgroundColor: item.imageColor || '#333',
                 color: 'white', position: 'relative', cursor: 'pointer',
                 boxShadow: 'inset 0 -40px 40px rgba(0,0,0,0.5)', overflow: 'hidden'
               }}
             >
               <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, textAlign: 'center' }}>
                 <p style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: '1.1', marginBottom: '4px' }}>{item.name}</p>
                 <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>${item.price.toFixed(2)}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANE - CURRENT ORDER */}
      <div className="flex flex-col" style={{ flex: '1', backgroundColor: 'var(--bg-panel)', height: '100%' }}>
        <div className="flex justify-between items-center" style={{ backgroundColor: '#2d1b11', color: 'white', padding: '0.75rem 1rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.9rem' }}>{isRegister ? 'Current Order For Cash Register' : `Shared Order For Table ${table.name}`}</span>
        </div>
        
        {!isRegister && (
           <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
              {[1,2,3].map(seat => (
                <div 
                  key={seat}
                  onClick={() => setActiveSeat(seat)}
                  style={{
                    flex: 1, textAlign: 'center', padding: '0.5rem', cursor: 'pointer',
                    backgroundColor: activeSeat === seat ? 'var(--accent)' : '#e5e7eb',
                    color: activeSeat === seat ? 'white' : 'var(--text-main)',
                    fontWeight: activeSeat === seat ? 'bold' : 'normal',
                    fontSize: '0.9rem'
                  }}>
                  Seat {seat}
                </div>
              ))}
           </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
           {orderItems.map((oi, idx) => (
              <div key={idx} className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                 <div className="flex items-center gap-2">
                   {!isRegister && <span style={{ fontSize: '0.75rem', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>S{oi.seatNumber}</span>}
                   <span style={{ fontSize: '0.95rem' }}>{oi.name}</span>
                 </div>
                 <span style={{ fontWeight: 600 }}>${oi.price.toFixed(2)}</span>
              </div>
           ))}
        </div>

        <div style={{ borderTop: '2px solid var(--border-color)', flexShrink: 0 }}>
          <div className="flex justify-between" style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#e2e8f0' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {/* Fast Checkout Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#94a3b8' }}>
             {['Exact', '$10', '$20', '$50', 'Cash', 'Debit', 'Credit', 'Tab'].map(label => (
               <button 
                 key={label}
                 style={{ padding: '0.75rem 0', backgroundColor: '#64748b', color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: '600' }}
               >
                 {label}
               </button>
             ))}
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full" style={{ padding: '1rem', borderRadius: 0, fontSize: '1.1rem' }}>
            Checkout / Print &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
