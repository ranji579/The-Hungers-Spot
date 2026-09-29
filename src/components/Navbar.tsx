'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import {
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  QrCode,
  Bell
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

  const pendingOrdersCount = orders.filter(o => o.status === 'Received' || o.status === 'Preparing').length;

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

        {/* Center: View Switcher (Customer, Owner, Admin) */}
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
            onClick={() => setActiveView('customer')}
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
            onClick={() => setActiveView('owner')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: activeView === 'owner' ? '#fff' : 'var(--text-secondary)',
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
          </button>

          <button
            onClick={() => setActiveView('admin')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: activeView === 'admin' ? '#fff' : 'var(--text-secondary)',
              background: activeView === 'admin' ? 'var(--color-primary)' : 'transparent',
              boxShadow: activeView === 'admin' ? '0 2px 10px rgba(255, 94, 58, 0.3)' : 'none'
            }}
          >
            <ShieldCheck size={15} />
            <span>Admin</span>
          </button>
        </div>

        {/* Right Tools: Table Quick Switcher (when on Customer view) + Sound & Simulator Toggles */}
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

      {/* Floating Alert Toast when a table order comes in */}
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
    </>
  );
};
