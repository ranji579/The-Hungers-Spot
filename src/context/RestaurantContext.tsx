'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  MenuItem,
  TableInfo,
  Order,
  CartItem,
  OrderStatus,
  PaymentMethod,
  YearlyRevenueData
} from '@/types/restaurant';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES,
  INITIAL_RECENT_ORDERS,
  INITIAL_YEARLY_REVENUE
} from '@/data/initialData';
import { sounds } from '@/utils/audio';

const STORAGE_KEY_MENU = 'ths_menu_items_inr_v3';
const STORAGE_KEY_TABLES = 'ths_tables_inr_v3';
const STORAGE_KEY_ORDERS = 'ths_orders_inr_v3';

interface RestaurantContextType {
  menuItems: MenuItem[];
  tables: TableInfo[];
  orders: Order[];
  activeTableNumber: number;
  setActiveTableNumber: (tableNumber: number) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  placeOrder: (paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemPrice: (itemId: string, newPrice: number) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  yearlyRevenue: YearlyRevenueData[];
  getTableRevenue: (tableNumber: number) => number;
  getTableOrders: (tableNumber: number) => Order[];
  activeView: 'customer' | 'owner' | 'admin';
  setActiveView: (view: 'customer' | 'owner' | 'admin') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  unreadOrderNotification: string | null;
  clearNotification: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<TableInfo[]>(INITIAL_TABLES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_RECENT_ORDERS);
  const [activeTableNumber, setActiveTableNumberState] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeView, setActiveView] = useState<'customer' | 'owner' | 'admin'>('customer');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [unreadOrderNotification, setUnreadOrderNotification] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize from localStorage and setup URL table param
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedMenu = localStorage.getItem(STORAGE_KEY_MENU);
      if (savedMenu) setMenuItems(JSON.parse(savedMenu));

      const savedTables = localStorage.getItem(STORAGE_KEY_TABLES);
      if (savedTables) setTables(JSON.parse(savedTables));

