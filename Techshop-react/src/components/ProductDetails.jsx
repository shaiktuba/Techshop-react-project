import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { AiFillStar, AiOutlineCheck } from 'react-icons/ai';

const ProductDetails = () => {
  const {
    products,
    selectedProduct,
    addToCart,
    navigateTo,
    reviews,
    addReview,
  } = useShop();

  // If no product selected, default to first product
  const product = selectedProduct || products[0];

  const imagesList = product.images && product.images.length > 0
    ? product.images
    : [product.heroImage || '/images/products/jbl660nc-1.png'];

  const [activeImage, setActiveImage] = useState(imagesList[0]);
  const [activeTab, setActiveTab] = useState('specifications'); // 'specifications', 'overview', 'reviews'

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // When selectedProduct changes, update activeImage
  React.useEffect(() => {
    if (imagesList && imagesList[0]) {
      setActiveImage(imagesList[0]);
    }
  }, [product.id]);

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  // Calculate discount percentage
  const discountAmount = product.originalPrice ? product.originalPrice - product.finalPrice : 0;
  const discountPercent = product.originalPrice
    ? Math.round((discountAmount / product.originalPrice) * 100)
    : 0;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    addReview({
      name: reviewName,
      rateCount: reviewRating,
      review: reviewComment,
    });
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="py-12 bg-[#0b0c10] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <span onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer">
            Home
          </span>
          <span>/</span>
          <span onClick={() => navigateTo('catalog')} className="hover:text-white cursor-pointer">
            {product.category}
          </span>
          <span>/</span>
          <span className="text-white truncate">{product.title}</span>
        </div>

        {/* Main Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left: Gallery (Thumbnails + Main Image) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-6 items-center sm:items-start justify-center">
            
            {/* Thumbnails (Vertical on desktop) */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#14161f] border p-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    activeImage === img
                      ? 'border-red-600 shadow-md shadow-red-900/30 ring-1 ring-red-600'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/products/jbl660nc-1.png';
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Preview Image */}
            <div className="flex-1 w-full max-w-[460px] h-[360px] sm:h-[450px] bg-[#14161f]/60 border border-white/5 rounded-2xl flex items-center justify-center p-6 relative group">
              <img
                src={activeImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/products/jbl660nc-1.png';
                }}
              />
            </div>

          </div>

          {/* Right: Details & Buying Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {product.title}
              </h1>
              <p className="text-sm text-gray-400 mt-1">{product.info}</p>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < (product.rateCount || 5) ? 'text-red-600' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                | {product.ratings || 1234} Ratings
              </span>
            </div>

            <hr className="border-white/10" />

            {/* Pricing Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  ₹{product.finalPrice.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <AiOutlineCheck className="w-3 h-3" /> In Stock
                </span>
              </div>

              {discountAmount > 0 && (
                <p className="text-xs font-semibold text-emerald-400">
                  You save: ₹{discountAmount.toLocaleString('en-IN')} ({discountPercent}%) [Inclusive of all taxes]
                </p>
              )}
            </div>

            {/* Offers & Discounts */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Offers and Discounts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#13151d] border border-white/5 rounded-xl">
                  <p className="text-xs font-bold text-white">No Cost EMI</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Available on selected credit cards</p>
                </div>
                <div className="p-3 bg-[#13151d] border border-white/5 rounded-xl">
                  <p className="text-xs font-bold text-white">Pay Later Cashback</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Avail up to ₹500 cashback</p>
                </div>
              </div>
            </div>

            <hr className="border-white/10" />

            {/* Action Button */}
            <div>
              <button
                onClick={() => addToCart(product, 1)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg shadow-red-900/40 uppercase tracking-wider text-sm cursor-pointer"
              >
                Add to cart
              </button>
            </div>

          </div>

        </div>

        {/* Tabbed Info Section (Specifications, Overview, Reviews) */}
        <div className="mb-20">
          <div className="flex justify-center items-center gap-6 sm:gap-10 my-8">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-7 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                activeTab === 'specifications'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-7 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-7 py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Reviews {reviews.length > 0 ? `(${reviews.length})` : ''}
            </button>
          </div>

          {/* Specifications Content */}
          {activeTab === 'specifications' && (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6">
              <table className="w-full text-sm sm:text-base border-collapse">
                <tbody>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Brand</td>
                    <td className="py-3 sm:py-3.5 text-white">{product.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Model</td>
                    <td className="py-3 sm:py-3.5 text-white">{product.title}</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Generic Name</td>
                    <td className="py-3 sm:py-3.5 text-white">{product.category}</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Headphone Type</td>
                    <td className="py-3 sm:py-3.5 text-white">{product.type || 'Over Ear'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Connectivity</td>
                    <td className="py-3 sm:py-3.5 text-white">{product.connectivity || 'Wireless'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 sm:py-3.5 text-gray-300 w-2/5 sm:w-1/3">Microphone</td>
                    <td className="py-3 sm:py-3.5 text-white">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              <p>
                Experience world-class acoustic engineering with the <strong className="text-white">{product.title}</strong>. 
                Engineered for audiophiles and daily commuters alike, this device delivers signature high-definition sound with punchy bass, crisp highs, and nuanced mid-tones.
              </p>
              <p>
                Features active noise cancellation (ANC) algorithms to filter ambient city hum, long-lasting battery life with ultra-fast quick charging, ergonomic memory foam cushions for fatigue-free all-day comfort, and seamless multi-device Bluetooth pairing.
              </p>
            </div>
          )}

          {/* Reviews Content */}
          {activeTab === 'reviews' && (
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#12131a] border border-white/5 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        <span className="text-xs text-gray-500">• {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <AiFillStar
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rateCount ? 'text-red-600' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">{rev.review}</p>
                  </div>
                ))}
              </div>

              {/* Add a Review Form */}
              <div className="bg-[#141620] border border-white/10 rounded-2xl p-6">
                <h4 className="text-base font-bold text-white mb-4">Add Your Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full bg-[#1b1d28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="w-full bg-[#1b1d28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - Fair</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Your Feedback</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your honest opinion about the sound, build quality, and comfort..."
                      required
                      className="w-full bg-[#1b1d28] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-white/5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight text-center mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[#12131a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group shadow-lg"
                >
                  <div
                    onClick={() => navigateTo('details', rel)}
                    className="w-full h-44 flex items-center justify-center p-2 mb-4 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={rel.images?.[0] || rel.heroImage}
                      alt={rel.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
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
                            i < (rel.rateCount || 5) ? 'text-red-600' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <h3
                      onClick={() => navigateTo('details', rel)}
                      className="text-sm font-bold text-white group-hover:text-red-500 transition-colors cursor-pointer truncate"
                    >
                      {rel.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3 truncate">{rel.info}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-base font-extrabold text-white">
                        ₹{rel.finalPrice.toLocaleString('en-IN')}
                      </span>
                      {rel.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ₹{rel.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(rel, 1)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider shadow-md hover:shadow-red-900/30 cursor-pointer"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;