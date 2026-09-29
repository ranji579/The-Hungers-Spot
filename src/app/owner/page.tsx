'use client';

import React, { useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { OwnerView } from '@/components/owner/OwnerView';

export default function OwnerPage() {
  const { setActiveView } = useRestaurant();

  useEffect(() => {
    setActiveView('owner');
  }, [setActiveView]);

  return <OwnerView />;
}
