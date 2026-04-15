'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Toggle = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    className="transition-all"
    style={{
      width: '48px', height: '24px', borderRadius: '12px',
      backgroundColor: active ? 'var(--primary)' : '#cbd5e1',
      position: 'relative', cursor: 'pointer'
    }}
  >
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
      position: 'absolute', top: '2px', left: active ? '26px' : '2px',
      transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: 'var(--shadow-sm)'
    }} />
  </div>
);

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Dashboard';
  
  const sidebarItems = [
    {id: 'Dashboard', icon: '📊', label: 'Dashboard'},
    {id: 'Restaurant Information', icon: 'ℹ️', label: 'Restaurant Information'},
    {id: 'Staff', icon: '👥', label: 'Staff Configuration'},
    {id: 'Payments', icon: '💳', label: 'Payments & Taxes'},
    {id: 'Marketplace', icon: '🧩', label: 'App Marketplace'},
    {id: 'Advanced', icon: '⚙️', label: 'Advanced Settings'},
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard': return <StatsDashboard />;
      case 'Restaurant Information': return <RestaurantInfo />;
      case 'Staff': return <StaffSettings />;
      case 'Payments': return <PaymentsSettings />;
      case 'Marketplace': return <AppMarketplace />;
      case 'Advanced': return <AdvancedSettings />;
      default: return <StatsDashboard />;
    }
  };

  return (
    <div className="flex h-full animate-fade-in" style={{ backgroundColor: '#F8FAFC' }}>
      
      {/* Sidebar Navigation */}
      <div className="flex flex-col" style={{ width: '320px', borderRight: '1px solid var(--border-color)', backgroundColor: 'white' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3 mb-6">
             <button 
               onClick={() => router.push('/pos/floorplan')}
               className="flex items-center justify-center"
               style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F1F5F9', border: 'none', color: 'var(--text-main)', fontWeight: 'bold' }}
             >
               ←
             </button>
             <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Management</h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Settings & Config</p>
        </div>
        
        <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map(item => (
            <Link 
              key={item.id}
              href={`/pos/settings?tab=${item.id}`}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-bold ${activeTab === item.id ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
              style={{ textDecoration: 'none' }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              {activeTab === item.id && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto p-8 border-t border-slate-100">
           <div className="pos-card bg-slate-50 border-none p-4 text-center">
              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Version 2.4.1 Premium</p>
              <button className="btn w-full" style={{ fontSize: '0.75rem', padding: '0.5rem' }}>Check for Updates</button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '3.5rem' }}>
        {renderContent()}
      </div>
    </div>
  );
}

const StatsDashboard = () => {
  const [showLabor, setShowLabor] = useState(false);
  
  // High-fidelity chart data
  const data = [
    { time: '11am', sales: 1200, labor: 450 },
    { time: '12pm', sales: 2100, labor: 450 },
    { time: '1pm', sales: 1800, labor: 450 },
    { time: '2pm', sales: 900, labor: 400 },
    { time: '3pm', sales: 700, labor: 350 },
    { time: '4pm', sales: 1100, labor: 350 },
    { time: '5pm', sales: 2400, labor: 500 },
  ];

  return (
    <div className="flex flex-col gap-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-1px' }}>Performance Overview</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Business metrics and operational insights for today.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => setShowLabor(false)}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${!showLabor ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500'}`}
           >Revenue Only</button>
           <button 
             onClick={() => setShowLabor(true)}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${showLabor ? 'bg-teal-600 text-white shadow-md' : 'text-slate-500'}`}
           >Labor Adjusted</button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: '$12,482.50', trend: '+14.2%', color: 'var(--primary)' },
          { label: showLabor ? 'Labor Cost' : 'Average Check', value: showLabor ? '$2,450.00' : '$42.90', trend: showLabor ? '+2.1%' : '+5.1%', color: showLabor ? 'var(--danger)' : 'var(--accent)' },
          { label: showLabor ? 'Net Profit' : 'Guest Count', value: showLabor ? '$10,032.50' : '284', trend: showLabor ? '+18.4%' : '-2.4%', color: showLabor ? 'var(--success)' : 'var(--warning)' },
        ].map((stat, i) => (
          <div key={i} className="surface transition-all hover:translate-y-[-4px]" style={{ padding: '2rem', borderLeft: `6px solid ${stat.color}` }}>
             <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{stat.label}</p>
             <h3 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{stat.value}</h3>
             <div className="flex items-center gap-2 mt-4">
                <span className={`badge ${stat.trend.startsWith('+') ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.8rem' }}>{stat.trend}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vs. last week</span>
             </div>
          </div>
        ))}
      </div>

      <div className="surface" style={{ padding: '2rem', minHeight: '300px' }}>
         <div className="flex justify-between items-center mb-8">
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Sales vs. Labor Trend</h4>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary)' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Gross Sales</span>
               </div>
               <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#FCA5A5' }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Labor Cost</span>
               </div>
            </div>
         </div>
         {/* Chart Visualization */}
         <div className="flex items-end gap-4" style={{ height: '200px', paddingBottom: '2rem' }}>
            {data.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <div className="w-full flex flex-col justify-end gap-[1px]">
                     <div style={{ height: `${(d.sales/2500)*100}%`, width: '100%', backgroundColor: 'var(--primary-light)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '0.65rem', fontWeight: '800' }}>${d.sales}</div>
                     </div>
                     <div style={{ height: `${(d.labor/2500)*100}%`, width: '100%', backgroundColor: '#FCA5A5', borderRadius: '0 0 4px 4px' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{d.time}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
         <div className="surface" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Revenue by Category</h4>
            <div className="flex flex-col gap-6">
               {[
                 { name: 'Mains', amount: '$6,240', percent: 50 },
                 { name: 'Starters', amount: '$1,820', percent: 15 },
                 { name: 'Beverages', amount: '$3,120', percent: 25 },
                 { name: 'Desserts', amount: '$1,302', percent: 10 },
               ].map((cat, i) => (
                 <div key={i} className="flex flex-col gap-2">
                   <div className="flex justify-between items-end">
                      <span style={{ fontWeight: '700' }}>{cat.name}</span>
                      <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{cat.amount}</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${cat.percent}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }}></div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
  
         <div className="surface" style={{ padding: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>Top Performing Items</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Real-time ranking of staff favorites and high-margin assets.</p>
            <div className="flex flex-col gap-2">
               {[
                 { name: 'Classic Burger + Fries', count: 48, growth: '+12%', color: 'var(--success)' },
                 { name: 'Margarita Pizza', count: 32, growth: '+4%', color: 'var(--success)' },
                 { name: 'Garlic Bread', count: 29, growth: '+18%', color: 'var(--success)' },
                 { name: 'Singapore Sling', count: 25, growth: '-2%', color: 'var(--danger)' },
                 { name: 'Tiramisu', count: 18, growth: '+8%', color: 'var(--success)' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                       <span style={{ fontWeight: '800', color: 'var(--text-light)', width: '20px' }}>{i+1}</span>
                       <span style={{ fontWeight: '700' }}>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span style={{ fontSize: '0.8rem', fontWeight: '800', color: item.growth.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{item.growth}</span>
                       <span className="badge badge-primary">{item.count} Sold</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

const RestaurantInfo = () => (
  <div className="flex flex-col gap-10 max-w-3xl">
    <header>
      <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Restaurant Identity</h2>
      <p style={{ color: 'var(--text-light)' }}>Manage your business profile and public information.</p>
    </header>

    <div className="surface p-10 flex flex-col gap-8">
       <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Business Name</label>
            <input type="text" className="input" defaultValue="The TouchBistro Cafe" />
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Contact Phone</label>
            <input type="text" className="input" defaultValue="(555) 123-4567" />
          </div>
       </div>

       <div className="flex flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Mailing Address</label>
          <textarea className="input" style={{ minHeight: '100px' }} defaultValue="123 Cuisine Ave, Food District, NY 10001" />
       </div>

       <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Primary Currency</label>
            <select className="input">
              <option>USD ($)</option>
              <option>CAD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Timezone</label>
            <select className="input">
              <option>Eastern Time (ET)</option>
              <option>Pacific Time (PT)</option>
            </select>
          </div>
       </div>

       <button className="btn btn-primary py-4 text-lg">Save Updated Profile</button>
    </div>
  </div>
);

const StaffSettings = () => (
  <div className="flex flex-col gap-10">
    <header className="flex justify-between items-end">
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Staff Configuration</h2>
        <p style={{ color: 'var(--text-light)' }}>Manage employee roles, access permissions, and PIN codes.</p>
      </div>
      <button className="btn btn-primary">+ Add New Staff</button>
    </header>

    <div className="surface overflow-hidden">
       <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Employee</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Daily Sales</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>PIN</th>
              <th style={{ padding: '1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Admin User', role: 'Global Administrator', sales: '$2,402', pin: '••••', status: 'admin' },
              { name: 'Darko V.', role: 'Server', sales: '$1,820', pin: '••••', status: 'primary' },
              { name: 'Elena R.', role: 'Kitchen Lead', sales: '-', pin: '••••', status: 'accent' },
              { name: 'Marcus T.', role: 'Server / Host', sales: '$1,105', pin: '••••', status: 'primary' },
            ].map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1.5rem' }}>
                   <div className="flex items-center gap-4">
                     <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#F1F5F9', border: '2px solid white', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)' }}>
                        {s.name.charAt(0)}
                     </div>
                     <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{s.name}</span>
                   </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <span className={`badge badge-${s.status === 'admin' ? 'danger' : 'primary'}`}>{s.role}</span>
                </td>
                <td style={{ padding: '1.5rem', fontWeight: '600' }}>{s.sales}</td>
                <td style={{ padding: '1.5rem', fontFamily: 'monospace', letterSpacing: '4px' }}>{s.pin}</td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                   <div className="flex justify-end gap-2">
                      <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Edit</button>
                      <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--danger)' }}>Revoke</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
       </table>
    </div>
  </div>
);

const PaymentsSettings = () => {
  const [credit, setCredit] = useState(true);
  const [tips, setTips] = useState(true);
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Payments & Accounting</h2>
        <p style={{ color: 'var(--text-light)' }}>Configure payment processing, tax rates, and checkout behavior.</p>
      </header>

      <div className="flex flex-col gap-8">
         <div className="surface p-8">
            <h4 style={{ fontWeight: '800', marginBottom: '1.5rem' }}>Processing Configuration</h4>
            <div className="flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontWeight: '700' }}>In-App Credit Card Payments</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Allow direct payment via integrated terminals.</p>
                  </div>
                  <Toggle active={credit} onChange={() => setCredit(!credit)} />
               </div>
               <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />
               <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontWeight: '700' }}>Suggested Gratuity</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Show 15%, 18%, 20% buttons on checkout screen.</p>
                  </div>
                  <Toggle active={tips} onChange={() => setTips(!tips)} />
               </div>
            </div>
         </div>

         <div className="surface p-8">
            <h4 style={{ fontWeight: '800', marginBottom: '1.5rem' }}>Tax Rates</h4>
            <div className="grid grid-cols-2 gap-8">
               <div className="flex flex-col gap-2">
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>HST / GST (%)</label>
                  <input type="number" className="input" defaultValue="13" />
               </div>
               <div className="flex flex-col gap-2">
                  <label style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>Service Charge (%)</label>
                  <input type="number" className="input" defaultValue="0" />
               </div>
            </div>
         </div>
      </div>
      
      <button className="btn btn-primary py-4">Save Payment Logic</button>
    </div>
  );
};

const AppMarketplace = () => (
  <div className="flex flex-col gap-10">
    <header>
      <h2 style={{ fontSize: '2.25rem', fontWeight: '900' }}>Marketplace</h2>
      <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Powerful integrations to supercharge your restaurant.</p>
    </header>

    <div className="grid grid-cols-2 gap-8">
      {[
        { name: 'UberEats Integration', desc: 'Sync your menu and inject orders directly into the POS/KDS pipeline.', price: '$29/mo', icon: '🛵', color: '#06C167' },
        { name: '7shifts Payroll', desc: 'Automated staff scheduling and labor cost analysis synced with timeclocks.', price: '$49/mo', icon: '⏰', color: '#1E40AF' },
        { name: 'Mailchimp Sync', desc: 'Sync customer names and emails from Loyalty accounts into segmented campaigns.', price: 'Free', icon: '✉️', color: '#FFE01B' },
        { name: 'TouchBistro Reservations', desc: 'Full-service host stand and online booking engine for your website.', price: 'Installed', icon: '📅', color: '#059669', active: true },
      ].map((app, i) => (
        <div key={i} className="pos-card flex gap-6 p-8">
           <div style={{ width: '70px', height: '70px', borderRadius: '18px', backgroundColor: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
             {app.icon}
           </div>
           <div className="flex flex-col justify-between flex-1">
              <div>
                <div className="flex justify-between items-center mb-1">
                   <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{app.name}</h4>
                   <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-main)' }}>{app.price}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{app.desc}</p>
              </div>
              <div className="flex justify-end mt-6">
                 {app.active ? (
                   <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>System Native</span>
                 ) : (
                   <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Install Integration</button>
                 )}
              </div>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const AdvancedSettings = () => {
  const [offline, setOffline] = useState(false);

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: '900' }}>Advanced Operations</h2>
        <p style={{ color: 'var(--text-light)' }}>Technical configurations and database maintenance.</p>
      </header>
  
      <div className="flex flex-col gap-6">
         <div className="surface p-8">
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h4 style={{ fontWeight: '800' }}>Offline Synchronization Mode</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simulate internet disconnect to test local caching Resilience.</p>
               </div>
               <Toggle active={offline} onChange={() => setOffline(!offline)} />
            </div>
         </div>

         <div className="surface p-8">
            <h4 style={{ fontWeight: '800', marginBottom: '1rem' }}>System Cache</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Clearing the cache will force a fresh sync of all menu items and images. Use if changes aren&apos;t appearing.</p>
            <button className="btn w-full">Purge Local Cache</button>
         </div>
  
         <div className="surface p-8" style={{ border: '2px solid #FEE2E2', backgroundColor: '#FEF2F2' }}>
            <h4 style={{ fontWeight: '800', color: 'var(--danger)', marginBottom: '1rem' }}>Dangerous Actions</h4>
            <p style={{ fontSize: '0.9rem', color: '#991B1B', marginBottom: '1.5rem' }}>These actions are permanent. Ensure you have a database backup before proceeding.</p>
            <div className="flex flex-col gap-3">
               <button className="btn" style={{ backgroundColor: 'white', border: '1px solid #FCA5A5', color: 'var(--danger)', fontWeight: '800' }}>Wipe Transaction History</button>
               <button className="btn" style={{ backgroundColor: 'var(--danger)', border: 'none', color: 'white', fontWeight: '800' }}>Factory Reset Terminal</button>
            </div>
         </div>
      </div>
    </div>
  );
};
