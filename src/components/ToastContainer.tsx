import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top-2 duration-200 ${
            t.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/20'
              : t.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/40 text-rose-200 shadow-rose-950/20'
              : t.type === 'warning'
              ? 'bg-slate-900/95 border-amber-500/40 text-amber-200 shadow-amber-950/20'
              : 'bg-slate-900/95 border-cyan-500/40 text-cyan-200 shadow-cyan-950/20'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : t.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="font-medium">{t.message}</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
