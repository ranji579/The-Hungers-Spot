'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  Eye, EyeOff, Lock, Mail, ShieldCheck, ChefHat,
  UtensilsCrossed, AlertCircle, Loader2, LogIn
} from 'lucide-react';

interface LoginModalProps {
  requiredRole: UserRole;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ requiredRole, onSuccess, onCancel }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const isAdmin = requiredRole === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      triggerShake();
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await login(email.trim(), password, requiredRole);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.message || 'Invalid credentials');
      triggerShake();
    }

    setIsLoading(false);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const accentColor = isAdmin ? '#8B5CF6' : '#FF5E3A';
  const gradientBg = isAdmin
    ? 'linear-gradient(135deg, #1a0533 0%, #0D0B1E 50%, #0B0D13 100%)'
    : 'linear-gradient(135deg, #1a0a00 0%, #1a0d00 50%, #0B0D13 100%)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '20px',
          background: gradientBg,
          border: `1px solid ${accentColor}40`,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: `0 25px 60px rgba(0,0,0,0.6), 0 0 40px ${accentColor}20`,
          animation: shake ? 'loginShake 0.5s ease' : 'loginSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}10 100%)`,
            borderBottom: `1px solid ${accentColor}30`,
            padding: '32px 32px 24px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
            width: '160px', height: '160px',
            background: `radial-gradient(circle, ${accentColor}25 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Logo icon */}
          <div
            style={{
              width: '72px', height: '72px',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${isAdmin ? '#6D28D9' : '#FFB300'} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 8px 24px ${accentColor}50`,
            }}
          >
            {isAdmin ? <ShieldCheck size={36} color="#fff" /> : <ChefHat size={36} color="#fff" />}
          </div>

          <h2 style={{
            fontSize: '22px', fontWeight: 800, color: '#fff',
            marginBottom: '6px', letterSpacing: '-0.02em',
          }}>
            {isAdmin ? 'Admin Portal' : 'Owner Dashboard'}
          </h2>

          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {isAdmin
              ? 'Sign in with your email to manage settings'
              : 'Sign in with your email to access kitchen & analytics'
            }
          </p>

          {/* Role badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            marginTop: '12px',
            background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
            borderRadius: '100px', padding: '4px 12px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAdmin ? 'Admin Access' : 'Owner Access'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>
          {/* Error message */}
          {error && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px', padding: '12px 14px',
                marginBottom: '20px',
                animation: 'loginFadeIn 0.2s ease',
              }}
            >
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 600,
              color: 'rgba(255,255,255,0.6)', marginBottom: '8px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16} color={email ? accentColor : 'rgba(255,255,255,0.25)'}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }}
              />
              <input
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="Enter your email"
                autoComplete="email"
                required
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${email ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.border = `1.5px solid ${accentColor}`)}
                onBlur={(e) => (e.target.style.border = `1.5px solid ${email ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`)}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '26px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 600,
              color: 'rgba(255,255,255,0.6)', marginBottom: '8px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16} color={password ? accentColor : 'rgba(255,255,255,0.25)'}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 40px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${password ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 500,
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.border = `1.5px solid ${accentColor}`)}
                onBlur={(e) => (e.target.style.border = `1.5px solid ${password ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.35)', padding: '4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            id={`${requiredRole.toLowerCase()}-login-btn`}
            style={{
              width: '100%', padding: '14px',
              background: isLoading
                ? `${accentColor}80`
                : `linear-gradient(135deg, ${accentColor} 0%, ${isAdmin ? '#6D28D9' : '#FFB300'} 100%)`,
              color: '#fff', fontWeight: 700, fontSize: '15px',
              borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: isLoading ? 'none' : `0 6px 20px ${accentColor}40`,
              border: 'none',
              transition: 'all 0.2s',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {isLoading
              ? <><Loader2 size={18} className="spin-icon" /> Signing in...</>
              : <><LogIn size={18} /> Sign In</>
            }
          </button>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '100%', padding: '12px', marginTop: '10px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '14px',
              borderRadius: '12px', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            Cancel
          </button>
        </form>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '14px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontSize: '11px', color: 'rgba(255,255,255,0.25)',
        }}>
          <UtensilsCrossed size={12} />
          <span>The Hunger&apos;s Spot — Secure Portal</span>
        </div>
      </div>

      <style>{`
        @keyframes loginSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(-20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin-icon { animation: spin 0.8s linear infinite; }
      `}</style>
    </div>
  );
};
