import React from 'react';
import { useShop } from '../context/ShopContext';
import { FiCheckCircle, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

const Toast = () => {
  const { toast, setToast } = useShop();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-24 right-5 z-50 max-w-sm w-full bg-[#161821] border border-white/10 rounded-xl shadow-2xl p-4 flex items-center gap-3 text-white animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="flex-shrink-0">
        {isSuccess && <FiCheckCircle className="w-5 h-5 text-emerald-400" />}
        {isError && <FiAlertCircle className="w-5 h-5 text-red-500" />}
        {!isSuccess && !isError && <FiInfo className="w-5 h-5 text-blue-400" />}
      </div>
      <div className="flex-1 text-sm font-medium pr-2">
        {toast.message}
      </div>
      <button
        onClick={() => setToast(null)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <AiOutlineClose className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
