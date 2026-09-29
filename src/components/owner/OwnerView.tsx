'use client';

import React, { useState, useMemo } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Order, OrderStatus, MenuItem } from '@/types/restaurant';
import {
  ChefHat,
  TrendingUp,
  DollarSign,
  UtensilsCrossed,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  Search,
  Users,
  Eye,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { AddDishModal } from '@/components/common/AddDishModal';

export const OwnerView: React.FC = () => {
  const {
    tables,
    orders,
    menuItems,
    updateOrderStatus,
    updateItemPrice,
    addMenuItem,
    removeMenuItem,
    toggleItemAvailability,
    yearlyRevenue,
    getTableRevenue,
    getTableOrders
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'orders' | 'tables' | 'menu' | 'yearly'>('orders');
  const [selectedTableForDetails, setSelectedTableForDetails] = useState<number | null>(null);

  // Price editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  // Add Item Modal state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Search filter for menu items
  const [menuSearch, setMenuSearch] = useState('');

  // Year filter for yearly analytics
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Group active orders
  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Completed');
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter(o => o.status === 'Completed');
  }, [orders]);

  // Overall today's metrics
  const todayRevenue = useMemo(() => {
    return Number(orders.reduce((sum, o) => sum + o.total, 0).toFixed(2));
  }, [orders]);

  const handleStartEditPrice = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditingPrice(item.price.toString());
  };

  const handleSavePrice = (itemId: string) => {
    const val = parseFloat(editingPrice);
    if (!isNaN(val) && val > 0) {
      updateItemPrice(itemId, val);
    }
    setEditingItemId(null);
  };

  const handleCreateItem = (dishData: {
    name: string;
    category: string;
    description: string;
    price: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    image: string;
  }) => {
    addMenuItem({
      ...dishData,
      rating: 4.8,
      isAvailable: true,
      preparationTimeMinutes: 15
    });
  };

  const selectedYearData = yearlyRevenue.find(y => y.year === selectedYear) || yearlyRevenue[yearlyRevenue.length - 1];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
      {/* Top Banner / Owner Stats */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(255, 179, 0, 0.1) 0%, rgba(18, 21, 31, 0.95) 100%)',
          border: '1px solid rgba(255, 179, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFB300 0%, #FF5E3A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 4px 16px rgba(255, 179, 0, 0.35)'
            }}
          >
            <ChefHat size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Restaurant Owner Dashboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Kitchen display, 4-table revenue tracking, and dynamic item pricing
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Table Orders</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {activeOrders.length}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Today&apos;s Revenue</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-accent)' }}>
              ₹{todayRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '12px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--bg-card)',
            color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)',
            border: activeTab === 'orders' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
          }}
        >
          <UtensilsCrossed size={16} />
          <span>Live Kitchen Orders ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'tables' ? 'var(--color-primary)' : 'var(--bg-card)',
            color: activeTab === 'tables' ? '#fff' : 'var(--text-secondary)',
            border: activeTab === 'tables' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
          }}
        >
          <Users size={16} />
          <span>Particular Table Revenue</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'menu' ? 'var(--color-primary)' : 'var(--bg-card)',
            color: activeTab === 'menu' ? '#fff' : 'var(--text-secondary)',
            border: activeTab === 'menu' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
          }}
        >
          <DollarSign size={16} />
          <span>Items &amp; Price Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('yearly')}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'yearly' ? 'var(--color-primary)' : 'var(--bg-card)',
            color: activeTab === 'yearly' ? '#fff' : 'var(--text-secondary)',
            border: activeTab === 'yearly' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
          }}
        >
          <TrendingUp size={16} />
          <span>Yearly Revenue Analytics</span>
        </button>
      </div>

      {/* TAB 1: LIVE KITCHEN ORDERS */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Table-Specific Order Queue</h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Updates instantly as customers order from tables
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <CheckCircle size={44} color="var(--color-accent)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '4px' }}>All Kitchen Orders Cleared!</h3>
              <p style={{ fontSize: '14px' }}>Waiting for diners at Tables 1-4 to place new food orders.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {activeOrders.map(order => {
                const table = tables.find(t => t.tableNumber === order.tableNumber);

                return (
                  <div
                    key={order.id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: `4px solid ${
                        order.status === 'Received' ? 'var(--color-primary)' : 'var(--color-warning)'
                      }`
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              background: 'var(--color-primary)',
                              color: '#fff',
                              fontSize: '13px',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: '6px'
                            }}
                          >
                            TABLE #{order.tableNumber}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            {order.orderNumber}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {table?.label || `Table ${order.tableNumber}`} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <span className={`badge badge-status badge-status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Items Ordered List */}
                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        marginBottom: '16px',
                        flex: 1
                      }}
                    >
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
                        Ordered Items ({order.items.length}):
                      </div>
                      {order.items.map((it, idx) => (
                        <div key={idx} style={{ marginBottom: '8px', paddingBottom: idx !== order.items.length - 1 ? '6px' : '0', borderBottom: idx !== order.items.length - 1 ? '1px dashed var(--glass-border)' : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
                            <span>
                              <strong style={{ color: 'var(--color-primary)' }}>{it.quantity}x</strong> {it.name}
                            </span>
                            <span>₹{(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                          {it.notes && (
                            <div style={{ fontSize: '12px', color: 'var(--color-warning)', fontStyle: 'italic', marginTop: '2px' }}>
                              Note: {it.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Paid via <strong style={{ color: '#fff' }}>{order.paymentMethod}</strong>
                      </span>
                      <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-accent)' }}>
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>

                    {/* Status Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {order.status === 'Received' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          className="btn-primary"
                          style={{ gridColumn: 'span 2', padding: '10px', fontSize: '13px' }}
                        >
                          <ChefHat size={16} />
                          <span>Start Cooking in Kitchen</span>
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Served')}
                            className="btn-primary"
                            style={{ padding: '10px', fontSize: '13px', background: 'var(--color-accent)' }}
                          >
                            <CheckCircle size={16} />
                            <span>Mark as Served</span>
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                            className="btn-secondary"
                            style={{ padding: '10px', fontSize: '13px' }}
                          >
                            Complete
                          </button>
                        </>
                      )}

                      {order.status === 'Served' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                          className="btn-primary"
                          style={{ gridColumn: 'span 2', padding: '10px', fontSize: '13px', background: '#3B82F6' }}
                        >
                          <Sparkles size={16} />
                          <span>Complete Table Session (Free Table)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PARTICULAR TABLE REVENUE */}
      {activeTab === 'tables' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Table-Wise Financial Revenue</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Granular revenue performance breakdown for Tables 1 to 4
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {tables.map(tbl => {
              const tableOrdersList = getTableOrders(tbl.tableNumber);
              const totalRev = getTableRevenue(tbl.tableNumber);
              const avgSpend = tableOrdersList.length > 0 ? totalRev / tableOrdersList.length : 0;

              return (
                <div
                  key={tbl.tableNumber}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: `4px solid ${
                      tbl.status === 'Occupied' ? 'var(--color-primary)' : 'var(--color-accent)'
                    }`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Table #{tbl.tableNumber}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tbl.label}</div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                        background: tbl.status === 'Occupied' ? 'rgba(255, 94, 58, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: tbl.status === 'Occupied' ? 'var(--color-primary)' : 'var(--color-accent)'
                      }}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Table Total Revenue
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-accent)', marginTop: '2px' }}>
                      ₹{totalRev.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '10px', marginBottom: '12px' }}>
                    <div>Orders: <strong style={{ color: '#fff' }}>{tableOrdersList.length}</strong></div>
                    <div>Avg: <strong style={{ color: '#fff' }}>₹{avgSpend.toFixed(2)}</strong></div>
                  </div>

                  <button
                    onClick={() => setSelectedTableForDetails(tbl.tableNumber)}
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '12px', padding: '8px' }}
                  >
                    <Eye size={13} />
                    <span>View Table Orders History</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Table Orders History Modal */}
          {selectedTableForDetails !== null && (
            <div className="modal-overlay">
              <div className="modal-sheet" style={{ maxWidth: '520px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Table #{selectedTableForDetails} History</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      All recorded customer orders from this table
                    </p>
                  </div>
                  <button onClick={() => setSelectedTableForDetails(null)} className="btn-icon" style={{ width: '32px', height: '32px' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {getTableOrders(selectedTableForDetails).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No orders placed for this table yet.
                    </div>
                  ) : (
                    getTableOrders(selectedTableForDetails).map(ord => (
                      <div
                        key={ord.id}
                        style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          marginBottom: '10px',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>{ord.orderNumber}</span>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-accent)' }}>₹{ord.total.toFixed(2)}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>Method: {ord.paymentMethod}</span>
                          <span>Status: {ord.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MENU ITEMS & SET PRICE CONTROLS */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Menu Pricing &amp; Item Control</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Set prices dynamically or add/remove dishes
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter dishes..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  style={{ paddingLeft: '32px', height: '36px', fontSize: '13px' }}
                />
              </div>

              <button
                onClick={() => setIsAddItemOpen(true)}
                className="btn-primary"
                style={{ padding: '8px 14px', fontSize: '13px' }}
              >
                <Plus size={16} />
                <span>Add New Item</span>
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Dish</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Category</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Diet</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Selling Price (₹)</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>In Stock</th>
                    <th style={{ padding: '12px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems
                    .filter(m => m.name.toLowerCase().includes(menuSearch.toLowerCase()) || m.category.toLowerCase().includes(menuSearch.toLowerCase()))
                    .map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff' }}>{item.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{item.category}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge badge-${item.dietary}`}>
                            {item.dietary}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {editingItemId === item.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 700 }}>₹</span>
                              <input
                                type="number"
                                step="1"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                style={{ width: '80px', padding: '4px 8px', fontSize: '13px' }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                style={{ padding: '6px', background: 'var(--color-accent)', borderRadius: '6px', color: '#fff' }}
                                title="Save price"
                              >
                                <Save size={14} />
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                style={{ padding: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-primary)' }}>
                                ₹{item.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleStartEditPrice(item)}
                                className="btn-icon"
                                style={{ width: '28px', height: '28px' }}
                                title="Set new price"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: item.isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: item.isAvailable ? 'var(--color-accent)' : 'var(--color-danger)',
                              border: item.isAvailable ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                              fontWeight: 600
                            }}
                          >
                            {item.isAvailable ? 'Available' : 'Sold Out'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => removeMenuItem(item.id)}
                            className="btn-icon"
                            style={{ width: '30px', height: '30px', color: 'var(--color-danger)' }}
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: YEARLY REVENUE ANALYTICS */}
      {activeTab === 'yearly' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Annual Revenue &amp; Growth</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Historical comparisons and monthly performance
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[2024, 2025, 2026].map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: selectedYear === yr ? 'var(--color-primary)' : 'var(--bg-card)',
                    color: selectedYear === yr ? '#fff' : 'var(--text-secondary)',
                    border: selectedYear === yr ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                  }}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Metric cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {selectedYear} Total Revenue
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
                ₹{selectedYearData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Diners Served
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedYearData.totalOrders.toLocaleString()} orders
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Average Order Value
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
                ₹{selectedYearData.averageOrderValue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Monthly Revenue Bars Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '20px' }}>
              {selectedYear} Monthly Revenue Breakdown
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '8px', alignItems: 'flex-end', height: '200px' }}>
              {selectedYearData.monthlyBreakdown.map((m, i) => {
                const maxRev = Math.max(...selectedYearData.monthlyBreakdown.map(x => x.revenue));
                const heightPercent = (m.revenue / maxRev) * 100;

                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      ₹{(m.revenue / 100000).toFixed(1)}L
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, #FF5E3A 0%, #FFB300 100%)',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: '0 2px 8px rgba(255, 94, 58, 0.25)',
                        transition: 'height 0.4s ease'
                      }}
                      title={`${m.month}: ₹${m.revenue.toLocaleString()} (${m.orders} orders)`}
                    />
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: 600 }}>
                      {m.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal with local image & URL upload options */}
      <AddDishModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        title="Owner: Add New Menu Item"
        submitLabel="Add to Live Menu"
        onSubmit={handleCreateItem}
      />
    </div>
  );
};
