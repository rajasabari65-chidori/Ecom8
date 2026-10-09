import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
  RotateCcw,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { Product, ProductCategory } from '../types';
import { DEMO_SELLERS, TOTAL_CATALOGUE_COUNT } from '../data/catalogueGenerator';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
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

export const MarketplaceView: React.FC = () => {
  const {
    marketplaceCategoryFilter,
    setMarketplaceCategoryFilter,
    marketplaceSearchQuery,
    setMarketplaceSearchQuery,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(TOTAL_CATALOGUE_COUNT);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(24);

  // Filter States
  const [searchInput, setSearchInput] = useState(marketplaceSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(marketplaceCategoryFilter || 'All');
  const [surplusOnly, setSurplusOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedSeller, setSelectedSeller] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<
    'relevance' | 'price-asc' | 'price-desc' | 'discount' | 'rating' | 'deal-score'
  >('relevance');

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync external filters from context
  useEffect(() => {
    if (marketplaceCategoryFilter) {
      setSelectedCategory(marketplaceCategoryFilter);
      setCurrentPage(1);
    }
  }, [marketplaceCategoryFilter]);

  useEffect(() => {
    if (marketplaceSearchQuery !== undefined) {
      setSearchInput(marketplaceSearchQuery);
      setCurrentPage(1);
    }
  }, [marketplaceSearchQuery]);

  // Load products with current filter parameters
  useEffect(() => {
    setLoading(true);
    const debounceTimer = setTimeout(() => {
      fetchProducts({
        page: currentPage,
        limit,
        search: searchInput,
        category: selectedCategory,
        surplusOnly,
        minPrice: minPrice > 0 ? minPrice : undefined,
        maxPrice: maxPrice < 150000 ? maxPrice : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        minDiscount: minDiscount > 0 ? minDiscount : undefined,
        sellerId: selectedSeller,
        condition: selectedCondition,
        sortBy,
      })
        .then((res) => {
          setProducts(res.products);
          setTotalCount(res.total);
          setTotalPages(res.totalPages);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [
    currentPage,
    limit,
    searchInput,
    selectedCategory,
    surplusOnly,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    selectedSeller,
    selectedCondition,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchInput('');
    setMarketplaceSearchQuery('');
    setSelectedCategory('All');
    setMarketplaceCategoryFilter('All');
    setSurplusOnly(false);
    setMinPrice(0);
    setMaxPrice(150000);
    setMinRating(0);
    setMinDiscount(0);
    setSelectedSeller('All');
    setSelectedCondition('All');
    setSortBy('relevance');
    setCurrentPage(1);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchInput) count++;
    if (selectedCategory !== 'All') count++;
    if (surplusOnly) count++;
    if (minPrice > 0 || maxPrice < 150000) count++;
    if (minRating > 0) count++;
    if (minDiscount > 0) count++;
    if (selectedSeller !== 'All') count++;
    if (selectedCondition !== 'All') count++;
    return count;
  }, [
    searchInput,
    selectedCategory,
    surplusOnly,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    selectedSeller,
    selectedCondition,
  ]);

  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(totalCount, currentPage * limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
              {TOTAL_CATALOGUE_COUNT.toLocaleString()} Products
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified electronics, smart devices, apparel, and factory-sealed surplus inventory.
          </p>
        </div>

        {/* Search input with live clear */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, brand, model..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setMarketplaceSearchQuery('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Category Pill Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setMarketplaceCategoryFilter(cat);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Sidebar Filters */}
        <aside
          className={`md:col-span-3 space-y-6 bg-slate-950/70 p-5 rounded-3xl border border-slate-800/80 ${
            showMobileFilters ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="text-[10px] px-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Surplus Clearance Toggle */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-amber-300 block">Surplus Only</span>
                <span className="text-[10px] text-amber-400/80">Excess clearance deals</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={surplusOnly}
              onChange={(e) => {
                setSurplusOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Max Price</span>
              <span className="text-cyan-400 font-bold">₹{maxPrice.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="150000"
              step="2000"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹1,000</span>
              <span>₹1,50,000+</span>
            </div>
          </div>

          {/* Minimum Discount Filter */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Minimum Discount</span>
            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {[0, 15, 30, 45].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setMinDiscount(pct);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 rounded-lg font-medium transition-colors ${
                    minDiscount === pct
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {pct === 0 ? 'All' : `${pct}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Customer Rating</span>
            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {[0, 3.5, 4.0, 4.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setMinRating(rate);
                    setCurrentPage(1);
                  }}
                  className={`py-1.5 rounded-lg font-medium transition-colors ${
                    minRating === rate
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {rate === 0 ? 'All' : `${rate}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Factory Sealed Surplus">Factory Sealed Surplus</option>
              <option value="Surplus Open-Box">Surplus Open-Box</option>
              <option value="Refurbished Certified">Refurbished Certified</option>
            </select>
          </div>

          {/* Verified Seller Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Verified Seller</label>
            <select
              value={selectedSeller}
              onChange={(e) => {
                setSelectedSeller(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Sellers (6 Verified)</option>
              {DEMO_SELLERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rating}★)
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Main Content: Sort Bar + Products Grid */}
        <div className="md:col-span-9 space-y-6">
          {/* Sorting & Item Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{totalCount > 0 ? `${startRecord}–${endRecord}` : '0'}</strong> of{' '}
              <strong className="text-cyan-400">{totalCount.toLocaleString()}</strong> products
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 flex-1 sm:flex-initial"
              >
                <option value="relevance">Relevance</option>
                <option value="deal-score">Price Guardian Deal Score</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount %</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-square bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                  <div className="h-6 bg-slate-800 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950/40 border border-slate-800 space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No catalogue records matched your selected criteria. Try resetting price ranges, discounts, or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Page</span>
                <span className="font-bold text-white">{currentPage}</span>
                <span>of</span>
                <span className="font-bold text-white">{totalPages}</span>
              </div>

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-800"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
