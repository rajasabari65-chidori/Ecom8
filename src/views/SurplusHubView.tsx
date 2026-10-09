import React, { useEffect, useState } from 'react';
import {
  Percent,
  Sparkles,
  Leaf,
  ShieldCheck,
  TrendingDown,
  Info,
  PackageCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchProducts, fetchMarketplaceStats } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const SurplusHubView: React.FC = () => {
  const { setView } = useApp();
  const [surplusProducts, setSurplusProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedMinDiscount, setSelectedMinDiscount] = useState<number>(30);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      surplusOnly: true,
      minDiscount: selectedMinDiscount,
      limit: 24,
      sortBy: 'discount',
    })
      .then((res) => {
        setSurplusProducts(res.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchMarketplaceStats().then(setStats).catch(console.error);
  }, [selectedMinDiscount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-cyan-950/60 border border-amber-500/30 relative overflow-hidden space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Percent className="w-3.5 h-3.5" />
            <span>AI Smart Surplus Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Rescue Verified Surplus Stock. Save Up to 55%.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Authorized manufacturers and sellers liquidate brand-new, factory-sealed excess stock before carrying costs pile up.
            Every purchase prevents supply chain waste and unlocks direct clearance savings.
          </p>
        </div>

        {/* Real-time Environmental & Economic Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {stats ? stats.activeSurplusListings.toLocaleString() : '2,400+'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Active Surplus Listings</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {stats ? stats.totalSurplusUnits.toLocaleString() : '52,000+'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Units Available to Rescue</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-cyan-400">
              {stats ? `${stats.co2KgSavedEstimate.toLocaleString()} kg` : '38,000+ kg'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Est. Avoided Landfill CO2</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-white">
              100%
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Seller-Approved Discounts</p>
          </div>
        </div>
      </div>

      {/* Discount Tiers Segmented Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Curated Surplus Drops</h2>
          <p className="text-xs text-slate-400">
            Filtered by verified clearance percentage off original MSRP.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          {[
            { label: '30%+ Off', value: 30 },
            { label: '40%+ Off', value: 40 },
            { label: '50%+ Deep Clearance', value: 50 },
          ].map((tier) => (
            <button
              key={tier.value}
              onClick={() => setSelectedMinDiscount(tier.value)}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                selectedMinDiscount === tier.value
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : surplusProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-white">No surplus items match {selectedMinDiscount}%+ right now</p>
          <button
            onClick={() => setSelectedMinDiscount(30)}
            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
          >
            Show All Surplus Deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {surplusProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Informational Zero-Waste Guarantee */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
        <div className="flex items-center gap-3">
          <PackageCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-white text-sm">Verified Product Authenticity & OptiMart Warranty</h4>
            <p className="text-slate-400 mt-0.5">
              All surplus items are thoroughly checked by authorized partners. Each purchase includes a 6-month warranty and standard 7-day replacement guarantee.
            </p>
          </div>
        </div>
        <button
          onClick={() => setView('marketplace')}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold shrink-0"
        >
          Explore Regular Catalogue
        </button>
      </div>
    </div>
  );
};
