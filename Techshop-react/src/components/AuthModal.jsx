import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';

const AuthModal = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    loginUser,
    signupUser,
  } = useShop();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('Please enter all required fields');
        return;
      }
      loginUser(email, password);
    } else {
      if (!username || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      signupUser(username, email, password);
    }
  };

  const handleSocialLogin = (platform) => {
    const defaultUser = `${platform.toLowerCase()}_user`;
    const defaultEmail = `${defaultUser}@example.com`;
    loginUser(defaultEmail, 'dummy_password');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#13151b] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <AiOutlineClose className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold capitalize">
            {authMode === 'signup' ? 'Signup' : 'Login'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {authMode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthMode('login');
                  }}
                  className="text-red-500 hover:underline font-medium cursor-pointer"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthMode('signup');
                  }}
                  className="text-red-500 hover:underline font-medium cursor-pointer"
                >
                  Signup
                </button>
              </>
            )}
          </p>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="mb-4 p-2.5 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1b1e27] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder={authMode === 'signup' ? 'Email' : 'Email or Username'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1b1e27] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1b1e27] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#1b1e27] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#e50914] hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer text-sm shadow-lg shadow-red-900/30 uppercase tracking-wide mt-2"
          >
            {authMode === 'signup' ? 'Signup' : 'Login'}
          </button>
        </form>

        {/* Social Login Section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:w-[28%] before:h-px before:bg-white/10 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-[28%] after:h-px after:bg-white/10">
            or {authMode === 'signup' ? 'signup' : 'login'} with
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#3b5998] hover:bg-[#2d4373] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
              <span>Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#ea4335] hover:bg-[#c53727] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FaGoogle className="w-3.5 h-3.5" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Twitter')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1da1f2] hover:bg-[#0c85d0] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FaTwitter className="w-3.5 h-3.5" />
              <span>Twitter</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
