import React from 'react';
import { X, Scale, ShoppingCart, Trash2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CompareDrawer: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareDrawerOpen,
    setIsCompareDrawerOpen,
    addToCart,
    openProductDetail,
  } = useApp();

  if (!isCompareDrawerOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Compare Products ({compareList.length}/4)</h3>
              <p className="text-xs text-slate-400">Side-by-side specifications, price history, and deal ratings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => setIsCompareDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-3 w-40 text-slate-500 font-semibold uppercase tracking-wider">Product</th>
                {compareList.map((p) => (
                  <th key={p.id} className="p-3 min-w-[220px]">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute -top-1 -right-1 p-1 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-24 h-24 rounded-xl object-cover border border-slate-800 cursor-pointer"
                        onClick={() => {
                          setIsCompareDrawerOpen(false);
                          openProductDetail(p.id);
                        }}
                      />
                      <div>
                        <span className="text-[10px] text-slate-400">{p.brand}</span>
                        <h4
                          onClick={() => {
                            setIsCompareDrawerOpen(false);
                            openProductDetail(p.id);
                          }}
                          className="font-bold text-white text-xs line-clamp-2 hover:text-cyan-300 cursor-pointer"
                        >
                          {p.name}
                        </h4>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 font-medium text-slate-400">Current Price</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">
                    <span className="text-sm font-bold text-cyan-400">₹{p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 line-through ml-1.5">₹{p.referencePrice.toLocaleString()}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Price Guardian Deal</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-semibold text-white">{p.dealRecommendation}</span>
                      <span className="text-slate-500 text-[10px]">({p.dealScore}/100)</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Condition</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-white">{p.condition}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Surplus Discount</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">
                    {p.surplus ? (
                      <span className="text-amber-400 font-semibold">{p.discount}% OFF Surplus</span>
                    ) : (
                      <span className="text-slate-500">{p.discount}% Retail Discount</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Warranty</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">{p.warranty}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Return Policy</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">{p.returnPolicy}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Seller</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3 text-white font-medium">{p.sellerName}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-slate-400">Action</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Add to Cart</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
