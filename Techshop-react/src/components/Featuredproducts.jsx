import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

const FeaturedProducts = () => {
  const { products, navigateTo } = useShop();

  const featured = products.filter(
    (p) => p.tag === 'featured-product'
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic scrolling
  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % featured.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featured.length, isPaused]);

  if (featured.length === 0) return null;

  // Previous product
  const handlePrev = () => {
    setActiveIdx((prev) =>
      prev === 0 ? featured.length - 1 : prev - 1
    );
  };

  // Next product
  const handleNext = () => {
    setActiveIdx((prev) =>
      (prev + 1) % featured.length
    );
  };

  // Show products around the active product
  const offsets = [0, -1, 1, -2, 2];

  const visibleProducts = offsets
    .map((offset) => {
      const index =
        (activeIdx + offset + featured.length) % featured.length;

      return {
        product: featured[index],
        index,
        offset,
      };
    })
    .filter(
      (item, i, arr) =>
        arr.findIndex((p) => p.index === item.index) === i
    )
    .sort((a, b) => a.offset - b.offset);

  return (
    <section className="py-16 bg-[#090a0e] border-b border-white/5 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Featured Products
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative flex items-center justify-center min-h-[380px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:left-2 z-30 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
            aria-label="Previous product"
          >
            &#10094;
          </button>

          {/* Product Cards */}
          <div className="flex items-center justify-center w-full max-w-6xl overflow-hidden">

            {visibleProducts.map(({ product, index, offset }) => {

              const isCenter = offset === 0;
              const distance = Math.abs(offset);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIdx(index);
                    }
                  }}
                  className={`
                    flex flex-col items-center justify-center
                    text-center cursor-pointer
                    transition-all duration-700 ease-in-out
                    flex-shrink-0
                    ${isCenter
                      ? 'w-full sm:w-2/5 scale-100 opacity-100 z-20'
                      : distance === 1
                        ? 'hidden sm:flex w-1/5 scale-90 opacity-60 z-10'
                        : 'hidden sm:flex w-1/5 scale-75 opacity-30 z-0'
                    }
                  `}
                >

                  {/* Product Name */}
                  <p className={`
                    font-semibold text-gray-300 mb-3 truncate max-w-full px-2
                    ${isCenter ? 'text-base sm:text-lg' : 'text-xs'}
                  `}>
                    {product.title}
                  </p>

                  {/* Product Image */}
                  <div className={`
                    flex items-center justify-center mb-4
                    transition-all duration-700
                    ${isCenter
                      ? 'w-64 h-64 sm:w-72 sm:h-72'
                      : distance === 1
                        ? 'w-40 h-40 sm:w-48 sm:h-48'
                        : 'w-28 h-28 sm:w-36 sm:h-36'
                    }
                  `}>
                    <img
                      src={product.images?.[0] || product.heroImage}
                      alt={product.title}
                      className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          '/images/products/boat203-1.png';
                      }}
                    />
                  </div>

                  {/* Product Price */}
                  <div className="flex items-baseline gap-2">

                    <span className={`
                      font-bold text-white
                      ${isCenter ? 'text-xl sm:text-2xl' : 'text-sm'}
                    `}>
                      ₹{Number(product.finalPrice || 0).toLocaleString('en-IN')}
                    </span>

                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-2 z-30 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
            aria-label="Next product"
          >
            &#10095;
          </button>

        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">

          {featured.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIdx(idx)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${activeIdx === idx
                  ? 'w-6 bg-red-600'
                  : 'w-2 bg-gray-600 hover:bg-gray-400'
                }
              `}
              aria-label={`Featured slide ${idx + 1}`}
            />
          ))}

        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;