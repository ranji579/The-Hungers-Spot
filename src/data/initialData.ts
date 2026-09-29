import { MenuItem, TableInfo, YearlyRevenueData, Order } from '@/types/restaurant';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Appetizers & Starters
  {
    id: 'm-1',
    name: 'Tandoori Malai Paneer Tikka',
    category: 'Appetizers',
    description: 'Fresh cottage cheese cubes marinated in rich cardamom cream, char-grilled in the clay oven with bell peppers.',
    price: 260,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 14
  },
  {
    id: 'm-2',
    name: 'Crispy Firecracker Chicken Wings',
    category: 'Appetizers',
    description: 'Crisp fried chicken wings tossed in hot garlic pepper glaze, toasted sesame seeds, and spring onion.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    rating: 4.8,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 15
  },
  {
    id: 'm-3',
    name: 'Truffle Parmesan Hand-Cut Fries',
    category: 'Appetizers',
    description: 'Golden crispy russet fries tossed with aromatic black truffle oil, aged parmesan, and freshly cracked pepper.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.7,
    isAvailable: true,
    preparationTimeMinutes: 10
  },

  // Gourmet Burgers & Sandwiches
  {
    id: 'm-4',
    name: 'The Spot Special Smash Burger',
    category: 'Burgers & Steaks',
    description: 'Crisp seared patty, caramelized onion relish, smoked cheddar, house secret relish in toasted brioche bun.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 16
  },
  {
    id: 'm-5',
    name: 'Grilled Cottage Cheese Steak Sizzler',
    category: 'Burgers & Steaks',
    description: 'Herb-marinated grilled paneer steak on a sizzling platter with buttered veggies, garlic mash, and pepper jus.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.8,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 20
  },
  {
    id: 'm-6',
    name: 'Crispy Avocado Veggie Burger',
    category: 'Burgers & Steaks',
    description: 'Spiced potato & quinoa patty, smashed Haas avocado, pickled onions, chipotle drizzle.',
    price: 230,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    dietary: 'vegan',
    rating: 4.6,
    isAvailable: true,
    preparationTimeMinutes: 14
  },

  // Artisanal Pizzas & Pastas
  {
    id: 'm-7',
    name: 'Rustic Neapolitan Margherita Pizza',
    category: 'Pizzas & Pasta',
    description: 'Hand-stretched sourdough, San Marzano tomato sauce, fresh mozzarella fior di latte, basil leaves.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.8,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 16
  },
  {
    id: 'm-8',
    name: 'Spicy Chicken Tikka & Jalapeño Pizza',
    category: 'Pizzas & Pasta',
    description: 'Tandoori chicken tikka chunks, pickled jalapeños, red onions, mozzarella, coriander drizzle.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 16
  },
  {
    id: 'm-9',
    name: 'Creamy White Mushroom Fettuccine',
    category: 'Pizzas & Pasta',
    description: 'Italian egg fettuccine, sautéed portobello and button mushrooms, rich parmesan garlic cream sauce.',
    price: 310,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.7,
    isAvailable: true,
    preparationTimeMinutes: 16
  },

  // Main Course
  {
    id: 'm-10',
    name: 'Royal Awadhi Dum Biryani (Chicken / Mutton)',
    category: 'Mains',
    description: 'Aromatic long-grain basmati rice slow-cooked on dum with fragrant saffron, whole spices, and mint raita.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 18
  },
  {
    id: 'm-11',
    name: 'Smoked Butter Chicken with Garlic Naan',
    category: 'Mains',
    description: 'Charcoal-infused pulled tandoori chicken simmered in silky tomato cashew gravy, served with 2 hot butter garlic naans.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    dietary: 'non-veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 18
  },
  {
    id: 'm-12',
    name: 'Dal Makhani Slow-Cooked with Chur Chur Naan',
    category: 'Mains',
    description: 'Black lentils slow cooked overnight on charcoal embers with churned butter and cream, served with flaky naan.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.8,
    isAvailable: true,
    preparationTimeMinutes: 15
  },

  // Beverages & Coolers
  {
    id: 'm-13',
    name: 'Passionfruit Mint Lemonade Cooler',
    category: 'Beverages',
    description: 'Real passionfruit pulp, muddled fresh garden mint, Persian lime, rock salt, chilled soda.',
    price: 140,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    dietary: 'vegan',
    rating: 4.8,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 5
  },
  {
    id: 'm-14',
    name: 'Cold Coffee with Vanilla Ice Cream',
    category: 'Beverages',
    description: 'Rich blended espresso, chilled full-cream milk, topped with a scoop of vanilla ice cream and chocolate drizzle.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.7,
    isAvailable: true,
    preparationTimeMinutes: 5
  },

  // Decadent Desserts
  {
    id: 'm-15',
    name: 'Molten Belgian Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm dark chocolate sponge with flowing molten chocolate core, served with vanilla bean ice cream.',
    price: 220,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.9,
    isPopular: true,
    isAvailable: true,
    preparationTimeMinutes: 12
  },
  {
    id: 'm-16',
    name: 'Gulab Jamun with Rabdi Parfait',
    category: 'Desserts',
    description: 'Warm melt-in-mouth khoya gulab jamuns layered with saffron infused thickened rabdi and pistachios.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    dietary: 'veg',
    rating: 4.8,
    isAvailable: true,
    preparationTimeMinutes: 6
  }
];

