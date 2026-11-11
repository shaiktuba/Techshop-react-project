import { useState, useRef, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';

import {
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineClose,
} from 'react-icons/ai';

import { FiLogOut } from 'react-icons/fi';

const FALLBACK_IMAGE = '/images/products/jbl660nc-1.png';

const Navbar = () => {
  const {
    products,
    navigateTo,
    cartCount,
    user,
    openAuth,
    logoutUser,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [userDropdown, setUserDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Focus input and handle outside click / Escape
  useEffect(() => {
    if (!isSearchOpen) return;

    searchInputRef.current?.focus();

    const handleOutsideClick = (e) => {
      if (!searchContainerRef.current?.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return products.filter((item) =>
      [item.title, item.brand, item.category, item.info]
        .some(value =>
          String(value ?? '').toLowerCase().includes(query)
        )
    );
  }, [products, searchQuery]);

  // Select search result
  const handleSelectProduct = (product) => {
    navigateTo('details', product);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // User dropdown
  const handleUserClick = () => {
    setUserDropdown(prev => !prev);
  };

  // Open Login / Signup modal
  const handleAuthClick = () => {
    setUserDropdown(false);
    openAuth('login');
  };

  // Logout
  const handleLogout = () => {
    logoutUser();
    setUserDropdown(false);
  };

  // Fallback image
  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-white/5 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigateTo('home')} aria-label="Home">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:text-red-500 transition-colors">
            Tech-Shop
          </h1>
        </button>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-6 sm:space-x-7">

          {/* Search */}
          <div className="relative" ref={searchContainerRef}>

            <button
              onClick={() => setIsSearchOpen(prev => !prev)}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/5"
              aria-label="Search"
              aria-expanded={isSearchOpen}
            >
              <AiOutlineSearch className="w-6 h-6" />
            </button>

            {/* Search Box */}
            {isSearchOpen && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[85vw] lg:w-[80vw] bg-[#14161f] border border-white/10 rounded-xl shadow-2xl p-4 z-50">

                <div className="relative flex items-center">

                  <AiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3" />

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search headphones, earbuds, boAt, JBL..."
                    className="w-full bg-[#1e202c] text-white text-sm rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-red-600 border border-white/5 placeholder-gray-400"
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-gray-400 hover:text-white"
                      aria-label="Clear search"
                    >
                      <AiOutlineClose className="w-4 h-4" />
                    </button>
                  )}

                </div>

                {/* Search Results */}
                {searchQuery.trim() && (
                  <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-white/5">

                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(prod => (
                        <button
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-left"
                        >

                          <img
                            src={prod.images?.[0] || prod.heroImage || FALLBACK_IMAGE}
                            alt={prod.title || 'Product'}
                            className="w-12 h-12 object-contain bg-black/30 rounded p-1"
                            onError={handleImageError}
                          />

                          <div className="flex-1 min-w-0">

                            <h4 className="text-sm font-semibold text-white truncate">
                              {prod.title}
                            </h4>

                            <p className="text-xs text-gray-400 truncate">
                              {prod.info}
                            </p>

                            <span className="text-xs text-red-500 font-bold">
                              ₹{Number(prod.finalPrice || 0).toLocaleString('en-IN')}
                            </span>

                          </div>

                          <span className="text-[10px] uppercase text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {prod.brand}
                          </span>

                        </button>
                      ))
                    ) : (
                      <p className="py-6 text-center text-sm text-gray-400">
                        No products found matching "{searchQuery}"
                      </p>
                    )}

                  </div>
                )}

              </div>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={() => navigateTo('cart')}
            className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/5"
            aria-label={`Cart, ${cartCount} items`}
          >

            <AiOutlineShoppingCart className="w-6 h-6" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0c0d12]">
                {cartCount}
              </span>
            )}

          </button>

          {/* User */}
          <div className="relative">

            <button
              onClick={handleUserClick}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/5"
              aria-label="User account"
              aria-expanded={userDropdown}
            >
              <AiOutlineUser className="w-6 h-6" />
            </button>

            {/* User Dropdown */}
            {userDropdown && (
              <div className="absolute right-0 top-12 w-[300px] bg-[#14161f] border border-white/10 rounded-lg shadow-2xl p-4 z-50">

                {user ? (
                  <>
                    <div className="pb-3 border-b border-white/10">

                      <p className="text-xs text-gray-400">
                        Signed in as
                      </p>

                      <p className="text-sm font-semibold text-white truncate mt-1">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate mt-1">
                        {user.email}
                      </p>

                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 mt-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-semibold text-gray-200">
                      Hello!
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Access account and manage orders
                    </p>

                    <button
                      onClick={handleAuthClick}
                      className="mt-4 px-4 py-2 border border-gray-500 text-gray-300 hover:text-white hover:border-white transition-colors text-sm"
                    >
                      Login / Signup
                    </button>

                    <div className="border-t border-white/10 mt-4 pt-4">
                      <p className="text-sm text-gray-400">
                        Please Login
                      </p>
                    </div>
                  </>
                )}

              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;