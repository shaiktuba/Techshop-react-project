import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

const Hero = () => {
  const { products, navigateTo } = useShop();

  
  const heroProducts = products.filter((p) => p.tag === 'hero-product');
  const [currentIndex, setCurrentIndex] = useState(0);

  
  useEffect(() => {
    if (heroProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  if (heroProducts.length === 0) return null;

  const currentItem = heroProducts[currentIndex];

  return (
    <div className="relative w-full bg-[#0e0f14] py-12 md:py-20 overflow-hidden border-b border-white/5">
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[14vw] font-black text-white/[0.03] uppercase tracking-wider transform -translate-y-4 whitespace-nowrap">
          {currentItem.type || 'Over Ear'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[440px]">
          
          
          <div className="lg:col-span-7 space-y-5 text-left animate-in fade-in slide-in-from-left duration-300">
            <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
              {currentItem.title}
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              {currentItem.tagline || currentItem.info}
            </h2>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                ₹{currentItem.finalPrice.toLocaleString('en-IN')}
              </span>
              {currentItem.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{currentItem.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigateTo('details', currentItem)}
                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-red-900/40 cursor-pointer text-sm uppercase tracking-wider"
              >
                Shop Now
              </button>
            </div>
          </div>

         
          <div className="lg:col-span-5 flex justify-center items-center relative animate-in fade-in zoom-in duration-300">
            <div className="relative group cursor-pointer" onClick={() => navigateTo('details', currentItem)}>
              <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl transform scale-75 group-hover:scale-95 transition-transform duration-300" />
              <img
                src={currentItem.heroImage || currentItem.images?.[0]}
                alt={currentItem.title}
                className="w-[280px] sm:w-[360px] lg:w-[420px] max-h-[400px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] transform transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/jbl660nc-1.png';
                }}
              />
            </div>
          </div>

        </div>

        
        <div className="flex justify-center items-center gap-3 mt-10">
          {heroProducts.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-8 bg-red-600'
                  : 'w-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
