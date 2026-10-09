import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, UserProfile, Order, DeliveryAddress, Seller } from '../types';
import { DEMO_SELLERS, getProductById } from '../data/catalogueGenerator';

type ActiveView =
  | 'home'
  | 'marketplace'
  | 'product-detail'
  | 'surplus-hub'
  | 'seller-portal'
  | 'orders'
  | 'profile';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  view: ActiveView;
  setView: (view: ActiveView) => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartReferenceTotal: number;
  cartSavings: number;
  targetBudget: number;
  setTargetBudget: (budget: number) => void;
  isOverBudget: boolean;
  overBudgetAmount: number;
  remainingBudget: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareDrawerOpen: boolean;
  setIsCompareDrawerOpen: (open: boolean) => void;
  priceGuardianProductId: string | null;
  openPriceGuardian: (productId: string) => void;
  closePriceGuardian: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  user: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addDeliveryAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  selectedSeller: Seller;
  setSelectedSeller: (seller: Seller) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  marketplaceCategoryFilter: string;
  setMarketplaceCategoryFilter: (category: string) => void;
  marketplaceSearchQuery: string;
  setMarketplaceSearchQuery: (query: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-99',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  addresses: [
    {
      id: 'addr-1',
      name: 'Aarav Sharma (Home)',
      street: '42, Cyber Greens, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: 'addr-2',
      name: 'Aarav Sharma (Office)',
      street: 'Tech Park Tower 4, 3rd Floor, Outer Ring Rd',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
      phone: '+91 98765 43210',
      isDefault: false,
    },
  ],
  notifications: {
    priceAlerts: true,
    surplusDeals: true,
    orderUpdates: true,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('optimart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Target Budget persisted in localStorage
  const [targetBudget, setTargetBudgetState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('optimart_target_budget');
      return saved ? Number(saved) : 6000;
    } catch {
      return 6000;
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('optimart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare state
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  // Modals & Panels
  const [priceGuardianProductId, setPriceGuardianProductId] = useState<string | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('optimart_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Active Seller for Seller Portal
  const [selectedSeller, setSelectedSeller] = useState<Seller>(DEMO_SELLERS[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('optimart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick Filters for Marketplace
  const [marketplaceCategoryFilter, setMarketplaceCategoryFilter] = useState('All');
  const [marketplaceSearchQuery, setMarketplaceSearchQuery] = useState('');

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('optimart_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('optimart_target_budget', targetBudget.toString());
    } catch {}
  }, [targetBudget]);

  useEffect(() => {
    try {
      localStorage.setItem('optimart_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('optimart_user_profile', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('optimart_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setTargetBudget = (amount: number) => {
    const clamped = Math.max(500, amount);
    setTargetBudgetState(clamped);
    showToast(`Target budget set to ₹${clamped.toLocaleString()}`, 'info');
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, addedAt: new Date().toISOString() }];
    });
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartReferenceTotal = cart.reduce(
    (acc, item) => acc + item.product.referencePrice * item.quantity,
    0
  );
  const cartSavings = Math.max(0, cartReferenceTotal - cartTotal);
  const isOverBudget = cartTotal > targetBudget;
  const overBudgetAmount = isOverBudget ? cartTotal - targetBudget : 0;
  const remainingBudget = isOverBudget ? 0 : targetBudget - cartTotal;

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addToCompare = (product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        showToast('Item already in comparison', 'info');
        return prev;
      }
      if (prev.length >= 4) {
        showToast('Maximum 4 products can be compared at once', 'warning');
        return prev;
      }
      showToast(`Added "${product.name}" to comparison`, 'info');
      setIsCompareDrawerOpen(true);
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const openPriceGuardian = (productId: string) => {
    setPriceGuardianProductId(productId);
  };

  const closePriceGuardian = () => {
    setPriceGuardianProductId(null);
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...patch }));
    showToast('Profile updated successfully', 'success');
  };

  const addDeliveryAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
    showToast('New delivery address saved', 'success');
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
    showToast('Order confirmed! Tracking details generated.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        selectedProductId,
        openProductDetail,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartReferenceTotal,
        cartSavings,
        targetBudget,
        setTargetBudget,
        isOverBudget,
        overBudgetAmount,
        remainingBudget,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,
        priceGuardianProductId,
        openPriceGuardian,
        closePriceGuardian,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isAssistantOpen,
        setIsAssistantOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        updateUserProfile,
        addDeliveryAddress,
        selectedSeller,
        setSelectedSeller,
        orders,
        addOrder,
        toasts,
        showToast,
        removeToast,
        marketplaceCategoryFilter,
        setMarketplaceCategoryFilter,
        marketplaceSearchQuery,
        setMarketplaceSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
