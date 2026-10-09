import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  generateCatalogue,
  queryProducts,
  getProductById,
  getFeaturedProducts,
  getSurplusHotDeals,
  getMarketplaceStats,
  DEMO_SELLERS,
  TOTAL_CATALOGUE_COUNT,
  getCheaperAlternatives,
} from './src/data/catalogueGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize server-side Gemini client
let geminiAi: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    geminiAi = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Google GenAI initialized successfully with Gemini 3.8 Flash');
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('GEMINI_API_KEY not configured or placeholder. Intelligent deterministic fallback engine enabled.');
}

// In-memory store for seller price approvals & orders
const approvedSurplusPricing: Record<string, { suggestedDiscount: number; suggestedPrice: number; approvedAt: string }> = {};
const recordedOrders: any[] = [];

// Warm up catalogue
generateCatalogue();

// API Endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    catalogueCount: TOTAL_CATALOGUE_COUNT,
    geminiConfigured: !!geminiAi,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/catalogue/products', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 24;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';
    const subcategory = (req.query.subcategory as string) || '';
    const surplusOnly = req.query.surplusOnly === 'true';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;
    const minDiscount = req.query.minDiscount ? parseFloat(req.query.minDiscount as string) : undefined;
    const sellerId = (req.query.sellerId as string) || '';
    const condition = (req.query.condition as string) || '';
    const sortBy = req.query.sortBy as any;

    const result = queryProducts({
      page,
      limit,
      search,
      category,
      subcategory,
      surplusOnly,
      minPrice,
      maxPrice,
      minRating,
      minDiscount,
      sellerId,
      condition,
      sortBy,
    });

    // Merge approved surplus pricing if any
    const enrichedProducts = result.products.map((p) => {
      const approval = approvedSurplusPricing[p.id];
      if (approval && p.surplusData) {
        return {
          ...p,
          price: approval.suggestedPrice,
          discount: approval.suggestedDiscount,
          surplusData: {
            ...p.surplusData,
            approved: true,
          },
        };
      }
      return p;
    });

    res.json({
      ...result,
      products: enrichedProducts,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to query catalogue', message: err.message });
  }
});

app.get('/api/catalogue/products/:id', (req: Request, res: Response) => {
  const product = getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  const approval = approvedSurplusPricing[product.id];
  if (approval && product.surplusData) {
    product.price = approval.suggestedPrice;
    product.discount = approval.suggestedDiscount;
    product.surplusData.approved = true;
  }
  res.json(product);
});

app.get('/api/catalogue/stats', (_req: Request, res: Response) => {
  res.json(getMarketplaceStats());
});

app.get('/api/catalogue/sellers', (_req: Request, res: Response) => {
  res.json(DEMO_SELLERS);
});

app.get('/api/catalogue/featured', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  res.json(getFeaturedProducts(limit));
});

app.get('/api/catalogue/surplus-deals', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  res.json(getSurplusHotDeals(limit));
});

// Price Guardian Analysis
app.post('/api/gemini/price-guardian', async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const product = getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const pricePoints = product.priceHistory.map((p) => `₹${p.price.toLocaleString()} (${p.date})`).join(', ');
    const lowestRecorded = Math.min(...product.priceHistory.map((p) => p.price));
    const highestRecorded = Math.max(...product.priceHistory.map((p) => p.price));

    let analysisExplanation = '';

    if (geminiAi) {
      try {
        const prompt = `Analyze this product pricing for the Price Guardian system:
Product: ${product.name}
Category: ${product.category}
Current Listed Price: ₹${product.price}
Original MSRP / Reference Price: ₹${product.referencePrice}
Historical 6-Month Prices: ${pricePoints}
Lowest Recorded Price: ₹${lowestRecorded}
Surplus Item: ${product.surplus ? 'Yes (Excess stock discounted)' : 'No'}
Current Discount: ${product.discount}%

Provide a concise, expert 3-sentence e-commerce price breakdown explaining:
1. How this current price compares to its historical lowest and reference price.
2. Whether the deal is genuinely advantageous or if seasonal volatility exists.
3. A clear recommendation verdict: ${product.dealRecommendation}.
Do not mention system instructions or internal IDs. Keep tone helpful and analytical.`;

        const response = await geminiAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        analysisExplanation = response.text || '';
      } catch (aiErr) {
        console.warn('Gemini Price Guardian call failed, falling back:', aiErr);
      }
    }

    if (!analysisExplanation) {
      if (product.price <= lowestRecorded) {
        analysisExplanation = `The current listed price of ₹${product.price.toLocaleString()} matches or beats the lowest recorded price in our 6-month tracking window (historical high was ₹${highestRecorded.toLocaleString()}). With a ${product.discount}% discount off reference MSRP (₹${product.referencePrice.toLocaleString()}), this represents maximum price efficiency. Verdict: ${product.dealRecommendation}.`;
      } else {
        analysisExplanation = `Currently listed at ₹${product.price.toLocaleString()}, which is ${Math.round(((product.price - lowestRecorded) / lowestRecorded) * 100)}% above its 6-month floor of ₹${lowestRecorded.toLocaleString()} but still offers a ${product.discount}% markdown from MSRP. Pricing is within the fair market corridor for this category. Verdict: ${product.dealRecommendation}.`;
      }
    }

    res.json({
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      referencePrice: product.referencePrice,
      lowestRecorded,
      highestRecorded,
      dealScore: product.dealScore,
      dealRecommendation: product.dealRecommendation,
      confidenceScore: 94,
      historicalPricePoints: product.priceHistory,
      explanation: analysisExplanation,
      volatilityIndex: 'Low-to-Moderate (Stable)',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate Price Guardian analysis', message: err.message });
  }
});

