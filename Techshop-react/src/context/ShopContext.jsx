import React, { createContext, useContext, useState, useEffect } from 'react';
import productsData from '../data/productsData';

const ShopContext = createContext();

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider = ({ children }) => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('home'); // 'home', 'catalog', 'cart', 'details'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State (Initialized with sample or empty)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('techshop_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // User Auth State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('techshop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Toast / Alert State
  const [toast, setToast] = useState(null);

  // Reviews State (supports adding new reviews)
  const [reviews, setReviews] = useState([]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techshop_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Save user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('techshop_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('techshop_user');
      }
    } catch (e) {
      console.error('Failed to save user:', e);
    }
  }, [user]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Navigation Helper
  const navigateTo = (view, product = null) => {
    setCurrentView(view);
    if (product) {
      setSelectedProduct(product);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSearchOpen(false);
  };

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    showToast(`Added "${product.title}" to Cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.product.id === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.title}" from Cart`, 'info');
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const originalTotal = cart.reduce(
    (total, item) => total + (item.product.originalPrice || item.product.finalPrice) * item.quantity,
    0
  );

  const finalTotal = cart.reduce(
    (total, item) => total + item.product.finalPrice * item.quantity,
    0
  );

  const discountTotal = originalTotal - finalTotal;
  const deliveryFee = finalTotal > 0 ? 0 : 0; // Free delivery

  // Auth Functions
  const loginUser = (email, password) => {
    const username = email.split('@')[0] || 'User';
    const userData = { email, name: username };
    setUser(userData);
    setAuthModalOpen(false);
    showToast(`Login Successful! Welcome back, ${userData.name}!`);
  };

  const signupUser = (username, email, password) => {
    const userData = { email, name: username };
    setUser(userData);
    setAuthModalOpen(false);
    showToast(`Account Created Successfully! Welcome to TechShop, ${username}!`);
  };

  const logoutUser = () => {
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Add Review
  const addReview = (newReview) => {
    setReviews((prev) => [
      {
        id: Date.now(),
        date: 'Today',
        ...newReview,
      },
      ...prev,
    ]);
    showToast('Thank you! Your review has been submitted.');
  };

  return (
    <ShopContext.Provider
      value={{
        products: productsData,
        currentView,
        selectedProduct,
        navigateTo,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        originalTotal,
        finalTotal,
        discountTotal,
        deliveryFee,
        user,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        loginUser,
        signupUser,
        logoutUser,
        toast,
        showToast,
        setToast,
        reviews,
        addReview,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
