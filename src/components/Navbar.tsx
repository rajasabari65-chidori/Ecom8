import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Percent,
  Search,
  SlidersHorizontal,
  User,
  Heart,
  Scale,
  Menu,
  X,
  Store,
  Wallet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    view,
    setView,
    cart,
    cartTotal,
    targetBudget,
    isOverBudget,
    setIsCartDrawerOpen,
    wishlist,
    compareList,
    setIsCompareDrawerOpen,
    setIsAssistantOpen,
    setIsAuthModalOpen,
    user,
    setMarketplaceSearchQuery,
    setMarketplaceCategoryFilter,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setMarketplaceSearchQuery(searchInput.trim());
      setView('marketplace');
      setMobileMenuOpen(false);
    }
  };

  const budgetUsagePercent = Math.min(100, Math.round((cartTotal / targetBudget) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Banner: Surplus & Guarantee Announcement */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-violet-950/70 border-b border-cyan-900/30 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-medium text-cyan-300">Smart Surplus Marketplace</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">
              Clearance pricing verified with AI Price Guardian
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="hidden md:inline">10,200+ Live Verified Catalogue Records</span>
            <span aria-hidden="true" className="hidden md:inline text-slate-600">·</span>
            <span className="text-emerald-400 font-medium">Zero-Waste Direct Logistics</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  OptiMart
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Shop Smarter · Sell Better · Waste Less
              </p>
            </div>
          </button>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md items-center relative"
          >
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search 10,200+ products (laptops, audio, phones...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => {
                setMarketplaceCategoryFilter('All');
                setMarketplaceSearchQuery('');
                setView('marketplace');
              }}
              className={`transition-colors py-1 hover:text-cyan-400 ${
                view === 'marketplace' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setView('surplus-hub')}
              className={`flex items-center gap-1.5 transition-colors py-1 hover:text-cyan-400 ${
                view === 'surplus-hub' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Surplus Hub
            </button>
            <button
              onClick={() => setView('seller-portal')}
              className={`flex items-center gap-1.5 transition-colors py-1 hover:text-cyan-400 ${
                view === 'seller-portal' ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-violet-400" />
              Seller Portal
            </button>
          </nav>

          {/* Right Action Controls: Assistant, Compare, Wishlist, Budget & Cart */}
          <div className="flex items-center gap-3">
            {/* Opti Assistant Co-pilot Trigger */}
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-medium shadow-sm hover:shadow-cyan-500/20"
              title="Open Opti Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Opti Assistant</span>
            </button>

            {/* Compare Trigger */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareDrawerOpen(true)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Compare Products"
              >
                <Scale className="w-4 h-4 text-cyan-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Wishlist Trigger */}
            <button
              onClick={() => {
                setView('marketplace');
                showToastMessage('Viewing catalogue wishlist items');
              }}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-400/30' : 'text-slate-400'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Smart Cart & Budget Status Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all ${
                isOverBudget
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300 hover:border-rose-400'
                  : 'bg-slate-900 border-slate-700/80 text-slate-200 hover:border-cyan-500/60'
              }`}
              title="Open Smart Cart & Budget Assistant"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-semibold text-white">₹{cartTotal.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400">/ ₹{targetBudget.toLocaleString()}</span>
                </div>
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isOverBudget ? 'bg-rose-500' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
                  />
                </div>
              </div>
            </button>

            {/* User Profile / Auth */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors focus:outline-none"
              title="Account & Settings"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 10,200+ products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
              <button
                onClick={() => {
                  setView('marketplace');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 text-left text-slate-200 hover:text-cyan-400"
              >
                Marketplace (10k+)
              </button>
              <button
                onClick={() => {
                  setView('surplus-hub');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 text-left text-slate-200 hover:text-cyan-400 flex items-center gap-1.5"
              >
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                Surplus Hub
              </button>
              <button
                onClick={() => {
                  setView('seller-portal');
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 text-left text-slate-200 hover:text-cyan-400 flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-violet-400" />
                Seller Portal
              </button>
              <button
                onClick={() => {
                  setIsAssistantOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-left text-cyan-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Opti Assistant
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  function showToastMessage(_msg: string) {
    // helper placeholder
  }
};
