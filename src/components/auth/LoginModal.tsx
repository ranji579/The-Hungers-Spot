'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  Eye, EyeOff, Lock, Mail, ShieldCheck, ChefHat,
  UtensilsCrossed, AlertCircle, Loader2, LogIn, UserPlus, User, CheckCircle
} from 'lucide-react';

interface LoginModalProps {
  requiredRole: UserRole;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ requiredRole, onSuccess, onCancel }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const isAdmin = requiredRole === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        triggerShake();
        return;
      }

      setIsLoading(true);
      const result = await login(email.trim(), password, requiredRole);

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || 'Invalid credentials');
        triggerShake();
      }
      setIsLoading(false);
    } else {
      // Register mode for new user
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and a password');
        triggerShake();
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        triggerShake();
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        triggerShake();
        return;
      }

      setIsLoading(true);
      const result = await register({
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
        role: requiredRole,
      });

      if (result.success) {
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(() => {
          onSuccess();
        }, 600);
      } else {
        setError(result.message || 'Registration failed');
        triggerShake();
      }
      setIsLoading(false);
    }
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
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: gradientBg,
          border: `1px solid ${accentColor}40`,
          borderRadius: '24px',
          boxShadow: `0 25px 60px rgba(0,0,0,0.65), 0 0 40px ${accentColor}20`,
          animation: shake ? 'loginShake 0.5s ease' : 'loginSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}10 100%)`,
            borderBottom: `1px solid ${accentColor}30`,
            padding: '28px 28px 20px',
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
              width: '64px', height: '64px',
              borderRadius: '18px',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${isAdmin ? '#6D28D9' : '#FFB300'} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: `0 8px 24px ${accentColor}50`,
            }}
          >
            {isAdmin ? <ShieldCheck size={32} color="#fff" /> : <ChefHat size={32} color="#fff" />}
          </div>

          <h2 style={{
            fontSize: '21px', fontWeight: 800, color: '#fff',
            marginBottom: '4px', letterSpacing: '-0.02em',
          }}>
            {isAdmin ? 'Admin Portal' : 'Owner Dashboard'}
          </h2>

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
            {mode === 'login'
              ? (isAdmin ? 'Sign in with your email to manage settings' : 'Sign in to access kitchen orders & restaurant settings')
              : (isAdmin ? 'Create a new admin account' : 'Register a new owner account to start managing your kitchen')}
          </p>

          {/* Role badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            marginTop: '10px',
            background: `${accentColor}20`, border: `1px solid ${accentColor}40`,
            borderRadius: '100px', padding: '3px 10px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: accentColor, boxShadow: `0 0 8px ${accentColor}`,
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {isAdmin ? 'Admin' : 'Owner'} {mode === 'login' ? 'Access' : 'Registration'}
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '4px',
          margin: '18px 28px 0',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            id="tab-sign-in"
            onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'login' ? accentColor : 'transparent',
              color: mode === 'login' ? '#fff' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            id="tab-new-user"
            onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? accentColor : 'transparent',
              color: mode === 'register' ? '#fff' : 'rgba(255,255,255,0.6)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={14} />
            <span>New User (Sign Up)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 28px 28px' }}>
          {/* Error message */}
          {error && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px', padding: '10px 12px',
                marginBottom: '16px',
                animation: 'loginFadeIn 0.2s ease',
              }}
            >
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '12px', padding: '10px 12px',
                marginBottom: '16px',
                animation: 'loginFadeIn 0.2s ease',
              }}
            >
              <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>{successMsg}</span>
            </div>
          )}

          {/* Display Name (Only in Register Mode) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Owner / Restaurant Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={15} color={displayName ? accentColor : 'rgba(255,255,255,0.25)'}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }}
                />
                <input
                  type="text"
                  id="register-name"
                  value={displayName}
                  onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
                  placeholder="Enter owner or restaurant name"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${displayName ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.border = `1.5px solid ${accentColor}`)}
                  onBlur={(e) => (e.target.style.border = `1.5px solid ${displayName ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`)}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15} color={email ? accentColor : 'rgba(255,255,255,0.25)'}
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
                  padding: '11px 14px 11px 38px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${email ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
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
          <div style={{ marginBottom: mode === 'register' ? '14px' : '22px' }}>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {mode === 'register' ? 'Create Password (min. 6 chars)' : 'Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15} color={password ? accentColor : 'rgba(255,255,255,0.25)'}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder={mode === 'register' ? 'Choose a secure password' : 'Enter your password'}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                required
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 38px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${password ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
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
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(255,255,255,0.35)', padding: '4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Only in Register Mode) */}
          {mode === 'register' && (
            <div style={{ marginBottom: '22px' }}>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15} color={confirmPassword ? accentColor : 'rgba(255,255,255,0.25)'}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', transition: 'color 0.2s' }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="register-confirm-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 38px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1.5px solid ${confirmPassword ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.border = `1.5px solid ${accentColor}`)}
                  onBlur={(e) => (e.target.style.border = `1.5px solid ${confirmPassword ? accentColor + '60' : 'rgba(255,255,255,0.1)'}`)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.35)', padding: '4px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            id={`${requiredRole.toLowerCase()}-submit-btn`}
            style={{
              width: '100%', padding: '13px',
              background: isLoading
                ? `${accentColor}80`
                : `linear-gradient(135deg, ${accentColor} 0%, ${isAdmin ? '#6D28D9' : '#FFB300'} 100%)`,
              color: '#fff', fontWeight: 700, fontSize: '14px',
              borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: isLoading ? 'none' : `0 6px 20px ${accentColor}40`,
              border: 'none',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <><Loader2 size={17} className="spin-icon" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
            ) : mode === 'login' ? (
              <><LogIn size={17} /> Sign In</>
            ) : (
              <><UserPlus size={17} /> Create {isAdmin ? 'Admin' : 'Owner'} Account</>
            )}
          </button>

          {/* Mode Switch Helper Link */}
          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            {mode === 'login' ? (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                New user?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  style={{
                    background: 'none', border: 'none', color: accentColor,
                    fontWeight: 700, cursor: 'pointer', padding: '0 4px',
                    textDecoration: 'underline', fontSize: '12px'
                  }}
                >
                  Create an {isAdmin ? 'Admin' : 'Owner'} account
                </button>
              </p>
            ) : (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  style={{
                    background: 'none', border: 'none', color: accentColor,
                    fontWeight: 700, cursor: 'pointer', padding: '0 4px',
                    textDecoration: 'underline', fontSize: '12px'
                  }}
                >
                  Sign In instead
                </button>
              </p>
            )}
          </div>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onCancel}
            style={{
              width: '100%', padding: '10px', marginTop: '12px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '13px',
              borderRadius: '12px', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.08)',
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
          padding: '12px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '11px', color: 'rgba(255,255,255,0.3)',
        }}>
          <UtensilsCrossed size={12} />
          <span>The Hunger&apos;s Spot — Secure Authentication</span>
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
