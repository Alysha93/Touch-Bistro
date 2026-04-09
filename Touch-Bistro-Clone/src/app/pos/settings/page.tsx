'use client'
import { useRouter } from 'next/navigation';

export default function SettingsAppsPage() {
  const router = useRouter();
  
  return (
    <div className="flex h-full w-full">
      {/* LEFT PANE - Nav Sidebar */}
      <div className="flex-col" style={{ width: '30%', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
         <div style={{ padding: '1rem', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
            <span onClick={() => router.push('/pos/floorplan')} style={{ color: 'var(--primary)', cursor: 'pointer', marginRight: '1rem' }}>&lt;</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0 auto' }}>Settings</span>
         </div>
         <div style={{ padding: '0.5rem 1rem' }}>
            <input type="text" placeholder="Search" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9' }} />
         </div>
         <div style={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
            {[
              {icon: 'ℹ️', label: 'Restaurant Information'},
              {icon: '🍴', label: 'Menu'},
              {icon: '👤', label: 'Staff'},
              {icon: '💳', label: 'Payments'},
              {icon: '🧾', label: 'Bill & Order Tickets'},
              {icon: '📐', label: 'Floorplan'},
              {icon: '🖨️', label: 'Printers & Kitchen Displays', link: '/pos/settings/kds'},
              {icon: '📱', label: 'TouchBistro Apps', active: true},
              {icon: '🧩', label: 'App Marketplace'},
              {icon: '❓', label: 'Help'},
              {icon: '⚙️', label: 'Advanced'},
            ].map(item => (
               <div key={item.label} 
                 onClick={() => { if(item.link) router.push(item.link); }}
                 style={{ 
                 padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                 borderBottom: '1px solid #eee', cursor: 'pointer',
                 backgroundColor: item.active ? '#e2e8f0' : 'transparent',
                 color: item.active ? 'var(--primary)' : 'var(--text-main)'
               }}>
                 <span style={{ width: '2rem', textAlign: 'center' }}>{item.icon}</span>
                 <span style={{ fontSize: '1rem' }}>{item.label}</span>
               </div>
            ))}
         </div>
      </div>
      
      {/* RIGHT PANE - TouchBistro Apps */}
      <div className="flex-col" style={{ flex: '1', backgroundColor: '#f8fafc', padding: '2rem', overflowY: 'auto' }}>
         <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>TouchBistro Apps</h1>
         
         <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Apps</p>
            <div className="surface" style={{ padding: '1rem', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
               <div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Customer Facing Display</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Let guests see and confirm orders in real time.</div>
               </div>
               <span style={{ color: '#cbd5e1' }}>&gt;</span>
            </div>
         </div>

         <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Online Ordering</p>
            <div className="surface" style={{ padding: '1rem', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
               <div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>TouchBistro Online Ordering</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Let diners order takeout and delivery directly from you and keep 100% of the profits!</div>
               </div>
               <span style={{ color: '#cbd5e1' }}>&gt;</span>
            </div>
         </div>

         <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Loyalty & Marketing</p>
            <div className="surface" style={{ backgroundColor: 'white', cursor: 'pointer' }}>
               {[
                 {title: 'TouchBistro Loyalty', desc: 'A customer relationship management (CRM) and engagement platform...'},
                 {title: 'TouchBistro Gift Cards', desc: 'Create and sell gift cards directly from your restaurant’s POS...'},
                 {title: 'eCard Physical Gift Cards', desc: 'Create and sell physical cards that help build awareness...'},
                 {title: 'TouchBistro Reservations', desc: 'The complete reservation and guest management platform.'},
               ].map((itm, i) => (
                 <div key={itm.title} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 3 ? 'none' : '1px solid #eee' }}>
                   <div>
                      <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{itm.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{itm.desc}</div>
                   </div>
                   <span style={{ color: '#cbd5e1' }}>&gt;</span>
                 </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  )
}
