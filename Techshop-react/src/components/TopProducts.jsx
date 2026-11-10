import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { AiFillStar, AiOutlineArrowRight } from 'react-icons/ai';

const categories = ['All', 'Headphones', 'Earbuds', 'Earphones', 'Neckbands'];

const TopProducts = () => {
  const { products, addToCart, navigateTo } = useShop();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All'
    ? products.slice(0, 11) // Display first 11 products + the 12th card is "Browse All Products"
    : products.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-16 bg-[#0c0d12] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Top Products
          </h2>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#12131a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group shadow-lg"
            >
              {/* Product Image */}
              <div
                onClick={() => navigateTo('details', prod)}
                className="w-full h-48 flex items-center justify-center p-2 mb-4 cursor-pointer overflow-hidden relative"
              >
                <img
                  src={prod.images?.[0] || prod.heroImage}
                  alt={prod.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/products/jbl660nc-1.png';
                  }}
                />
              </div>

              {/* Product Info */}
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <AiFillStar
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (prod.rateCount || 5) ? 'text-red-600' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <h3
                  onClick={() => navigateTo('details', prod)}
                  className="text-base font-bold text-white group-hover:text-red-500 transition-colors cursor-pointer truncate"
                  title={prod.title}
                >
                  {prod.title}
                </h3>

                <p className="text-xs text-gray-400 mt-1 mb-4 truncate" title={prod.info}>
                  {prod.info}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-extrabold text-white">
                    ₹{prod.finalPrice.toLocaleString('en-IN')}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(prod, 1)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider shadow-md hover:shadow-red-900/30 cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          ))}

          {/* Browse All Products Card (visible on 'All' category tab) */}
          {activeCategory === 'All' && (
            <div
              onClick={() => navigateTo('catalog')}
              className="bg-[#12131a] border border-dashed border-white/20 hover:border-red-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 min-h-[350px]"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-red-600/20 flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-all mb-4">
                <AiOutlineArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
                Browse All Products
              </h3>
              <p className="text-xs text-gray-400 mt-2">
                Explore all {products.length} audio devices with filters & sorting
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default TopProducts;
