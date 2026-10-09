import {
  Product,
  ProductCategory,
  ProductCondition,
  DealRecommendation,
  Seller,
  PriceHistoryPoint,
  SurplusMetrics,
} from '../types';
import { CATEGORY_IMAGE_BANK } from './imageBank';

export const TOTAL_CATALOGUE_COUNT = 10200;

export const DEMO_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    name: 'Nexus Retail Hub',
    tagline: 'Authorized Premium Consumer Tech & Smart Living',
    rating: 4.9,
    verified: true,
    specialty: 'Electronics, Smartphones & Smart Home',
    productCount: 2150,
    surplusCount: 430,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-2',
    name: 'EcoWarehouse Direct',
    tagline: 'Certified Surplus Clearance & Zero-Waste Inventory Partner',
    rating: 4.8,
    verified: true,
    specialty: 'Surplus Inventory, Electronics & Open-Box Tech',
    productCount: 2600,
    surplusCount: 1540,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-3',
    name: 'Apex Gear Co.',
    tagline: 'High-Performance Computing, Audio & Gaming Hardware',
    rating: 4.7,
    verified: true,
    specialty: 'Laptops, Gaming & Audio Gear',
    productCount: 1850,
    surplusCount: 380,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-4',
    name: 'Velox Living & Kitchen',
    tagline: 'Modern Kitchen Appliances, Coffee & Home Automation',
    rating: 4.9,
    verified: true,
    specialty: 'Home & Kitchen, Smart Appliances',
    productCount: 1400,
    surplusCount: 290,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-5',
    name: 'Terra Essentials & Organics',
    tagline: 'Artisan Grocery, Organic Superfoods & Clean Grooming',
    rating: 4.8,
    verified: true,
    specialty: 'Grocery, Daily Essentials & Personal Care',
    productCount: 1100,
    surplusCount: 240,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'seller-6',
    name: 'Urban Thread & Stride',
    tagline: 'Contemporary Apparel, Footwear & Travel Gear',
    rating: 4.6,
    verified: true,
    specialty: 'Fashion, Footwear & Travel Bags',
    productCount: 1100,
    surplusCount: 210,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  },
];

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Smartphones',
  'Laptops and Computers',
  'Audio and Headphones',
  'Fashion',
  'Footwear',
  'Home and Kitchen',
  'Home Appliances',
  'Beauty and Personal Care',
  'Grocery and Daily Essentials',
  'Sports and Fitness',
  'Books and Stationery',
  'Bags and Travel',
  'Gaming Accessories',
  'Smart Home Devices',
];

const BRANDS_BY_CATEGORY: Record<ProductCategory, string[]> = {
  'Electronics': ['AuraTech', 'Hyperion', 'Lumina', 'Zenith', 'Aeris', 'OmniVision'],
  'Smartphones': ['NexusPhone', 'Verve', 'Strata 5G', 'Orion', 'Pulse', 'Kroma'],
  'Laptops and Computers': ['Zenith Pro', 'Apex Workstation', 'VoltBook', 'Strata Compute', 'Hyperion', 'Caelum'],
  'Audio and Headphones': ['NovaSound', 'EchoCraft', 'Sona Acoustics', 'Zephyr Sound', 'AuraBeat', 'Prism Audio'],
  'Fashion': ['Urban Thread', 'Verve Studio', 'Terra Wear', 'Kroma Minimal', 'Aura Lifestyle', 'Peak Essentials'],
  'Footwear': ['Stride Dynamic', 'Velox Runner', 'AuraStep', 'Nimbus Trail', 'Peak Velocity', 'Terra Pace'],
  'Home and Kitchen': ['Velox Barista', 'Artisan Chef', 'Terra Craft', 'Lumina Culinary', 'AuraHome', 'EchoBrew'],
  'Home Appliances': ['Velox Pure', 'AuraClean', 'Aeris Climate', 'Hyperion Living', 'Zenith Vacuum', 'Terra Guard'],
  'Beauty and Personal Care': ['Lumina Glow', 'Terra Organics', 'AuraSonic', 'Verve Derma', 'EchoCare', 'Kroma Botanic'],
  'Grocery and Daily Essentials': ['Terra Harvest', 'Artisan Roast', 'Organic Peak', 'Verdant Fields', 'Solstice Brew', 'Pure Earth'],
  'Sports and Fitness': ['Peak Motion', 'Velox Active', 'AuraFit', 'Hyperion Endurance', 'Stride Track', 'Volt Power'],
  'Books and Stationery': ['EchoCraft Paper', 'Artisan Bound', 'Zenith Pens', 'Terra Journal', 'Kroma Folio', 'Solstice Press'],
  'Bags and Travel': ['Strata Luggage', 'Urban Rover', 'Apex Voyage', 'Terra Carry', 'Nimbus Pack', 'Verve Commute'],
  'Gaming Accessories': ['Apex Strike', 'Hyperion Mech', 'Nova Gaming', 'Volt Precision', 'Kroma RGB', 'Zenith Battle'],
  'Smart Home Devices': ['Lumina Connect', 'AuraNest', 'EchoGuard', 'Zenith Automation', 'Hyperion IoT', 'Aeris Sense'],
};

