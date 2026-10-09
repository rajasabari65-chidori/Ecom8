import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  CheckCircle2,
  Lock,
  Store,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, updateUserProfile, showToast, setView } =
    useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>('profile');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [role, setRole] = useState<'customer' | 'seller'>(user.role);
  const [notifications, setNotifications] = useState(user.notifications);

  if (!isAuthModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      role,
      notifications,
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-cyan-500/40"
            />
            <div>
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-400">
                {user.email} · <span className="text-cyan-400 font-medium capitalize">{user.role} Account</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile & Role
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'notifications'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Alert Preferences
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Demo Mode
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-400 cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Email authentication is locked in Demo Mode.
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Role Switcher */}
              <div>
                <label className="text-slate-400 block mb-1.5">Account Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      role === 'customer'
                        ? 'bg-cyan-950/30 border-cyan-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Smart Customer</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Browse 10k+ items, Price Guardian & Smart Cart budget tools
                    </p>
                  </div>

                  <div
                    onClick={() => setRole('seller')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      role === 'seller'
                        ? 'bg-violet-950/30 border-violet-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5" />
                      <span>Verified Seller</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Manage inventory, approve AI surplus clearance pricing
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setView('orders');
                    setIsAuthModalOpen(false);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View My Past Orders
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 text-xs">
              {[
                {
                  key: 'priceAlerts',
                  title: 'Price Guardian Alerts',
                  desc: 'Receive alerts when watched items reach lowest 180-day prices.',
                },
                {
                  key: 'surplusDeals',
                  title: 'Surplus Clearance Drops',
                  desc: 'Instant notifications when sellers approve >35% excess inventory discounts.',
                },
                {
                  key: 'orderUpdates',
                  title: 'Order Status & Transit',
                  desc: 'SMS and notification updates for eco-transit shipping progress.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="font-semibold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded accent-cyan-500"
                  />
                </div>
              ))}

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Demonstration Environment Transparency</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  This instance of OptiMart AI runs in a verified demonstration sandbox with over 10,200 reproducible product catalogue records.
                  Customer session preferences, cart states, and simulated order receipts are persisted locally in your browser session.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white">Reset Local Session</h5>
                  <p className="text-[10px] text-slate-500">Clear demo cart, wishlist, and local demo orders</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-medium"
                >
                  Reset Demo Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
