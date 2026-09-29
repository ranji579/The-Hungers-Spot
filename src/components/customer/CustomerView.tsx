'use client';

import React, { useState, useMemo } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { MenuItem, Order, DietaryType } from '@/types/restaurant';
import { PaymentModal } from './PaymentModal';
import { OrderStatusModal } from './OrderStatusModal';
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Clock,
  Star,
  Sparkles,
  QrCode,
  UtensilsCrossed,
  X,
  CreditCard,
  CheckCircle,
  FileText,
  Edit3
} from 'lucide-react';
import Image from 'next/image';
import { AddDishModal } from '@/components/common/AddDishModal';

export const CustomerView: React.FC = () => {
  const {
    menuItems,
    tables,
    activeTableNumber,
    setActiveTableNumber,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTax,
    cartTotal,
    cartItemCount,
    orders,
    updateMenuItem
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingDishItem, setEditingDishItem] = useState<MenuItem | null>(null);

  // Active table details
  const currentTable = tables.find(t => t.tableNumber === activeTableNumber) || tables[0];

  // Check if current table has an active order
  const tableOrders = orders.filter(o => o.tableNumber === activeTableNumber);
  const latestOrder = tableOrders[0];

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach(i => set.add(i.category));
    return ['All', ...Array.from(set)];
  }, [menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      if (!item.isAvailable) return false;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesDiet = dietaryFilter === 'all' || item.dietary === dietaryFilter;
      return matchesSearch && matchesCategory && matchesDiet;
    });
  }, [menuItems, searchQuery, selectedCategory, dietaryFilter]);

  const getItemQuantityInCart = (itemId: string) => {
    const found = cart.find(c => c.item.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setIsPaymentOpen(false);
    setIsCartOpen(false);
    setActiveTrackingOrderId(newOrder.id);
  };

  const handleSaveDishEdit = (dishData: {
    name: string;
    category: string;
    description: string;
    price: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    image: string;
  }) => {
    if (editingDishItem) {
      updateMenuItem(editingDishItem.id, dishData);
      setEditingDishItem(null);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 20px 100px 20px' }}>
      {/* Table Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(255, 94, 58, 0.12) 0%, rgba(18, 21, 31, 0.95) 100%)',
          border: '1px solid rgba(255, 94, 58, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(255, 94, 58, 0.4)'
            }}
          >
            <QrCode size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
                Dining at Table #{activeTableNumber}
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: 'var(--color-accent)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700
                }}
              >
                QR Active
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {currentTable.label} • Instant mobile ordering &amp; online pay
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {latestOrder && (
            <button
              onClick={() => setActiveTrackingOrderId(latestOrder.id)}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 12px', borderColor: 'var(--color-accent)' }}
            >
              <FileText size={14} color="var(--color-accent)" />
              <span>Track Order ({latestOrder.status})</span>
            </button>
          )}

          <button
            onClick={() => setIsTableModalOpen(true)}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 12px' }}
          >
            Switch Table
          </button>
        </div>
      </div>

      {/* Search & Dietary Filters Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
            <input
              type="text"
              placeholder="Search biryani, chicken 65, gravies, naans, noodles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '42px',
                paddingRight: '14px',
                height: '44px',
                fontSize: '14px',
                borderRadius: 'var(--radius-md)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '12px', top: '13px', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Dietary Toggle buttons */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'veg', label: '🌱 Veg' },
              { id: 'non-veg', label: '🥩 Meat' },
              { id: 'vegan', label: '🥑 Vegan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDietaryFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: dietaryFilter === tab.id ? '#fff' : 'var(--text-secondary)',
                  background: dietaryFilter === tab.id ? 'var(--color-primary)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: selectedCategory === cat ? 'var(--color-primary)' : 'var(--bg-card)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                boxShadow: selectedCategory === cat ? '0 2px 10px rgba(255, 94, 58, 0.3)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <UtensilsCrossed size={42} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px' }}>No dishes found</h3>
          <p style={{ fontSize: '14px' }}>Try searching for a different keyword or resetting dietary filters.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: '16px'
          }}
        >
          {filteredItems.map(item => {
            const qty = getItemQuantityInCart(item.id);

            return (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  border: qty > 0 ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                }}
              >
                {/* Image & Badges */}
                <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(18,21,31,0.95) 100%)'
                    }}
                  />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    <span className={`badge badge-${item.dietary}`}>
                      {item.dietary === 'veg' ? '🌱 Veg' : item.dietary === 'vegan' ? '🥑 Vegan' : '🥩 Non-Veg'}
                    </span>
                    {item.isPopular && (
                      <span className="badge badge-popular">
                        ★ Popular
                      </span>
                    )}
                  </div>

                  {/* Quick Edit Dish Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDishItem(item);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: '#fff',
                      borderRadius: '8px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      transition: 'all 0.15s ease'
                    }}
                    title="Edit Dish (Name, Image & Price)"
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Prep Time & Rating Bottom Badges */}
                  <div style={{ position: 'absolute', bottom: '8px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#FFD700', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '6px' }}>
                      <Star size={13} fill="#FFD700" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#E2E8F0', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '6px' }}>
                      <Clock size={12} />
                      <span>{item.preparationTimeMinutes}m</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
                    {item.name}
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.45,
                      marginBottom: '16px',
                      flex: 1
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Price & Add to Cart button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>
                      ₹{item.price.toFixed(2)}
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '13px', borderRadius: 'var(--radius-md)' }}
                      >
                        <Plus size={15} />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'var(--bg-card)',
                          padding: '4px 6px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-primary)'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {qty === 1 ? <Trash2 size={13} color="var(--color-danger)" /> : <Minus size={13} />}
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            background: 'var(--color-primary)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Cart Bar (Appears when items are in cart) */}
      {cartItemCount > 0 && !isCartOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '560px',
            zIndex: 90
          }}
        >
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #FF5E3A 0%, #FF3D12 100%)',
              color: '#fff',
              padding: '16px 20px',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 12px 30px rgba(255, 94, 58, 0.45)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '13px'
                }}
              >
                {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
              </div>
              <span style={{ fontSize: '15px', fontWeight: 600 }}>Table #{activeTableNumber} Order</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '18px' }}>₹{cartTotal.toFixed(2)}</span>
              <span style={{ fontSize: '13px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                View Cart →
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-Up Cart Drawer */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ maxWidth: '480px' }}>
            <div style={{ padding: '24px' }}>
              {/* Cart Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--color-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <ShoppingBag size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Table #{activeTableNumber} Order</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cartItemCount} item{cartItemCount > 1 ? 's' : ''} selected</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Cart Items List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
                {cart.map(({ item, quantity, notes }) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--glass-border)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{item.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 700 }}>
                        ₹{(item.price * quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--bg-card)',
                        padding: '3px 6px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        style={{ width: '26px', height: '26px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {quantity === 1 ? <Trash2 size={12} color="var(--color-danger)" /> : <Minus size={12} />}
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        style={{ width: '26px', height: '26px', borderRadius: '4px', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Breakdown */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  <span>Item Subtotal</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  <span>GST (5% CGST + SGST)</span>
                  <span>₹{cartTax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, borderTop: '1px dashed var(--glass-border)', paddingTop: '10px' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--color-accent)' }}>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Proceed to Pay */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsPaymentOpen(true);
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '16px' }}
              >
                <CreditCard size={18} />
                <span>Proceed to Pay Online (₹{cartTotal.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Table Modal */}
      {isTableModalOpen && (
        <div className="modal-overlay">
          <div className="modal-sheet" style={{ maxWidth: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Select Dining Table</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Simulate scanning a specific QR code for one of the 4 restaurant tables:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {tables.map(tbl => (
                <button
                  key={tbl.tableNumber}
                  onClick={() => {
                    setActiveTableNumber(tbl.tableNumber);
                    setIsTableModalOpen(false);
                  }}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--radius-lg)',
                    background: tbl.tableNumber === activeTableNumber ? 'rgba(255, 94, 58, 0.15)' : 'var(--bg-card)',
                    border: tbl.tableNumber === activeTableNumber ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '20px', fontWeight: 800, color: tbl.tableNumber === activeTableNumber ? 'var(--color-primary)' : '#fff' }}>
                    Table {tbl.tableNumber}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {tbl.seats} Seats • {tbl.label.split('(')[1]?.replace(')', '') || 'Dining'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Status Modal */}
      <OrderStatusModal
        orderId={activeTrackingOrderId}
        onClose={() => setActiveTrackingOrderId(null)}
      />

      {/* Edit Dish Modal (Change Name, Image, Price & Details) */}
      <AddDishModal
        isOpen={editingDishItem !== null}
        onClose={() => setEditingDishItem(null)}
        initialItem={editingDishItem}
        title={editingDishItem ? `Edit Dish: ${editingDishItem.name}` : 'Edit Dish'}
        submitLabel="Save Changes"
        onSubmit={handleSaveDishEdit}
      />
    </div>
  );
};
