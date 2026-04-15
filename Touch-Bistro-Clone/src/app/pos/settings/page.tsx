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

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'Dashboard': return <StatsDashboard />;
      case 'Restaurant Information': return <RestaurantInfo onSave={() => showToast('Profile updated successfully!', 'success')} />;
      case 'Staff': return <StaffSettings onToast={showToast} />;
      case 'Payments': return <PaymentsSettings onSave={() => showToast('Payment logic saved!', 'success')} />;
      case 'Marketplace': return <AppMarketplace onToast={showToast} />;
      case 'Advanced': return <AdvancedSettings onToast={showToast} />;
      default: return <StatsDashboard />;
    }
  };

  return (
    <div className="flex h-full animate-fade-in" style={{ backgroundColor: 'white', color: '#7c3aed' }}>
      
      {/* Sidebar Navigation */}
      <div className="flex flex-col" style={{ width: '320px', borderRight: '1px solid #f1f5f9', backgroundColor: '#fdfaff' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3 mb-6">
             <button 
               onClick={() => router.push('/pos/floorplan')}
               className="flex items-center justify-center"
               style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: 'none', color: '#7c3aed', fontWeight: 'bold' }}
             >
               ←
             </button>
             <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Management</h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Settings & Config</p>
        </div>
        
        <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarItems.map(item => (
            <Link 
              key={item.id}
              href={`/pos/settings?tab=${item.id}`}
              className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-bold ${activeTab === item.id ? 'bg-[#f61b8d15] text-[#F61B8D]' : 'text-[#7c3aed] hover:bg-slate-50'}`}
              style={{ textDecoration: 'none' }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              {activeTab === item.id && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F61B8D' }}></div>}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto p-8 border-t border-[#f1f5f9]">
           <div className="bg-[#f1f5f9] p-4 text-center rounded-xl">
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Version 2.4.1 Premium</p>
              <button className="w-full py-2 rounded-lg bg-[#7c3aed] text-white font-bold" style={{ fontSize: '0.75rem' }}>Check for Updates</button>
           </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div 
          className="fixed bottom-10 right-10 animate-slide-up"
          style={{ 
            padding: '1rem 2rem', 
            backgroundColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#7c3aed',
            color: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            zIndex: 1000,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {toast.type === 'success' ? '✅' : 'ℹ️'} {toast.message}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '3.5rem' }}>
        {renderContent()}
      </div>
    </div>
  );
}

const StatsDashboard = () => {
  const [showLabor, setShowLabor] = useState(false);
  
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
          <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#F61B8D', letterSpacing: '-1px' }}>Performance Overview</h2>
          <p style={{ color: '#7c3aed', opacity: 0.6, fontSize: '1.1rem' }}>Business metrics and operational insights for today.</p>
        </div>
        <div className="flex p-1 rounded-xl border border-[#f1f5f9]">
           <button 
             onClick={() => setShowLabor(false)}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${!showLabor ? 'bg-[#F61B8D] text-white shadow-md' : 'text-[#7c3aed]'}`}
           >Revenue Only</button>
           <button 
             onClick={() => setShowLabor(true)}
             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${showLabor ? 'bg-[#F61B8D] text-white shadow-md' : 'text-[#7c3aed]'}`}
           >Labor Adjusted</button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: '$12,482.50', trend: '+14.2%', color: '#F61B8D' },
          { label: showLabor ? 'Labor Cost' : 'Average Check', value: showLabor ? '$2,450.00' : '$42.90', trend: showLabor ? '+2.1%' : '+5.1%', color: '#7c3aed' },
          { label: showLabor ? 'Net Profit' : 'Guest Count', value: showLabor ? '$10,032.50' : '284', trend: showLabor ? '+18.4%' : '-2.4%', color: '#F61B8D' },
        ].map((stat, i) => (
          <div key={i} style={{ padding: '2rem', borderLeft: `6px solid ${stat.color}`, backgroundColor: '#fdfaff', borderRadius: '14px' }}>
             <p style={{ fontSize: '0.85rem', fontWeight: '900', color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>{stat.label}</p>
             <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: stat.color }}>{stat.value}</h3>
             <div className="flex items-center gap-2 mt-4">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{stat.trend}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>vs. last week</span>
             </div>
          </div>
        ))}
      </div>

       <div style={{ padding: '2rem', minHeight: '300px', backgroundColor: '#fdfaff', borderRadius: '20px' }}>
          <div className="flex justify-between items-center mb-8">
             <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#7c3aed' }}>Sales vs. Labor Trend</h4>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#F61B8D' }}></div>
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
                   <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
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
                 <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all">
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

const RestaurantInfo = ({ onSave }: { onSave: () => void }) => {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSave();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-10 max-w-3xl">
    <header>
      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#F61B8D' }}>Restaurant Identity</h2>
      <p style={{ color: '#7c3aed', opacity: 0.6 }}>Manage your business profile and public information.</p>
    </header>

    <div className="surface p-10 flex flex-col gap-8" style={{ backgroundColor: '#fdfaff', border: '1px solid #f1f5f9', borderRadius: '24px' }}>
       <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Business Name</label>
            <input type="text" className="input" style={{ backgroundColor: '#fcf6ff', color: '#7c3aed', border: '1px solid #f1f5f9', padding: '0.75rem', borderRadius: '12px' }} defaultValue="The TouchBistro Cafe" />
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Contact Phone</label>
            <input type="text" className="input" style={{ backgroundColor: '#fcf6ff', color: '#7c3aed', border: '1px solid #f1f5f9', padding: '0.75rem', borderRadius: '12px' }} defaultValue="(555) 123-4567" />
          </div>
       </div>

       <div className="flex flex-col gap-2">
          <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Mailing Address</label>
          <textarea className="input" style={{ minHeight: '100px', backgroundColor: '#fcf6ff', color: '#7c3aed', border: '1px solid #f1f5f9' }} defaultValue="123 Cuisine Ave, Food District, NY 10001" />
       </div>

       <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Primary Currency</label>
            <select className="input" style={{ backgroundColor: '#fcf6ff', color: '#7c3aed', border: '1px solid #f1f5f9' }}>
              <option>USD ($)</option>
              <option>CAD ($)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#7c3aed' }}>Timezone</label>
            <select className="input" style={{ backgroundColor: '#fcf6ff', color: '#7c3aed', border: '1px solid #f1f5f9' }}>
              <option>Eastern Time (ET)</option>
              <option>Pacific Time (PT)</option>
            </select>
          </div>
       </div>

       <button 
         onClick={handleSave}
         disabled={saving}
         style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', backgroundColor: '#F61B8D', color: 'white', fontWeight: '900', border: 'none', boxShadow: '0 10px 20px rgba(246, 27, 141, 0.2)', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
       >
         {saving ? 'Saving Changes...' : 'Save Updated Profile'}
       </button>
    </div>
  </div>
);
};

const StaffSettings = ({ onToast }: { onToast: (m: string) => void }) => {
  const [staff, setStaff] = useState([
    { name: 'Admin User', role: 'Global Administrator', sales: '$2,402', pin: '••••', status: 'admin', id: 1 },
    { name: 'Darko V.', role: 'Server', sales: '$1,820', pin: '••••', status: 'primary', id: 2 },
    { name: 'Elena R.', role: 'Kitchen Lead', sales: '-', pin: '••••', status: 'accent', id: 3 },
    { name: 'Marcus T.', role: 'Server / Host', sales: '$1,105', pin: '••••', status: 'primary', id: 4 },
  ]);

  const removeStaff = (id: number) => {
    if (window.confirm('Are you sure you want to revoke access?')) {
      setStaff(staff.filter(s => s.id !== id));
      onToast('Staff access revoked.');
    }
  };

  const addStaff = () => {
    const name = window.prompt('Enter staff name:');
    if (name) {
      setStaff([...staff, { name, role: 'Server', sales: '-', pin: '••••', status: 'primary', id: Date.now() }]);
      onToast(`Added ${name} to the team.`);
    }
  };

  return (
    <div className="flex flex-col gap-10">
    <header className="flex justify-between items-end">
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#F61B8D' }}>Staff Configuration</h2>
        <p style={{ color: '#7c3aed', opacity: 0.6 }}>Manage employee roles, access permissions, and PIN codes.</p>
      </div>
      <button 
        onClick={addStaff}
        className="py-3 px-6 rounded-xl bg-[#F61B8D] text-white font-bold shadow-lg text-sm"
      >+ Add New Staff</button>
    </header>

    <div style={{ backgroundColor: '#fdfaff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
       <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fcf6ff', borderBottom: '1px solid #f1f5f9' }}>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>Employee</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>Daily Sales</th>
              <th style={{ padding: '1.25rem', fontWeight: '800', color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase' }}>PIN</th>
              <th style={{ padding: '1.25rem', textAlign: 'right', color: '#7c3aed' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f8f1ff' }}>
                <td style={{ padding: '1.5rem' }}>
                   <div className="flex items-center gap-4">
                     <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f3e8ff', border: '2px solid white', boxShadow: '0 4px 10px rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#7c3aed' }}>
                        {s.name.charAt(0)}
                     </div>
                     <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{s.name}</span>
                   </div>
                </td>
                <td style={{ padding: '1.5rem' }}>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${s.status === 'admin' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{s.role}</span>
                </td>
                <td style={{ padding: '1.5rem', fontWeight: '600', color: '#7c3aed' }}>{s.sales}</td>
                <td style={{ padding: '1.5rem', fontFamily: 'monospace', letterSpacing: '4px', color: '#7c3aed' }}>{s.pin}</td>
                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                       <button onClick={() => onToast('Edit dialog opened.')} className="py-2 px-4 rounded-lg bg-white border border-[#f1f5f9] text-[#7c3aed] font-bold text-xs">Edit</button>
                       <button onClick={() => removeStaff(s.id)} className="py-2 px-4 rounded-lg bg-pink-50 text-[#F61B8D] font-bold text-xs">Revoke</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
       </table>
    </div>
  </div>
);
};

const PaymentsSettings = ({ onSave }: { onSave: () => void }) => {
  const [credit, setCredit] = useState(true);
  const [tips, setTips] = useState(true);
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <header>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#F61B8D' }}>Payments & Accounting</h2>
        <p style={{ color: '#7c3aed', opacity: 0.6 }}>Configure payment processing, tax rates, and checkout behavior.</p>
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
               <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
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
      
      <button onClick={() => onSave()} className="py-4 rounded-xl bg-[#F61B8D] text-white font-bold shadow-xl">Save Payment Logic</button>
    </div>
  );
};

const AppMarketplace = ({ onToast }: { onToast: (m: string) => void }) => {
  const [apps, setApps] = useState([
    { id: 'uber', name: 'UberEats Integration', desc: 'Sync your menu and inject orders directly into the POS/KDS pipeline.', price: '$29/mo', icon: '🛵', color: '#06C167', active: false },
    { id: '7shifts', name: '7shifts Payroll', desc: 'Automated staff scheduling and labor cost analysis synced with timeclocks.', price: '$49/mo', icon: '⏰', color: '#1E40AF', active: false },
    { id: 'mailchimp', name: 'Mailchimp Sync', desc: 'Sync customer names and emails from Loyalty accounts into segmented campaigns.', price: 'Free', icon: '✉️', color: '#FFE01B', active: false },
    { id: 'res', name: 'TouchBistro Reservations', desc: 'Full-service host stand and online booking engine for your website.', price: 'Installed', icon: '📅', color: '#059669', active: true },
  ]);

  const installApp = (id: string, name: string) => {
    onToast(`Initiating connection to ${name}...`);
    setTimeout(() => {
      setApps(apps.map(a => a.id === id ? { ...a, active: true } : a));
      onToast(`${name} installed successfully!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10">
    <header>
      <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#F61B8D' }}>Marketplace</h2>
      <p style={{ color: '#7c3aed', opacity: 0.6, fontSize: '1.1rem' }}>Powerful integrations to supercharge your restaurant.</p>
    </header>

    <div className="grid grid-cols-2 gap-8">
      {apps.map((app, i) => (
        <div key={app.id} className="pos-card flex gap-6 p-8">
           <div style={{ width: '70px', height: '70px', borderRadius: '18px', backgroundColor: app.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
             {app.icon}
           </div>
           <div className="flex flex-col justify-between flex-1">
              <div>
                <div className="flex justify-between items-center mb-1">
                   <h4 style={{ fontWeight: '800', fontSize: '1.1rem' }}>{app.name}</h4>
                   <span style={{ fontWeight: '800', fontSize: '0.85rem' }}>{app.price}</span>
                </div>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.5' }}>{app.desc}</p>
              </div>
              <div className="flex justify-end mt-6">
                 {app.active ? (
                   <span className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold text-xs">Installed</span>
                 ) : (
                   <button 
                    onClick={() => installApp(app.id, app.name)}
                    className="py-2 px-4 rounded-lg bg-[#7c3aed] text-white font-bold text-xs"
                   >Install Integration</button>
                 )}
              </div>
           </div>
        </div>
      ))}
    </div>
  </div>
);
};

const AdvancedSettings = ({ onToast }: { onToast: (m: string) => void }) => {
  const [offline, setOffline] = useState(false);

  const purgeCache = () => {
    onToast('Purging system cache...');
    setTimeout(() => onToast('Cache purged successfully!'), 1500);
  };

  const wipeHistory = () => {
    if (window.confirm('CRITICAL: This will permanently delete all transaction history for the current database. Proceed?')) {
      onToast('Transaction history wiped.');
    }
  };

  const factoryReset = () => {
    if (window.confirm('CRITICAL: This will restore the terminal to factory default. All settings will be lost. Proceed?')) {
      onToast('Factory reset initiated...');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <header>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '950', color: '#F61B8D' }}>Advanced Operations</h2>
        <p style={{ color: '#7c3aed', opacity: 0.6 }}>Technical configurations and database maintenance.</p>
      </header>
  
      <div className="flex flex-col gap-6">
         <div className="surface p-8" style={{ backgroundColor: '#fdfaff', border: '1px solid #f1f5f9', borderRadius: '24px' }}>
            <div className="flex justify-between items-center mb-4">
               <div>
                  <h4 style={{ fontWeight: '800' }}>Offline Synchronization Mode</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Simulate internet disconnect to test local caching Resilience.</p>
               </div>
               <Toggle active={offline} onChange={() => { setOffline(!offline); onToast(offline ? 'System online' : 'System offline mode active'); }} />
            </div>
         </div>

         <div className="surface p-8" style={{ backgroundColor: '#fdfaff', border: '1px solid #f1f5f9', borderRadius: '24px' }}>
            <h4 style={{ fontWeight: '800', marginBottom: '1rem' }}>System Cache</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '1.5rem' }}>Clearing the cache will force a fresh sync of all menu items and images. Use if changes aren&apos;t appearing.</p>
            <button onClick={purgeCache} className="w-full py-3 rounded-lg bg-[#7c3aed] text-white font-bold">Purge Local Cache</button>
         </div>
  
         <div className="surface p-8" style={{ border: '2px solid rgba(246, 27, 141, 0.4)', backgroundColor: 'rgba(246, 27, 141, 0.05)', borderRadius: '24px' }}>
            <h4 style={{ fontWeight: '800', color: '#F61B8D', marginBottom: '1rem' }}>Dangerous Actions</h4>
            <p style={{ fontSize: '0.9rem', color: '#F61B8D', opacity: 0.8, marginBottom: '1.5rem' }}>These actions are permanent. Ensure you have a database backup before proceeding.</p>
            <div className="flex flex-col gap-3">
               <button onClick={wipeHistory} className="py-2 rounded-lg border border-pink-200 text-[#F61B8D] font-bold">Wipe Transaction History</button>
               <button onClick={factoryReset} className="py-2 rounded-lg bg-[#F61B8D] text-white font-bold">Factory Reset Terminal</button>
            </div>
         </div>
      </div>
    </div>
  );
};
