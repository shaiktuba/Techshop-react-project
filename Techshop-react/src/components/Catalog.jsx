import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { sortMenu, brandsMenu as defaultBrands, categoryMenu as defaultCategories } from '../data/filterBarData';
import { AiFillStar, AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';

const Catalog = () => {
  const { products, addToCart, navigateTo } = useShop();

  const [selectedSort, setSelectedSort] = useState(1); // 1: Latest
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(25000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle brand
  const handleBrandToggle = (brandLabel) => {
    setSelectedBrands((prev) =>
      prev.includes(brandLabel)
        ? prev.filter((b) => b !== brandLabel)
        : [...prev, brandLabel]
    );
  };

  // Toggle category
  const handleCategoryToggle = (catLabel) => {
    setSelectedCategories((prev) =>
      prev.includes(catLabel)
        ? prev.filter((c) => c !== catLabel)
        : [...prev, catLabel]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSort(1);
    setMaxPrice(25000);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Brands filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.some((b) => b.toLowerCase() === p.brand.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.some((c) => c.toLowerCase() === p.category.toLowerCase())
      );
    }

    // Price filter
    result = result.filter((p) => p.finalPrice <= maxPrice);

    // Sorting
    switch (selectedSort) {
      case 1: // Latest
        result.sort((a, b) => b.id - a.id);
        break;
      case 2: // Featured
        result.sort((a, b) => (b.tag === 'featured-product' ? 1 : 0) - (a.tag === 'featured-product' ? 1 : 0));
        break;
      case 3: // Top Rated
        result.sort((a, b) => (b.rateCount || 0) - (a.rateCount || 0));
        break;
      case 4: // Price(Lowest First)
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case 5: // Price(Highest First)
        result.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedBrands, selectedCategories, selectedSort, maxPrice]);

  return (
    <div className="py-10 bg-[#0b0c10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <span onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer">
                Home
              </span>
              <span>/</span>
              <span className="text-white">All Products</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              All Audio Products
            </h1>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen((prev) => !prev)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#171922] border border-white/10 rounded-lg text-sm text-white"
          >
            <AiOutlineFilter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside
            className={`${
              mobileFilterOpen ? 'fixed inset-0 z-50 bg-[#0e1017] p-6 overflow-y-auto block' : 'hidden md:block'
            } md:relative md:z-0 md:bg-transparent md:p-0 space-y-8`}
          >
            {mobileFilterOpen && (
              <div className="flex items-center justify-between pb-4 border-b border-white/10 md:hidden mb-6">
                <h3 className="text-lg font-bold">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <AiOutlineClose className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Sort Menu */}
            <div className="bg-[#12131a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                Sort By
              </h3>
              <div className="space-y-2">
                {sortMenu.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sortMenu"
                      checked={selectedSort === item.id}
                      onChange={() => setSelectedSort(item.id)}
                      className="accent-red-600"
                    />
                    <span>{item.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Brands */}
            <div className="bg-[#12131a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                Brands
              </h3>
              <div className="space-y-2.5">
                {defaultBrands.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.label)}
                      onChange={() => handleBrandToggle(b.label)}
                      className="accent-red-600 rounded"
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Categories */}
            <div className="bg-[#12131a] border border-white/5 rounded-xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                Category
              </h3>
              <div className="space-y-2.5">
                {defaultCategories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.label)}
                      onChange={() => handleCategoryToggle(c.label)}
                      className="accent-red-600 rounded"
                    />
                    <span>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-[#12131a] border border-white/5 rounded-xl p-5">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
                <span>Max Price</span>
                <span className="text-red-500 font-extrabold">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="400"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={clearAllFilters}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-white/5 cursor-pointer uppercase"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Product Grid Area */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-400">
                Showing <span className="text-white font-bold">{filteredProducts.length}</span> of {products.length} products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#12131a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group shadow-lg"
                  >
                    <div
                      onClick={() => navigateTo('details', prod)}
                      className="w-full h-48 flex items-center justify-center p-2 mb-4 cursor-pointer overflow-hidden"
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

                    <div>
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
                      >
                        {prod.title}
                      </h3>

                      <p className="text-xs text-gray-400 mt-1 mb-4 truncate">
                        {prod.info}
                      </p>

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

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider shadow-md hover:shadow-red-900/30 cursor-pointer"
                    >
                      Add to cart
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#12131a] border border-white/5 rounded-xl p-12 text-center">
                <p className="text-lg text-gray-300 mb-2">No products match your selected filters</p>
                <p className="text-xs text-gray-500 mb-6">Try clearing or adjusting the filter options</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};

export default Catalog;
