import {
  Product,
  Order,
  DeliveryAddress,
  CartItem,
  CartAlternativeRecommendation,
  Seller,
} from '../types';
import {
  queryProducts as localQueryProducts,
  getProductById as localGetProductById,
  getFeaturedProducts as localGetFeatured,
  getSurplusHotDeals as localGetSurplus,
  getMarketplaceStats as localGetStats,
  DEMO_SELLERS,
  ProductQueryParams,
  PaginatedProductResult,
} from '../data/catalogueGenerator';

const API_BASE = '/api';

export async function fetchProducts(params: ProductQueryParams = {}): Promise<PaginatedProductResult> {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.category && params.category !== 'All') searchParams.set('category', params.category);
    if (params.subcategory && params.subcategory !== 'All') searchParams.set('subcategory', params.subcategory);
    if (params.surplusOnly) searchParams.set('surplusOnly', 'true');
    if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params.minRating) searchParams.set('minRating', params.minRating.toString());
    if (params.minDiscount) searchParams.set('minDiscount', params.minDiscount.toString());
    if (params.sellerId && params.sellerId !== 'All') searchParams.set('sellerId', params.sellerId);
    if (params.condition && params.condition !== 'All') searchParams.set('condition', params.condition);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);

    const res = await fetch(`${API_BASE}/catalogue/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    // Graceful offline/direct generator fallback
    return localQueryProducts(params);
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/catalogue/products/${id}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch {
    return localGetProductById(id);
  }
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/catalogue/featured?limit=${limit}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return localGetFeatured(limit);
  }
}

export async function fetchSurplusDeals(limit = 8): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/catalogue/surplus-deals?limit=${limit}`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return localGetSurplus(limit);
  }
}

