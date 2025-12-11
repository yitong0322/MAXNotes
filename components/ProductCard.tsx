import React from 'react';
import { Product } from '../types';
import { Plus, Infinity } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  variant?: 'default' | 'bundle';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, variant = 'default' }) => {
  const isBundle = variant === 'bundle';

  return (
    <div className={`
      group flex flex-col h-full relative
      rounded-3xl overflow-hidden
      transition-all duration-300 ease-out
      ${isBundle 
        ? 'bg-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 ring-1 ring-white/10' 
        : 'bg-white text-gray-900 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 border border-gray-100'
      }
    `}>
      {/* Image Preview Area */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-700 ${isBundle ? 'opacity-90 group-hover:scale-105' : 'mix-blend-multiply opacity-90 group-hover:scale-105 group-hover:opacity-100'}`}
        />
        {/* Minimal Category Tag */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md rounded-full border ${
            isBundle 
              ? 'bg-white/20 border-white/10 text-white' 
              : 'bg-white/80 border-white/50 text-gray-900 shadow-sm'
          }`}>
            {isBundle ? 'Premium' : product.category}
          </span>
        </div>
      </div>

      <div className={`flex-1 flex flex-col p-6`}>
        <div className="mb-2 flex items-center justify-between">
           <span className={`text-xs font-mono font-medium ${isBundle ? 'text-gray-400' : 'text-gray-400'}`}>
             {product.code}
           </span>
           <span className={`text-[10px] uppercase tracking-wide font-semibold ${isBundle ? 'text-gray-500' : 'text-gray-300'}`}>
             {product.filterCategory}
           </span>
        </div>

        <h3 className={`text-lg font-bold mb-3 leading-tight tracking-tight ${isBundle ? 'text-white text-2xl' : 'text-gray-900'}`}>
          {product.name}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-8 font-normal ${isBundle ? 'text-gray-400' : 'text-gray-500'}`}>
          {product.description}
        </p>

        <div className={`mt-auto flex items-center justify-between pt-5 border-t ${isBundle ? 'border-gray-800' : 'border-gray-50'}`}>
          <span className={`text-lg font-bold ${isBundle ? 'text-white' : 'text-gray-900'}`}>
            ¥{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className={`
              flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-full
              ${isBundle 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            <span>{isBundle ? 'Get DaBao' : 'Add'}</span>
            {isBundle ? <Infinity size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;