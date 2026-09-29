'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { PaymentMethod, Order } from '@/types/restaurant';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Smartphone,
  Building2,
  Utensils
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
  const { cart, cartSubtotal, cartTax, cartTotal, activeTableNumber, placeOrder } = useRestaurant();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI (Google Pay / PhonePe / Paytm)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // UPI sub-options: 'apps' | 'id' | 'qr'
  const [upiMode, setUpiMode] = useState<'apps' | 'id' | 'qr'>('apps');
  const [upiId, setUpiId] = useState('user@oksbi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Simulated card form state
  const [cardName, setCardName] = useState('Rajesh Sharma');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('782');

  if (!isOpen) return null;

  const handlePay = async () => {
    setIsProcessing(true);

    // Simulate realistic payment gateway processing latency
    setTimeout(async () => {
      try {
        const order = await placeOrder(selectedMethod);
        setIsProcessing(false);
        setCompletedOrder(order);

        // Burst celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error('Payment error', e);
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleDone = () => {
    if (completedOrder) {
      onOrderSuccess(completedOrder);
    }
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxWidth: '470px' }}>
        {/* If Order is already successfully paid */}
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
              Payment Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Your order is placed directly to the kitchen for <strong style={{ color: 'var(--color-secondary)' }}>Table {completedOrder.tableNumber}</strong>.
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Payment Mode</span>
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-secondary)' }}>{completedOrder.paymentMethod}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Transaction ID</span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{completedOrder.transactionId}</span>
              </div>

              {/* Items List */}
              <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ordered Items:
                </div>
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>{it.quantity}x {it.name}</span>
                    <span style={{ fontWeight: 600 }}>₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>Total Amount Paid</span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--color-accent)' }}>₹{completedOrder.total.toFixed(2)}</span>
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
          /* Payment Selection Screen */
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Complete Online Payment</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Dining at <span style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Table #{activeTableNumber}</span>
                </p>
              </div>
              <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            {/* Total Callout */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 94, 58, 0.12) 0%, rgba(255, 179, 0, 0.12) 100%)',
                border: '1px solid rgba(255, 94, 58, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total to Pay (inc. 5% GST)
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  ₹{cartTotal.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
                {cart.length} item{cart.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {/* UPI Tab */}
              <button
                type="button"
                onClick={() => setSelectedMethod('UPI (Google Pay / PhonePe / Paytm)')}
                style={{
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMethod === 'UPI (Google Pay / PhonePe / Paytm)' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  border: selectedMethod === 'UPI (Google Pay / PhonePe / Paytm)' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={18} color={selectedMethod.startsWith('UPI') ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: selectedMethod.startsWith('UPI') ? '#fff' : 'var(--text-muted)' }}>
                  UPI Apps
                </span>
              </button>

              {/* Credit/Debit Cards */}
              <button
                type="button"
                onClick={() => setSelectedMethod('Credit / Debit Card')}
                style={{
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMethod === 'Credit / Debit Card' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  border: selectedMethod === 'Credit / Debit Card' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CreditCard size={18} color={selectedMethod === 'Credit / Debit Card' ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: selectedMethod === 'Credit / Debit Card' ? '#fff' : 'var(--text-muted)' }}>
                  Cards / RuPay
                </span>
              </button>

              {/* Net Banking */}
              <button
                type="button"
                onClick={() => setSelectedMethod('Net Banking')}
                style={{
                  padding: '12px 6px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedMethod === 'Net Banking' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                  border: selectedMethod === 'Net Banking' ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={18} color={selectedMethod === 'Net Banking' ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: selectedMethod === 'Net Banking' ? '#fff' : 'var(--text-muted)' }}>
                  NetBanking
                </span>
              </button>
            </div>

            {/* Method Details: UPI */}
            {selectedMethod === 'UPI (Google Pay / PhonePe / Paytm)' && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { id: 'apps', label: '⚡ Popular Apps' },
                    { id: 'id', label: '✍️ UPI ID' },
                    { id: 'qr', label: '📱 Scan QR' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setUpiMode(m.id as 'apps' | 'id' | 'qr')}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: upiMode === m.id ? 'var(--color-primary-light)' : 'transparent',
                        color: upiMode === m.id ? 'var(--color-primary)' : 'var(--text-muted)',
                        border: upiMode === m.id ? '1px solid var(--color-primary)' : '1px solid transparent'
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {upiMode === 'apps' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div style={{ background: 'var(--bg-surface)', padding: '10px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#4285F4' }}>GPay</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Google Pay</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '10px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#5F259F' }}>PhonePe</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Instant UPI</div>
                    </div>
                    <div style={{ background: 'var(--bg-surface)', padding: '10px 8px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#00BAF2' }}>Paytm</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>UPI / Wallet</div>
                    </div>
                  </div>
                )}

                {upiMode === 'id' && (
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Enter VPA / UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. 9876543210@paytm"
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  </div>
                )}

                {upiMode === 'qr' && (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ background: '#fff', width: '120px', height: '120px', margin: '0 auto 10px auto', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={90} color="#000" />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scan with any Indian UPI App to Pay</div>
                  </div>
                )}
              </div>
            )}

            {/* Method Details: Card */}
            {selectedMethod === 'Credit / Debit Card' && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Card Number (RuPay, Visa, Mastercard)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ width: '100%', paddingRight: '40px' }}
                    />
                    <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', right: '12px', top: '11px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                      CVV (3 Digits)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Method Details: Net Banking */}
            {selectedMethod === 'Net Banking' && (
              <div
                style={{
                  background: 'var(--bg-card)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '20px'
                }}
              >
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Choose Your Bank
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: selectedBank === bank ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                        color: selectedBank === bank ? 'var(--color-primary)' : 'var(--text-secondary)',
                        border: selectedBank === bank ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                      }}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Pay Button */}
            <button
              onClick={handlePay}
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
                <span>Authorizing ₹{cartTotal.toFixed(2)}...</span>
              ) : (
                <>
                  <span>
                    Pay ₹{cartTotal.toFixed(2)} Online
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Lock size={12} />
              <span>RBI Regulated 256-Bit SSL Encrypted Indian Gateway</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
