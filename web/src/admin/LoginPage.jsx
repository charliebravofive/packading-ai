import React, { useState } from 'react';
import { login } from './adminApi.js';

function BrandLogoInline() {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 36, color: '#141414', letterSpacing: '-0.5px', lineHeight: 1 }}>Pack</span>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontStyle: 'italic', fontSize: 36, color: '#C4724A', letterSpacing: '-0.5px', lineHeight: 1 }}>ading</span>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, fontSize: 21, color: '#C4724A', letterSpacing: '1px', lineHeight: 1, marginLeft: 2, alignSelf: 'flex-end', paddingBottom: 3 }}>.ai</span>
    </div>
  );
}

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(password);
      if (result.ok) {
        onLogin();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#141414',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 14,
        padding: 40,
        width: 400,
        boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <BrandLogoInline height={80} />
        </div>
        <h1 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, color: '#1a1816', margin: '0 0 8px' }}>
          Admin Panel
        </h1>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 14, margin: '0 0 28px' }}>
          packading.ai · Brisbane
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d4c4a8',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              autoFocus
            />
          </div>
          {error && (
            <p style={{ color: '#dc2626', fontSize: 13, margin: '0 0 12px', textAlign: 'center' }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#b06240' : '#C4724A',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
