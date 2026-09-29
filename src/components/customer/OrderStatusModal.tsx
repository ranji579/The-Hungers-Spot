'use client';

import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Order, OrderStatus } from '@/types/restaurant';
import {
  X,
  CheckCircle,
  Clock,
  ChefHat,
  Sparkles,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';

interface OrderStatusModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({ orderId, onClose }) => {
  const { orders } = useRestaurant();

  if (!orderId) return null;

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      status: 'Received',
      label: 'Order Confirmed',
      desc: 'Sent to kitchen order display',
      icon: <CheckCircle size={18} />
    },
    {
      status: 'Preparing',
      label: 'Cooking in Kitchen',
      desc: 'Chef is crafting your dishes fresh',
      icon: <ChefHat size={18} />
    },
    {
      status: 'Served',
      label: 'Served to Table',
      desc: 'Delivered to your table',
      icon: <UtensilsCrossed size={18} />
    },
    {
      status: 'Completed',
      label: 'Completed',
      desc: 'Thank you for dining with us!',
      icon: <Sparkles size={18} />
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Received': return 0;
      case 'Preparing': return 1;
      case 'Served': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(order.status);

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxWidth: '440px' }}>
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Order Status</h3>
                <span className={`badge badge-status badge-status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {order.orderNumber} • <strong style={{ color: 'var(--color-secondary)' }}>Table #{order.tableNumber}</strong>
              </p>
            </div>
            <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <X size={18} />
            </button>
          </div>

          {/* Stepper Timeline */}
          <div style={{ margin: '24px 0', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isUpcoming = idx > currentIndex;

              return (
                <div
                  key={step.status}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    position: 'relative',
                    paddingBottom: idx !== steps.length - 1 ? '24px' : '0'
                  }}
                >
                  {/* Connecting line */}
                  {idx !== steps.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '18px',
                        top: '36px',
                        bottom: 0,
                        width: '2px',
                        background: isPast ? 'var(--color-accent)' : 'var(--glass-border)'
                      }}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? 'var(--color-primary)'
                        : isPast
                        ? 'var(--color-accent)'
                        : 'var(--bg-card)',
                      border: isUpcoming ? '1px solid var(--glass-border)' : 'none',
                      color: isUpcoming ? 'var(--text-muted)' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      zIndex: 2,
                      boxShadow: isCurrent ? '0 0 16px rgba(255, 94, 58, 0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: isUpcoming ? 'var(--text-muted)' : '#FFFFFF'
                      }}
                    >
                      {step.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ordered Items Summary */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--glass-border)',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Ordered Food ({order.items.length})
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 600 }}>
                ✓ {order.paymentMethod} (₹{order.total.toFixed(2)})
              </span>
            </div>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0' }}>
                <span>{it.quantity}x {it.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
