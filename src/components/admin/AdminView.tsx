'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  DollarSign,
  Layers,
  Sparkles,
  X,
  Eye,
  RotateCcw,
  Receipt,
  Users
} from 'lucide-react';
import { AddDishModal } from '@/components/common/AddDishModal';

import { MenuItem } from '@/types/restaurant';

export const AdminView: React.FC = () => {
  const {
    tables,
    menuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    toggleItemAvailability,
    yearlyRevenue,
    getTableRevenue,
    getTableOrders,
    resetAllTablesRevenue,
    resetTableRevenue,
    setActiveTableNumber,
    setActiveView
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'tables' | 'qr' | 'menu' | 'revenue'>('tables');
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

  const handleTestTable = (tableNum: number) => {
    setActiveTableNumber(tableNum);
    setActiveView('customer');
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
              Table QR Code Studio (4 Tables), Master Menu Catalog, and Financial Reports
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
            <DollarSign size={15} />
            <span>Particular Table Revenue</span>
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

      {/* TAB: PARTICULAR TABLE REVENUE */}
      {activeTab === 'tables' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Particular Table Revenue (Tables 1 - 4)</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Live revenue breakdown for each dining table. Every table starts at ₹0 and adds up automatically as orders are placed.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all tables revenue and orders to ₹0?')) {
                    resetAllTablesRevenue();
                  }
                }}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '8px 14px', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                title="Reset all tables revenue to 0"
              >
                <RotateCcw size={14} />
                <span>Reset All Tables to ₹0</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {tables.map(tbl => {
              const tableOrdersList = getTableOrders(tbl.tableNumber);
              const totalRev = getTableRevenue(tbl.tableNumber);
              const avgSpend = tableOrdersList.length > 0 ? totalRev / tableOrdersList.length : 0;

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
                      Table Total Revenue
                    </div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-accent)', marginTop: '4px' }}>
                      ₹{totalRev.toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <div>Orders Placed: <strong style={{ color: '#fff' }}>{tableOrdersList.length}</strong></div>
                    <div>Avg Ticket: <strong style={{ color: '#fff' }}>₹{avgSpend.toFixed(2)}</strong></div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedTableForDetails(tbl.tableNumber)}
                      className="btn-secondary"
                      style={{ width: '100%', fontSize: '12px', padding: '9px', justifyContent: 'center' }}
                    >
                      <Eye size={14} />
                      <span>View Orders Breakdown ({tableOrdersList.length})</span>
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => handleTestTable(tbl.tableNumber)}
                        className="btn-primary"
                        style={{ fontSize: '11px', padding: '8px 10px', justifyContent: 'center' }}
                        title="Order food from this table to test revenue addition"
                      >
                        <ExternalLink size={13} />
                        <span>Order Test</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Reset Table ${tbl.tableNumber} revenue to ₹0?`)) {
                            resetTableRevenue(tbl.tableNumber);
                          }
                        }}
                        style={{
                          fontSize: '11px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: 'var(--color-danger)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                        title="Reset this table's revenue to ₹0"
                      >
                        <RotateCcw size={12} />
                        <span>Reset ₹0</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

                {/* Table Live Revenue Badge */}
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
                  <span style={{ color: 'var(--text-muted)' }}>Revenue:</span>
                  <strong style={{ color: 'var(--color-accent)', fontSize: '14px' }}>
                    ₹{getTableRevenue(table.tableNumber).toFixed(2)}
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
                <p style={{ fontSize: '14px', margin: '20px 0 10px 0' }}>Scan with your Phone Camera to Browse Menu &amp; Pay Online</p>
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
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>
                    ₹{item.price.toFixed(2)}
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

      {/* TAB 3: YEARLY FINANCIAL REPORTS */}
      {activeTab === 'revenue' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Financial Revenue Reports</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Audited yearly financial performance, volume, and average check metrics
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
                Annual Gross Sales
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
                ₹{selectedYearData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Paid Orders
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedYearData.totalOrders.toLocaleString()}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Average Check Size
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
                ₹{selectedYearData.averageOrderValue.toFixed(2)}
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
                {selectedYear} Monthly Ledger Breakdown
              </h3>
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,Month,Revenue,Orders\n" +
                    selectedYearData.monthlyBreakdown.map(e => `${e.month},${e.revenue},${e.orders}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `TheHungersSpot-Revenue-${selectedYear}.csv`);
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
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Total Revenue (₹)</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Orders Completed</th>
                    <th style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>Avg Order (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedYearData.monthlyBreakdown.map((m, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>{m.month}</td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-accent)', fontWeight: 700 }}>
                        ₹{m.revenue.toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 14px' }}>{m.orders}</td>
                      <td style={{ padding: '10px 14px' }}>
                        ₹{(m.revenue / m.orders).toFixed(2)}
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

      {/* Edit Dish Modal (Change Name, Image, Price & Details) */}
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
                  Table #{selectedTableForDetails} Revenue &amp; Orders Breakdown
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Total Collected: <strong style={{ color: 'var(--color-accent)', fontSize: '15px' }}>₹{getTableRevenue(selectedTableForDetails).toFixed(2)}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedTableForDetails(null)}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {getTableOrders(selectedTableForDetails).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Receipt size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>No orders placed for this table yet</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Table revenue is currently ₹0.00. Place an order from Table #{selectedTableForDetails} to see revenue add up live!
                </p>
                <button
                  onClick={() => {
                    handleTestTable(selectedTableForDetails);
                    setSelectedTableForDetails(null);
                  }}
                  className="btn-primary"
                  style={{ marginTop: '16px', fontSize: '13px', padding: '8px 16px' }}
                >
                  <ExternalLink size={14} />
                  <span>Place Test Order for Table #{selectedTableForDetails}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {getTableOrders(selectedTableForDetails).map(ord => (
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
                      <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-accent)' }}>
                        ₹{ord.total.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {ord.items.map((it, idx) => (
                        <span key={idx}>
                          {it.quantity}x {it.name} (₹{it.price}){idx < ord.items.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <span>Status: <strong style={{ color: '#fff' }}>{ord.status}</strong></span>
                      <span>Payment: <strong style={{ color: '#fff' }}>{ord.paymentMethod}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
