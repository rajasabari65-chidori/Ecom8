import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  X,
  TrendingDown,
  Info,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzePriceGuardian } from '../services/api';
import { getProductById, getCheaperAlternatives } from '../data/catalogueGenerator';
import { Product } from '../types';

export const PriceGuardianModal: React.FC = () => {
  const { priceGuardianProductId, closePriceGuardian, addToCart, openProductDetail, showToast } =
    useApp();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [alertSet, setAlertSet] = useState(false);
  const [alternatives, setAlternatives] = useState<Product[]>([]);

  useEffect(() => {
    if (!priceGuardianProductId) return;

    const prod = getProductById(priceGuardianProductId);
    setProduct(prod);
    if (prod) {
      setAlternatives(getCheaperAlternatives(prod, 2));
    }

    setLoading(true);
    analyzePriceGuardian(priceGuardianProductId)
      .then((data) => {
        setAnalysis(data);
      })
      .catch((err) => {
        console.error('Failed to load Price Guardian analysis:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [priceGuardianProductId]);

  if (!priceGuardianProductId || !product) return null;

  const points = analysis?.historicalPricePoints || product.priceHistory;
  const maxPrice = Math.max(...points.map((p: any) => p.price));
  const minPrice = Math.min(...points.map((p: any) => p.price));
  const priceRange = Math.max(1, maxPrice - minPrice);

  const getDealBadgeClass = (rec: string) => {
    switch (rec) {
      case 'GOOD DEAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'FAIR PRICE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'CONSIDER WAITING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-cyan-950/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Price Guardian</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">
                  Verified Tracking
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Independent 180-day market price verification & fair-deal scoring
              </p>
            </div>
          </div>
          <button
            onClick={closePriceGuardian}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target Product Summary Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3.5">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-800"
              />
              <div>
                <span className="text-xs text-slate-400">{product.brand} · {product.category}</span>
                <h4 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-cyan-400">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 line-through">₹{product.referencePrice.toLocaleString()}</span>
                  <span className="text-xs text-emerald-400 font-semibold">{product.discount}% OFF</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${getDealBadgeClass(product.dealRecommendation)}`}>
                {product.dealRecommendation}
              </span>
              <div className="text-[11px] text-slate-400 mt-1">
                Score: <span className="font-bold text-white">{product.dealScore}</span> / 100
              </div>
            </div>
          </div>

          {/* Historical Price Trend Visualization Chart */}
          <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <History className="w-4 h-4 text-cyan-400" />
                <span>6-Month Price Movement Timeline</span>
              </div>
              <span className="text-[11px] text-slate-500">Simulated 180-Day Audit Data</span>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="h-40 w-full relative pt-4 pb-6">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="4 4" />
                <line x1="0" y1="110" x2="500" y2="110" stroke="#1e293b" strokeDasharray="4 4" />

                {/* Generate polyline points */}
                {(() => {
                  const pts = points.map((p: any, idx: number) => {
                    const x = (idx / (points.length - 1)) * 480 + 10;
                    const normalizedY = (p.price - minPrice) / priceRange;
                    const y = 100 - normalizedY * 80;
                    return { x, y, price: p.price, date: p.date, event: p.event };
                  });

                  const pathStr = pts.reduce((acc: string, curr: any, i: number) => {
                    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                  }, '');

                  const areaStr = `${pathStr} L ${pts[pts.length - 1].x} 120 L ${pts[0].x} 120 Z`;

                  return (
                    <>
                      <path d={areaStr} fill="url(#priceGradient)" />
                      <path d={pathStr} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                      {pts.map((pt: any, i: number) => (
                        <g key={i}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={i === pts.length - 1 ? 5 : 3.5}
                            className={i === pts.length - 1 ? 'fill-cyan-300 stroke-cyan-900 stroke-2 animate-pulse' : 'fill-slate-900 stroke-cyan-400 stroke-2'}
                          />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                {points.map((p: any, i: number) => (
                  <span key={i} className="text-center">{p.date.split(' ')[0]}</span>
                ))}
              </div>
            </div>

            {/* Price Key Stats Bar */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Lowest Recorded</span>
                <p className="font-bold text-emerald-400">₹{minPrice.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Current Price</span>
                <p className="font-bold text-cyan-400">₹{product.price.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Historical High / MSRP</span>
                <p className="font-bold text-slate-400">₹{maxPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* AI Guardian Explanation Breakdown */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-slate-300 text-xs leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
              <Sparkles className="w-4 h-4" />
              <span>OptiMart Intelligence Analysis</span>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-2 pt-1">
                <div className="h-3 bg-cyan-900/40 rounded w-full" />
                <div className="h-3 bg-cyan-900/40 rounded w-4/5" />
              </div>
            ) : (
              <p>{analysis?.explanation || 'Historical data confirms stable pricing trends.'}</p>
            )}
            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-400">
              <span>Confidence: <strong className="text-white">94%</strong></span>
              <span>·</span>
              <span>Market Volatility: <strong className="text-white">{analysis?.volatilityIndex || 'Stable'}</strong></span>
            </div>
          </div>

          {/* Comparable Alternatives if not best deal */}
          {alternatives.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300">
                Comparable Alternatives in {product.category}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={alt.image} alt={alt.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h5 className="text-xs font-medium text-white line-clamp-1">{alt.name}</h5>
                        <span className="text-xs font-bold text-cyan-400">₹{alt.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        closePriceGuardian();
                        openProductDetail(alt.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="View Alternative"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Drop Alert Trigger */}
          <div className="p-3 rounded-xl bg-slate-950/30 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Get notified if price drops below ₹{Math.round(product.price * 0.95).toLocaleString()}</span>
            </div>
            <button
              onClick={() => {
                setAlertSet(!alertSet);
                showToast(
                  alertSet ? 'Price alert cancelled' : `Price alert active for ${product.name}`,
                  alertSet ? 'info' : 'success'
                );
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                alertSet
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {alertSet ? 'Alert Active' : 'Set Alert'}
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Reference MSRP: <span className="text-white font-medium">₹{product.referencePrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={closePriceGuardian}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                addToCart(product, 1);
                closePriceGuardian();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
            >
              Add to Cart · ₹{product.price.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
