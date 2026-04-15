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
    <div className="flex h-full w-full items-center justify-center">
      <div className="surface flex flex-col items-center animate-fade-in" style={{ padding: '3.5rem', width: '450px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', fontWeight: 800, letterSpacing: '-1px' }}>TouchBistro</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>Enter passcode</p>
        
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ 
              width: '16px', height: '16px', 
              borderRadius: '50%', 
              backgroundColor: pin.length > i ? 'white' : 'rgba(255,255,255,0.2)',
              boxShadow: pin.length > i ? '0 0 10px white' : 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          ))}
        </div>

        {error && <p style={{ color: '#fca5a5', marginBottom: '1.5rem', height: '24px', fontWeight: 600 }}>{error}</p>}
        {message && <p style={{ color: '#6ee7b7', marginBottom: '1.5rem', height: '24px', fontWeight: 600 }}>{message}</p>}
        {!error && !message && <div style={{ height: '24px', marginBottom: '1.5rem' }} />}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button 
              key={num}
              onClick={() => handlePress(num.toString())}
              className="pos-card flex items-center justify-center"
              style={{ fontSize: '1.75rem', fontWeight: 600, padding: '1.5rem 0', borderRadius: 'var(--radius-md)' }}
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleClear}
            className="btn btn-secondary"
            style={{ fontSize: '1.5rem' }}
          >
            ✕
          </button>
          <button 
            onClick={() => handlePress('0')}
            className="pos-card flex items-center justify-center"
            style={{ fontSize: '1.75rem', fontWeight: 600, padding: '1.5rem 0', borderRadius: 'var(--radius-md)' }}
          >
            0
          </button>
          <button 
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ fontSize: '1.75rem', backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            ✓
          </button>
        </div>

        <button 
           onClick={handleClockIn}
           className="btn btn-secondary w-full"
           style={{ padding: '1.25rem', fontSize: '1.1rem' }}>
           Clock In / Clock Out
        </button>
      </div>
    </div>

  );
}
