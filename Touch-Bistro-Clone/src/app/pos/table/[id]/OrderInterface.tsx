'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder, fastCheckout, deleteOrderItem } from '../actions';

type MenuItem = { id?: number, categoryId: number, name: string, price: number, imageColor: string | null };
type Modifier = { id: number, menuItemId: number, name: string, price: number };

export default function OrderInterface({ table, allTables = [], categories, menuItems, modifiers = [], staffId, staffRole, initialOrderItems = [] }: any) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 1);
  const [activeSeat, setActiveSeat] = useState(1);
  
  // Initialize with the Database's persisted open orders
  const [orderItems, setOrderItems] = useState<any[]>(() => {
    return initialOrderItems.map((oi: any) => ({
      ...oi,
      originalName: oi.name, // Fallback for UI
      price: oi.unitPrice
    }));
  });

  // Modifiers Modal State
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  
  // Edit Item Modal State
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);

  const displayedItems = menuItems.filter((i: MenuItem) => i.categoryId === activeCategory);

  const handleItemClick = (item: MenuItem) => {
    const itemModifiers = modifiers.filter((m: Modifier) => m.menuItemId === item.id);
    if (itemModifiers.length > 0) {
      setSelectedItemForModifiers(item);
      setSelectedModifiers([]);
    } else {
      addItemToOrder(item, []);
    }
  };

  const addItemToOrder = (item: MenuItem, itemModifiers: Modifier[]) => {
    let finalName = item.name;
    let finalPrice = item.price;
    if (itemModifiers.length > 0) {
      finalName += ` (${itemModifiers.map(m => m.name).join(', ')})`;
      finalPrice += itemModifiers.reduce((acc, m) => acc + m.price, 0);
    }
    
    setOrderItems([...orderItems, { 
      ...item,
      id: undefined, // Explicitly undefined to track that it hasn't been submitted to DB
      originalName: item.name,
      name: finalName,
      menuItemId: item.id, 
      seatNumber: activeSeat, 
      qty: 1, 
      unitPrice: finalPrice, 
      price: finalPrice 
    }]);
    setSelectedItemForModifiers(null);
  };

  const toggleModifier = (mod: Modifier) => {
    if (selectedModifiers.find(m => m.id === mod.id)) {
      setSelectedModifiers(selectedModifiers.filter(m => m.id !== mod.id));
    } else {
      setSelectedModifiers([...selectedModifiers, mod]);
    }
  };

  const handleSendOrder = async () => {
    const unsubmittedItems = orderItems.filter(oi => !oi.id);
    if (unsubmittedItems.length > 0) {
      await submitOrder(table.id, staffId, unsubmittedItems);
    }
    // Refresh the table visual status directly
    router.refresh();
  };

  const handleCheckout = async () => {
    if (orderItems.length === 0) {
      router.push(`/pos/table/${table.id}/checkout`);
      return;
    }
    const unsubmittedItems = orderItems.filter(oi => !oi.id);
    let finalOrderId = null;
    
    if (unsubmittedItems.length > 0) {
      const res = await submitOrder(table.id, staffId, unsubmittedItems);
      finalOrderId = res.orderId;
    } else {
      finalOrderId = orderItems[0]?.orderId;
    }
    
    if (finalOrderId) {
      router.push(`/pos/table/${table.id}/checkout?orderId=${finalOrderId}`);
    } else {
      router.push(`/pos/table/${table.id}/checkout`);
    }
  };

  const handleFastCheckout = async (label: string) => {
    if (orderItems.length === 0) return;
    const unsubmittedItems = orderItems.filter(oi => !oi.id);
    await fastCheckout(table.id, staffId, unsubmittedItems, 0, label);
    alert(`Fast Checkout successful: ${label} for $${total.toFixed(2)}`);
    router.push('/pos/floorplan');
  };

  const total = orderItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const isRegister = table.name.includes("Register");

  return (
    <div className="flex h-full w-full" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* PANE 1 - TABLES GRID (LEFT) */}
      <div className="flex-col" style={{ width: '280px', borderRight: '1px solid var(--border-color)', backgroundColor: '#f1f5f9', height: '100%', overflowY: 'auto' }}>
         <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverse)', textAlign: 'center', fontWeight: 'bold' }}>
           Tables & Rooms
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', padding: '1rem' }}>
           {allTables.map((t: any) => (
              <div 
                key={t.id}
                onClick={() => {
                  if (t.id !== table.id) {
                     router.push(`/pos/table/${t.id}`);
                  }
                }}
                style={{
                  height: '100px',
                  borderRadius: t.name.includes('Register') ? 'var(--radius-sm)' : '50%',
                  backgroundColor: t.id === table.id ? 'var(--primary)' : (t.status === 'open' ? 'var(--success)' : (t.status === 'seated' ? '#F59E0B' : 'var(--danger)')),
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  fontWeight: 'bold', fontSize: '1.2rem',
                  cursor: 'pointer',
                  border: t.id === table.id ? '4px solid #1e293b' : 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  transform: 'scale(1)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                {t.name}
              </div>
           ))}
         </div>
      </div>

      {/* PANE 2 - ACTIVE ORDER (MIDDLE) */}
      <div className="flex flex-col" style={{ minWidth: '380px', flex: '1', borderRight: '1px solid var(--border-color)', backgroundColor: '#ffffff', height: '100%', color: 'black' }}>
        <div className="flex justify-between items-center" style={{ backgroundColor: '#2d1b11', color: 'white', padding: '0.75rem 1rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{isRegister ? 'Current Order For Cash Register' : `Order For Table ${table.name}`}</span>
        </div>
        
        {!isRegister && (
           <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
              {[1,2,3].map(seat => (
                <div 
                  key={seat}
                  onClick={() => setActiveSeat(seat)}
                  style={{
                    flex: 1, textAlign: 'center', padding: '0.75rem', cursor: 'pointer',
                    backgroundColor: activeSeat === seat ? 'var(--accent)' : '#e5e7eb',
                    color: activeSeat === seat ? 'white' : '#334155',
                    fontWeight: activeSeat === seat ? 'bold' : 'normal',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s ease'
                  }}>
                  Seat {seat}
                </div>
              ))}
           </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
           {orderItems.length === 0 ? (
             <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '3rem', fontStyle: 'italic' }}>Ticket is empty. Add items from the menu.</div>
           ) : (
             orderItems.map((oi, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setEditItemIndex(idx)}
                  className="flex items-center justify-between" 
                  style={{ padding: '0.75rem 0.5rem', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: editItemIndex === idx ? '#f1f5f9' : 'transparent', borderRadius: '4px' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = editItemIndex === idx ? '#f1f5f9' : 'transparent'}
                >
                   <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2">
                       {!isRegister && <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#1e293b', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>S{oi.seatNumber}</span>}
                       <span style={{ fontSize: '1.05rem', fontWeight: '600', color: oi.id ? '#0f172a' : '#10b981' }}>
                         {oi.qty > 1 ? `${oi.qty}x ` : ''}{oi.originalName} 
                         {!oi.id && <span style={{ fontSize: '0.7rem', verticalAlign: 'top', color: '#10b981' }}>*</span>}
                       </span>
                     </div>
                     {oi.name !== oi.originalName && (
                       <span style={{ fontSize: '0.85rem', color: '#64748b', paddingLeft: isRegister ? '0' : '28px' }}>{oi.name.replace(`${oi.originalName} `, '')}</span>
                     )}
                   </div>
                   <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${(oi.price * oi.qty).toFixed(2)}</span>
                </div>
             ))
           )}
        </div>

        <div style={{ borderTop: '2px solid var(--border-color)', flexShrink: 0 }}>
          <div className="flex justify-between" style={{ padding: '1.25rem 1rem', fontWeight: 'bold', fontSize: '1.4rem', backgroundColor: '#f8fafc' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', gap: '2px', backgroundColor: '#cbd5e1' }}>
            <button 
              onClick={handleSendOrder} 
              style={{ flex: 1, padding: '1.25rem', backgroundColor: '#334155', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#334155'}
            >
               Send Order 🎟️
            </button>
            <button 
              onClick={handleCheckout} 
              style={{ flex: 1, padding: '1.25rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
               Checkout / Pay &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* PANE 3 - MENU (RIGHT) */}
      <div className="flex-col" style={{ flex: '2', backgroundColor: 'var(--bg-app)', height: '100%' }}>
        <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-dark)', color: 'var(--text-inverse)', overflowX: 'auto', flexShrink: 0 }}>
           {categories.map((c: any) => (
             <div 
               key={c.id} 
               onClick={() => setActiveCategory(c.id)}
               style={{ 
                 padding: '1.25rem 1.5rem', cursor: 'pointer', whiteSpace: 'nowrap',
                 backgroundColor: activeCategory === c.id ? 'var(--primary-hover)' : 'transparent',
                 fontWeight: activeCategory === c.id ? 'bold' : 'normal',
                 borderBottom: activeCategory === c.id ? '4px solid var(--accent)' : '4px solid transparent',
                 transition: 'background-color 0.2s ease'
               }}
             >
               {c.name}
             </div>
           ))}
        </div>

        <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', overflowY: 'auto', height: 'calc(100% - 65px)' }}>
          {displayedItems.map((item: MenuItem & { isAvailable?: boolean }) => (
             <div 
               key={item.id} 
               onClick={() => { if (item.isAvailable !== false) handleItemClick(item) }}
               style={{
                 height: '140px', borderRadius: 'var(--radius-md)',
                 backgroundColor: item.imageColor || '#475569',
                 color: 'var(--text-inverse)', position: 'relative', cursor: item.isAvailable !== false ? 'pointer' : 'not-allowed',
                 boxShadow: 'inset 0 -50px 50px rgba(0,0,0,0.6)', overflow: 'hidden',
                 opacity: item.isAvailable !== false ? 1 : 0.5,
                 transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                 transform: 'scale(1)'
               }}
               onMouseOver={(e) => { 
                 if (item.isAvailable !== false) {
                   e.currentTarget.style.transform = 'scale(1.05)'; 
                   e.currentTarget.style.boxShadow = 'inset 0 -50px 50px rgba(0,0,0,0.4), 0 10px 15px -3px rgba(0,0,0,0.3)';
                 }
               }}
               onMouseOut={(e) => { 
                 e.currentTarget.style.transform = 'scale(1)'; 
                 e.currentTarget.style.boxShadow = 'inset 0 -50px 50px rgba(0,0,0,0.6)';
               }}
             >
               {item.isAvailable === false && (
                 <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <span style={{ fontWeight: 'bold', letterSpacing: '2px', color: '#ffaaaa', transform: 'rotate(-15deg)', border: '2px solid #ffaaaa', padding: '4px 8px' }}>86'd</span>
                 </div>
               )}
               <div style={{ position: 'absolute', bottom: 12, left: 10, right: 10, textAlign: 'center' }}>
                 <p style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.2', marginBottom: '6px' }}>{item.name}</p>
                 <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>${item.price.toFixed(2)}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* MODIFIERS MODAL */}
      {selectedItemForModifiers && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '500px', backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: 'var(--shadow-xl)', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Modify: {selectedItemForModifiers.name}</h2>
               <button onClick={() => setSelectedItemForModifiers(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {modifiers.filter((m: Modifier) => m.menuItemId === selectedItemForModifiers.id).map((mod: Modifier) => {
                const isSelected = !!selectedModifiers.find(selected => selected.id === mod.id);
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => toggleModifier(mod)}
                    style={{ 
                      padding: '1.25rem', border: `2px solid ${isSelected ? 'var(--primary)' : '#e2e8f0'}`, 
                      borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#f0fdf4' : 'transparent', fontWeight: isSelected ? 'bold' : 'normal',
                      transition: 'all 0.15s ease',
                      transform: 'scale(1)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                     <span style={{ fontSize: '1.1rem' }}>{mod.name}</span>
                     <span style={{ fontSize: '1.1rem' }}>{mod.price > 0 ? `+$${mod.price.toFixed(2)}` : 'Free'}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => addItemToOrder(selectedItemForModifiers, selectedModifiers)} className="w-full" style={{ padding: '1.25rem', fontSize: '1.2rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              Add to Order
            </button>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItemIndex !== null && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '450px', backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: 'var(--shadow-xl)', color: 'black' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Edit Item</h2>
            
            <p style={{ textAlign: 'center', fontSize: '1.3rem', marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              {orderItems[editItemIndex].originalName}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   if (newItems[editItemIndex].qty > 1) {
                     newItems[editItemIndex].qty -= 1;
                     setOrderItems(newItems);
                   }
                 }} 
                 style={{ width: '60px', height: '60px', borderRadius: '30px', border: '2px solid #cbd5e1', fontSize: '2rem', background: '#f8fafc', cursor: 'pointer', transition: 'background 0.1s ease' }}
                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
               >-</button>
               
               <span style={{ fontSize: '2.5rem', fontWeight: 'bold', width: '50px', textAlign: 'center' }}>
                 {orderItems[editItemIndex].qty}
               </span>

               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   newItems[editItemIndex].qty += 1;
                   setOrderItems(newItems);
                 }} 
                 style={{ width: '60px', height: '60px', borderRadius: '30px', border: '2px solid #cbd5e1', fontSize: '2rem', background: '#f8fafc', cursor: 'pointer', transition: 'background 0.1s ease' }}
                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
               >+</button>
            </div>

            <button 
              onClick={async () => {
                const item = orderItems[editItemIndex];
                if (item.id) {
                  // Admin override required for DB items
                  if (staffRole !== 'admin') {
                    alert('Admin Role Required: This item has already been submitted to the kitchen ticket.');
                    return;
                  }
                  await deleteOrderItem(item.id, table.id);
                }
                const newItems = [...orderItems];
                newItems.splice(editItemIndex, 1);
                setOrderItems(newItems);
                setEditItemIndex(null);
              }} 
              style={{ width: '100%', padding: '1.25rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: '2px solid #fca5a5', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', cursor: 'pointer', transition: 'background 0.1s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            >
              Remove from Order (Void)
            </button>
            
            <button 
              onClick={() => setEditItemIndex(null)} 
              style={{ width: '100%', padding: '1.25rem', backgroundColor: '#f1f5f9', color: '#334155', border: '2px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.1s ease' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