const CATEGORY_MODEL_NOUNS: Record<ProductCategory, string[]> = {
  'Electronics': ['Smartwatch Active', '4K Drone Quadcopter', 'Precision Gimbal', 'Curved Display 32"', 'Portable Power Hub 65W', 'VR Immersion Goggles'],
  'Smartphones': ['Flagship Ultra 5G', 'Pro Compact OLED', 'Max Flip 5G', 'Edge Lite Dual-SIM', 'Infinity AI Phone', 'Titanium 5G'],
  'Laptops and Computers': ['Ultrabook 14" Slim', 'Studio Creator 16"', 'Mini Desktop Core', 'Carbon Workstation', 'Thin & Light AI Edition', 'All-In-One 27"'],
  'Audio and Headphones': ['ANC Over-Ear Studio', 'True Wireless Earbuds Pro', 'Dolby Atmos Soundbar', 'Hi-Res Bluetooth Speaker', 'Monitor Earphones', 'Open-Ear Sport Pods'],
  'Fashion': ['Thermal Waterproof Parka', 'Merino Wool Minimal Sweater', 'All-Weather Commuter Trench', 'Organic Cotton Oversized Tee', 'Japanese Denim Slim Fit', 'Tailored Casual Blazer'],
  'Footwear': ['Carbon Plate Marathon Shoe', 'Minimalist Knit Sneaker', 'Rugged Waterproof Trail Boot', 'City Slip-On Loafer', 'Zero-Drop Training Runner', 'Cloud Cushion Daily Walker'],
  'Home and Kitchen': ['Barista Espresso Touch', 'Digital Air Fryer Pro 6L', 'Enameled Dutch Oven 5.5 Qt', 'Damascus Knife 8" Chef Set', 'High-Speed Vacuum Blender', 'Precision Induction Cooktop'],
  'Home Appliances': ['LiDAR Robot Vacuum & Mop', 'HEPA 14 Air Purifier Tower', 'Smart Hybrid Dehumidifier', 'Handheld Garment Steamer Pro', 'Whisper Quiet Bladeless Fan', 'Smart Ultrasonic Humidifier'],
  'Beauty and Personal Care': ['Sonic Toothbrush 40k VPM', 'Ceramic Hair Dryer Pro', 'Microcurrent Facial Sculptor', 'Organic Cold-Pressed Face Oil', 'Cordless Beard Trimmer Kit', 'Mineral SPF50 Defense Serum'],
  'Grocery and Daily Essentials': ['Single Origin Specialty Coffee 500g', 'Cold-Pressed Extra Virgin Olive Oil 1L', 'Raw Forest Blossom Honey 450g', 'Superfood Matcha Powder 100g', 'Ancient Grains Granola 750g', 'Organic Dark Cocoa Nibs 250g'],
  'Sports and Fitness': ['Smart Adjustable Dumbbell 24kg', 'High-Density Non-Slip Yoga Mat', 'GPS Multi-Sport Watch Pro', 'Deep Tissue Percussion Gun', 'Hydration Pack & Tactical Vest', 'Smart Resistance Band Set'],
  'Books and Stationery': ['Leatherbound Grid Notebook 240p', 'Titanium Fountain Pen Fine Nib', 'Architecture & Design Hardcover', 'Brass Drafting Ruler & Pencil', 'Archival Linen Sketchbook', 'Minimalist Desk Planner Pad'],
  'Bags and Travel': ['Polycarbonate Expandable Carry-On', 'Water-Resistant Tech Backpack 26L', 'Everyday Sling Bag 6L', 'Rugged Duffel Weekender 45L', 'Cordura Organizer Pouch Pro', 'Anti-Theft Commuter Briefcase'],
  'Gaming Accessories': ['Hot-Swappable 75% Mechanical Keyboard', 'Ultra-Lightweight 8K Gaming Mouse', 'Studio Condenser USB Microphone', 'RGB Aluminum Headset Stand', 'Stream Control Macro Deck', 'Magnetic Levitation Gamepad'],
  'Smart Home Devices': ['4K HDR Video Doorbell AI', 'Mesh WiFi 6 Smart Hub', 'Matter-Enabled RGBIC Lightstrip 5m', 'Smart Thermostat with Room Sensor', 'Automated Roller Blind Driver', 'Smart Water Leak Detector 3-Pack'],
};

