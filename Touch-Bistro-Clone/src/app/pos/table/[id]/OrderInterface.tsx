import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitOrder, deleteOrderItem } from '../actions';
import Image from 'next/image';

type MenuItem = { id?: number, categoryId: number, name: string, price: number, imageColor: string | null, imageUrl?: string };
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex h-full w-full animate-fade-in" style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* PANE 1 - TABLES SIDEBAR */}
      <div className="flex flex-col" style={{ width: '240px', borderRight: '1px solid var(--border-color)', backgroundColor: 'white' }}>
         <div className="flex items-center justify-center" style={{ height: '60px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>
           Service Areas
         </div>
         <div style={{ padding: '1rem', overflowY: 'auto' }} className="flex flex-col gap-2">
           {allTables.map((t: any) => (
              <div 
                key={t.id}
                onClick={() => t.id !== table.id && router.push(`/pos/table/${t.id}`)}
                className="pos-card flex flex-col items-center justify-center"
                style={{
                  height: '90px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  backgroundColor: t.id === table.id ? 'var(--primary-light)' : 'white',
                  borderColor: t.id === table.id ? 'var(--primary)' : 'var(--border-color)',
                  borderRadius: t.name.includes('Register') ? 'var(--radius-md)' : 'var(--radius-full)',
                  borderWidth: t.id === table.id ? '2px' : '1px'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{t.name.includes('Register') ? 'Register' : 'Table'}</span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: t.id === table.id ? 'var(--primary)' : 'var(--text-main)' }}>{t.name.replace('Register', '01')}</span>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.status === 'open' ? 'var(--success)' : (t.status === 'seated' ? 'var(--warning)' : 'var(--danger)'), marginTop: '0.5rem' }}></div>
              </div>
           ))}
         </div>
      </div>

      {/* PANE 2 - ACTIVE TICKET */}
      <div className="flex flex-col" style={{ width: '400px', borderRight: '1px solid var(--border-color)', backgroundColor: 'white', boxShadow: '0 0 20px rgba(0,0,0,0.03)' }}>
        <div className="flex flex-col" style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'white' }}>
          <span className="badge badge-success" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>{isRegister ? 'Direct Sale' : 'Dine In'}</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{isRegister ? 'Cash Register' : `Table ${table.name}`}</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Order #{(orderItems[0]?.orderId || 'NEW').toString().padStart(4, '0')} {mounted && `• ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
          </span>
        </div>
        
        {!isRegister && (
           <div className="flex" style={{ backgroundColor: '#F1F5F9', padding: '0.5rem', gap: '0.5rem' }}>
              {[1,2,3,4].map(seat => (
                <button 
                  key={seat}
                  onClick={() => setActiveSeat(seat)}
                  className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${activeSeat === seat ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
                  style={{
                    backgroundColor: activeSeat === seat ? 'white' : 'transparent',
                    color: activeSeat === seat ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: activeSeat === seat ? 'var(--shadow-sm)' : 'none'
                  }}>
                  Seat {seat}
                </button>
              ))}
           </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }} className="flex flex-col gap-1">
           {orderItems.length === 0 ? (
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, textAlign: 'center' }}>
               <span style={{ fontSize: '3rem' }}>🧾</span>
               <p style={{ marginTop: '1rem', fontWeight: '500' }}>Ticket is empty</p>
             </div>
           ) : (
             orderItems.map((oi, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setEditItemIndex(idx)}
                  className="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  style={{ backgroundColor: editItemIndex === idx ? 'var(--primary-light)' : 'transparent', borderLeft: editItemIndex === idx ? '4px solid var(--primary)' : '1px solid transparent' }}
                >
                   <div className="flex flex-col flex-1">
                     <div className="flex items-center gap-2">
                       {!isRegister && <span style={{ fontSize: '0.7rem', backgroundColor: '#E2E8F0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>S{oi.seatNumber}</span>}
                       <span style={{ fontSize: '1rem', fontWeight: '600', color: oi.id ? 'var(--text-main)' : 'var(--success)' }}>
                         {oi.qty > 1 ? `${oi.qty}x ` : ''}{oi.originalName} 
                         {!oi.id && <span style={{ marginLeft: '4px', color: 'var(--success)', fontSize: '1.2rem', verticalAlign: 'middle' }}>•</span>}
                       </span>
                     </div>
                     {oi.name !== oi.originalName && (
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>+ {oi.name.replace(`${oi.originalName} `, '').replace('(', '').replace(')', '')}</span>
                     )}
                   </div>
                   <span style={{ fontWeight: '700', fontSize: '1rem' }}>${(oi.price * oi.qty).toFixed(2)}</span>
                </div>
             ))
           )}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'white' }}>
          <div className="flex justify-between items-center mb-4">
            <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Subtotal</span>
            <span style={{ fontWeight: '600' }}>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Total</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleSendOrder} 
              className="btn flex-1"
              style={{ backgroundColor: '#F1F5F9', color: 'var(--text-main)' }}
            >
               Send & Stay
            </button>
            <button 
              onClick={handleCheckout} 
              className="btn btn-primary flex-1"
            >
               Pay & Finish
            </button>
          </div>
        </div>
      </div>

      {/* PANE 3 - MENU GRID */}
      <div className="flex flex-col flex-1" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="flex" style={{ padding: '0.75rem 1.5rem', gap: '1rem', backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
           {categories.map((c: any) => (
             <button 
               key={c.id} 
               onClick={() => setActiveCategory(c.id)}
               className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap ${activeCategory === c.id ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
               style={{
                 backgroundColor: activeCategory === c.id ? 'var(--primary)' : '#F1F5F9',
                 color: activeCategory === c.id ? 'white' : 'var(--text-muted)'
               }}
             >
               {c.name}
             </button>
           ))}
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', overflowY: 'auto' }}>
          {displayedItems.map((item: MenuItem & { isAvailable?: boolean }) => (
             <div 
               key={item.id} 
               onClick={() => item.isAvailable !== false && handleItemClick(item)}
               className="pos-card flex flex-col p-0 overflow-hidden"
               style={{ opacity: item.isAvailable !== false ? 1 : 0.5, cursor: item.isAvailable !== false ? 'pointer' : 'not-allowed' }}
             >
               <div style={{ position: 'relative', width: '100%', height: '140px' }}>
                 {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                 ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: item.imageColor || '#E2E8F0' }} />
                 )}
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }} />
                 <span style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.95)', color: 'var(--text-main)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '800' }}>
                   ${item.price.toFixed(2)}
                 </span>
               </div>
               <div style={{ padding: '1rem' }}>
                 <p style={{ fontWeight: '700', fontSize: '1rem', lineHeight: '1.2' }}>{item.name}</p>
                 {item.isAvailable === false && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '1px' }}>Out of Stock</span>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* MODIFIERS MODAL */}
      {selectedItemForModifiers && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '550px', padding: '2rem' }}>
            <div className="flex justify-between items-center mb-6">
               <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Add Modifiers</h2>
               <button onClick={() => setSelectedItemForModifiers(null)} style={{ fontSize: '1.5rem', color: 'var(--text-light)' }}>✕</button>
            </div>
            
            <p className="mb-4" style={{ fontWeight: '600', color: 'var(--primary)' }}>MODIFYING: {selectedItemForModifiers.name}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {modifiers.filter((m: Modifier) => m.menuItemId === selectedItemForModifiers.id).map((mod: Modifier) => {
                const isSelected = !!selectedModifiers.find(selected => selected.id === mod.id);
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => toggleModifier(mod)}
                    className="pos-card flex justify-between items-center"
                    style={{ 
                      padding: '1.25rem', 
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)', 
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'white',
                      borderWidth: isSelected ? '2px' : '1px'
                    }}
                  >
                     <span style={{ fontWeight: '600' }}>{mod.name}</span>
                     <span style={{ color: 'var(--text-muted)' }}>{mod.price > 0 ? `+$${mod.price.toFixed(2)}` : 'Free'}</span>
                  </div>
                );
              })}
            </div>

            <button onClick={() => addItemToOrder(selectedItemForModifiers, selectedModifiers)} className="btn btn-primary w-full py-4 text-lg">
              Confirm & Add to Ticket
            </button>
          </div>
        </div>
      )}

      {/* EDIT ITEM MODAL */}
      {editItemIndex !== null && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="surface animate-fade-in" style={{ width: '400px', padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Edit Item</h2>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>{orderItems[editItemIndex].originalName}</h3>
            
            <div className="flex items-center justify-center gap-6 mb-8">
               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   if (newItems[editItemIndex].qty > 1) {
                     newItems[editItemIndex].qty -= 1;
                     setOrderItems(newItems);
                   }
                 }} 
                 style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', backgroundColor: '#F1F5F9', fontSize: '1.5rem', fontWeight: 'bold' }}
               >-</button>
               
               <span style={{ fontSize: '2.5rem', fontWeight: '900', minWidth: '60px' }}>
                 {orderItems[editItemIndex].qty}
               </span>

               <button 
                 onClick={() => {
                   const newItems = [...orderItems];
                   newItems[editItemIndex].qty += 1;
                   setOrderItems(newItems);
                 }} 
                 style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-full)', backgroundColor: '#F1F5F9', fontSize: '1.5rem', fontWeight: 'bold' }}
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
              className="btn w-full mb-3"
              style={{ backgroundColor: '#FEF2F2', color: 'var(--danger)', border: '1px solid #FCA5A5' }}
            >
              Remove / Void Item
            </button>
            
            <button 
              onClick={() => setEditItemIndex(null)} 
              className="btn btn-secondary w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
