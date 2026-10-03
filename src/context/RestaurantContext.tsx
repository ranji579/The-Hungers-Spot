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

const STORAGE_KEY_MENU = 'ths_menu_items_inr_v5';
const STORAGE_KEY_TABLES = 'ths_tables_inr_v5';
const STORAGE_KEY_ORDERS = 'ths_orders_inr_v5';

// Helper to compute table stats strictly from orders so table revenue adds up accurately
export const computeTablesFromOrders = (baseTables: TableInfo[], orderList: Order[]): TableInfo[] => {
  return baseTables.map(t => {
    const tableOrders = orderList.filter(o => o.tableNumber === t.tableNumber);
    const rev = Number(tableOrders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2));
    const activeOrder = tableOrders.find(o => o.status === 'Received' || o.status === 'Preparing' || o.status === 'Served');
    return {
      ...t,
      totalRevenue: rev,
      totalOrdersCount: tableOrders.length,
      status: activeOrder ? 'Occupied' : 'Vacant',
      activeOrderId: activeOrder ? activeOrder.id : undefined
    };
  });
};

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
  updateMenuItem: (itemId: string, updatedFields: Partial<Omit<MenuItem, 'id'>>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (itemId: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  yearlyRevenue: YearlyRevenueData[];
  getTableRevenue: (tableNumber: number) => number;
  getTableOrders: (tableNumber: number) => Order[];
  resetAllTablesRevenue: () => void;
  resetTableRevenue: (tableNumber: number) => void;
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

      const savedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      const loadedOrders: Order[] = savedOrders ? JSON.parse(savedOrders) : INITIAL_RECENT_ORDERS;
      setOrders(loadedOrders);

      const savedTables = localStorage.getItem(STORAGE_KEY_TABLES);
      const baseTables: TableInfo[] = savedTables ? JSON.parse(savedTables) : INITIAL_TABLES;
      // Recompute table revenue strictly from orders so table revenue starts at 0 and adds up accurately
      const accurateTables = computeTablesFromOrders(baseTables, loadedOrders);
      setTables(accurateTables);
      localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(accurateTables));
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
        setOrders(prev => {
          const updated = [order, ...prev.filter(o => o.id !== order.id)];
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
          setTables(tPrev => {
            const upTables = computeTablesFromOrders(tPrev, updated);
            localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(upTables));
            return upTables;
          });
          return updated;
        });
        setUnreadOrderNotification(`New Order ${order.orderNumber} placed for Table ${order.tableNumber}!`);
        if (soundEnabled) {
          sounds.playNewOrderChime();
        }
      } else if (type === 'UPDATE_STATUS') {
        const { orderId, status } = payload;
        setOrders(prev => {
          const updated = prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
          setTables(tPrev => {
            const upTables = computeTablesFromOrders(tPrev, updated);
            localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(upTables));
            return upTables;
          });
          return updated;
        });
      } else if (type === 'RESET_ALL_REVENUE') {
        setOrders([]);
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([]));
        setTables(tPrev => {
          const upTables = computeTablesFromOrders(tPrev, []);
          localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(upTables));
          return upTables;
        });
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

    // Update table info strictly from updated orders
    const updatedTables = computeTablesFromOrders(tables, updatedOrders);
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

    const updatedTables = computeTablesFromOrders(tables, updated);
    setTables(updatedTables);
    localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(updatedTables));

    broadcastSync('UPDATE_TABLES', updatedTables);
    broadcastSync('UPDATE_STATUS', { orderId, status });
  };

  // Owner modifies item price
  const updateItemPrice = (itemId: string, newPrice: number) => {
    const updated = menuItems.map(m => (m.id === itemId ? { ...m, price: Number(newPrice.toFixed(2)) } : m));
    setMenuItems(updated);
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(updated));
    broadcastSync('UPDATE_MENU', updated);
  };

  // Owner/Admin edits any menu item fields (name, image, price, description, etc.)
  const updateMenuItem = (itemId: string, updatedFields: Partial<Omit<MenuItem, 'id'>>) => {
    const updated = menuItems.map(m => (m.id === itemId ? { ...m, ...updatedFields } : m));
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

  // Table specific revenue & orders — always computes real live sum of table orders
  const getTableRevenue = useCallback((tableNum: number) => {
    const tableOrders = orders.filter(o => o.tableNumber === tableNum);
    return Number(tableOrders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2));
  }, [orders]);

  const getTableOrders = useCallback((tableNum: number) => {
    return orders.filter(o => o.tableNumber === tableNum);
  }, [orders]);

  // Reset all table revenues and orders to 0
  const resetAllTablesRevenue = useCallback(() => {
    setOrders([]);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify([]));
    const zeroTables = computeTablesFromOrders(INITIAL_TABLES, []);
    setTables(zeroTables);
    localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(zeroTables));
    broadcastSync('RESET_ALL_REVENUE', {});
  }, [broadcastSync]);

  // Reset a specific table's revenue to 0
  const resetTableRevenue = useCallback((tableNum: number) => {
    setOrders(prev => {
      const remaining = prev.filter(o => o.tableNumber !== tableNum);
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(remaining));
      setTables(tPrev => {
        const upTables = computeTablesFromOrders(tPrev, remaining);
        localStorage.setItem(STORAGE_KEY_TABLES, JSON.stringify(upTables));
        broadcastSync('UPDATE_TABLES', upTables);
        return upTables;
      });
      return remaining;
    });
  }, [broadcastSync]);

  // Aggregate yearly revenue including live placed orders
  const yearlyRevenue = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const liveOrdersTotal = orders.reduce((sum, o) => sum + o.total, 0);

    return INITIAL_YEARLY_REVENUE.map(yr => {
      if (yr.year === currentYear) {
        return {
          ...yr,
          totalRevenue: Number((yr.totalRevenue + liveOrdersTotal).toFixed(2)),
          totalOrders: yr.totalOrders + orders.length,
          averageOrderValue: (yr.totalOrders + orders.length) > 0
            ? Number(((yr.totalRevenue + liveOrdersTotal) / (yr.totalOrders + orders.length)).toFixed(2))
            : 0
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
        updateMenuItem,
        addMenuItem,
        removeMenuItem,
        toggleItemAvailability,
        yearlyRevenue,
        getTableRevenue,
        getTableOrders,
        resetAllTablesRevenue,
        resetTableRevenue,
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
