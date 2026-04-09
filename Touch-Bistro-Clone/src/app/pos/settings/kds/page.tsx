'use client'
import { useRouter } from 'next/navigation';

export default function KDSSettingsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full" style={{ backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
       <div style={{ backgroundColor: '#1e293b', color: 'white', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center' }}>
          <button onClick={() => router.back()} style={{ background: 'transparent', color: 'var(--primary)', border: 'none', fontSize: '1rem', marginRight: '2rem', cursor: 'pointer', fontWeight: 'bold' }}>&lt; Back</button>
          <h1 style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>New Kitchen Display System</h1>
       </div>
       
       <div style={{ padding: '3rem 2rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', maxWidth: '800px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
            
             <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '30%', padding: '1.5rem', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: 'bold', fontSize: '1.1rem' }}>
                   Configuration Name
                </div>
                <div style={{ flex: 1, padding: '1.5rem' }}>
                   <input type="text" defaultValue="KDS" style={{ width: '100%', border: 'none', fontSize: '1.2rem', outline: 'none' }} />
                </div>
             </div>
             
             <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '30%', padding: '1.5rem', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: 'bold', fontSize: '1.1rem' }}>
                   Identifier
                </div>
                <div style={{ flex: 1, padding: '1.5rem', color: '#6b7280', fontSize: '1.1rem' }}>
                   A0C23668-3E2A-4B60-BCD2-1E8D2C5
                </div>
             </div>
             
             <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '30%', padding: '1.5rem', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: 'bold', fontSize: '1.1rem' }}>
                   Prep Station
                </div>
                <div style={{ flex: 1, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                   <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>Grill Display</span>
                   <span style={{ color: '#9ca3af', fontSize: '1.2rem' }}>&gt;</span>
                </div>
             </div>

             <div style={{ display: 'flex' }}>
                <div style={{ width: '30%', padding: '1.5rem', backgroundColor: '#f9fafb', color: '#4b5563', fontWeight: 'bold', fontSize: '1.1rem' }}>
                   IP Address
                </div>
                <div style={{ flex: 1, padding: '1.5rem', fontSize: '1.2rem', color: '#4b5563' }}>
                   Current IP: 192.168.0.104
                </div>
             </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => window.open('/kds', '_blank')} className="btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.2rem', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}>
               Launch KDS Monitor
            </button>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Normally launched on the designated Kitchen iPad.</p>
          </div>
       </div>
    </div>
  )
}
