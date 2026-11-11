import React, { useState } from 'react';
import { footMenu, footSocial } from '../data/footerData';
import { useShop } from '../context/ShopContext';
import { AiOutlineArrowUp } from 'react-icons/ai';

const Footer = () => {
  const { showToast, navigateTo } = useShop();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Subscribed! We will send updates to ${email}`);
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090d] text-white pt-16 pb-12 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand & Newsletter Column (spans 2 columns) */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <h2
              onClick={() => navigateTo('home')}
              className="text-2xl font-black tracking-tight text-white cursor-pointer hover:text-red-500 transition-colors"
            >
              Tech-Shop
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Subscribe to our Email alerts to receive early discount offers, and new products info.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
              <input
                type="email"
                required
                placeholder="Email Address*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full max-w-sm bg-[#12141c] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md hover:shadow-red-900/30"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          
          {footMenu.map((group) => (
            <div key={group.id} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {group.title}
              </h3>
              <ul className="space-y-2 text-xs text-gray-400">
                {group.menu.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        showToast(`Navigating to ${item.link}`, 'info');
                      }}
                      className="hover:text-red-500 transition-colors cursor-pointer text-left"
                    >
                      {item.link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

    
        <hr className="border-white/5 mb-8" />

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            {new Date().getFullYear()} | All Rights Reserved ©.
          </p>

       
          <div className="flex items-center gap-5">
            {footSocial.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => e.preventDefault()}
                className="text-gray-400 hover:text-white hover:scale-110 transition-all text-sm"
                aria-label="Social Link"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-30 w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center shadow-lg shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
        title="Back to Top"
        aria-label="Back to top"
      >
        <AiOutlineArrowUp className="w-5 h-5 font-bold" />
      </button>
    </footer>
  );
};

export default Footer;
