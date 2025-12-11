import React, { useState } from 'react';
import { CartItem } from '../types'; // 确保路径正确
import { X, Loader2, CreditCard, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  cart: CartItem[];
  onSuccess?: () => void; // 这里的 onSuccess 暂时用不到，因为会跳转
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  cart,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理支付跳转
  const handleCheckout = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1. 调用我们在 Vercel 里的后端 API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 把购物车数据传给后端
        body: JSON.stringify({ cartItems: cart }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 2. 如果后端成功返回了 Stripe 的 URL，就跳转过去
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (err) {
      console.error("Payment Error:", err);
      setError('Connection failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-100 flex flex-col relative overflow-hidden">
        
        {/* 顶部关闭按钮 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-black text-lg tracking-tight flex items-center gap-2">
            <Lock size={16} className="text-green-600" />
            Secure Checkout
          </h3>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-black transition-colors">
             <X size={24} />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-8">
          
          {/* 订单摘要 */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Order Summary</p>
            <div className="flex justify-between items-baseline border-b-2 border-black pb-2">
               <span className="text-3xl font-black tracking-tighter">${totalAmount.toFixed(2)}</span>
               <span className="text-gray-500 font-medium">{cart.reduce((a, b) => a + b.quantity, 0)} items</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Includes access to {cart.length} Google Drive resource(s).
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium border border-red-100 rounded">
              {error}
            </div>
          )}

          {/* 支付按钮区域 */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <Loader2 className="animate-spin text-black" size={32} />
              <p className="text-sm text-gray-500 font-mono animate-pulse">Redirecting to Stripe...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#635BFF] hover:bg-[#5346E0] text-white font-bold text-lg py-4 rounded-md transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
              >
                 <span>Pay with Stripe</span>
                 <CreditCard size={20} />
              </button>
              
              <div className="text-center">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                   Encrypted by Stripe • SSL Secure
                 </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;