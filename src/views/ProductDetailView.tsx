import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Heart,
  Scale,
  ShoppingCart,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Store,
  ChevronRight,
  TrendingDown,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchProductById } from '../services/api';
import { getSimilarProducts, getCheaperAlternatives } from '../data/catalogueGenerator';
import { Product } from '../types';
import { ProductImage } from '../components/ProductImage';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    setView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    openPriceGuardian,
    setIsCheckoutOpen,
    showToast,
  } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [cheaperAlternatives, setCheaperAlternatives] = useState<Product[]>([]);

  useEffect(() => {
    if (!selectedProductId) return;

    fetchProductById(selectedProductId)
      .then((p) => {
        if (p) {
          setProduct(p);
          setSelectedImageIndex(0);
          setSimilarProducts(getSimilarProducts(p, 4));
          setCheaperAlternatives(getCheaperAlternatives(p, 4));
        }
      })
      .catch(console.error);
  }, [selectedProductId]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Product not found</h2>
        <button
          onClick={() => setView('marketplace')}
          className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const availableImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = availableImages[selectedImageIndex] || product.image;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <button
          onClick={() => setView('marketplace')}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </button>
        <span aria-hidden="true" className="text-slate-600">/</span>
        <span>{product.category}</span>
        <span aria-hidden="true" className="text-slate-600">/</span>
        <span className="text-slate-300 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            <ProductImage
              src={activeImage}
              alt={product.name}
              category={product.category}
              aspectRatio="square"
              className="rounded-3xl"
              zoomOnHover={false}
            />

            {product.surplus && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Surplus · {product.discount}% OFF</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {availableImages.length > 1 && (
            <div className="flex items-center gap-3">
              {availableImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                      : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Buy Actions & Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Metadata (Zero-pill discipline) */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">{product.brand}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-cyan-400">{product.condition}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center text-amber-400 font-bold">
                <span>★ {product.rating.toFixed(1)}</span>
                <span className="text-slate-500 ml-1 font-normal">({product.reviewCount} customer ratings)</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-medium">Verified Batch #{product.id}</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.referencePrice > product.price && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{product.referencePrice.toLocaleString()}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Save ₹{(product.referencePrice - product.price).toLocaleString()} ({product.discount}% OFF)
              </span>
            </div>

            {/* Price Guardian Embedded Widget */}
            <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Price Guardian: {product.dealRecommendation}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      {product.dealScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Analyzed against 180-day historical catalogue data
                  </p>
                </div>
              </div>
              <button
                onClick={() => openPriceGuardian(product.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-semibold shrink-0"
              >
                Inspect Price Chart
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-sm">Product Overview</h4>
            <p>{product.description}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Quantity:</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-xs focus:outline-none focus:border-cyan-500"
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Stock: <strong className="text-emerald-400">{product.stock} units available</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 transition-all active:scale-98"
              >
                <span>Buy Now (Instant Demo)</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 transition-colors"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Compare"
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery & Warranty Information Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Express Transit</span>
                <span className="text-[11px] text-slate-400">{product.deliveryEstimate}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-violet-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">Easy Returns</span>
                <span className="text-[11px] text-slate-400">{product.returnPolicy}</span>
              </div>
            </div>
          </div>

          {/* Verified Seller Box */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-cyan-400" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">{product.sellerName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-[11px] text-slate-400">Authorized Marketplace Merchant</span>
              </div>
            </div>
            <button
              onClick={() => setView('marketplace')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Merchant Store
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <section className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-lg font-bold text-white">Technical Specifications</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl text-xs">
          {Object.entries(product.specs).map(([k, v]) => (
            <div
              key={k}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex justify-between"
            >
              <span className="text-slate-400 font-medium">{k}</span>
              <span className="text-white font-semibold">{v}</span>
            </div>
          ))}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex justify-between">
            <span className="text-slate-400 font-medium">Warranty</span>
            <span className="text-white font-semibold">{product.warranty}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex justify-between">
            <span className="text-slate-400 font-medium">Inventory Condition</span>
            <span className="text-white font-semibold">{product.condition}</span>
          </div>
        </div>
      </section>

      {/* Cheaper Alternatives Section */}
      {cheaperAlternatives.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Budget-Friendly Alternatives</h3>
          </div>
          <p className="text-xs text-slate-400">
            Comparable items in {product.category} with lower prices and verified quality ratings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {cheaperAlternatives.map((alt) => (
              <ProductCard key={alt.id} product={alt} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white">Similar Products in {product.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {similarProducts.map((sim) => (
              <ProductCard key={sim.id} product={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
