export type ProductCategory =
  | 'Electronics'
  | 'Smartphones'
  | 'Laptops and Computers'
  | 'Audio and Headphones'
  | 'Fashion'
  | 'Footwear'
  | 'Home and Kitchen'
  | 'Home Appliances'
  | 'Beauty and Personal Care'
  | 'Grocery and Daily Essentials'
  | 'Sports and Fitness'
  | 'Books and Stationery'
  | 'Bags and Travel'
  | 'Gaming Accessories'
  | 'Smart Home Devices';

export type ProductCondition =
  | 'Brand New'
  | 'Surplus Open-Box'
  | 'Factory Sealed Surplus'
  | 'Refurbished Certified';

export type AvailabilityStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export type DealRecommendation =
  | 'GOOD DEAL'
  | 'FAIR PRICE'
  | 'CONSIDER WAITING'
  | 'COMPARE ALTERNATIVES'
  | 'INSUFFICIENT DATA';

export interface PriceHistoryPoint {
  date: string;
  price: number;
  event: 'Normal' | 'Sale' | 'Surplus Clearance' | 'Current';
}

export interface SurplusMetrics {
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  excessUnits: number;
  daysInInventory: number;
  salesVelocity: number; // units per week
  suggestedDiscount: number; // percentage
  suggestedPrice: number;
  approved: boolean;
  clearanceScenario: string;
  carryingCostMonthly: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  referencePrice: number;
  discount: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  condition: ProductCondition;
  deliveryEstimate: string;
  returnPolicy: string;
  warranty: string;
  surplus: boolean;
  surplusData?: SurplusMetrics;
  priceHistory: PriceHistoryPoint[];
  dealScore: number; // 0-100
  dealRecommendation: DealRecommendation;
  availability: AvailabilityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  tagline: string;
  rating: number;
  verified: boolean;
  specialty: string;
  productCount: number;
  surplusCount: number;
  avatar: string;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    referencePrice: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discountTotal: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'Cash on Delivery (Demo)' | 'Instant UPI Demo' | 'Wallet';
  createdAt: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'seller';
  sellerId?: string;
  avatar: string;
  addresses: DeliveryAddress[];
  notifications: {
    priceAlerts: boolean;
    surplusDeals: boolean;
    orderUpdates: boolean;
  };
}

export interface BudgetGoal {
  targetAmount: number;
  currency: string;
  notes?: string;
}

export interface CartAlternativeRecommendation {
  originalProductId: string;
  originalProductName: string;
  originalPrice: number;
  alternativeProduct: Product;
  savings: number;
  reason: string;
  surplusBonus?: boolean;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  productIds?: string[];
  suggestedActions?: { label: string; action: string; payload?: unknown }[];
}
