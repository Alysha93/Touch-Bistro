'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder, deleteOrderItem } from '../actions';
import Image from 'next/image';


type MenuItem = { id?: number, categoryId: number, name: string, price: number, imageColor: string | null, imageUrl?: string, allergenInfo?: string };
type Modifier = { id: number, menuItemId: number, name: string, price: number };

export default function OrderInterface({ table, allTables = [], categories, menuItems, modifiers = [], staffId, staffRole, initialOrderItems = [] }: any) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 1);
  const [activeSeat, setActiveSeat] = useState(1);
  
  const [orderItems, setOrderItems] = useState<any[]>(() => {
    return initialOrderItems.map((oi: any) => ({
      ...oi,
      originalName: oi.name,
      price: oi.unitPrice
    }));
  });

  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [allergenWarningItem, setAllergenWarningItem] = useState<MenuItem | null>(null);
  const [splitMode, setSplitMode] = useState<null | 'seat' | 'equal'>(null);
  const [splitCount, setSplitCount] = useState(2);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedItems = menuItems.filter((i: MenuItem) => i.categoryId === activeCategory);

  const handleItemClick = (item: MenuItem) => {
    if (item.allergenInfo && !allergenWarningItem) {
      setAllergenWarningItem(item);
      return;
    }
    
    const itemModifiers = modifiers.filter((m: Modifier) => m.menuItemId === item.id);
    if (itemModifiers.length > 0) {
      setSelectedItemForModifiers(item);
      setSelectedModifiers([]);
    } else {
      addItemToOrder(item, []);
    }
    setAllergenWarningItem(null);
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
      id: undefined,
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

  const total = orderItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const isRegister = table.name.includes("Register");

  return (
    <div className="flex h-full w-full animate-fade-in">
      
      {/* PANE 1 - TABLES SIDEBAR */}
      <div className="flex flex-col" style={{ width: '240px', borderRight: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
         <div className="flex items-center justify-center" style={{ height: '60px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.05em' }}>
           SERVICE AREAS
         </div>
         <div style={{ padding: '1rem', overflowY: 'auto' }} className="flex flex-col gap-3">
           {allTables.map((t: any) => (
              <div 
                key={t.id}
                onClick={() => t.id !== table.id && router.push(`/pos/table/${t.id}`)}
                className="pos-card flex flex-col items-center justify-center"
                style={{
                  height: '100px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  background: t.id === table.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  borderColor: t.id === table.id ? 'white' : 'rgba(255,255,255,0.15)',
                  borderRadius: t.name.includes('Register') ? 'var(--radius-lg)' : 'var(--radius-full)',
                  borderWidth: t.id === table.id ? '2.5px' : '1px'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem', fontWeight: '600' }}>{t.name.includes('Register') ? 'Register' : 'Table'}</span>
                <span style={{ fontWeight: '900', fontSize: '1.25rem', color: 'white' }}>{t.name.replace('Register', '01')}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.status === 'open' ? 'var(--success)' : (t.status === 'seated' ? 'var(--warning)' : 'var(--danger)'), marginTop: '0.75rem', boxShadow: '0 0 10px currentColor' }}></div>
              </div>
           ))}
         </div>
      </div>

      {/* PANE 2 - ACTIVE TICKET */}
      <div className="flex flex-col" style={{ width: '420px', borderRight: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
        <div className="flex flex-col" style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>
          <span className="badge badge-success" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>{isRegister ? 'Direct Sale' : 'Dine In'}</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{isRegister ? 'Cash Register' : `Table ${table.name}`}</h2>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
            Order #{(orderItems[0]?.orderId || 'NEW').toString().padStart(4, '0')} {mounted && `• ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
          </span>
        </div>
        
        {!isRegister && (
           <div className="flex" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', gap: '0.5rem' }}>
              {[1,2,3,4].map(seat => (
                <button 
                  key={seat}
                  onClick={() => setActiveSeat(seat)}
                  className="flex-1 py-2 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: activeSeat === seat ? 'rgba(255,255,255,0.2)' : 'transparent',
                    color: activeSeat === seat ? 'white' : 'rgba(255,255,255,0.5)',
                    border: activeSeat === seat ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent'
                  }}>
                  Seat {seat}
                </button>
              ))}
           </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }} className="flex flex-col gap-2">
           {orderItems.length === 0 ? (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, textAlign: 'center' }}>
               <span style={{ fontSize: '3.5rem' }}>🧾</span>
               <p style={{ marginTop: '1rem', fontWeight: '600', fontSize: '1.1rem' }}>Ticket is empty</p>
             </div>
           ) : (
             orderItems.map((oi, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setEditItemIndex(idx)}
                  className="flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/20"
                  style={{ 
                    background: editItemIndex === idx ? 'rgba(255,255,255,0.1)' : 'transparent', 
                    backdropFilter: editItemIndex === idx ? 'blur(10px)' : 'none'
                  }}
                >
                   <div className="flex flex-col flex-1">
                     <div className="flex items-center gap-2">
                       {!isRegister && <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>S{oi.seatNumber}</span>}
                       <span style={{ fontSize: '1.1rem', fontWeight: '700', color: oi.id ? 'white' : 'var(--success)' }}>
                         {oi.qty > 1 ? `${oi.qty}x ` : ''}{oi.originalName} 
                         {!oi.id && <span style={{ marginLeft: '6px', color: 'var(--success)', fontSize: '1.5rem', verticalAlign: 'middle' }}>•</span>}
                       </span>
                     </div>
                     {oi.name !== oi.originalName && (
                       <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontStyle: 'italic' }}>+ {oi.name.replace(`${oi.originalName} `, '').replace('(', '').replace(')', '')}</span>
                     )}
                   </div>
                   <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>${(oi.price * oi.qty).toFixed(2)}</span>
                </div>
             ))
           )}
        </div>

        <div style={{ padding: '1.75rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>Subtotal</span>
            <span style={{ fontWeight: '700' }}>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>Total</span>
            <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white' }}>${total.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setSplitMode('seat')} 
              className="btn btn-secondary flex-1"
              style={{ padding: '1rem 0' }}
            >
               Split
            </button>
            <button 
              onClick={handleSendOrder} 
              className="btn btn-secondary flex-1"
              style={{ padding: '1rem 0' }}
            >
               Send
            </button>
            <button 
              onClick={handleCheckout} 
              className="btn btn-primary flex-2"
              style={{ padding: '1rem 0', background: 'rgba(255,255,255,0.2)' }}
            >
               Pay & Finish
            </button>
          </div>
        </div>
      </div>

      {/* PANE 3 - MENU GRID */}
      <div className="flex flex-col flex-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex" style={{ padding: '1rem 2rem', gap: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', overflowX: 'auto', backdropFilter: 'blur(10px)' }}>
           {categories.map((c: any) => (
             <button 
               key={c.id} 
               onClick={() => setActiveCategory(c.id)}
               className="px-8 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap"
               style={{
                 background: activeCategory === c.id ? 'white' : 'rgba(255,255,255,0.08)',
                 color: activeCategory === c.id ? '#0f172a' : 'white',
                 border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: activeCategory === c.id ? '0 10px 20px -5px rgba(255,255,255,0.2)' : 'none'
               }}
             >
               {c.name}
             </button>
           ))}
        </div>

        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', overflowY: 'auto' }}>
          {displayedItems.map((item: MenuItem & { isAvailable?: boolean }) => (
             <div 
               key={item.id} 
               onClick={() => item.isAvailable !== false && handleItemClick(item)}
               className="pos-card flex flex-col p-0 overflow-hidden"
               style={{ 
                 opacity: item.isAvailable !== false ? 1 : 0.4, 
                 cursor: item.isAvailable !== false ? 'pointer' : 'not-allowed',
                 borderWidth: '1.5px'
               }}
             >
               <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                 {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                 ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: item.imageColor || '#E2E8F0', opacity: 0.1 }} />
                 )}
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
                 <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', color: '#0f172a', padding: '3px 10px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '900' }}>
                   ${item.price.toFixed(2)}
                 </span>
               </div>
               <div style={{ padding: '1.25rem' }}>
                 <p style={{ fontWeight: '800', fontSize: '1.15rem', lineHeight: '1.3', color: 'white' }}>{item.name}</p>
                 {item.isAvailable === false && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginTop: '0.5rem' }}>Out of Stock</span>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* MODIFIERS MODAL */}
      {selectedItemForModifiers && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(25px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '600px', padding: '3rem', borderRadius: 'var(--radius-xl)' }}>
            <div className="flex justify-between items-center mb-8">
               <h2 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Add Modifiers</h2>
               <button onClick={() => setSelectedItemForModifiers(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '50%' }}>✕</button>
            </div>
            
            <p className="mb-6" style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white' }}>MODIFYING: {selectedItemForModifiers.name}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              {modifiers.filter((m: Modifier) => m.menuItemId === selectedItemForModifiers.id).map((mod: Modifier) => {
                const isSelected = !!selectedModifiers.find(selected => selected.id === mod.id);
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => toggleModifier(mod)}
                    className="pos-card flex justify-between items-center"
                    style={{ 
                      padding: '1.5rem', 
                      background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.1)', 
                      borderWidth: isSelected ? '2.5px' : '1.5px'
                    }}
                  >
                     <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{mod.name}</span>
                     <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>{mod.price > 0 ? `+$${mod.price.toFixed(2)}` : 'Free'}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => addItemToOrder(selectedItemForModifiers, selectedModifiers)} className="btn btn-primary w-full py-5 text-xl font-black uppercase tracking-wider">
              Confirm & Add to Ticket
            </button>
          </div>
        </div>
      )}

      {/* ALLERGY WARNING MODAL */}
      {allergenWarningItem && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(30px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '450px', padding: '3rem', textAlign: 'center', border: '3px solid #fbbf24' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1rem' }}>Allergy Alert</h2>
            <p style={{ marginBottom: '2.5rem', color: 'white', fontSize: '1.1rem' }}>
              This item (<strong>{allergenWarningItem.name}</strong>) contains: <br/>
              <span style={{ color: '#fbbf24', fontWeight: '900', fontSize: '1.4rem', textTransform: 'uppercase', display: 'block', marginTop: '0.75rem' }}>{allergenWarningItem.allergenInfo}</span>
            </p>
            <div className="flex flex-col gap-3">
               <button onClick={() => { handleItemClick(Object.assign({}, allergenWarningItem, { allergenInfo: null })); }} className="btn btn-primary w-full py-5 font-black uppercase" style={{ background: '#fbbf24', color: '#0f172a' }}>Proceed with Order</button>
               <button onClick={() => setAllergenWarningItem(null)} className="btn btn-secondary w-full py-4 uppercase font-bold">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT TICKET MODAL */}
      {splitMode && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(25px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '550px', padding: '3rem' }}>
             <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2rem' }}>Split Transaction</h2>
             <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setSplitMode('seat')}
                  className="flex-1 py-5 rounded-2xl border-2 font-black transition-all"
                  style={{
                    background: splitMode === 'seat' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    borderColor: splitMode === 'seat' ? 'white' : 'transparent',
                    color: 'white'
                  }}
                >
                   Split by Seat
                </button>
                <button 
                  onClick={() => setSplitMode('equal')}
                  className="flex-1 py-5 rounded-2xl border-2 font-black transition-all"
                  style={{
                    background: splitMode === 'equal' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                    borderColor: splitMode === 'equal' ? 'white' : 'transparent',
                    color: 'white'
                  }}
                >
                   Split Equally
                </button>
             </div>

             {splitMode === 'equal' ? (
                <div className="mb-10">
                   <p className="mb-4 font-bold text-white/60 uppercase text-xs tracking-widest">Number of ways to split:</p>
                   <div className="flex items-center gap-6">
                      <button onClick={() => setSplitCount(Math.max(2, splitCount-1))} className="w-14 h-14 rounded-full glass font-black text-2xl">-</button>
                      <span style={{ fontSize: '2.5rem', fontWeight: '900' }}>{splitCount}</span>
                      <button onClick={() => setSplitCount(splitCount+1)} className="w-14 h-14 rounded-full glass font-black text-2xl">+</button>
                      <div className="ml-auto text-right">
                         <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white' }}>${(total / splitCount).toFixed(2)}</span>
                         <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Per person (x{splitCount})</p>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="mb-10 overflow-y-auto" style={{ maxHeight: '250px' }}>
                   {[1,2,3,4].map(seat => {
                      const seatTotal = orderItems.filter(oi => oi.seatNumber === seat).reduce((acc, oi) => acc + (oi.price * oi.qty), 0);
                      if (seatTotal === 0) return null;
                      return (
                        <div key={seat} className="flex justify-between p-4 border-b border-white/10 glass mb-2 rounded-xl">
                           <span className="font-black text-white uppercase text-sm">Seat {seat}</span>
                           <span className="font-black text-white text-xl">${seatTotal.toFixed(2)}</span>
                        </div>
                      );
                   })}
                </div>
             )}

             <div className="flex gap-3">
                <button onClick={() => setSplitMode(null)} className="btn btn-secondary flex-1 py-4">Back</button>
                <button onClick={handleCheckout} className="btn btn-primary flex-2 py-4 font-black uppercase" style={{ background: 'rgba(255,255,255,0.2)' }}>Proceed to Split Pay</button>
             </div>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItemIndex !== null && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(25px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '450px', padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Edit Ticket Item</h2>
            <h3 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '2.5rem', letterSpacing: '-1px' }}>{orderItems[editItemIndex].originalName}</h3>
            
            <div className="flex items-center justify-center gap-8 mb-10">
               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   if (newItems[editItemIndex].qty > 1) {
                     newItems[editItemIndex].qty -= 1;
                     setOrderItems(newItems);
                   }
                 }} 
                 className="w-16 h-16 rounded-full glass font-black text-2xl"
               >-</button>
               
               <span style={{ fontSize: '3.5rem', fontWeight: '900', minWidth: '80px' }}>
                 {orderItems[editItemIndex].qty}
               </span>

               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   newItems[editItemIndex].qty += 1;
                   setOrderItems(newItems);
                 }} 
                 className="w-16 h-16 rounded-full glass font-black text-2xl"
               >+</button>
            </div>

            <button 
              onClick={async () => {
                const item = orderItems[editItemIndex];
                if (item.id) {
                  if (staffRole !== 'admin') {
                    alert('Admin Permission Required');
                    return;
                  }
                  await deleteOrderItem(item.id, table.id);
                }
                const newItems = [...orderItems];
                newItems.splice(editItemIndex, 1);
                setOrderItems(newItems);
                setEditItemIndex(null);
              }} 
              className="btn btn-danger w-full mb-4 py-4 uppercase font-black tracking-widest"
            >
              Void Item
            </button>
            
            <button 
              onClick={() => setEditItemIndex(null)} 
              className="btn btn-secondary w-full py-4 uppercase font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>

  );
}
