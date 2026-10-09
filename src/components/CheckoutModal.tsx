import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitCheckout } from '../services/api';
import { DeliveryAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartSavings,
    user,
    addOrder,
    addDeliveryAddress,
    setView,
    showToast,
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery (Demo)' | 'Instant UPI Demo' | 'Wallet'
  >('Cash on Delivery (Demo)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // New address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newName, setNewName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);

  if (!isCheckoutOpen) return null;

  const shipping = cartTotal > 999 ? 0 : 99;
  const grandTotal = cartTotal + shipping;
  const selectedAddress =
    user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPin) return;

    addDeliveryAddress({
      name: newName,
      street: newStreet,
      city: newCity,
      state: newState || 'Karnataka',
      pinCode: newPin,
      phone: newPhone,
    });

    setShowAddAddress(false);
    setNewStreet('');
    setNewCity('');
    setNewPin('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'warning');
      return;
    }
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          referencePrice: i.product.referencePrice,
          image: i.product.image,
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
      };

      const result = await submitCheckout(payload);
      if (result.success && result.order) {
        addOrder(result.order);
        setOrderSuccess(result.order);
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast('Could not complete checkout', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Safe Demo Checkout</h3>
              <p className="text-xs text-slate-400">OptiMart Express Eco-Transit & Price Protection</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setOrderSuccess(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {orderSuccess ? (
            /* Order Placed Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Order Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Order ID: <strong className="text-cyan-400 font-mono">{orderSuccess.id}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Delivery</span>
                  <span className="text-white font-medium">{orderSuccess.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Address</span>
                  <span className="text-white font-medium text-right max-w-[200px] truncate">
                    {orderSuccess.deliveryAddress.street}, {orderSuccess.deliveryAddress.city}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Method</span>
                  <span className="text-white font-medium">{orderSuccess.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-bold pt-2 border-t border-slate-800">
                  <span>Total Paid (Demo)</span>
                  <span className="text-cyan-400 text-sm">₹{orderSuccess.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderSuccess(null);
                    setView('orders');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
                >
                  View Order Tracking
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setOrderSuccess(null);
                    setView('marketplace');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <>
              {/* Delivery Address Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Select Delivery Address</span>
                  </div>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form
                    onSubmit={handleAddNewAddress}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="House/Flat No., Building, Street"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">City</label>
                        <input
                          type="text"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">State</label>
                        <input
                          type="text"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr) => {
                    const isSelected = addr.id === selectedAddressId;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-950/30 border-cyan-500/60 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{addr.name}</span>
                          {isSelected && (
                            <span className="text-[10px] text-cyan-400 font-semibold">Selected</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {addr.street}, {addr.city}, {addr.pinCode}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">{addr.phone}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method Section (Demo CoD) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <span>Demo Payment Method</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Cash on Delivery (Demo)', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                    { id: 'Instant UPI Demo', label: 'Instant UPI (Demo)', desc: 'Scan QR at delivery' },
                    { id: 'Wallet', label: 'OptiWallet Demo', desc: 'Preloaded balance' },
                  ].map((method) => {
                    const isSel = paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all text-left ${
                          isSel
                            ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-md'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-semibold">{method.label}</div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{method.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Items to be Delivered ({cart.length})
                </span>
                <div className="divide-y divide-slate-800/80 max-h-36 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                        />
                        <span className="text-white line-clamp-1">{item.product.name}</span>
                        <span className="text-slate-500 text-[10px]">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-cyan-400 shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Cart Items Subtotal</span>
                  <span className="text-white font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Surplus & Retail Savings</span>
                  <span className="text-emerald-400 font-semibold">-₹{cartSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Charge</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Payable Total</span>
                  <span className="text-cyan-400 text-base">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Stock & Generating Order...</span>
                ) : (
                  <>
                    <span>Confirm Order · ₹{grandTotal.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
