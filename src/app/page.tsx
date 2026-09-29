'use client';

import React, { Suspense } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { CustomerView } from '@/components/customer/CustomerView';
import { OwnerView } from '@/components/owner/OwnerView';
import { AdminView } from '@/components/admin/AdminView';

function AppContent() {
  const { activeView, isMobileFrame } = useRestaurant();

  const renderActiveView = () => {
    switch (activeView) {
      case 'customer':
        return <CustomerView />;
      case 'owner':
        return <OwnerView />;
      case 'admin':
        return <AdminView />;
      default:
        return <CustomerView />;
    }
  };

  if (isMobileFrame) {
    return (
      <div className="simulator-wrapper">
        <div className="simulator-frame">
          <div className="simulator-notch">
            <div className="simulator-notch-speaker" />
          </div>
          <div className="simulator-content">
            {renderActiveView()}
          </div>
          <div className="simulator-home-bar" />
        </div>
      </div>
    );
  }

  return renderActiveView();
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading The Hunger&apos;s Spot...</div>}>
      <AppContent />
    </Suspense>
  );
}
