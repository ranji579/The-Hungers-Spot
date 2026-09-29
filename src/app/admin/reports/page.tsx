'use client';

import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowLeft,
  FileSpreadsheet,
  DollarSign,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminReportsPage() {
  const { yearlyRevenue, tables, orders } = useRestaurant();
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const selectedYearData = yearlyRevenue.find(y => y.year === selectedYear) || yearlyRevenue[yearlyRevenue.length - 1];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Month,Revenue,Orders,AverageOrder\n" +
      selectedYearData.monthlyBreakdown.map(e => `${e.month},${e.revenue},${e.orders},${(e.revenue / e.orders).toFixed(2)}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TheHungersSpot-Annual-Report-${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin" className="btn-icon" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Annual Revenue Audit &amp; Reports</h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Fiscal analytics and dining ledger reports for The Hunger&apos;s Spot
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            {[2024, 2025, 2026].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: selectedYear === yr ? 'var(--color-primary)' : 'transparent',
                  color: selectedYear === yr ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.15s'
                }}
              >
                {yr}
              </button>
            ))}
          </div>

          <button onClick={handleExportCSV} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Annual Sales
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-accent)', marginTop: '4px' }}>
            ₹{selectedYearData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            +18% growth year-over-year
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Orders Logged
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            {selectedYearData.totalOrders.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Across all 4 dining tables
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Average Check Size
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-secondary)', marginTop: '4px' }}>
            ₹{selectedYearData.averageOrderValue.toFixed(2)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Per guest table seating
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Payment Split
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
            100% Online Digital Pay
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-accent)', marginTop: '6px' }}>
            UPI (GPay / PhonePe / Paytm) • Cards • NetBanking
          </div>
        </div>
      </div>

      {/* Monthly Performance Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Monthly Financial Breakdown ({selectedYear})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Month</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Gross Revenue (₹)</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Orders Fulfilled</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Average Order (₹)</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedYearData.monthlyBreakdown.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700 }}>{m.month}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '14px' }}>
                    ₹{m.revenue.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{m.orders}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                    ₹{(m.revenue / m.orders).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-accent)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      Audited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
