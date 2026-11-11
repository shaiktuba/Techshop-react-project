import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FiTrash2, FiPlus, FiMinus, FiCheckCircle } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Cart = () => {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    originalTotal,
    finalTotal,
    discountTotal,
    navigateTo,
    showToast,
  } = useShop();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'card',
  });

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setCheckoutModalOpen(false);
      setOrderPlaced(false);
      showToast('Order Placed Successfully! Thank you for shopping with TechShop.');
      navigateTo('home');
    }, 2500);
  };

  // If cart is empty, show empty state matching requirement
  if (cartCount === 0) {
    return (
      <div className="py-24 bg-[#0b0c10] min-h-[70vh] flex items-center justify-center text-white px-4">
        <div className="text-center max-w-md animate-in fade-in duration-300">
          <div className="w-36 h-36 mx-auto mb-6 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 14h9l8 55h49l10-43H22" />
              <path d="M42 34l17 17M59 34L42 51" />
              <circle cx="35" cy="82" r="7" />
              <circle cx="69" cy="82" r="7" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Your Cart is Empty
          </h2>
          {/* <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Looks like you haven't added any products to your cart yet. Explore our top-rated headphones and earbuds!
          </p> */}
          <button
            onClick={() => navigateTo('home')}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-red-900/40 uppercase tracking-wider text-xs cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <span onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer">
            Home
          </span>
          <span>/</span>
          <span className="text-white">Cart</span>
        </div>

        {/* Main Cart Grid: Left Items + Right Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 divide-y divide-white/10">
            {cart.map((item) => {
              const { product, quantity } = item;
              return (
                <div
                  key={product.id}
                  className="py-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
                >
                  {/* Product Image */}
                  <div
                    onClick={() => navigateTo('details', product)}
                    className="w-28 h-28 sm:w-32 sm:h-32 bg-[#14161f] rounded-xl p-3 flex items-center justify-center flex-shrink-0 cursor-pointer border border-white/5 hover:border-white/20 transition-all"
                  >
                    <img
                      src={product.images?.[0] || product.heroImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/products/jbl660nc-1.png';
                      }}
                    />
                  </div>

                  {/* Product Details & Controls */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="cursor-pointer" onClick={() => navigateTo('details', product)}>
                        <h3 className="text-base font-bold text-white hover:text-red-500 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">{product.info}</p>
                      </div>

                      {/* Trash Icon */}
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-white">
                        ₹{product.finalPrice.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="inline-flex items-center border border-white/10 rounded-lg bg-[#14161f]">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Decrease quantity"
                      >
                        <FiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-red-500 select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 bg-[#12131a] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-5 sticky top-28 shadow-xl">
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Order Summary ( {cartCount} {cartCount === 1 ? 'item' : 'items'} )
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Original Price</span>
                <span className="font-semibold text-white">
                  ₹{originalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span className="font-semibold">
                  - ₹{discountTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Delivery</span>
                <span className="font-semibold">Free</span>
              </div>
            </div>

            <hr className="border-white/10" />

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-base font-bold text-white">Total Price</span>
              <span className="text-2xl font-black text-white">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-red-900/40 uppercase tracking-wider text-xs cursor-pointer mt-4"
            >
              Checkout
            </button>
          </div>

        </div>

      </div>

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#14161f] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors"
            >
              <AiOutlineClose className="w-5 h-5" />
            </button>

            {orderPlaced ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <FiCheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Order Confirmed!</h3>
                <p className="text-sm text-gray-300">
                  Thank you! Your order of ₹{finalTotal.toLocaleString('en-IN')} has been placed.
                </p>
                <p className="text-xs text-gray-500">Redirecting to Home...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4">Complete Checkout</h3>
                <p className="text-xs text-gray-400 mb-6">
                  Review and confirm your order details below.
                </p>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Durga Prasad"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      className="w-full bg-[#1c1e28] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Audio Street, Tech City"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full bg-[#1c1e28] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Bengaluru"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full bg-[#1c1e28] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        placeholder="560001"
                        value={shippingInfo.pincode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                        className="w-full bg-[#1c1e28] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'card' })}
                        className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                          shippingInfo.paymentMethod === 'card'
                            ? 'border-red-600 bg-red-600/10 text-white'
                            : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'upi' })}
                        className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                          shippingInfo.paymentMethod === 'upi'
                            ? 'border-red-600 bg-red-600/10 text-white'
                            : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingInfo({ ...shippingInfo, paymentMethod: 'cod' })}
                        className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                          shippingInfo.paymentMethod === 'cod'
                            ? 'border-red-600 bg-red-600/10 text-white'
                            : 'border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="text-lg font-bold text-white">₹{finalTotal.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Place Order
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Cart;