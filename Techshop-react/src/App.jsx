import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import TopProducts from './components/TopProducts';
import Catalog from './components/Catalog';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Advantages from './components/Advantages';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

const MainContent = () => {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen bg-[#0b0c10] flex flex-col justify-between selection:bg-red-600 selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero />
            <FeaturedProducts />
            <TopProducts />
            <Advantages />
          </>
        )}

        {currentView === 'catalog' && (
          <>
            <Catalog />
            <Advantages />
          </>
        )}

        {currentView === 'details' && (
          <>
            <ProductDetails />
            <Advantages />
          </>
        )}

        {currentView === 'cart' && (
          <Cart />
        )}
      </main>

      <Footer />
      <AuthModal />
      <Toast />
    </div>
  );
};

function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}

export default App;