      const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error('Failed to load local storage state', e);
    }

    // Check query params for table
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table');
    if (tableParam) {
      const num = parseInt(tableParam, 10);
      if (num >= 1 && num <= 4) {
        setActiveTableNumberState(num);
      }
    }
  }, []);

  // Sync to LocalStorage and BroadcastChannel
  const broadcastSync = useCallback((type: string, payload: unknown) => {
    if (typeof window === 'undefined') return;
    try {
      if ('BroadcastChannel' in window) {
        const channel = new BroadcastChannel('hungers_spot_sync_bus');
        channel.postMessage({ type, payload, timestamp: Date.now() });
        channel.close();
      }
    } catch (e) {
      console.warn('BroadcastChannel error', e);
    }
  }, []);

  // Listen for BroadcastChannel events from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('hungers_spot_sync_bus');

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_ORDER') {
        const order = payload as Order;
        setOrders(prev => [order, ...prev.filter(o => o.id !== order.id)]);
        setTables(prev => prev.map(t => {
          if (t.tableNumber === order.tableNumber) {
            return {
              ...t,
              status: 'Occupied',
              totalRevenue: Number((t.totalRevenue + order.total).toFixed(2)),
              totalOrdersCount: t.totalOrdersCount + 1,
              activeOrderId: order.id
            };
          }
          return t;
        }));
        setUnreadOrderNotification(`New Order ${order.orderNumber} placed for Table ${order.tableNumber}!`);
        if (soundEnabled) {
          sounds.playNewOrderChime();
        }
      } else if (type === 'UPDATE_STATUS') {
        const { orderId, status } = payload;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
      } else if (type === 'UPDATE_MENU') {
        setMenuItems(payload as MenuItem[]);
      } else if (type === 'UPDATE_TABLES') {
        setTables(payload as TableInfo[]);
      }
    };

    return () => {
      channel.close();
    };
  }, [soundEnabled]);

  const setActiveTableNumber = (tableNum: number) => {
    setActiveTableNumberState(tableNum);
    // Keep cart separated or persist per table if needed
  };

  const clearNotification = () => {
    setUnreadOrderNotification(null);
  };

  // Cart operations
  const addToCart = (item: MenuItem, notes?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.item.id === item.id
            ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes }
            : i
        );
      }
      return [...prev, { item, quantity: 1, notes }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.item.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = useMemo(() => {
    return Number(cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0).toFixed(2));
  }, [cart]);

  const cartTax = useMemo(() => {
    // 5% GST (2.5% CGST + 2.5% SGST)
    return Number((cartSubtotal * 0.05).toFixed(2));
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Number((cartSubtotal + cartTax).toFixed(2));
  }, [cartSubtotal, cartTax]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Place order
  const placeOrder = async (paymentMethod: PaymentMethod): Promise<Order> => {
    const orderNum = `#THS-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      tableNumber: activeTableNumber,
      items: cart.map(c => ({
        id: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
        notes: c.notes
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      total: cartTotal,
      status: 'Received',
      paymentMethod,
      paymentStatus: 'Paid',
      transactionId: `TXN-${paymentMethod.replace(/\s+/g, '').toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));

    // Update table info
    const updatedTables = tables.map(t => {
      if (t.tableNumber === activeTableNumber) {
        return {
          ...t,
          status: 'Occupied' as const,
          totalRevenue: Number((t.totalRevenue + newOrder.total).toFixed(2)),
          totalOrdersCount: t.totalOrdersCount + 1,
          activeOrderId: newOrder.id
        };
      }
      return t;
    });
    setTables(updatedTables);
    localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(updatedTables));

    // Broadcast live event to owner and admin
    broadcastSync('NEW_ORDER', newOrder);
    broadcastSync('UPDATE_TABLES', updatedTables);

    if (soundEnabled) {
      sounds.playPaymentSuccess();
    }

    clearCart();
    return newOrder;
  };

  // Owner changes order status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map(o => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    setOrders(updated);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));

    // If completed, update table status if this was active order
    if (status === 'Completed') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const updatedTables = tables.map(t => {
          if (t.tableNumber === order.tableNumber && t.activeOrderId === orderId) {
            return { ...t, status: 'Vacant' as const, activeOrderId: undefined };
          }
          return t;
        });
        setTables(updatedTables);
        localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(updatedTables));
        broadcastSync('UPDATE_TABLES', updatedTables);
      }
    }

    broadcastSync('UPDATE_STATUS', { orderId, status });
  };

  // Owner modifies item price
  const updateItemPrice = (itemId: string, newPrice: number) => {
    const updated = menuItems.map(m => (m.id === itemId ? { ...m, price: Number(newPrice.toFixed(2)) } : m));
    setMenuItems(updated);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated));
    broadcastSync('UPDATE_MENU', updated);
  };

  // Admin adds new item
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`
    };
    const updated = [newItem, ...menuItems];
    setMenuItems(updated);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated));
    broadcastSync('UPDATE_MENU', updated);
  };

  // Admin removes item
  const removeMenuItem = (itemId: string) => {
    const updated = menuItems.filter(m => m.id !== itemId);
    setMenuItems(updated);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated));
    broadcastSync('UPDATE_MENU', updated);
  };

  // Toggle availability
  const toggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map(m => (m.id === itemId ? { ...m, isAvailable: !m.isAvailable } : m));
    setMenuItems(updated);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated));
    broadcastSync('UPDATE_MENU', updated);
  };

  // Table specific revenue & orders
  const getTableRevenue = useCallback((tableNum: number) => {
    const table = tables.find(t => t.tableNumber === tableNum);
    return table ? table.totalRevenue : 0;
  }, [tables]);

  const getTableOrders = useCallback((tableNum: number) => {
    return orders.filter(o => o.tableNumber === tableNum);
  }, [orders]);

  // Aggregate yearly revenue including live placed orders
  const yearlyRevenue = useMemo(() => {
    // Current year orders total
    const currentYear = new Date().getFullYear();
    const liveOrdersTotal = orders.reduce((sum, o) => sum + o.total, 0);

    return INITIAL_YEARLY_REVENUE.map(yr => {
      if (yr.year === currentYear) {
        return {
          ...yr,
          totalRevenue: Number((yr.totalRevenue + liveOrdersTotal).toFixed(2)),
          totalOrders: yr.totalOrders + orders.length,
          averageOrderValue: Number(((yr.totalRevenue + liveOrdersTotal) / (yr.totalOrders + orders.length)).toFixed(2))
        };
      }
      return yr;
    });
  }, [orders]);

  return (
    <RestaurantContext.Provider
      value={{
        menuItems,
        tables,
        orders,
        activeTableNumber,
        setActiveTableNumber,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartItemCount,
        placeOrder,
        updateOrderStatus,
        updateItemPrice,
        addMenuItem,
        removeMenuItem,
        toggleItemAvailability,
        yearlyRevenue,
        getTableRevenue,
        getTableOrders,
        activeView,
        setActiveView,
        isMobileFrame,
        setIsMobileFrame,
        unreadOrderNotification,
        clearNotification,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
