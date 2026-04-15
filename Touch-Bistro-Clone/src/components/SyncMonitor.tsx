'use client';
import { useState, useEffect } from 'react';

export default function SyncMonitor() {
  const [status, setStatus] = useState<'online' | 'syncing' | 'offline'>('online');
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    // Simulate periodic syncing heartbeat
    const interval = setInterval(() => {
      setStatus('syncing');
      setTimeout(() => {
        setStatus('online');
        setLatency(Math.floor(Math.random() * 15) + 15);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#10B981';
      case 'syncing': return '#3B82F6';
      case 'offline': return '#EF4444';
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-slate-800 rounded-full border border-slate-700" style={{ fontSize: '0.75rem' }}>
       <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-500 ${status === 'syncing' ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: getStatusColor(), boxShadow: `0 0 8px ${getStatusColor()}` }}
          />
          <span className="font-bold text-slate-300 uppercase tracking-tighter">
            {status === 'online' ? 'System Live' : (status === 'syncing' ? 'Syncing...' : 'Local Mode')}
          </span>
       </div>
       <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--slate-700)' }} />
       <span className="text-slate-500 font-mono">{latency}ms</span>
    </div>
  );
}
