import React from 'react';
import { CartItem } from '../types';
import { X, Minus, ShoppingBag, ArrowRight, Zap } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
  total: number;
  savingsMessage: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onRemove,
  onCheckout,
  total,
  savingsMessage
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white z-50 transform transition-transform duration-300 flex flex-col border-l border-gray-100 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Selection</h2>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          ) : (
            <>
              {savingsMessage && (
                <div className="bg-black text-white p-4 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                  <span>{savingsMessage}</span>
                </div>
              )}
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.code} className="w-full h-full object-cover mix-blend-multiply opacity-80" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        <span className="text-xs font-mono text-gray-400">{item.code}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-medium text-gray-900">¥{item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-black text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1"
                      >
                        <Minus size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-3xl font-black text-gray-900 tracking-tight">¥{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-black hover:bg-gray-800 text-white py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;