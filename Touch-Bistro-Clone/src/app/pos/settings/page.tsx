'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    style={{
      width: '44px', height: '24px', borderRadius: '12px',
      backgroundColor: active ? 'var(--primary)' : '#cbd5e1',
      position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s'
    }}
  >
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
      position: 'absolute', top: '2px', left: active ? '22px' : '2px',
      transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }} />
  </div>
);

export default function SettingsAppsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('TouchBistro Apps');
  
  const sidebarItems = [
    {icon: 'ℹ️', label: 'Restaurant Information'},
    {icon: '🍴', label: 'Menu', link: '/pos/admin/menu'},
    {icon: '👤', label: 'Staff'},
    {icon: '💳', label: 'Payments'},
    {icon: '🧾', label: 'Bill & Order Tickets'},
    {icon: '📐', label: 'Floorplan', link: '/pos/floorplan'},
    {icon: '🖨️', label: 'Kitchen Display System (KDS)', link: '/pos/kds'},
    {icon: '📱', label: 'TouchBistro Apps'},
    {icon: '🧩', label: 'App Marketplace'},
    {icon: '❓', label: 'Help'},
    {icon: '⚙️', label: 'Advanced'},
  ];

  const handleTabClick = (item: { link?: string, label: string }) => {
    if (item.link) {
      router.push(item.link);
    } else {
      setActiveTab(item.label);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'TouchBistro Apps': return <TouchBistroApps />;
      case 'Restaurant Information': return <RestaurantInfo />;
      case 'Staff': return <StaffSettings />;
      case 'Payments': return <PaymentsSettings />;
      case 'Bill & Order Tickets': return <BillTicketsSettings />;
      case 'App Marketplace': return <AppMarketplace />;
      case 'Help': return <HelpSettings />;
      case 'Advanced': return <AdvancedSettings />;
      case 'TouchBistro Loyalty': return <LoyaltySettings />;
      default: return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
           <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</span>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeTab}</h2>
        </div>
      );
    }
  };

  // --- Subcomponents ---

  const TouchBistroApps = () => (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>TouchBistro Apps</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Apps</p>
        <div className="surface" onClick={() => router.push('/cfd')} style={{ padding: '1rem', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
           <div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Customer Facing Display</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Let guests see and confirm orders in real time.</div>
           </div>
           <span style={{ color: '#cbd5e1' }}>&gt;</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Online Ordering</p>
        <div className="surface" onClick={() => router.push('/online')} style={{ padding: '1rem', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
           <div>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>TouchBistro Online Ordering</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Let diners order takeout and delivery directly from you!</div>
           </div>
           <span style={{ color: '#cbd5e1' }}>&gt;</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Loyalty & Marketing</p>
        <div className="surface" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
           {[
             {title: 'TouchBistro Loyalty', desc: 'Customer relationship management and engagement platform.', action: () => setActiveTab('TouchBistro Loyalty')},
             {title: 'TouchBistro Reservations', desc: 'Complete reservation and guest management platform.', action: () => router.push('/pos/reservations')},
             {title: 'Management Dashboard', desc: 'End-of-day sales, ticket averages, and selling items.', action: () => router.push('/pos/admin')},
             {title: 'Menu Configuration', desc: 'Manage 86s and dynamic catalog pricing.', action: () => router.push('/pos/admin/menu')},
           ].map((itm, i) => (
             <div key={itm.title} onClick={itm.action} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 3 ? 'none' : '1px solid #eee', cursor: 'pointer' }}>
               <div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: itm.title.includes('Loyalty') ? 'var(--primary)' : 'inherit' }}>{itm.title}</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{itm.desc}</div>
               </div>
               <span style={{ color: '#cbd5e1' }}>&gt;</span>
             </div>
           ))}
        </div>
      </div>
    </>
  );

  const RestaurantInfo = () => (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Restaurant Information</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Restaurant Name</span>
          <input type="text" defaultValue="The TouchBistro Cafe" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </label>
        <label>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Phone Number</span>
          <input type="text" defaultValue="(555) 123-4567" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </label>
        <label>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Business Address</span>
          <textarea defaultValue="123 Cuisine Ave, Food District, NY 10001" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }} />
        </label>
        <label>
          <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Tax Rate (%)</span>
          <input type="number" defaultValue="8.5" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </label>
        <button style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          Save Configuration
        </button>
      </div>
    </div>
  );

  const StaffSettings = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Staff Management</h1>
         <button style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>+ Add Staff Member</button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {[
          {name: 'Admin', role: 'Manager/Admin', pin: '1234'},
          {name: 'Server Darko', role: 'Server', pin: '1111'},
          {name: 'Chef Gordon', role: 'Kitchen', pin: '8888'},
        ].map((s, i) => (
          <div key={s.name} style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i === 2 ? 'none' : '1px solid #eee' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{s.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Role: {s.role} &nbsp;•&nbsp; PIN: {s.pin}</div>
                </div>
             </div>
             <button style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: 'var(--primary)', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Edit</button>
          </div>
        ))}
      </div>
    </>
  );

  const PaymentsSettings = () => {
    const [t1, setT1] = useState(true);
    const [t2, setT2] = useState(true);
    return (
      <div style={{ maxWidth: '700px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Payments & Checkout</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}>
           <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Payment Methods</h2>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #eee', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Enable Credit Card Processing</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Accept Visa, MasterCard, Amex via local terminal</div>
              </div>
              <Toggle active={t1} onChange={() => setT1(!t1)} />
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Enable Cash Management</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Track cash drawer operations and tip outs</div>
              </div>
              <Toggle active={t2} onChange={() => setT2(!t2)} />
           </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem' }}>
           <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Suggested Tip Percentages</h2>
           <div style={{ display: 'flex', gap: '1rem' }}>
             {['15', '18', '20'].map(val => (
                <div key={val} style={{ flex: 1, padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{val}%</span>
                </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  const BillTicketsSettings = () => {
    const [t1, setT1] = useState(true);
    return (
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Bill & Order Tickets</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Auto-Print Kitchen Tickets</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Send tickets to KDS and Printers automatically</div>
              </div>
              <Toggle active={t1} onChange={() => setT1(!t1)} />
           </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem' }}>
           <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Receipt Footer Message</h2>
           <textarea 
             defaultValue={"Thank you for dining with us!\\nFollow us on Instagram @TouchBistroCafe"} 
             style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', marginBottom: '1rem' }} 
           />
           <button style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Save Footer</button>
        </div>
      </div>
    );
  };

  const AppMarketplace = () => (
    <>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>App Marketplace</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {[
          {name: 'QuickBooks Desktop', type: 'Accounting', status: 'Connected'},
          {name: 'Deliveroo Integration', type: 'Online Ordering', status: 'Install'},
          {name: 'UberEats Integration', type: 'Online Ordering', status: 'Install'},
          {name: 'Mailchimp', type: 'Marketing', status: 'Install'},
          {name: '7shifts', type: 'Staff Scheduling', status: 'Connected'},
        ].map(app => (
          <div key={app.name} style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{app.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>{app.type}</div>
            </div>
            <button style={{ 
              width: '100%', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer',
              backgroundColor: app.status === 'Connected' ? '#f1f5f9' : 'var(--primary)',
              color: app.status === 'Connected' ? 'var(--text-main)' : 'white'
             }}>
              {app.status}
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const HelpSettings = () => (
    <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', paddingTop: '3rem' }}>
       <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎧</div>
       <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>We&apos;re here to help!</h1>
       <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>Contact our 24/7 world-class support team at any time.</p>
       
       <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>Phone Support</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>1-800-YOUR-POS</div>
          </div>
          <div style={{ width: '1px', height: '60px', backgroundColor: '#e2e8f0' }}></div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>Email Support</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>support@touchbistro.com</div>
          </div>
       </div>
    </div>
  );

  const AdvancedSettings = () => {
    const [t1, setT1] = useState(false);
    return (
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Advanced Settings</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Developer Debug Logging</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Store verbose errors in local cache (affects performance)</div>
              </div>
              <Toggle active={t1} onChange={() => setT1(!t1)} />
           </div>
        </div>

        <div style={{ border: '1px solid #ef4444', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fef2f2' }}>
           <h2 style={{ fontWeight: 'bold', color: '#b91c1c', marginBottom: '0.5rem' }}>Danger Zone</h2>
           <p style={{ fontSize: '0.85rem', color: '#991b1b', marginBottom: '1rem' }}>These actions cannot be undone and will affect local POS operation.</p>
           <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'block', width: '100%', marginBottom: '1rem' }}>Clear Local Database Cache</button>
           <button style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'block', width: '100%' }}>Force Sync with Cloud</button>
        </div>
      </div>
    );
  };

  const LoyaltySettings = () => {
    const [t1, setT1] = useState(true);
    return (
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--primary)' }}>TouchBistro Loyalty</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
           <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Reward Multiplier</h2>
           <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Configure how many points guests earn per dollar spent before tax.</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 'bold' }}>$1.00 spent  =</span>
              <input type="number" defaultValue="1" style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }} />
              <span style={{ fontWeight: 'bold' }}>Points</span>
           </div>
           <button style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold', border: 'none' }}>Update Reward Rules</button>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Customer Facing Display Sign-up</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Prompt guests to enter phone number on CFD checkout</div>
              </div>
              <Toggle active={t1} onChange={() => setT1(!t1)} />
           </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
           <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Top Members</h2>
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 'bold', color: '#64748b' }}>Customer</span>
              <span style={{ fontWeight: 'bold', color: '#64748b' }}>Points Balance</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Lana Avery</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>(555) 999-3434</div>
              </div>
              <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>198 pts</div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full">
      {/* LEFT PANE - Nav Sidebar */}
      <div className="flex-col" style={{ width: '30%', borderRight: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)' }}>
         <div style={{ padding: '1rem', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
            <span onClick={() => router.push('/pos/floorplan')} style={{ color: 'var(--primary)', cursor: 'pointer', marginRight: '1rem' }}>&lt; Back</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0 auto' }}>Settings</span>
         </div>
         <div style={{ padding: '0.5rem 1rem' }}>
            <input type="text" placeholder="Search" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9' }} />
         </div>
         <div style={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
            {sidebarItems.map(item => (
               <div key={item.label} 
                 onClick={() => handleTabClick(item)}
                 style={{ 
                 padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                 borderBottom: '1px solid #eee', cursor: 'pointer',
                 backgroundColor: activeTab === item.label && !item.link ? '#e2e8f0' : 'transparent',
                 color: activeTab === item.label && !item.link ? 'var(--primary)' : 'var(--text-main)'
               }}>
                 <span style={{ width: '2rem', textAlign: 'center' }}>{item.icon}</span>
                 <span style={{ fontSize: '1rem' }}>{item.label}</span>
               </div>
            ))}
         </div>
      </div>
      
      {/* RIGHT PANE */}
      <div className="flex-col" style={{ flex: '1', backgroundColor: '#f8fafc', padding: '2rem', overflowY: 'auto' }}>
        {renderContent()}
      </div>
    </div>
  )
}
