import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Percent,
  Wallet,
  ArrowRight,
  TrendingDown,
  Leaf,
  Store,
  ChevronRight,
  CheckCircle2,
  Package,
  Layers,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Hero3D } from '../components/Hero3D';
import { ProductCard } from '../components/ProductCard';
import { fetchFeaturedProducts, fetchSurplusDeals, fetchMarketplaceStats } from '../services/api';
import { Product } from '../types';

export const HomeView: React.FC = () => {
  const {
    setView,
    setMarketplaceCategoryFilter,
    setMarketplaceSearchQuery,
    setIsAssistantOpen,
  } = useApp();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [surplusDeals, setSurplusDeals] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchFeaturedProducts(4).then(setFeaturedProducts).catch(console.error);
    fetchSurplusDeals(4).then(setSurplusDeals).catch(console.error);
    fetchMarketplaceStats().then(setStats).catch(console.error);
  }, []);

  const categoriesList = [
    { name: 'Laptops and Computers', icon: '💻', count: '1,420+ items' },
    { name: 'Smartphones', icon: '📱', count: '1,280+ items' },
    { name: 'Audio and Headphones', icon: '🎧', count: '980+ items' },
    { name: 'Electronics', icon: '⚡', count: '1,150+ items' },
    { name: 'Home and Kitchen', icon: '☕', count: '890+ items' },
    { name: 'Fashion', icon: '👔', count: '760+ items' },
    { name: 'Gaming Accessories', icon: '🎮', count: '650+ items' },
    { name: 'Smart Home Devices', icon: '🏠', count: '540+ items' },
  ];

  const faqs = [
    {
      q: 'How does the AI Smart Surplus Marketplace prevent waste?',
      a: 'Retailers accumulate excess factory-sealed inventory that incurs mounting carrying costs. Our AI detects slow-moving inventory velocity and recommends optimal discount prices. Once approved by sellers, these items are surfaced to buyers at steep discounts, preventing landfill disposal and saving up to 55% off MSRP.',
    },
    {
      q: 'What makes the AI Price Guardian different from typical price trackers?',
      a: 'Price Guardian audits 180 days of actual catalogue history to compute an objective 0–100 Deal Score. It compares the current listing against category floors, historical volatility, and manufacturer MSRP, providing transparent recommendations like GOOD DEAL or CONSIDER WAITING.',
    },
    {
      q: 'How does the Smart Cart & Budget Assistant optimize my cart?',
      a: 'When your cart exceeds your target budget, the assistant analyzes your items and scans 10,200+ catalogue listings to find equivalent cheaper alternatives or surplus discounts. It gives you a clear diff and lets you approve swaps one by one.',
    },
    {
      q: 'Are the products in the catalogue real?',
      a: 'OptiMart AI features a robust demonstration catalogue of over 10,200 reproducible product records across 15 categories, complete with realistic pricing, high-resolution photography, and independent seller associations.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section with 3D Holographic Artifact */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden pt-8 lg:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Indicator Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next-Generation AI E-Commerce · 10,200+ Products</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Intelligence That Makes Every Purchase{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Smarter.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Discover better deals, understand product prices, optimize your budget, and help
              businesses manage surplus inventory with AI.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setMarketplaceCategoryFilter('All');
                  setMarketplaceSearchQuery('');
                  setView('marketplace');
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-102 active:scale-98"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setView('surplus-hub')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-white font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Percent className="w-4 h-4 text-amber-400" />
                <span>Shop Surplus Deals</span>
              </button>

              <button
                onClick={() => setIsAssistantOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 font-medium text-sm flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try AI Assistant</span>
              </button>
            </div>

            {/* Micro Stats Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <span className="text-2xl font-black text-white">10,200+</span>
                <p className="text-xs text-slate-400 mt-0.5">Catalogue Records</p>
              </div>
              <div>
                <span className="text-2xl font-black text-cyan-400">Up to 55%</span>
                <p className="text-xs text-slate-400 mt-0.5">Surplus Savings</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-400">35,000+ kg</span>
                <p className="text-xs text-slate-400 mt-0.5">Est. CO2 Avoided</p>
              </div>
            </div>
          </div>

          {/* Right Column: Three.js Interactive 3D Showcase */}
          <div className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[480px] w-full relative flex items-center justify-center">
            <Hero3D />
          </div>
        </div>
      </section>

      {/* 2. The Three Connected Innovations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Core Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Three Innovations. One Unified Platform.
          </h2>
          <p className="text-sm text-slate-400">
            OptiMart AI links surplus liquidation, historical price transparency, and algorithmic budget management into a single seamless shopping workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div
            onClick={() => setView('surplus-hub')}
            className="group p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-amber-500/50 transition-all duration-300 space-y-4 cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              AI Smart Surplus Marketplace
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects excess inventory velocity gaps and recommends seller-approved discounts up to 55%. Buyers get brand-new factory-sealed overstock while preventing warehouse landfill waste.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-amber-400 gap-1">
              <span>Explore Surplus Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div
            onClick={() => {
              setMarketplaceCategoryFilter('All');
              setView('marketplace');
            }}
            className="group p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 space-y-4 cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              AI Price Guardian
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes 180-day price curves and category medians to assign a 0–100 Deal Score. Instantly identifies whether an item is a true GOOD DEAL or if you should consider waiting.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-cyan-400 gap-1">
              <span>View Price Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div
            onClick={() => setView('marketplace')}
            className="group p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-violet-500/50 transition-all duration-300 space-y-4 cursor-pointer hover:-translate-y-1 shadow-lg shadow-black/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
              Smart Cart & Budget Assistant
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set any shopping budget in Indian Rupees (₹). If your cart exceeds your target, our AI analyzes comparable items across 10,200+ listings to recommend money-saving swaps.
            </p>
            <div className="pt-2 flex items-center text-xs font-semibold text-violet-400 gap-1">
              <span>Test Budget Tools</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products with High Deal Scores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Top Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              High Deal Score Selections
            </h2>
          </div>
          <button
            onClick={() => {
              setMarketplaceCategoryFilter('All');
              setView('marketplace');
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All 10,200+ Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Best Surplus Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border border-amber-500/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Percent className="w-4 h-4" />
                <span>Zero-Waste Clearance Drops</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Verified Surplus Inventory
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Brand-new and factory-sealed overstock sold directly by authorized sellers at clearance prices.
              </p>
            </div>
            <button
              onClick={() => setView('surplus-hub')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              Browse All Surplus Deals
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {surplusDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trending Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore By Category
          </h2>
          <p className="text-xs text-slate-400">
            15 distinct product departments loaded with verified specifications and real images.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoriesList.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMarketplaceCategoryFilter(cat.name);
                setView('marketplace');
              }}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-left transition-all group flex flex-col justify-between h-28"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 6. Environmental Sustainability Impact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Circular Commerce Initiative</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Preventing Landfill Waste Through Algorithmic Pricing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every year, millions of unsold consumer electronics and appliances are written off or destroyed.
              OptiMart AI matches surplus stock with willing buyers at fair discount prices, accelerating inventory velocity and keeping usable goods in circulation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-400">
                {stats ? stats.totalSurplusUnits.toLocaleString() : '2,400+'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Units Rescued</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <span className="text-2xl font-black text-cyan-400">
                {stats ? `${stats.co2KgSavedEstimate.toLocaleString()} kg` : '35,000+ kg'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">CO2 Emissions Avoided</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Clear answers regarding platform technology and data integrity.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-cyan-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-slate-800/80 pt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">OptiMart AI</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Shop Smarter. Sell Better. Waste Less. Next-generation e-commerce powered by deterministic surplus models and Gemini 3.8 Flash intelligence.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">Marketplace</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => setView('marketplace')} className="hover:text-cyan-400">
                  Full 10,200+ Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => setView('surplus-hub')} className="hover:text-cyan-400">
                  Surplus Clearance Hub
                </button>
              </li>
              <li>
                <button onClick={() => setView('seller-portal')} className="hover:text-cyan-400">
                  Seller Dashboard & Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">AI Innovations</h5>
            <ul className="space-y-2 text-[11px]">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer" onClick={() => setIsAssistantOpen(true)}>
                  Opti Assistant Co-pilot
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400">AI Price Guardian (180-Day Audit)</span>
              </li>
              <li>
                <span className="hover:text-cyan-400">Smart Cart Budget Assistant</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white mb-3 text-xs">Demonstration Notice</h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              OptiMart AI is seeded with a deterministic 10,200+ demonstration product catalogue for testing and evaluation. All currencies in Indian Rupees (₹).
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600">
          <span>© 2026 OptiMart AI. All rights reserved.</span>
          <span>Crafted with Google AI Studio & Gemini 3.8 Flash</span>
        </div>
      </footer>
    </div>
  );
};