const TIERS = ['SE', 'Pro', 'Ultra', 'Elite', 'Prime', 'Genesis', 'Plus', 'Air', 'Max', 'V2'];

// Deterministic PRNG (Mulberry32) for stable repeatable generation
function createPRNG(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let cachedCatalogue: Product[] | null = null;

export function generateCatalogue(): Product[] {
  if (cachedCatalogue && cachedCatalogue.length === TOTAL_CATALOGUE_COUNT) {
    return cachedCatalogue;
  }

  const prng = createPRNG(133742);
  const products: Product[] = new Array(TOTAL_CATALOGUE_COUNT);

  for (let i = 0; i < TOTAL_CATALOGUE_COUNT; i++) {
    const id = `OPT-${10001 + i}`;
    const categoryIndex = i % CATEGORIES.length;
    const category = CATEGORIES[categoryIndex];

    const brands = BRANDS_BY_CATEGORY[category];
    const brand = brands[Math.floor(prng() * brands.length)];

    const nouns = CATEGORY_MODEL_NOUNS[category];
    const nounIndex = Math.floor(prng() * nouns.length);
    const noun = nouns[nounIndex];
    const tier = TIERS[Math.floor(prng() * TIERS.length)];
    const modelNum = Math.floor(100 + prng() * 900);

    const name = `${brand} ${noun} ${tier}-${modelNum}`;

    // Category images from image bank
    const imageMapping = CATEGORY_IMAGE_BANK[category];
    const subcategoryObj = imageMapping.subcategories[nounIndex % imageMapping.subcategories.length];
    const subcategory = subcategoryObj.name;
    const availableImages = subcategoryObj.images.length > 0 ? subcategoryObj.images : imageMapping.defaultImages;
    const mainImageIndex = Math.floor(prng() * availableImages.length);
    const mainImage = availableImages[mainImageIndex];
    const secondaryImage = availableImages[(mainImageIndex + 1) % availableImages.length];
    const tertiaryImage = availableImages[(mainImageIndex + 2) % availableImages.length];
    const images = [mainImage, secondaryImage, tertiaryImage];

    // Price calculation in INR (₹)
    let baseReferencePrice = 0;
    switch (category) {
      case 'Laptops and Computers':
        baseReferencePrice = Math.floor(35000 + prng() * 115000);
        break;
      case 'Smartphones':
        baseReferencePrice = Math.floor(12000 + prng() * 75000);
        break;
      case 'Electronics':
      case 'Home Appliances':
        baseReferencePrice = Math.floor(4000 + prng() * 32000);
        break;
      case 'Audio and Headphones':
      case 'Gaming Accessories':
      case 'Home and Kitchen':
      case 'Bags and Travel':
      case 'Smart Home Devices':
        baseReferencePrice = Math.floor(1500 + prng() * 16000);
        break;
      case 'Footwear':
      case 'Fashion':
      case 'Sports and Fitness':
        baseReferencePrice = Math.floor(1200 + prng() * 8500);
        break;
      case 'Beauty and Personal Care':
      case 'Grocery and Daily Essentials':
      case 'Books and Stationery':
        baseReferencePrice = Math.floor(450 + prng() * 3500);
        break;
      default:
        baseReferencePrice = Math.floor(1000 + prng() * 10000);
    }

    // Surplus distribution (~24% of catalogue)
    const isSurplus = prng() < 0.24;
    let discountPct = 0;
    let condition: ProductCondition = 'Brand New';

    let surplusData: SurplusMetrics | undefined = undefined;

    if (isSurplus) {
      const riskRand = prng();
      const riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' =
        riskRand > 0.65 ? 'HIGH' : riskRand > 0.3 ? 'MEDIUM' : 'LOW';

      // Surplus gets steep discount
      discountPct = riskLevel === 'HIGH' ? Math.floor(38 + prng() * 22) : riskLevel === 'MEDIUM' ? Math.floor(25 + prng() * 15) : Math.floor(18 + prng() * 10);
      condition = prng() > 0.5 ? 'Factory Sealed Surplus' : 'Surplus Open-Box';

      const excessUnits = Math.floor(15 + prng() * 180);
      const daysInInventory = Math.floor(45 + prng() * 140);
      const salesVelocity = Number((0.5 + prng() * 3.5).toFixed(1));
      const suggestedDiscount = discountPct + Math.floor(prng() * 5);
      const suggestedPrice = Math.round(baseReferencePrice * (1 - suggestedDiscount / 100));

      surplusData = {
        riskLevel,
        excessUnits,
        daysInInventory,
        salesVelocity,
        suggestedDiscount,
        suggestedPrice,
        approved: prng() > 0.3, // some approved, some awaiting seller approval
        clearanceScenario:
          riskLevel === 'HIGH'
            ? 'Holding beyond 60 days will incur carrying costs of ₹' + (Math.round(excessUnits * 85)) + '/mo. Fast liquidation recommended.'
            : 'Moderate inventory turnover gap. Targeted marketplace promotion will clear backlog in ~3.2 weeks.',
        carryingCostMonthly: Math.round(excessUnits * (baseReferencePrice * 0.015)),
      };
    } else {
      // Normal discount between 5% and 25%
      discountPct = Math.floor(5 + prng() * 20);
      condition = prng() > 0.9 ? 'Refurbished Certified' : 'Brand New';
    }

    const price = Math.round(baseReferencePrice * (1 - discountPct / 100));
    const referencePrice = baseReferencePrice;
    const stock = isSurplus ? (surplusData?.excessUnits ?? 25) : Math.floor(5 + prng() * 85);
    const availability = stock > 10 ? 'IN_STOCK' : stock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK';

    // Seller allocation: EcoWarehouse has more surplus
    let seller: Seller;
    if (isSurplus && prng() > 0.4) {
      seller = DEMO_SELLERS[1]; // EcoWarehouse Direct
    } else {
      seller = DEMO_SELLERS[Math.floor(prng() * DEMO_SELLERS.length)];
    }

    const rating = Number((3.8 + prng() * 1.2).toFixed(1));
    const reviewCount = Math.floor(15 + prng() * 1250);

    // Specifications map
    const specs: Record<string, string> = {
      'Manufacturer': brand,
      'Series': `${tier} Edition`,
      'Model Year': '2025/2026',
      'Inventory Batch': `BAT-${202600 + (i % 500)}`,
      'Eco-Certification': isSurplus ? 'Zero-Waste Verified Surplus' : 'RoHS / Energy Star Compliant',
    };

    if (category.includes('Computers') || category.includes('Smartphones')) {
      specs['Processor'] = `${brand} Neural Octa-Core AI Engine`;
      specs['Memory/Storage'] = `${8 * (1 + (i % 4))}GB Unified RAM / ${128 * (1 + (i % 4))}GB NVMe`;
    } else if (category.includes('Audio')) {
      specs['Acoustic Drivers'] = `${40 + (i % 10)}mm Neodymium Dual Chamber`;
      specs['Battery Life'] = `${24 + (i % 30)} Hours Active Playback`;
      specs['Noise Cancellation'] = 'Hybrid ANC -38dB Active Reduction';
    }

    // Historical price tracking (6 months)
    const priceHistory: PriceHistoryPoint[] = [];
    const months = ['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
    for (let m = 0; m < 5; m++) {
      const histVariation = (prng() - 0.5) * 0.15;
      const histPrice = Math.round(referencePrice * (1 - (discountPct * 0.4) / 100 + histVariation));
      priceHistory.push({
        date: months[m],
        price: Math.max(price, histPrice),
        event: m === 2 ? 'Sale' : 'Normal',
      });
    }
    priceHistory.push({
      date: 'Oct 2026 (Now)',
      price: price,
      event: isSurplus ? 'Surplus Clearance' : 'Current',
    });

    // Deal score & recommendation
    const lowestRecorded = Math.min(...priceHistory.map((p) => p.price));
    let dealScore = 50;
    if (price <= lowestRecorded) {
      dealScore = Math.min(100, Math.floor(82 + (discountPct / 60) * 18));
    } else if (discountPct >= 25) {
      dealScore = Math.floor(70 + (discountPct / 50) * 20);
    } else {
      dealScore = Math.floor(45 + discountPct);
    }

    let dealRecommendation: DealRecommendation = 'FAIR PRICE';
    if (dealScore >= 78) {
      dealRecommendation = 'GOOD DEAL';
    } else if (dealScore >= 60) {
      dealRecommendation = 'FAIR PRICE';
    } else if (dealScore >= 45) {
      dealRecommendation = 'CONSIDER WAITING';
    } else {
      dealRecommendation = 'COMPARE ALTERNATIVES';
    }

    const description = `The ${name} delivers precision engineering, reliable performance, and exceptional craft in ${category}. Tested and verified by ${seller.name}. Condition: ${condition}. ${isSurplus ? 'Offered via OptiMart Surplus Clearance to prevent supply-chain landfill waste while passing deep savings directly to smart shoppers.' : 'Standard retail availability with factory warranty.'}`;

    products[i] = {
      id,
      name,
      brand,
      category,
      subcategory,
      description,
      image: mainImage,
      images,
      price,
      referencePrice,
      discount: discountPct,
      stock,
      sellerId: seller.id,
      sellerName: seller.name,
      rating,
      reviewCount,
      specs,
      condition,
      deliveryEstimate: prng() > 0.4 ? '2-3 Business Days (Express)' : '4-5 Business Days',
      returnPolicy: '7-Day Hassle-Free Replacement or Refund',
      warranty: isSurplus ? '6-Month OptiMart Verified Warranty' : '1-Year Official Manufacturer Warranty',
      surplus: isSurplus,
      surplusData,
      priceHistory,
      dealScore,
      dealRecommendation,
      availability,
      createdAt: '2026-08-12T10:00:00Z',
      updatedAt: '2026-10-08T18:00:00Z',
    };
  }

  cachedCatalogue = products;
  return products;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  surplusOnly?: boolean;
  minRating?: number;
  minDiscount?: number;
  sellerId?: string;
  condition?: string;
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'discount' | 'rating' | 'deal-score';
}

export interface PaginatedProductResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalCatalogueCount: number;
  appliedFiltersCount: number;
}

export function queryProducts(params: ProductQueryParams = {}): PaginatedProductResult {
  const catalogue = generateCatalogue();
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 24));

  let filtered = catalogue;
  let appliedFiltersCount = 0;

  if (params.search && params.search.trim().length > 0) {
    appliedFiltersCount++;
    const term = params.search.trim().toLowerCase();
    const tokens = term.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((p) => {
      const target = `${p.name} ${p.brand} ${p.category} ${p.subcategory} ${p.description}`.toLowerCase();
      return tokens.every((tok) => target.includes(tok));
    });
  }

  if (params.category && params.category !== 'All') {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.subcategory && params.subcategory !== 'All') {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.subcategory === params.subcategory);
  }

  if (params.surplusOnly) {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.surplus);
  }

  if (params.minPrice !== undefined && params.minPrice > 0) {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined && params.maxPrice < 200000) {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (params.minRating !== undefined && params.minRating > 0) {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.rating >= params.minRating!);
  }

  if (params.minDiscount !== undefined && params.minDiscount > 0) {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.discount >= params.minDiscount!);
  }

  if (params.sellerId && params.sellerId !== 'All') {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.sellerId === params.sellerId);
  }

  if (params.condition && params.condition !== 'All') {
    appliedFiltersCount++;
    filtered = filtered.filter((p) => p.condition === params.condition);
  }

  // Sorting
  const sortBy = params.sortBy || 'relevance';
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => b.discount - a.discount);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'deal-score') {
    filtered.sort((a, b) => b.dealScore - a.dealScore);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages,
    totalCatalogueCount: TOTAL_CATALOGUE_COUNT,
    appliedFiltersCount,
  };
}