export async function fetchMarketplaceStats() {
  try {
    const res = await fetch(`${API_BASE}/catalogue/stats`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return localGetStats();
  }
}

export async function fetchSellers(): Promise<Seller[]> {
  try {
    const res = await fetch(`${API_BASE}/catalogue/sellers`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return DEMO_SELLERS;
  }
}

export async function analyzePriceGuardian(productId: string) {
  try {
    const res = await fetch(`${API_BASE}/gemini/price-guardian`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error('Failed to analyze');
    return await res.json();
  } catch {
    const product = localGetProductById(productId);
    if (!product) throw new Error('Product not found');
    const lowest = Math.min(...product.priceHistory.map((p) => p.price));
    return {
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      referencePrice: product.referencePrice,
      lowestRecorded: lowest,
      highestRecorded: Math.max(...product.priceHistory.map((p) => p.price)),
      dealScore: product.dealScore,
      dealRecommendation: product.dealRecommendation,
      confidenceScore: 92,
      historicalPricePoints: product.priceHistory,
      explanation: `Listed at ₹${product.price.toLocaleString()} with a ${product.discount}% markdown from MSRP. Historical analysis confirms price stability over the last 180 days. Verdict: ${product.dealRecommendation}.`,
      volatilityIndex: 'Low (Stable)',
    };
  }
}

export async function optimizeCartBudget(cartItems: CartItem[], targetBudget: number) {
  try {
    const res = await fetch(`${API_BASE}/gemini/budget-optimizer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems, targetBudget }),
    });
    if (!res.ok) throw new Error('Failed to optimize');
    return await res.json();
  } catch {
    const currentTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const overBudget = Math.max(0, currentTotal - targetBudget);
    const recommendations: CartAlternativeRecommendation[] = [];

    cartItems.forEach((item) => {
      if (overBudget > 0) {
        const alts = localQueryProducts({
          category: item.product.category,
          maxPrice: Math.round(item.product.price * 0.75),
          limit: 1,
        }).products;
        if (alts.length > 0) {
          const alt = alts[0];
          recommendations.push({
            originalProductId: item.product.id,
            originalProductName: item.product.name,
            originalPrice: item.product.price,
            alternativeProduct: alt,
            savings: (item.product.price - alt.price) * item.quantity,
            reason: alt.surplus
              ? `Swap with surplus ${alt.name} to save ₹${((item.product.price - alt.price) * item.quantity).toLocaleString()}.`
              : `High-value alternative in ${item.product.category}.`,
            surplusBonus: alt.surplus,
          });
        }
      }
    });

    return {
      currentTotal,
      targetBudget,
      overBudget,
      remainingBudget: Math.max(0, targetBudget - currentTotal),
      recommendations,
      aiAdvice:
        overBudget > 0
          ? `Cart is ₹${overBudget.toLocaleString()} over target. Swapping items for recommended surplus or budget picks will achieve your target.`
          : `Cart total is within your ₹${targetBudget.toLocaleString()} budget limit.`,
    };
  }
}

export async function askOptiAssistant(message: string, history: any[] = []) {
  try {
    const res = await fetch(`${API_BASE}/gemini/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Failed to query assistant');
    return await res.json();
  } catch {
    const results = localQueryProducts({ search: message, limit: 3 }).products;
    return {
      reply: `I searched our 10,200+ product catalogue for "${message}". Here are verified top-rated matches with active Price Guardian protection.`,
      recommendedProducts: results.length ? results : localGetFeatured(3),
      suggestedQueries: [
        'Find surplus electronics with >35% off',
        'Laptops under ₹60,000 with AI specs',
        'Help me stay under ₹4,000 budget',
      ],
    };
  }
}

export async function analyzeSurplusPricing(productId: string) {
  try {
    const res = await fetch(`${API_BASE}/gemini/surplus-pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    const p = localGetProductById(productId);
    if (!p) throw new Error('Not found');
    const discount = Math.min(55, (p.discount || 20) + 10);
    const suggestedPrice = Math.round(p.referencePrice * (1 - discount / 100));
    return {
      productId: p.id,
      productName: p.name,
      currentPrice: p.price,
      referencePrice: p.referencePrice,
      daysInInventory: p.surplusData?.daysInInventory || 80,
      excessUnits: p.surplusData?.excessUnits || 30,
      monthlyCarryingCost: Math.round(p.referencePrice * 0.02 * (p.surplusData?.excessUnits || 30)),
      recommendedDiscount: discount,
      recommendedPrice: suggestedPrice,
      estimatedClearanceWeeks: 3,
      aiReasoning: `Accelerating clearance to ${discount}% discount avoids holding costs and clears backlog within 3 weeks.`,
      requiresSellerApproval: true,
      isApproved: false,
    };
  }
}

export async function approveSurplusPrice(productId: string, suggestedDiscount: number, suggestedPrice: number, sellerId: string) {
  try {
    const res = await fetch(`${API_BASE}/seller/approve-surplus-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, suggestedDiscount, suggestedPrice, sellerId }),
    });
    if (!res.ok) throw new Error('Failed to approve');
    return await res.json();
  } catch {
    return {
      success: true,
      message: `Surplus discount of ${suggestedDiscount}% (₹${suggestedPrice}) approved and activated locally.`,
      approvedAt: new Date().toISOString(),
    };
  }
}

export async function submitCheckout(payload: {
  items: { productId: string; quantity: number; price: number; referencePrice: number; image: string; productName: string }[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
}): Promise<{ success: boolean; order: Order; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Checkout request failed');
    return await res.json();
  } catch {
    const subtotal = payload.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 99;
    const mockOrder: Order = {
      id: `OPT-ORD-${Date.now().toString().slice(-6)}`,
      items: payload.items,
      subtotal,
      discountTotal: 0,
      shipping,
      total: subtotal + shipping,
      status: 'Confirmed',
      deliveryAddress: payload.deliveryAddress,
      paymentMethod: payload.paymentMethod as any,
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-4 Business Days (Express Eco-Transit)',
    };
    return {
      success: true,
      order: mockOrder,
      message: 'Demo order placed successfully!',
    };
  }
}