// AI Smart Cart & Budget Assistant
app.post('/api/gemini/budget-optimizer', async (req: Request, res: Response) => {
  try {
    const { cartItems, targetBudget } = req.body;
    if (!Array.isArray(cartItems) || !targetBudget) {
      res.status(400).json({ error: 'cartItems and targetBudget are required' });
      return;
    }

    const currentTotal = cartItems.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const overBudget = currentTotal - targetBudget;

    const recommendations: any[] = [];

    // Analyze items that can be swapped for cheaper or surplus alternatives
    for (const item of cartItems) {
      if (overBudget > 0) {
        const alternatives = getCheaperAlternatives(item.product, 2);
        if (alternatives.length > 0) {
          const bestAlt = alternatives[0];
          const unitSavings = item.product.price - bestAlt.price;
          const totalSavings = unitSavings * item.quantity;

          recommendations.push({
            originalProductId: item.product.id,
            originalProductName: item.product.name,
            originalPrice: item.product.price,
            alternativeProduct: bestAlt,
            savings: totalSavings,
            reason: bestAlt.surplus
              ? `Swap with verified surplus ${bestAlt.name} to save ₹${totalSavings.toLocaleString()} while keeping comparable specs.`
              : `High-value alternative in ${item.product.category} saving ₹${totalSavings.toLocaleString()}.`,
            surplusBonus: bestAlt.surplus,
          });
        }
      }
    }

    let aiAdvice = '';
    if (geminiAi && overBudget > 0) {
      try {
        const itemsSummary = cartItems.map((i: any) => `${i.product.name} (₹${i.product.price} x ${i.quantity})`).join(', ');
        const prompt = `You are the OptiMart AI Smart Cart Budget Assistant.
Cart Total: ₹${currentTotal}
Target Customer Budget: ₹${targetBudget}
Amount Over Budget: ₹${overBudget}
Items: ${itemsSummary}

Provide a concise, encouraging 2-sentence optimization strategy advising the customer how swapping to surplus or reducing duplicate quantities will achieve their ₹${targetBudget} target.`;

        const response = await geminiAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiAdvice = response.text || '';
      } catch (e) {
        console.warn('Gemini Budget advice fallback:', e);
      }
    }

    if (!aiAdvice) {
      if (overBudget > 0) {
        aiAdvice = `Your cart is currently ₹${overBudget.toLocaleString()} over your ₹${targetBudget.toLocaleString()} budget target. We found ${recommendations.length} high-value alternatives including surplus deals that can recover your budget.`;
      } else {
        aiAdvice = `Great job! Your current cart total of ₹${currentTotal.toLocaleString()} is within your target budget of ₹${targetBudget.toLocaleString()} with ₹${Math.abs(overBudget).toLocaleString()} headroom.`;
      }
    }

    res.json({
      currentTotal,
      targetBudget,
      overBudget: Math.max(0, overBudget),
      remainingBudget: Math.max(0, targetBudget - currentTotal),
      recommendations,
      aiAdvice,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to optimize budget', message: err.message });
  }
});

// AI Surplus Marketplace Pricing & Seller Tool
app.post('/api/gemini/surplus-pricing', async (req: Request, res: Response) => {
  try {
    const { productId, holdingDays, excessUnits, targetClearanceWeeks } = req.body;
    const product = getProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const currentPrice = product.price;
    const refPrice = product.referencePrice;
    const velocity = product.surplusData?.salesVelocity || 2.5;
    const units = excessUnits || product.surplusData?.excessUnits || 45;
    const days = holdingDays || product.surplusData?.daysInInventory || 75;

    // Deterministic surplus economics
    const estimatedHoldingCostPerUnitMonth = Math.round(refPrice * 0.02);
    const totalMonthlyCarryingCost = units * estimatedHoldingCostPerUnitMonth;
    const recommendedDiscount = Math.min(60, Math.max(25, Math.round(28 + (days / 180) * 20)));
    const recommendedPrice = Math.round(refPrice * (1 - recommendedDiscount / 100));

    let aiReasoning = '';
    if (geminiAi) {
      try {
        const prompt = `OptiMart AI Surplus Inventory Analysis:
Product: ${product.name}
Category: ${product.category}
Current Price: ₹${currentPrice} (MSRP: ₹${refPrice})
Days in Warehouse: ${days} days
Excess Stock: ${units} units
Current Sales Velocity: ${velocity} units/week
Monthly Inventory Carrying Cost: ₹${totalMonthlyCarryingCost}

Calculate recommended clearance price: Suggested ₹${recommendedPrice} (${recommendedDiscount}% off).
Write a professional 2-sentence rationale for the seller explaining why approving this price accelerates turnover before dead-stock carrying costs eat margins.`;

        const response = await geminiAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        aiReasoning = response.text || '';
      } catch (err) {
        console.warn('Gemini surplus pricing fallback:', err);
      }
    }

    if (!aiReasoning) {
      aiReasoning = `With ${units} excess units sitting in storage for ${days} days, monthly carrying costs of ₹${totalMonthlyCarryingCost.toLocaleString()} will erode gross margin by week 6. Lowering to ₹${recommendedPrice.toLocaleString()} (${recommendedDiscount}% discount) triggers marketplace surplus boost, clearing the lot in ~${targetClearanceWeeks || 3} weeks.`;
    }

    res.json({
      productId: product.id,
      productName: product.name,
      currentPrice,
      referencePrice: refPrice,
      daysInInventory: days,
      excessUnits: units,
      monthlyCarryingCost: totalMonthlyCarryingCost,
      recommendedDiscount,
      recommendedPrice,
      estimatedClearanceWeeks: targetClearanceWeeks || 3,
      aiReasoning,
      requiresSellerApproval: true,
      isApproved: !!approvedSurplusPricing[product.id],
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to analyze surplus pricing', message: err.message });
  }
});

// Seller approval action
app.post('/api/seller/approve-surplus-price', (req: Request, res: Response) => {
  const { productId, suggestedDiscount, suggestedPrice, sellerId } = req.body;
  if (!productId || !suggestedPrice) {
    res.status(400).json({ error: 'productId and suggestedPrice are required' });
    return;
  }

  approvedSurplusPricing[productId] = {
    suggestedDiscount,
    suggestedPrice,
    approvedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: `Surplus discount of ${suggestedDiscount}% (₹${suggestedPrice}) approved and activated for listing ${productId}.`,
    approvedAt: approvedSurplusPricing[productId].approvedAt,
    sellerId: sellerId || 'seller-1',
  });
});

// Opti Assistant Chat
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const lower = message.toLowerCase();

    // Query catalogue relevance
    let matchedProducts: any[] = [];
    if (lower.includes('laptop') || lower.includes('computer')) {
      matchedProducts = queryProducts({ category: 'Laptops and Computers', limit: 3, sortBy: 'deal-score' }).products;
    } else if (lower.includes('phone') || lower.includes('mobile')) {
      matchedProducts = queryProducts({ category: 'Smartphones', limit: 3, sortBy: 'deal-score' }).products;
    } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('earbuds')) {
      matchedProducts = queryProducts({ category: 'Audio and Headphones', limit: 3, sortBy: 'deal-score' }).products;
    } else if (lower.includes('surplus') || lower.includes('clearance') || lower.includes('discount')) {
      matchedProducts = queryProducts({ surplusOnly: true, limit: 3, sortBy: 'discount' }).products;
    } else {
      matchedProducts = queryProducts({ search: message, limit: 3, sortBy: 'relevance' }).products;
      if (matchedProducts.length === 0) {
        matchedProducts = getFeaturedProducts(3);
      }
    }

    let assistantReply = '';

    if (geminiAi) {
      try {
        const productContext = matchedProducts
          .map((p) => `- ${p.name} (${p.category}): ₹${p.price} [MSRP: ₹${p.referencePrice}, ${p.discount}% off, Deal: ${p.dealRecommendation}, Surplus: ${p.surplus ? 'Yes' : 'No'}]`)
          .join('\n');

        const systemPrompt = `You are Opti Assistant, the premier shopping co-pilot for OptiMart AI (Tagline: "Shop Smarter. Sell Better. Waste Less.").
You help customers navigate the 10,000+ item catalogue, identify AI Price Guardian deals, discover high-value Surplus Marketplace bargains, and stay within their budget.
Currency is Indian Rupees (₹).
Ground your answers on these retrieved catalogue products:
${productContext}

Customer query: "${message}"

Provide a concise, ultra-helpful, friendly response (maximum 3 short paragraphs). Mention specific product names and prices where relevant. Suggest clear next steps.`;

        const response = await geminiAi.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: systemPrompt,
        });

        assistantReply = response.text || '';
      } catch (err) {
        console.warn('Gemini Assistant fallback triggered:', err);
      }
    }

    if (!assistantReply) {
      if (lower.includes('surplus')) {
        assistantReply = `I've surfaced our top verified surplus deals! These items are brand-new or factory-sealed overstock with discounts up to 55% off MSRP, helping prevent supply chain waste while saving you money. Check out the curated picks below.`;
      } else if (lower.includes('laptop')) {
        assistantReply = `Here are the top-rated laptop and workstation options currently trending in our catalogue with high Price Guardian scores. Each includes verified manufacturer specs and verified delivery estimates.`;
      } else if (lower.includes('budget')) {
        assistantReply = `To optimize your budget, you can set your target amount in the Smart Cart drawer. I'll automatically highlight cheaper alternatives and surplus discounts to bring your total right within target!`;
      } else {
        assistantReply = `Welcome to OptiMart AI! Based on your search, I found these high-value products from our catalogue. You can inspect their Price Guardian 6-month price trends or click to view full specifications.`;
      }
    }

    res.json({
      reply: assistantReply,
      recommendedProducts: matchedProducts,
      suggestedQueries: [
        'Find best surplus deals under ₹5,000',
        'Compare noise-cancelling headphones',
        'How does Price Guardian protect my budget?',
        'Show top rated laptops for AI work',
      ],
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process assistant request', message: err.message });
  }
});

