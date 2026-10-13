'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  QrCode,
  UtensilsCrossed,
  TrendingUp,
  Download,
  Printer,
  ExternalLink,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  X,
  Eye,
  RotateCcw,
  Receipt,
  Users,
  ClipboardList,
  Clock
} from 'lucide-react';
import { AddDishModal } from '@/components/common/AddDishModal';

import { MenuItem, OrderStatus } from '@/types/restaurant';

export const AdminView: React.FC = () => {
  const {
    tables,
    menuItems,
    orders,
    createDirectOrder,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    toggleItemAvailability,
    yearlyRevenue,
    getTableTotalItems,
    getTableOrders,
    resetAllTablesRevenue,
    resetTableRevenue,
    setActiveTableNumber,
    setActiveView
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'tables' | 'orders' | 'qr' | 'menu' | 'revenue'>('tables');
  const [orderTableFilter, setOrderTableFilter] = useState<'all' | number>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedPrintTable, setSelectedPrintTable] = useState<number | null>(null);
  const [selectedTableForDetails, setSelectedTableForDetails] = useState<number | null>(null);

  // QR Code canvas elements
  const qrCanvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  // Add / Edit Item Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingDishItem, setEditingDishItem] = useState<MenuItem | null>(null);

  // Selected Year for Analytics
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Render QR Codes on canvases
  useEffect(() => {
    if (typeof window === 'undefined') return;

    tables.forEach(table => {
      const canvas = qrCanvasRefs.current[table.tableNumber];
      if (canvas) {
        // Construct target URL for table ordering
        const origin = window.location.origin;
        const targetUrl = `${origin}/?table=${table.tableNumber}`;

        QRCode.toCanvas(canvas, targetUrl, {
          width: 180,
          margin: 2,
          color: {
            dark: '#11141E',
            light: '#FFFFFF'
          }
        }, (err) => {
          if (err) console.error('QR generation error', err);
        });
      }
    });
  }, [tables, activeTab]);

  const downloadQrCode = (tableNum: number) => {
    const canvas = qrCanvasRefs.current[tableNum];
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `TheHungersSpot-Table-${tableNum}-QRCode.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrintCard = (tableNum: number) => {
    setSelectedPrintTable(tableNum);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleTestTable = (tableNum: number, newTab: boolean = false) => {
    setActiveTableNumber(tableNum);
    setActiveView('customer');
    if (typeof window !== 'undefined') {
      if (newTab) {
        window.open(`/customer?table=${tableNum}`, '_blank');
      } else {
        window.location.href = `/customer?table=${tableNum}`;
      }
    }
  };

  const handleQuickTestOrder = (tableNum: number) => {
    createDirectOrder(tableNum);
  };

  const filteredAdminOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderTableFilter !== 'all' && o.tableNumber !== orderTableFilter) return false;
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      return true;
    });
  }, [orders, orderTableFilter, orderStatusFilter]);

  const handleCreateItem = (dishData: {
    name: string;
    category: string;
    description: string;
    price?: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    image: string;
  }) => {
    addMenuItem({
      ...dishData,
      price: 0,
      rating: 4.8,
      isAvailable: true,
      preparationTimeMinutes: 15
    });
  };

  const handleSaveDishEdit = (dishData: {
    name: string;
    category: string;
    description: string;
    price?: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    image: string;
  }) => {
    if (editingDishItem) {
      updateMenuItem(editingDishItem.id, { ...dishData, price: 0 });
      setEditingDishItem(null);
    }
  };

  const selectedYearData = yearlyRevenue.find(y => y.year === selectedYear) || yearlyRevenue[yearlyRevenue.length - 1];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
      {/* Admin Top Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(18, 21, 31, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
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
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.35)'
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Restaurant Admin Dashboard</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Table QR Code Studio (4 Tables), Master Menu Catalog, and Item Volume Reports
            </p>
          </div>
        </div>

        {/* Quick Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('tables')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'tables' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'tables' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'tables' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
            }}
          >
            <Layers size={15} />
            <span>Particular Table Items</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'orders' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
            }}
          >
            <ClipboardList size={15} />
            <span>Orders List ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'qr' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'qr' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'qr' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
            }}
          >
            <QrCode size={15} />
            <span>4 Tables QR Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'menu' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'menu' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'menu' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
            }}
          >
            <UtensilsCrossed size={15} />
            <span>Master Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('revenue')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeTab === 'revenue' ? 'var(--color-primary)' : 'var(--bg-card)',
              color: activeTab === 'revenue' ? '#fff' : 'var(--text-secondary)',
              border: activeTab === 'revenue' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
            }}
          >
            <TrendingUp size={15} />
            <span>Yearly Reports</span>
          </button>
        </div>
      </div>

      {/* TAB: PARTICULAR TABLE ITEMS & ORDERS */}
      {activeTab === 'tables' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Table-Wise Items &amp; Orders (Tables 1 - 4)</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Live breakdown of selected items and order count for each dining table.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all tables orders and items count to 0?')) {
                    resetAllTablesRevenue();
                  }
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '8px 14px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                title="Reset all tables orders to 0"
              >
                <RotateCcw size={14} />
                <span>Reset All Tables Orders</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {tables.map(tbl => {
              const tableOrdersList = getTableOrders(tbl.tableNumber);
              const totalItems = getTableTotalItems(tbl.tableNumber);
              const totalDishVarieties = tableOrdersList.reduce((acc, o) => acc + o.items.length, 0);

              return (
                <div
                  key={tbl.tableNumber}
                  className="glass-panel"
                  style={{
                    padding: '22px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: `4px solid ${
                      tbl.status === 'Occupied' ? 'var(--color-primary)' : 'var(--color-accent)'
                    }`,
                    background: 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '19px', fontWeight: 800 }}>Table #{tbl.tableNumber}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tbl.label} ({tbl.seats} Seats)</div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 700,
                        background: tbl.status === 'Occupied' ? 'rgba(255, 94, 58, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: tbl.status === 'Occupied' ? 'var(--color-primary)' : 'var(--color-accent)'
                      }}
                    >
                      {tbl.status}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Items Ordered
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-accent)', marginTop: '4px' }}>
                      {totalItems} items
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div>Orders: <strong style={{ color: '#fff' }}>{tableOrdersList.length}</strong></div>
                    <div>Dish Varieties: <strong style={{ color: '#fff' }}>{totalDishVarieties}</strong></div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedTableForDetails(tbl.tableNumber)}
                      className="btn-secondary"
                      style={{ width: '100%', fontSize: '12px', padding: '9px', justifyContent: 'center' }}
                      title="View orders list for Table #{tbl.tableNumber}"
                    >
                      <Eye size={14} />
                      <span>View Orders List ({tableOrdersList.length})</span>
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => handleTestTable(tbl.tableNumber, true)}
                        className="btn-primary"
                        style={{ fontSize: '11px', padding: '8px 6px', justifyContent: 'center' }}
                        title="Open customer menu for Table #{tbl.tableNumber} in a new tab"
                      >
                        <ExternalLink size={13} />
                        <span>Order Test</span>
                      </button>
                      <button
                        onClick={() => handleQuickTestOrder(tbl.tableNumber)}
                        style={{
                          fontSize: '11px',
                          padding: '8px 6px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          color: 'var(--color-accent)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        title="Instantly add a sample order to Table #{tbl.tableNumber}"
                      >
                        <Plus size={13} />
                        <span>+ Sample Order</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Reset Table ${tbl.tableNumber} orders and items to 0?`)) {
                          resetTableRevenue(tbl.tableNumber);
                        }
                      }}
                      style={{
                        width: '100%',
                        fontSize: '11px',
                        padding: '7px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: 'var(--color-danger)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      title="Reset Table #{tbl.tableNumber} orders"
                    >
                      <RotateCcw size={12} />
                      <span>Reset Table Orders</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: DEDICATED ORDERS LIST */}
      {activeTab === 'orders' && (
        <div>
          {/* Header & Quick Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Restaurant Orders List</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Live order queue, ordered items breakdown, and order status management across all 4 dining tables.
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleQuickTestOrder(orderTableFilter === 'all' ? 1 : orderTableFilter)}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                title="Add a sample order to selected table"
              >
                <Plus size={13} />
                <span>+ Sample Order (Table {orderTableFilter === 'all' ? 1 : orderTableFilter})</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all tables orders to 0?')) {
                    resetAllTablesRevenue();
                  }
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                title="Clear all orders across all tables"
              >
                <RotateCcw size={13} />
                <span>Clear All Orders</span>
              </button>
            </div>
          </div>

          {/* Table Filters & Status Filters */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {/* Table Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setOrderTableFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: orderTableFilter === 'all' ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: orderTableFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                  border: orderTableFilter === 'all' ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                }}
              >
                All Tables ({orders.length})
              </button>
              {[1, 2, 3, 4].map(tNum => {
                const count = getTableOrders(tNum).length;
                return (
                  <button
                    key={tNum}
                    onClick={() => setOrderTableFilter(tNum)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: orderTableFilter === tNum ? 'var(--color-primary)' : 'var(--bg-card)',
                      color: orderTableFilter === tNum ? '#fff' : 'var(--text-secondary)',
                      border: orderTableFilter === tNum ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)'
                    }}
                  >
                    Table #{tNum} ({count})
                  </button>
                );
              })}
            </div>

            {/* Status Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['all', 'Received', 'Preparing', 'Served', 'Completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: orderStatusFilter === st ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: orderStatusFilter === st ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards Grid */}
          {filteredAdminOrders.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                borderRadius: '16px'
              }}
            >
              <Receipt size={44} color="var(--color-accent)" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                No Orders in This View
              </h3>
              <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                {orders.length === 0
                  ? 'No orders have been placed yet. Click below to add a sample order or open the customer menu to place an order.'
                  : 'No orders match your selected table and status filter.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleQuickTestOrder(orderTableFilter === 'all' ? 1 : orderTableFilter)}
                  className="btn-primary"
                  style={{ fontSize: '13px', padding: '8px 18px' }}
                >
                  <Plus size={15} />
                  <span>Add Sample Order to Table {orderTableFilter === 'all' ? 1 : orderTableFilter}</span>
                </button>
                <button
                  onClick={() => handleTestTable(orderTableFilter === 'all' ? 1 : orderTableFilter, true)}
                  className="btn-secondary"
                  style={{ fontSize: '13px', padding: '8px 18px' }}
                >
                  <ExternalLink size={15} />
                  <span>Open Customer Menu</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {filteredAdminOrders.map(order => {
                const totalItemsCount = order.items.reduce((s, it) => s + (it.quantity || 0), 0);
                return (
                  <div
                    key={order.id}
                    className="glass-panel"
                    style={{
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '16px',
                      borderLeft: `4px solid ${
                        order.status === 'Received' ? 'var(--color-primary)' :
                        order.status === 'Preparing' ? 'var(--color-warning)' :
                        order.status === 'Served' ? 'var(--color-accent)' : '#10B981'
                      }`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              background: 'var(--color-primary)',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            TABLE #{order.tableNumber}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                            {order.orderNumber}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.paymentMethod || 'Dine-In'}
                        </div>
                      </div>

                      <span className={`badge badge-status badge-status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div
                      style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px',
                        marginBottom: '14px',
                        flex: 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 700 }}>
                        <span>Ordered Items ({order.items.length})</span>
                        <span style={{ color: 'var(--color-accent)' }}>{totalItemsCount} items</span>
                      </div>
                      {order.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: idx !== order.items.length - 1 ? '1px dashed var(--glass-border)' : 'none', fontSize: '13px' }}>
                          <span>
                            <strong style={{ color: 'var(--color-primary)' }}>{it.quantity}x</strong> {it.name}
                          </span>
                          <span style={{ fontSize: '11px', background: 'rgba(255, 94, 58, 0.12)', color: 'var(--color-primary)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {it.quantity} qty
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status Action Buttons */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {order.status === 'Received' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          className="btn-primary"
                          style={{ flex: 1, fontSize: '11px', padding: '6px', justifyContent: 'center' }}
                        >
                          Mark Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Served')}
                          style={{
                            flex: 1,
                            fontSize: '11px',
                            padding: '6px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-accent)',
                            color: '#000',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Served
                        </button>
                      )}
                      {order.status === 'Served' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Completed')}
                          style={{
                            flex: 1,
                            fontSize: '11px',
                            padding: '6px',
                            borderRadius: 'var(--radius-md)',
                            background: '#10B981',
                            color: '#fff',
                            fontWeight: 800,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Completed
                        </button>
                      )}
                      {order.status === 'Completed' && (
                        <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: 4 TABLES QR CODE STUDIO */}
      {activeTab === 'qr' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Table QR Code Studio (Tables 1 - 4)</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Each table has a dedicated QR code. Diners scan it with their phone to instantly order food.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {tables.map(table => (
              <div
                key={table.tableNumber}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-card)'
                }}
              >
                {/* Header */}
                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      background: 'rgba(255, 94, 58, 0.15)',
                      color: 'var(--color-primary)',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    TABLE CARD
                  </span>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginTop: '6px' }}>
                    Table #{table.tableNumber}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {table.label} ({table.seats} Seats)
                  </div>
                </div>

                {/* Table Live Items Badge */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Items:</span>
                  <strong style={{ color: 'var(--color-accent)', fontSize: '14px' }}>
                    {getTableTotalItems(table.tableNumber)} items
                  </strong>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ color: 'var(--text-muted)' }}>{getTableOrders(table.tableNumber).length} orders</span>
                </div>

                {/* QR Code Canvas */}
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <canvas
                    ref={(el) => {
                      qrCanvasRefs.current[table.tableNumber] = el;
                    }}
                    width={180}
                    height={180}
                  />
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px', wordBreak: 'break-all' }}>
                  Links to: <span style={{ color: 'var(--color-secondary)' }}>?table={table.tableNumber}</span>
                </div>

                {/* Action Buttons */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => handleTestTable(table.tableNumber)}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                  >
                    <ExternalLink size={14} />
                    <span>Test Table View</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => downloadQrCode(table.tableNumber)}
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '12px' }}
                      title="Download PNG QR image"
                    >
                      <Download size={13} />
                      <span>PNG</span>
                    </button>
                    <button
                      onClick={() => handlePrintCard(table.tableNumber)}
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '12px' }}
                      title="Print Table Tent Card"
                    >
                      <Printer size={13} />
                      <span>Print Standee</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Standee Printable Template Preview */}
          {selectedPrintTable !== null && (
            <div className="printable-qr-card" style={{ display: 'none' }}>
              <div style={{ textAlign: 'center', border: '3px solid #000', padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>The Hunger&apos;s Spot</h1>
                <p style={{ fontSize: '16px', color: '#555', margin: '0 0 24px 0' }}>Smart Table Ordering System</p>
                <div style={{ fontSize: '48px', fontWeight: 900, margin: '16px 0', borderTop: '2px solid #ccc', borderBottom: '2px solid #ccc', padding: '12px 0' }}>
                  TABLE #{selectedPrintTable}
                </div>
                <p style={{ fontSize: '14px', margin: '20px 0 10px 0' }}>Scan with your Phone Camera to Browse Menu &amp; Order</p>
                <div style={{ fontSize: '12px', color: '#777' }}>Enjoy your fresh dining experience!</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASTER MENU CATALOG */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Master Food &amp; Beverage Catalog</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Add or remove dishes from the active restaurant inventory
              </p>
            </div>

            <button
              onClick={() => setIsAddItemOpen(true)}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '14px' }}
            >
              <Plus size={16} />
              <span>Add New Dish</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {menuItems.map(item => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge badge-${item.dietary}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                      {item.dietary}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.category}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Prep Time: {item.preparationTimeMinutes || 15}m
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    style={{
                      fontSize: '10px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: item.isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: item.isAvailable ? 'var(--color-accent)' : 'var(--color-danger)',
                      border: 'none',
                      fontWeight: 700
                    }}
                  >
                    {item.isAvailable ? 'Active' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => setEditingDishItem(item)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--color-primary)' }}
                    title="Edit dish name, image, and details"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: YEARLY ITEM & ORDER VOLUME REPORTS */}
      {activeTab === 'revenue' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Item &amp; Order Volume Reports</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Audited yearly ordering volume, item counts, and table activity
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
                Annual Items Served
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
                {(selectedYearData.totalOrders * 3).toLocaleString()} items
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Orders Dispatched
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedYearData.totalOrders.toLocaleString()}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Average Items Per Order
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
                3.2 items
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tables Operational
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>
                4 Tables (QR Ready)
              </div>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                {selectedYear} Monthly Order Breakdown
              </h3>
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,Month,Orders,EstimatedItems\n" +
                    selectedYearData.monthlyBreakdown.map(e => `${e.month},${e.orders},${e.orders * 3}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `TheHungersSpot-Orders-${selectedYear}.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <FileSpreadsheet size={14} />
                <span>Export CSV</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Month</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Estimated Items</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Orders Completed</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Avg Items / Order</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedYearData.monthlyBreakdown.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.month}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-accent)', fontWeight: 700 }}>
                        {(m.orders * 3).toLocaleString()} items
                      </td>
                      <td style={{ padding: '10px 14px' }}>{m.orders}</td>
                      <td style={{ padding: '10px 14px' }}>
                        3.0
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      <AddDishModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        title="Admin: Add New Menu Item"
        submitLabel="Add to Restaurant Catalog"
        onSubmit={handleCreateItem}
      />

      {/* Edit Dish Modal (Change Name, Image & Details) */}
      <AddDishModal
        isOpen={editingDishItem !== null}
        onClose={() => setEditingDishItem(null)}
        initialItem={editingDishItem}
        title={editingDishItem ? `Edit Dish: ${editingDishItem.name}` : 'Edit Dish'}
        submitLabel="Save Changes"
        onSubmit={handleSaveDishEdit}
      />

      {/* Table Orders History Modal */}
      {selectedTableForDetails !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '20px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedTableForDetails(null); }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px',
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800 }}>
                  Table #{selectedTableForDetails} Items &amp; Orders Breakdown
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Total Selected Items: <strong style={{ color: 'var(--color-accent)', fontSize: '15px' }}>{getTableTotalItems(selectedTableForDetails)} items</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedTableForDetails(null)}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}>
                <X size={18} />
              </button>
            </div>

            {getTableOrders(selectedTableForDetails).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
                <Receipt size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5, color: 'var(--color-accent)' }} />
                <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 700 }}>No orders placed for Table #{selectedTableForDetails} yet</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 0 auto' }}>
                  Add a sample order instantly to see live items, or open the mobile customer menu to place an order.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      handleQuickTestOrder(selectedTableForDetails);
                    }}
                    className="btn-primary"
                    style={{ fontSize: '13px', padding: '9px 18px' }}
                    title="Instantly create a sample order for this table"
                  >
                    <Plus size={15} />
                    <span>+ Quick Add Sample Order</span>
                  </button>
                  <button
                    onClick={() => {
                      handleTestTable(selectedTableForDetails, true);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '13px', padding: '9px 18px' }}
                    title="Open customer menu for Table #{selectedTableForDetails} in a new tab"
                  >
                    <ExternalLink size={15} />
                    <span>Open Table Menu</span>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {getTableOrders(selectedTableForDetails).length} order(s) placed
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleQuickTestOrder(selectedTableForDetails)}
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      title="Add another sample order"
                    >
                      <Plus size={12} />
                      <span>+ Sample Order</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Reset Table ${selectedTableForDetails} orders and items to 0?`)) {
                          resetTableRevenue(selectedTableForDetails);
                        }
                      }}
                      style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        color: 'var(--color-danger)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'transparent',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer'
                      }}
                      title="Reset this table's orders"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {getTableOrders(selectedTableForDetails).map(ord => {
                  const orderItemsCount = ord.items.reduce((s, it) => s + (it.quantity || 0), 0);
                  return (
                    <div
                      key={ord.id}
                      style={{
                        background: 'var(--bg-surface)',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-primary)' }}>
                            {ord.orderNumber}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-accent)' }}>
                          {orderItemsCount} items
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        {ord.items.map((it, idx) => (
                          <span key={idx}>
                            {it.quantity}x {it.name}{idx < ord.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>Status:</span>
                          <span className={`badge badge-status badge-status-${ord.status.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {ord.status}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          {ord.status === 'Received' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                              style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                            >
                              Preparing
                            </button>
                          )}
                          {ord.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Served')}
                              style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: 'var(--color-accent)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                            >
                              Served
                            </button>
                          )}
                          {ord.status === 'Served' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'Completed')}
                              style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', background: '#10B981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 800 }}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
