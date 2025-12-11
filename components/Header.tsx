import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col justify-center">
             <h1 className="text-2xl font-black tracking-tighter text-black leading-none">MAXNotes</h1>
        </div>

        <button 
          onClick={onOpenCart}
          className="flex items-center gap-2 group"
        >
          <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">Cart</span>
          <div className="relative">
            <ShoppingBag size={20} className="text-gray-900" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;