export const INITIAL_TABLES: TableInfo[] = [
  {
    tableNumber: 1,
    label: 'Table 1 (Window Booth)',
    seats: 4,
    status: 'Occupied',
    totalRevenue: 5480,
    totalOrdersCount: 6,
    activeOrderId: 'order-101'
  },
  {
    tableNumber: 2,
    label: 'Table 2 (Center Dining)',
    seats: 2,
    status: 'Occupied',
    totalRevenue: 7850,
    totalOrdersCount: 8,
    activeOrderId: 'order-102'
  },
  {
    tableNumber: 3,
    label: 'Table 3 (Patio Garden)',
    seats: 6,
    status: 'Vacant',
    totalRevenue: 11200,
    totalOrdersCount: 11
  },
  {
    tableNumber: 4,
    label: 'Table 4 (VIP Lounge)',
    seats: 4,
    status: 'Vacant',
    totalRevenue: 14500,
    totalOrdersCount: 14
  }
];

export const INITIAL_RECENT_ORDERS: Order[] = [
  {
    id: 'order-101',
    orderNumber: '#THS-101',
    tableNumber: 1,
    items: [
      { id: 'm-10', name: 'Royal Awadhi Dum Biryani', price: 360, quantity: 1, notes: 'Medium spice with extra raita' },
      { id: 'm-13', name: 'Passionfruit Mint Lemonade Cooler', price: 140, quantity: 2 }
    ],
    subtotal: 640,
    tax: 32,
    total: 672,
    status: 'Preparing',
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Paid',
    transactionId: 'TXN-UPI-99214',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'order-102',
    orderNumber: '#THS-102',
    tableNumber: 2,
    items: [
      { id: 'm-8', name: 'Spicy Chicken Tikka & Jalapeño Pizza', price: 420, quantity: 1, notes: 'Extra crispy crust' },
      { id: 'm-15', name: 'Molten Belgian Chocolate Lava Cake', price: 220, quantity: 1 }
    ],
    subtotal: 640,
    tax: 32,
    total: 672,
    status: 'Received',
    paymentMethod: 'UPI (Google Pay / PhonePe / Paytm)',
    paymentStatus: 'Paid',
    transactionId: 'TXN-UPI-88312',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  }
];

export const INITIAL_YEARLY_REVENUE: YearlyRevenueData[] = [
  {
    year: 2024,
    totalRevenue: 3480000,
    totalOrders: 4200,
    averageOrderValue: 828,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 260000, orders: 320 },
      { month: 'Feb', revenue: 245000, orders: 300 },
      { month: 'Mar', revenue: 290000, orders: 350 },
      { month: 'Apr', revenue: 280000, orders: 340 },
      { month: 'May', revenue: 310000, orders: 370 },
      { month: 'Jun', revenue: 325000, orders: 390 },
      { month: 'Jul', revenue: 340000, orders: 410 },
      { month: 'Aug', revenue: 330000, orders: 400 },
      { month: 'Sep', revenue: 295000, orders: 360 },
      { month: 'Oct', revenue: 285000, orders: 340 },
      { month: 'Nov', revenue: 275000, orders: 330 },
      { month: 'Dec', revenue: 345000, orders: 410 }
    ]
  },
  {
    year: 2025,
    totalRevenue: 4320000,
    totalOrders: 4850,
    averageOrderValue: 890,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 320000, orders: 360 },
      { month: 'Feb', revenue: 305000, orders: 340 },
      { month: 'Mar', revenue: 360000, orders: 400 },
      { month: 'Apr', revenue: 350000, orders: 390 },
      { month: 'May', revenue: 385000, orders: 430 },
      { month: 'Jun', revenue: 410000, orders: 460 },
      { month: 'Jul', revenue: 430000, orders: 480 },
      { month: 'Aug', revenue: 415000, orders: 465 },
      { month: 'Sep', revenue: 375000, orders: 420 },
      { month: 'Oct', revenue: 360000, orders: 410 },
      { month: 'Nov', revenue: 355000, orders: 395 },
      { month: 'Dec', revenue: 425000, orders: 470 }
    ]
  },
  {
    year: 2026,
    totalRevenue: 5180000,
    totalOrders: 5420,
    averageOrderValue: 955,
    monthlyBreakdown: [
      { month: 'Jan', revenue: 410000, orders: 430 },
      { month: 'Feb', revenue: 395000, orders: 415 },
      { month: 'Mar', revenue: 460000, orders: 480 },
      { month: 'Apr', revenue: 445000, orders: 465 },
      { month: 'May', revenue: 490000, orders: 510 },
      { month: 'Jun', revenue: 520000, orders: 540 },
      { month: 'Jul', revenue: 545000, orders: 570 },
      { month: 'Aug', revenue: 530000, orders: 550 },
      { month: 'Sep', revenue: 495000, orders: 520 },
      { month: 'Oct', revenue: 475000, orders: 500 },
      { month: 'Nov', revenue: 455000, orders: 480 },
      { month: 'Dec', revenue: 460000, orders: 480 }
    ]
  }
];
