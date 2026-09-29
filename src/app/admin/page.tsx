'use client';

import React, { useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { AdminView } from '@/components/admin/AdminView';

export default function AdminPage() {
  const { setActiveView } = useRestaurant();

  useEffect(() => {
    setActiveView('admin');
  }, [setActiveView]);

  return <AdminView />;
}
