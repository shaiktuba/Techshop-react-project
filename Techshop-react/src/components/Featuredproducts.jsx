import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

const FeaturedProducts = () => {
  const { products, navigateTo } = useShop();

  const featured = products.filter((p) => p.tag === 'featured-product');
  const [activeIdx, setActiveIdx] = useState(0);

  if (featured.length === 0) return null;

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-[#090a0e] border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Featured Products
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center min-h-[300px]">
          
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Previous Featured Product"
          >
            <AiOutlineLeft className="w-5 h-5" />
          </button>

          {/* Cards Showcase (3 items visible on desktop, 1 on mobile) */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-4xl px-8">
            {featured.map((item, idx) => {
              const isCenter = idx === activeIdx;
              const isPrev = (idx === activeIdx - 1) || (activeIdx === 0 && idx === featured.length - 1);
              const isNext = (idx === activeIdx + 1) || (activeIdx === featured.length - 1 && idx === 0);

              // Only show prev, center, and next
              if (!isCenter && !isPrev && !isNext) return null;

              return (
                <div
                  key={item.id}
                  onClick={() => navigateTo('details', item)}
                  className={`cursor-pointer transition-all duration-300 transform flex flex-col items-center text-center p-4 rounded-xl ${
                    isCenter
                      ? 'scale-105 z-10 opacity-100'
                      : 'hidden sm:flex scale-90 opacity-40 hover:opacity-70'
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-400 mb-2 truncate max-w-[200px]">
                    {item.title}
                  </p>

                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center relative mb-4">
                    <img
                      src={item.images?.[0] || item.heroImage}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/boat203-1.png';
                      }}
                    />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      ₹{item.finalPrice.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            aria-label="Next Featured Product"
          >
            <AiOutlineRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {featured.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIdx === idx
                  ? 'w-6 bg-red-600'
                  : 'w-2 bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Featured Slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
