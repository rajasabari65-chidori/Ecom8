import React from 'react';
import { ShieldCheck, Heart, Scale, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    openPriceGuardian,
  } = useApp();

  const isFavorited = isInWishlist(product.id);

  // Price Guardian deal color mapping
  const getDealColor = (rec: string) => {
    switch (rec) {
      case 'GOOD DEAL':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
      case 'FAIR PRICE':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
      case 'CONSIDER WAITING':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900';
    }
  };

  return (
    <div className="group relative bg-slate-900/60 rounded-2xl border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg shadow-black/20 hover:shadow-cyan-500/10 hover:-translate-y-1">
      {/* Top Media Container */}
      <div
        className="relative cursor-pointer overflow-hidden p-2.5 pb-0"
        onClick={() => openProductDetail(product.id)}
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          aspectRatio="square"
          className="rounded-xl"
        />

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition-all shadow-md"
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-rose-500' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md"
            title="Compare Specs"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Surplus Clearance Tag */}
        {product.surplus && (
          <div className="absolute bottom-2 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 font-bold text-[11px] shadow-lg backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            <span>Surplus · {product.discount}% OFF</span>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Typographic Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-slate-300">{product.brand}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{product.condition}</span>
          </div>

          {/* Product Name Title */}
          <h3
            onClick={() => openProductDetail(product.id)}
            className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price Guardian deal recommendation & score */}
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPriceGuardian(product.id);
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-transform hover:scale-102 ${getDealColor(
                product.dealRecommendation
              )}`}
              title="Click to view 6-month historical price analysis"
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{product.dealRecommendation}</span>
              <span className="font-mono text-[10px] opacity-75">({product.dealScore}/100)</span>
            </button>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs text-amber-300">
              <span>★ {product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white">
                ₹{product.price.toLocaleString()}
              </span>
              {product.referencePrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.referencePrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">
              Save ₹{(product.referencePrice - product.price).toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
