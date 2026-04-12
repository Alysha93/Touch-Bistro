'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder, fastCheckout, deleteOrderItem } from '../actions';

type MenuItem = { id?: number, categoryId: number, name: string, price: number, imageColor: string | null };
type Modifier = { id: number, menuItemId: number, name: string, price: number };

export default function OrderInterface({ table, categories, menuItems, modifiers = [], staffId, staffRole, initialOrderItems = [] }: any) {
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
    router.push('/pos/floorplan');
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
      // Just find the active order ID from the first mapped item if everything is submitted
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
    <div className="flex h-full w-full" style={{ position: 'relative' }}>
      {/* LEFT PANE - MENU */}
      <div className="flex-col" style={{ flex: '2', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-app)', height: '100%' }}>
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

        <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', overflowY: 'auto' }}>
          {displayedItems.map((item: MenuItem & { isAvailable?: boolean }) => (
             <div 
               key={item.id} 
               onClick={() => { if (item.isAvailable !== false) handleItemClick(item) }}
               style={{
                 height: '130px', borderRadius: 'var(--radius-sm)',
                 backgroundColor: item.imageColor || '#333',
                 color: 'var(--text-inverse)', position: 'relative', cursor: item.isAvailable !== false ? 'pointer' : 'not-allowed',
                 boxShadow: 'inset 0 -40px 40px rgba(0,0,0,0.5)', overflow: 'hidden',
                 opacity: item.isAvailable !== false ? 1 : 0.5
               }}
             >
               {item.isAvailable === false && (
                 <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <span style={{ fontWeight: 'bold', letterSpacing: '2px', color: '#ffaaaa', transform: 'rotate(-15deg)', border: '2px solid #ffaaaa', padding: '4px 8px' }}>86'd</span>
                 </div>
               )}
               <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, textAlign: 'center' }}>
                 <p style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: '1.1', marginBottom: '4px' }}>{item.name}</p>
                 <p style={{ fontSize: '0.8rem', opacity: 0.9 }}>${item.price.toFixed(2)}</p>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANE - CURRENT ORDER */}
      <div className="flex flex-col" style={{ flex: '1', backgroundColor: '#f8fafc', height: '100%', color: 'black' }}>
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
                    color: activeSeat === seat ? 'white' : 'black',
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
              <div 
                key={idx} 
                onClick={() => setEditItemIndex(idx)}
                className="flex items-center justify-between" 
                style={{ padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: editItemIndex === idx ? '#f1f5f9' : 'transparent' }}
              >
                 <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-2">
                     {!isRegister && <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>S{oi.seatNumber}</span>}
                     <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{oi.qty > 1 ? `${oi.qty}x ` : ''}{oi.originalName}</span>
                   </div>
                   {oi.name !== oi.originalName && (
                     <span style={{ fontSize: '0.8rem', color: '#64748b', paddingLeft: isRegister ? '0' : '28px' }}>{oi.name.replace(`${oi.originalName} `, '')}</span>
                   )}
                 </div>
                 <span style={{ fontWeight: 600 }}>${(oi.price * oi.qty).toFixed(2)}</span>
              </div>
           ))}
        </div>

        <div style={{ borderTop: '2px solid var(--border-color)', flexShrink: 0 }}>
          <div className="flex justify-between" style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.25rem', backgroundColor: '#e2e8f0' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {/* Action Buttons Hub */}
          <div style={{ display: 'flex', gap: '2px', backgroundColor: '#94a3b8' }}>
            <button onClick={handleSendOrder} style={{ flex: 1, padding: '1rem', backgroundColor: '#475569', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
               Send Order 🎟️
            </button>
            <button onClick={handleCheckout} style={{ flex: 1, padding: '1rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
               Checkout / Pay &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* MODIFIERS MODAL */}
      {selectedItemForModifiers && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '500px', backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow-xl)', color: 'black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
               <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Modify: {selectedItemForModifiers.name}</h2>
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
                      padding: '1rem', border: `2px solid ${isSelected ? 'var(--primary)' : '#e2e8f0'}`, 
                      borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                      backgroundColor: isSelected ? '#f0fdf4' : 'transparent', fontWeight: isSelected ? 'bold' : 'normal'
                    }}
                  >
                     <span>{mod.name}</span>
                     <span>{mod.price > 0 ? `+$${mod.price.toFixed(2)}` : 'Free'}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => addItemToOrder(selectedItemForModifiers, selectedModifiers)} className="btn-primary w-full" style={{ padding: '1rem', fontSize: '1.1rem' }}>
              Add to Order
            </button>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItemIndex !== null && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '400px', backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: 'var(--shadow-xl)', color: 'black' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Edit Item</h2>
            
            <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              {orderItems[editItemIndex].originalName}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   if (newItems[editItemIndex].qty > 1) {
                     newItems[editItemIndex].qty -= 1;
                     setOrderItems(newItems);
                   }
                 }} 
                 style={{ width: '50px', height: '50px', borderRadius: '25px', border: '1px solid #cbd5e1', fontSize: '1.5rem', background: '#f8fafc', cursor: 'pointer' }}
               >-</button>
               
               <span style={{ fontSize: '2rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>
                 {orderItems[editItemIndex].qty}
               </span>

               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   newItems[editItemIndex].qty += 1;
                   setOrderItems(newItems);
                 }} 
                 style={{ width: '50px', height: '50px', borderRadius: '25px', border: '1px solid #cbd5e1', fontSize: '1.5rem', background: '#f8fafc', cursor: 'pointer' }}
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
              style={{ width: '100%', padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: 'bold', marginBottom: '1rem', cursor: 'pointer' }}
            >
              Remove from Order  (Void)
            </button>
            
            <button onClick={() => setEditItemIndex(null)} className="btn-secondary w-full" style={{ padding: '1rem' }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
