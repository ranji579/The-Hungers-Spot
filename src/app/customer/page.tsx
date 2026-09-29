'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRestaurant } from '@/context/RestaurantContext';
import { CustomerView } from '@/components/customer/CustomerView';

function CustomerPageContent() {
  const searchParams = useSearchParams();
  const { setActiveTableNumber, setActiveView } = useRestaurant();

  useEffect(() => {
    setActiveView('customer');
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const num = parseInt(tableParam, 10);
      if (num >= 1 && num <= 4) {
        setActiveTableNumber(num);
      }
    }
  }, [searchParams, setActiveTableNumber, setActiveView]);

  return <CustomerView />;
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Table Menu...</div>}>
      <CustomerPageContent />
    </Suspense>
  );
}
