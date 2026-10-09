import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShoppingBag,
  ExternalLink,
  Bot,
  User,
  RefreshCw,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askOptiAssistant } from '../services/api';
import { AssistantMessage, Product } from '../types';

export const OptiAssistant: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    addToCart,
    openProductDetail,
    cartTotal,
    targetBudget,
  } = useApp();

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am Opti Assistant, your AI shopping co-pilot. I can help you search our 10,200+ product catalogue, locate verified surplus discounts, optimize your budget, or analyze price trends with AI Price Guardian.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendedProductsMap, setRecommendedProductsMap] = useState<Record<string, Product[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    'Find a laptop under ₹50,000',
    'Show best surplus clearance deals',
    'Help me stay under ₹3,000 budget',
    'Compare top noise-cancelling headphones',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await askOptiAssistant(query);
      const assistantMsgId = `assistant-${Date.now()}`;

      const assistantMsg: AssistantMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (result.recommendedProducts && result.recommendedProducts.length > 0) {
        setRecommendedProductsMap((prev) => ({
          ...prev,
          [assistantMsgId]: result.recommendedProducts,
        }));
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue analyzing the catalogue. Please try again or rephrase your search.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Glowing Trigger Button */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-slate-950 font-bold shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-105 active:scale-95 transition-all"
          title="Open Opti Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-200 animate-ping" />
          </div>
          <span className="text-xs tracking-wide text-slate-950">Opti AI</span>
        </button>
      )}

      {/* Slide-over Chat Panel */}
      {isAssistantOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 max-h-[85vh] h-[580px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/60 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Opti Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                    v2.4
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">10,200+ Catalogue Co-pilot</p>
              </div>
            </div>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950/60 hover:border-cyan-500/40 border border-slate-700/60 text-[11px] text-slate-300 hover:text-cyan-300 transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const recProducts = recommendedProductsMap[m.id];
              const isAssistant = m.role === 'assistant';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-sm'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    <span className="block text-[9px] text-slate-400/80 mt-1.5 text-right">
                      {m.timestamp}
                    </span>
                  </div>

                  {/* Product Cards embedded in Assistant Message */}
                  {isAssistant && recProducts && recProducts.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      {recProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2.5 hover:border-cyan-500/40 transition-colors"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-slate-400">{p.brand}</span>
                            <h5 className="text-xs font-semibold text-white line-clamp-1">{p.name}</h5>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-cyan-400">₹{p.price.toLocaleString()}</span>
                              {p.surplus && (
                                <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300">
                                  Surplus
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="px-2 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] rounded-lg transition-transform active:scale-95"
                            >
                              + Cart
                            </button>
                            <button
                              onClick={() => {
                                setIsAssistantOpen(false);
                                openProductDetail(p.id);
                              }}
                              className="px-2 py-0.5 bg-slate-800 text-slate-300 hover:text-white text-[10px] rounded-lg"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs w-max">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Searching 10,200+ catalogue with Gemini 3.8 Flash...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Opti about prices, deals, or budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
