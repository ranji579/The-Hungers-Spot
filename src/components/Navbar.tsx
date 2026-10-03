'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { useAuth, UserRole } from '@/context/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import {
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  QrCode,
  Bell,
  LogOut,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeTableNumber,
    setActiveTableNumber,
    tables,
    isMobileFrame,
    setIsMobileFrame,
    soundEnabled,
    setSoundEnabled,
    orders,
    unreadOrderNotification,
    clearNotification
  } = useRestaurant();

  const { user, isAuthenticated, logout } = useAuth();

  const [loginTarget, setLoginTarget] = useState<UserRole | null>(null);

  const pendingOrdersCount = orders.filter(o => o.status === 'Received' || o.status === 'Preparing').length;

  const handleViewClick = (view: 'customer' | 'owner' | 'admin') => {
    if (view === 'customer') {
      setActiveView('customer');
      return;
    }

    const requiredRole: UserRole = view === 'owner' ? 'OWNER' : 'ADMIN';

    // Already authenticated with correct role
    if (isAuthenticated && user?.role === requiredRole) {
      setActiveView(view);
      return;
    }

    // If authenticated as different role — switch requires re-login
    if (isAuthenticated && user?.role !== requiredRole) {
      setLoginTarget(requiredRole);
      return;
    }

    // Not authenticated — open login
    setLoginTarget(requiredRole);
  };

  const handleLoginSuccess = () => {
    if (!loginTarget) return;
    const view = loginTarget === 'ADMIN' ? 'admin' : 'owner';
    setActiveView(view);
    setLoginTarget(null);
  };

  const handleLogout = () => {
    logout();
    setActiveView('customer');
  };

  return (
    <>
      <header
        style={{
          height: '68px',
          background: 'rgba(18, 21, 31, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF5E3A 0%, #FFB300 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 94, 58, 0.35)'
            }}
          >
            <UtensilsCrossed size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>The Hunger&apos;s Spot</span>
              <span style={{ fontSize: '11px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                APP
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Smart Dining &amp; Management Suite
            </div>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <button
            onClick={() => handleViewClick('customer')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: activeView === 'customer' ? '#fff' : 'var(--text-secondary)',
              background: activeView === 'customer' ? 'var(--color-primary)' : 'transparent',
              boxShadow: activeView === 'customer' ? '0 2px 10px rgba(255, 94, 58, 0.3)' : 'none'
            }}
          >
            <Smartphone size={15} />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleViewClick('owner')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: activeView === 'owner' ? '#fff' : (isAuthenticated && user?.role === 'OWNER' ? '#FF9945' : 'var(--text-secondary)'),
              background: activeView === 'owner' ? 'var(--color-primary)' : 'transparent',
              boxShadow: activeView === 'owner' ? '0 2px 10px rgba(255, 94, 58, 0.3)' : 'none',
              position: 'relative'
            }}
          >
            <ChefHat size={15} />
            <span>Owner</span>
            {pendingOrdersCount > 0 && (
              <span
                style={{
                  background: 'var(--color-secondary)',
                  color: '#000',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginLeft: '2px'
                }}
              >
                {pendingOrdersCount}
              </span>
            )}
            {/* Lock icon when not authenticated as owner */}
            {(!isAuthenticated || user?.role !== 'OWNER') && activeView !== 'owner' && (
              <span style={{ fontSize: '10px', opacity: 0.5 }}>🔒</span>
            )}
          </button>

          <button
            onClick={() => handleViewClick('admin')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: activeView === 'admin' ? '#fff' : (isAuthenticated && user?.role === 'ADMIN' ? '#A78BFA' : 'var(--text-secondary)'),
              background: activeView === 'admin' ? '#8B5CF6' : 'transparent',
              boxShadow: activeView === 'admin' ? '0 2px 10px rgba(139, 92, 246, 0.3)' : 'none'
            }}
          >
            <ShieldCheck size={15} />
            <span>Admin</span>
            {(!isAuthenticated || user?.role !== 'ADMIN') && activeView !== 'admin' && (
              <span style={{ fontSize: '10px', opacity: 0.5 }}>🔒</span>
            )}
          </button>
        </div>

        {/* Right Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeView === 'customer' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)',
                fontSize: '12px'
              }}
            >
              <QrCode size={14} color="var(--color-secondary)" />
              <span style={{ color: 'var(--text-muted)' }}>Table:</span>
              <select
                value={activeTableNumber}
                onChange={(e) => setActiveTableNumber(Number(e.target.value))}
                style={{
                  padding: '2px 6px',
                  fontSize: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-secondary)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {tables.map(t => (
                  <option key={t.tableNumber} value={t.tableNumber} style={{ background: '#181C2A', color: '#fff' }}>
                    Table {t.tableNumber}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User badge (when logged in) */}
          {isAuthenticated && user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: user.role === 'ADMIN' ? 'rgba(139,92,246,0.12)' : 'rgba(255,94,58,0.12)',
              border: `1px solid ${user.role === 'ADMIN' ? 'rgba(139,92,246,0.3)' : 'rgba(255,94,58,0.3)'}`,
              borderRadius: '100px', padding: '4px 12px 4px 6px',
            }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%',
                background: user.role === 'ADMIN' ? '#8B5CF6' : '#FF5E3A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={13} color="#fff" />
              </div>
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: user.role === 'ADMIN' ? '#A78BFA' : '#FF9945',
              }}>
                {user.displayName}
              </span>
            </div>
          )}

          {/* Logout button (when logged in) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="btn-icon"
              title="Sign out"
              style={{ width: '36px', height: '36px', color: 'rgba(255,255,255,0.4)' }}
            >
              <LogOut size={16} />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-icon"
            title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
            style={{ width: '36px', height: '36px' }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} color="var(--text-muted)" />}
          </button>

          {/* Phone Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="btn-icon"
            title={isMobileFrame ? 'Exit phone frame' : 'Preview in phone frame'}
            style={{
              width: '36px',
              height: '36px',
              background: isMobileFrame ? 'var(--color-primary-light)' : 'var(--bg-card)',
              color: isMobileFrame ? 'var(--color-primary)' : 'var(--text-primary)',
              borderColor: isMobileFrame ? 'var(--color-primary)' : 'var(--glass-border)'
            }}
          >
            {isMobileFrame ? <Maximize2 size={16} /> : <Smartphone size={16} />}
          </button>
        </div>
      </header>

      {/* Floating Alert Toast */}
      {unreadOrderNotification && (
        <div className="order-alert-toast">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Bell size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>Live Order Alert!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {unreadOrderNotification}
            </div>
          </div>
          <button
            onClick={clearNotification}
            style={{
              color: 'var(--text-muted)',
              fontSize: '18px',
              padding: '4px',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Login Modal */}
      {loginTarget && (
        <LoginModal
          requiredRole={loginTarget}
          onSuccess={handleLoginSuccess}
          onCancel={() => setLoginTarget(null)}
        />
      )}
    </>
  );
};
