'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Order } from '@/types/restaurant';
import {
  X,
  CheckCircle2,
  ArrowRight,
  Utensils,
  ShoppingBag,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, cartItemCount, activeTableNumber, placeOrder } = useRestaurant();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const handleConfirmOrder = async () => {
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const order = await placeOrder('Table Dine-In Order');
        setIsProcessing(false);
        setCompletedOrder(order);

        // Burst celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error('Order dispatch error', e);
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleDone = () => {
    if (completedOrder) {
      onOrderSuccess(completedOrder);
    }
    setCompletedOrder(null);
    onClose();
  };

  const completedItemsCount = completedOrder
    ? completedOrder.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxWidth: '470px' }}>
        {/* If Order is already successfully placed */}
        {completedOrder ? (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <CheckCircle2 size={38} color="var(--color-accent)" />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
              Order Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Your order has been sent to the kitchen for <strong style={{ color: 'var(--color-secondary)' }}>Table {completedOrder.tableNumber}</strong>.
            </p>

            {/* Receipt Summary Card */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                textAlign: 'left',
                border: '1px solid var(--glass-border)',
                marginBottom: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Order Reference</span>
                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>{completedOrder.orderNumber}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Table Assigned</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Table #{completedOrder.tableNumber}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Items Selected</span>
                <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-accent)' }}>{completedItemsCount} items</span>
              </div>

              {/* Items List */}
              <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Selected Items:
                </div>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{it.name}</span>
                    <span style={{
                      fontWeight: 700,
                      background: 'rgba(255, 94, 58, 0.15)',
                      color: 'var(--color-primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px'
                    }}>
                      {it.quantity} qty
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDone}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              <Utensils size={18} />
              <span>Track Live Order Status</span>
            </button>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Confirm Table Order</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dining at <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Table #{activeTableNumber}</span>
                </p>
              </div>
              <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Total Items Callout */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 94, 58, 0.12) 0%, rgba(255, 179, 0, 0.12) 100%)',
                border: '1px solid rgba(255, 94, 58, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Selected Items
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '13px', color: 'var(--text-muted)' }}>
                {cart.length} dish {cart.length > 1 ? 'types' : 'type'}
              </div>
            </div>

            {/* Selected Items Review */}
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
              Review Selected Items
            </label>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                padding: '14px',
                maxHeight: '220px',
                overflowY: 'auto',
                marginBottom: '20px'
              }}
            >
              {cart.map(({ item, quantity, notes }) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>{item.name}</div>
                      {notes && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Note: {notes}</div>
                      )}
                    </div>
                  </div>

                  <span
                    style={{
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 800,
                      fontSize: '13px'
                    }}
                  >
                    {quantity} qty
                  </span>
                </div>
              ))}
            </div>

            {/* Action Send to Kitchen Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                opacity: isProcessing ? 0.7 : 1
              }}
            >
              {isProcessing ? (
                <span>Sending Order to Kitchen...</span>
              ) : (
                <>
                  <span>
                    Send Order to Kitchen ({cartItemCount} items)
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span>Direct Kitchen Notification for Table #{activeTableNumber}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
