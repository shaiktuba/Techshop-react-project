import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineUser, AiOutlineClose } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';

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

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchOpen]);

  // Filter products for search
  const filteredProducts = searchQuery.trim() === ''
    ? []
    : products.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.info.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectProduct = (product) => {
    navigateTo('details', product);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleUserIconClick = () => {
    if (user) {
      setUserDropdown((prev) => !prev);
    } else {
      openAuth('login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d12]/95 backdrop-blur-md border-b border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo - TechShop with h1 tag as requested */}
        <div
          onClick={() => navigateTo('home')}
          className="cursor-pointer group flex items-center gap-1"
        >
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-red-500 transition-colors">
            Tech<span>-Shop</span>
          </h1>
        </div>

        {/* Right Navigation Icons */}
        <div className="flex items-center space-x-6 sm:space-x-7 relative">
          
          {/* 1. Search Icon */}
          <div className="relative" ref={searchContainerRef}>
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer relative group"
              title="Search"
              aria-label="Search"
            >
              <AiOutlineSearch className="w-6 h-6" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                Search
              </span>
            </button>

            {/* Interactive Search Overlay / Input Field */}
            {isSearchOpen && (
              <div className="absolute right-0 top-12 w-[320px] sm:w-[420px] bg-[#14161f] border border-white/10 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative flex items-center">
                  <AiOutlineSearch className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search headphones, earbuds, boAt, JBL..."
                    className="w-full bg-[#1e202c] text-white text-sm rounded-lg pl-10 pr-9 py-2.5 outline-none focus:ring-2 focus:ring-red-600 border border-white/5 placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-gray-400 hover:text-white"
                    >
                      <AiOutlineClose className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Live Search Suggestions Dropdown */}
                {searchQuery.trim() !== '' && (
                  <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-white/5">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <img
                            src={prod.images?.[0] || prod.heroImage}
                            alt={prod.title}
                            className="w-12 h-12 object-contain bg-black/30 rounded p-1 flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/products/jbl660nc-1.png';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white group-hover:text-red-500 truncate transition-colors">
                              {prod.title}
                            </h4>
                            <p className="text-xs text-gray-400 truncate">{prod.info}</p>
                            <span className="text-xs text-red-500 font-bold">
                              ₹{prod.finalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {prod.brand}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-gray-400">
                        No products found matching "<span className="text-white">{searchQuery}</span>"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Cart Icon with Badge */}
          <div className="relative">
            <button
              onClick={() => navigateTo('cart')}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer relative group"
              title="Cart"
              aria-label="Cart"
            >
              <AiOutlineShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0c0d12] shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                Cart
              </span>
            </button>
          </div>

          {/* 3. Login / User Icon */}
          <div className="relative">
            <button
              onClick={handleUserIconClick}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer relative group"
              title={user ? user.name : 'Login'}
              aria-label="Login"
            >
              <AiOutlineUser className="w-6 h-6" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                {user ? user.name : 'Login'}
              </span>
            </button>

            {/* Logged in User Menu Dropdown */}
            {user && userDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-[#14161f] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setUserDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
