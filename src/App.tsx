import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './views/HomeView';
import { MarketplaceView } from './views/MarketplaceView';
import { ProductDetailView } from './views/ProductDetailView';
import { SurplusHubView } from './views/SurplusHubView';
import { SellerPortalView } from './views/SellerPortalView';
import { OrdersView } from './views/OrdersView';
import { SmartCartDrawer } from './components/SmartCartDrawer';
import { PriceGuardianModal } from './components/PriceGuardianModal';
import { CompareDrawer } from './components/CompareDrawer';
import { OptiAssistant } from './components/OptiAssistant';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

const MainContent: React.FC = () => {
  const { view } = useApp();

  return (
    <main className="flex-1">
      {view === 'home' && <HomeView />}
      {view === 'marketplace' && <MarketplaceView />}
      {view === 'product-detail' && <ProductDetailView />}
      {view === 'surplus-hub' && <SurplusHubView />}
      {view === 'seller-portal' && <SellerPortalView />}
      {view === 'orders' && <OrdersView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <MainContent />

        {/* Global Overlays & Modals */}
        <SmartCartDrawer />
        <PriceGuardianModal />
        <CompareDrawer />
        <OptiAssistant />
        <CheckoutModal />
        <AuthModal />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