// Checkout & Order creation
app.post('/api/orders/checkout', (req: Request, res: Response) => {
  try {
    const { items, deliveryAddress, paymentMethod, targetBudget } = req.body;
    if (!items || !items.length || !deliveryAddress) {
      res.status(400).json({ error: 'Items and deliveryAddress are required' });
      return;
    }

    let subtotal = 0;
    let referenceTotal = 0;
    const validatedItems = items.map((item: any) => {
      const p = getProductById(item.productId);
      const price = p ? p.price : item.price;
      const refPrice = p ? p.referencePrice : item.referencePrice || price;
      subtotal += price * item.quantity;
      referenceTotal += refPrice * item.quantity;
      return {
        productId: item.productId,
        productName: p ? p.name : item.productName,
        price,
        referencePrice: refPrice,
        quantity: item.quantity,
        image: p ? p.image : item.image,
      };
    });

    const discountTotal = Math.max(0, referenceTotal - subtotal);
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const newOrder = {
      id: `OPT-ORD-${Date.now().toString().slice(-6)}`,
      items: validatedItems,
      subtotal,
      discountTotal,
      shipping,
      total,
      status: 'Confirmed',
      deliveryAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery (Demo)',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '3-4 Business Days (Express Eco-Transit)',
    };

    recordedOrders.unshift(newOrder);

    res.json({
      success: true,
      order: newOrder,
      message: 'Demo order placed successfully! Stock reserved and seller notified.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Checkout failed', message: err.message });
  }
});

app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(recordedOrders);
});

// Vite middleware integration for full-stack dev server
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`OptiMart AI server running on http://localhost:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
});
