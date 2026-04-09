'use client'

import { useState } from 'react';
import { loginWithPin, clockInOrOut } from './actions';

export default function LoginScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
      setMessage('');
    }
  };

  const handleClear = () => {
    setPin('');
    setError('');
    setMessage('');
  };

  const handleSubmit = async () => {
    if (pin.length === 0) return;
    const res = await loginWithPin(pin);
    if (res?.error) {
      setError(res.error);
      setPin('');
    }
  };

  const handleClockIn = async () => {
    if (pin.length === 0) return;
    const res = await clockInOrOut(pin);
    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setMessage(res.success);
    }
    setPin('');
  };

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div className="surface flex flex-col items-center" style={{ padding: '3rem', width: '400px' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>TouchBistro POS</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Enter passcode</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ 
              width: '20px', height: '20px', 
              borderRadius: '50%', 
              backgroundColor: pin.length > i ? 'var(--primary)' : 'var(--border-color)',
              transition: 'background-color 0.2s'
            }} />
          ))}
        </div>

        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', height: '20px', fontWeight: 'bold' }}>{error}</p>}
        {message && <p style={{ color: '#10b981', marginBottom: '1rem', height: '20px', fontWeight: 'bold' }}>{message}</p>}
        {!error && !message && <div style={{ height: '20px', marginBottom: '1rem' }} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', marginBottom: '1.5rem' }}>
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button 
              key={num}
              onClick={() => handlePress(num.toString())}
              style={{
                fontSize: '2rem', padding: '1.5rem 1rem', borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)', transition: 'background 0.1s'
              }}
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleClear}
            style={{ fontSize: '1.5rem', padding: '1.5rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
          <button 
            onClick={() => handlePress('0')}
            style={{
              fontSize: '2rem', padding: '1.5rem 1rem', borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)', transition: 'background 0.1s'
            }}
          >
            0
          </button>
          <button 
            onClick={handleSubmit}
            style={{ fontSize: '1.5rem', padding: '1.5rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}
          >
            ✓
          </button>
        </div>

        <button 
           onClick={handleClockIn}
           style={{ width: '100%', padding: '1rem', backgroundColor: '#e2e8f0', color: '#334155', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
           Clock In / Clock Out
        </button>
      </div>
    </div>
  );
}