export function getProductById(id: string): Product | null {
  const catalogue = generateCatalogue();
  return catalogue.find((p) => p.id === id) || null;
}

export function getFeaturedProducts(limit = 8): Product[] {
  const catalogue = generateCatalogue();
  return catalogue
    .filter((p) => p.dealScore >= 80 && p.rating >= 4.5)
    .slice(0, limit);
}

export function getSurplusHotDeals(limit = 8): Product[] {
  const catalogue = generateCatalogue();
  return catalogue
    .filter((p) => p.surplus && p.discount >= 35)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  const catalogue = generateCatalogue();
  return catalogue
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getCheaperAlternatives(product: Product, limit = 4): Product[] {
  const catalogue = generateCatalogue();
  return catalogue
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.price < product.price &&
        p.rating >= 4.0
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

export function getMarketplaceStats() {
  const catalogue = generateCatalogue();
  const surplusItems = catalogue.filter((p) => p.surplus);
  const totalSurplusUnits = surplusItems.reduce((acc, p) => acc + (p.surplusData?.excessUnits || 0), 0);
  const totalValueAtRisk = surplusItems.reduce(
    (acc, p) => acc + (p.price * (p.surplusData?.excessUnits || 0)),
    0
  );

  return {
    totalCatalogueCount: TOTAL_CATALOGUE_COUNT,
    categoriesCount: CATEGORIES.length,
    sellersCount: DEMO_SELLERS.length,
    activeSurplusListings: surplusItems.length,
    totalSurplusUnits,
    totalValueAtRisk,
    co2KgSavedEstimate: Math.round(totalSurplusUnits * 14.8),
  };
}
