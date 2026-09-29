export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  dietary: DietaryType;
  rating: number;
  isPopular?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Served' | 'Completed';
export type PaymentMethod = 'UPI (Google Pay / PhonePe / Paytm)' | 'Credit / Debit Card' | 'Net Banking';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  transactionId: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export interface TableInfo {
  tableNumber: number;
  label: string;
  seats: number;
  status: 'Vacant' | 'Occupied' | 'Billing';
  totalRevenue: number;
  totalOrdersCount: number;
  activeOrderId?: string;
}

export interface YearlyRevenueData {
  year: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  monthlyBreakdown: {
    month: string;
    revenue: number;
    orders: number;
  }[];
}
