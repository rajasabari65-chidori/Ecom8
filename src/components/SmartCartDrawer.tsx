import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { optimizeCartBudget } from '../services/api';
import { CartAlternativeRecommendation } from '../types';

export const SmartCartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartReferenceTotal,
    cartSavings,
    targetBudget,
    setTargetBudget,
    isOverBudget,
    overBudgetAmount,
    remainingBudget,
    addToCart,
    setIsCheckoutOpen,
    showToast,
  } = useApp();

  const [budgetInput, setBudgetInput] = useState<string>(targetBudget.toString());
  const [optimizing, setOptimizing] = useState(false);
  const [recommendations, setRecommendations] = useState<CartAlternativeRecommendation[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) {
      setTargetBudget(val);
      // Reset recommendations on budget change
      setRecommendations([]);
      setAiAdvice(null);
    }
  };

  const handleRunAiOptimization = async () => {
    if (cart.length === 0) return;
    setOptimizing(true);
    try {
      const result = await optimizeCartBudget(cart, targetBudget);
      setRecommendations(result.recommendations || []);
      setAiAdvice(result.aiAdvice || null);
      showToast('AI Budget recommendations generated', 'info');
    } catch (err) {
      console.error('Failed to run budget optimizer:', err);
      showToast('Could not run budget optimization', 'error');
    } finally {
      setOptimizing(false);
    }
  };

  const handleApplyAlternative = (rec: CartAlternativeRecommendation) => {
    const existing = cart.find((i) => i.product.id === rec.originalProductId);
    const qty = existing ? existing.quantity : 1;

    // Remove old item, add new item
    removeFromCart(rec.originalProductId);
    addToCart(rec.alternativeProduct, qty);

    // Remove recommendation from list
    setRecommendations((prev) => prev.filter((r) => r.originalProductId !== rec.originalProductId));
    showToast(`Swapped for ${rec.alternativeProduct.name}! Saved ₹${rec.savings.toLocaleString()}`, 'success');
  };

  const shipping = cartTotal > 999 || cartTotal === 0 ? 0 : 99;
  const grandTotal = cartTotal + shipping;
  const budgetUsagePercent = Math.min(100, Math.round((cartTotal / targetBudget) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Smart Cart & Budget</h2>
              <p className="text-xs text-slate-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget Assistant Control Card */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <span>Target Shopping Budget</span>
            </div>
            <form onSubmit={handleUpdateBudget} className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">₹</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Set
              </button>
            </form>
          </div>

          {/* Budget Visual Progress Meter */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">
                Current: <strong className="text-white">₹{cartTotal.toLocaleString()}</strong>
              </span>
              {isOverBudget ? (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ₹{overBudgetAmount.toLocaleString()} over budget
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ₹{remainingBudget.toLocaleString()} headroom
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                }`}
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
          </div>

          {/* AI Optimizer Trigger Button */}
          {cart.length > 0 && (
            <button
              onClick={handleRunAiOptimization}
              disabled={optimizing}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isOverBudget
                  ? 'bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-rose-500/20 border-cyan-500/40 text-cyan-300 hover:border-cyan-400 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {optimizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Analyzing 10,200+ Catalogue for Alternatives...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isOverBudget ? 'Optimize Cart with AI to Hit Budget' : 'Find Better Surplus Deals in Cart'}</span>
                </>
              )}
            </button>
          )}

          {/* AI Advice Summary */}
          {aiAdvice && (
            <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 leading-relaxed">
              {aiAdvice}
            </div>
          )}
        </div>

        {/* AI Recommendations List (User MUST accept or reject individually) */}
        {recommendations.length > 0 && (
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                AI Smart Budget Recommendations ({recommendations.length})
              </span>
              <button
                onClick={() => setRecommendations([])}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Dismiss All
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {recommendations.map((rec) => (
                <div
                  key={rec.originalProductId}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 line-clamp-1">{rec.originalProductName}</span>
                    <span className="text-rose-400 shrink-0 font-medium line-through">₹{rec.originalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2">
                      <img
                        src={rec.alternativeProduct.image}
                        alt={rec.alternativeProduct.name}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-semibold text-white line-clamp-1">{rec.alternativeProduct.name}</div>
                        <div className="text-[11px] text-emerald-400 font-bold">
                          ₹{rec.alternativeProduct.price.toLocaleString()} (Save ₹{rec.savings.toLocaleString()})
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyAlternative(rec)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold shrink-0 transition-transform active:scale-95"
                    >
                      Swap Item
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our 10,200+ product catalogue or browse surplus clearance deals.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3 items-center justify-between"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] text-slate-400">
                    {item.product.brand} · {item.product.category}
                  </div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-bold text-cyan-400">
                      ₹{item.product.price.toLocaleString()}
                    </span>
                    {item.product.referencePrice > item.product.price && (
                      <span className="text-[10px] text-slate-500 line-through">
                        ₹{item.product.referencePrice.toLocaleString()}
                      </span>
                    )}
                    {item.product.surplus && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                        Surplus
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-semibold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white font-medium">₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Savings (vs MSRP)</span>
                <span className="text-emerald-400 font-semibold">-₹{cartSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Eco Express Delivery</span>
                <span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Final Payable Total</span>
                <span className="text-cyan-400 text-base">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="px-3 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-98 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
