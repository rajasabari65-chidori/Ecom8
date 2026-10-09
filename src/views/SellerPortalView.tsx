import React, { useEffect, useState } from 'react';
import {
  Store,
  Sparkles,
  Percent,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Plus,
  RefreshCw,
  Clock,
  DollarSign,
  Package,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_SELLERS, queryProducts } from '../data/catalogueGenerator';
import { approveSurplusPrice, analyzeSurplusPricing } from '../services/api';
import { Product, ProductCategory } from '../types';

export const SellerPortalView: React.FC = () => {
  const { selectedSeller, setSelectedSeller, showToast } = useApp();

  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'surplus' | 'all-products' | 'insights'>('surplus');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // New Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Electronics');
  const [newProdPrice, setNewProdPrice] = useState(4999);
  const [newProdRefPrice, setNewProdRefPrice] = useState(6999);
  const [newProdStock, setNewProdStock] = useState(50);
  const [newProdSurplus, setNewProdSurplus] = useState(false);

  const loadSellerData = () => {
    setLoading(true);
    const res = queryProducts({
      sellerId: selectedSeller.id,
      limit: 60,
    });
    setSellerProducts(res.products);
    setLoading(false);
  };

  useEffect(() => {
    loadSellerData();
  }, [selectedSeller.id]);

  const surplusItems = sellerProducts.filter((p) => p.surplus);
  const totalStockUnits = sellerProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryValue = sellerProducts.reduce((acc, p) => acc + p.price * p.stock, 0);

  const handleApprovePrice = async (product: Product) => {
    if (!product.surplusData) return;
    setApprovingId(product.id);
    try {
      const res = await approveSurplusPrice(
        product.id,
        product.surplusData.suggestedDiscount,
        product.surplusData.suggestedPrice,
        selectedSeller.id
      );
      if (res.success) {
        showToast(
          `Approved discount of ${product.surplusData.suggestedDiscount}% for ${product.name}! Live catalogue updated.`,
          'success'
        );
        // Update local state
        setSellerProducts((prev) =>
          prev.map((p) =>
            p.id === product.id && p.surplusData
              ? {
                  ...p,
                  price: p.surplusData.suggestedPrice,
                  discount: p.surplusData.suggestedDiscount,
                  surplusData: { ...p.surplusData, approved: true },
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to approve price', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const discount = Math.round(((newProdRefPrice - newProdPrice) / newProdRefPrice) * 100);
    const created: Product = {
      id: `OPT-${Date.now().toString().slice(-5)}`,
      name: newProdName,
      brand: selectedSeller.name.split(' ')[0],
      category: newProdCategory,
      subcategory: 'General',
      description: `Newly published authorized merchant product by ${selectedSeller.name}.`,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      price: newProdPrice,
      referencePrice: newProdRefPrice,
      discount,
      stock: newProdStock,
      sellerId: selectedSeller.id,
      sellerName: selectedSeller.name,
      rating: 5.0,
      reviewCount: 1,
      specs: { 'Inventory Batch': 'BATCH-NEW-2026', 'Merchant': selectedSeller.name },
      condition: newProdSurplus ? 'Factory Sealed Surplus' : 'Brand New',
      deliveryEstimate: '2-3 Business Days',
      returnPolicy: '7-Day Return Policy',
      warranty: '1 Year Manufacturer Warranty',
      surplus: newProdSurplus,
      priceHistory: [
        { date: 'Oct 2026 (Now)', price: newProdPrice, event: 'Current' },
      ],
      dealScore: 85,
      dealRecommendation: 'GOOD DEAL',
      availability: 'IN_STOCK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSellerProducts([created, ...sellerProducts]);
    setShowAddModal(false);
    setNewProdName('');
    showToast(`Product "${created.name}" created and published!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Demo Seller Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={selectedSeller.avatar}
            alt={selectedSeller.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{selectedSeller.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Merchant
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{selectedSeller.tagline}</p>
          </div>
        </div>

        {/* Switch Seller Account Dropdown */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <Store className="w-4 h-4 text-violet-400 shrink-0" />
            <span className="shrink-0">Demo Merchant:</span>
            <select
              value={selectedSeller.id}
              onChange={(e) => {
                const s = DEMO_SELLERS.find((item) => item.id === e.target.value);
                if (s) setSelectedSeller(s);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-white font-semibold text-xs focus:outline-none focus:border-cyan-500"
            >
              {DEMO_SELLERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.specialty})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Active Inventory</span>
          <div className="text-2xl font-black text-white mt-1">
            {totalStockUnits.toLocaleString()} units
          </div>
          <span className="text-[11px] text-slate-500">Across {sellerProducts.length} listings</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 block">Total Inventory Value</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            ₹{totalInventoryValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500">At current listed retail prices</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 block">Surplus Items At Risk</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {surplusItems.length} products
          </div>
          <span className="text-[11px] text-amber-400/80">Pending velocity clearance</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 block">Merchant Trust Rating</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {selectedSeller.rating} ★
          </div>
          <span className="text-[11px] text-emerald-400/80">Zero return rate infractions</span>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('surplus')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'surplus'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Surplus Pricing Engine ({surplusItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('all-products')}
          className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'all-products'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Catalogue Products ({sellerProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: AI Surplus Pricing Engine Table */}
      {activeTab === 'surplus' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-slate-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300">Seller Approval Required for All AI Price Cuts</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                OptiMart AI automatically calculates inventory carrying costs and sales velocity gaps.
                AI-suggested clearance discounts are only activated on the public marketplace once explicitly approved by you.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="p-4">Product</th>
                  <th className="p-4">Excess Units</th>
                  <th className="p-4">Days in Stock</th>
                  <th className="p-4">Est. Carrying Cost</th>
                  <th className="p-4">Current Price</th>
                  <th className="p-4">AI Suggested Price</th>
                  <th className="p-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {surplusItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No surplus risk items found for this merchant.
                    </td>
                  </tr>
                ) : (
                  surplusItems.map((item) => {
                    const isApproved = item.surplusData?.approved;
                    return (
                      <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400">{item.brand}</span>
                            <div className="font-semibold text-white truncate max-w-xs">{item.name}</div>
                            <span className="text-[10px] text-slate-500">Batch #{item.id}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white">
                          {item.surplusData?.excessUnits || 35} units
                        </td>
                        <td className="p-4 text-slate-300">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {item.surplusData?.daysInInventory || 65} days
                          </span>
                        </td>
                        <td className="p-4 text-rose-400 font-medium">
                          ₹{(item.surplusData?.carryingCostMonthly || 1200).toLocaleString()}/mo
                        </td>
                        <td className="p-4 text-white font-medium">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-cyan-400">
                            ₹{(item.surplusData?.suggestedPrice || Math.round(item.price * 0.8)).toLocaleString()}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {item.surplusData?.suggestedDiscount || 35}% off MSRP
                          </span>
                        </td>
                        <td className="p-4">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active in Marketplace
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApprovePrice(item)}
                              disabled={approvingId === item.id}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                            >
                              {approvingId === item.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Activating...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Approve AI Price</span>
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: All Products Management */}
      {activeTab === 'all-products' && (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4">Product ID & Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Listed Price</th>
                <th className="p-4">MSRP Reference</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Deal Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {sellerProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <span className="font-semibold text-white truncate max-w-xs block">{p.name}</span>
                      <span className="text-[10px] text-slate-500">#{p.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{p.category}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${p.stock > 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">₹{p.price.toLocaleString()}</td>
                  <td className="p-4 text-slate-500 line-through">₹{p.referencePrice.toLocaleString()}</td>
                  <td className="p-4 text-slate-300">{p.condition}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[11px]">
                      {p.dealScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Publish New Product Listing</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. AuraTech Studio Monitor Gen-4"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {[
                      'Electronics',
                      'Smartphones',
                      'Laptops and Computers',
                      'Audio and Headphones',
                      'Home and Kitchen',
                      'Gaming Accessories',
                      'Smart Home Devices',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Reference MSRP (₹)</label>
                  <input
                    type="number"
                    value={newProdRefPrice}
                    onChange={(e) => setNewProdRefPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-white font-medium block">Publish as Surplus Clearance</span>
                  <span className="text-[10px] text-slate-400">Enables automated excess stock liquidation tools</span>
                </div>
                <input
                  type="checkbox"
                  checked={newProdSurplus}
                  onChange={(e) => setNewProdSurplus(e.target.checked)}
                  className="w-4 h-4 rounded accent-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
