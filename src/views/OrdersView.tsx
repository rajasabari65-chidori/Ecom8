import React from 'react';
import { Package, Truck, CheckCircle2, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrdersView: React.FC = () => {
  const { orders, setView, openProductDetail } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Orders</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track express delivery status and past orders.
          </p>
        </div>
        <button
          onClick={() => setView('marketplace')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-cyan-400 border border-slate-800 font-semibold"
        >
          Explore Catalogue
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No orders placed yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you complete checkout in our demo sandbox, your order receipt and tracking timeline will appear here.
          </p>
          <button
            onClick={() => setView('marketplace')}
            className="px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-xl mt-2"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400">Order ID: </span>
                  <span className="font-mono font-bold text-cyan-400">{order.id}</span>
                  <span className="text-slate-500 ml-2">
                    · Placed {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{order.status}</span>
                  </span>
                </div>
              </div>

              {/* Transit Timeline Indicator */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Eco-Transit Dispatched
                  </span>
                  <span className="text-slate-400 font-normal">
                    Est. Arrival: <strong className="text-white">{order.estimatedDelivery}</strong>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-800/60">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 cursor-pointer"
                        onClick={() => openProductDetail(item.productId)}
                      />
                      <div className="min-w-0">
                        <h4
                          onClick={() => openProductDetail(item.productId)}
                          className="font-semibold text-white truncate hover:text-cyan-400 cursor-pointer"
                        >
                          {item.productName}
                        </h4>
                        <span className="text-slate-500 text-[11px]">
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total & Delivery Details */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-400">
                  <span>Shipping Address: </span>
                  <span className="text-slate-200">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city} ({order.deliveryAddress.pinCode})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Total Paid (Demo): </span>
                  <span className="text-base font-bold text-cyan-400">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
