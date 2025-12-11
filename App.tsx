
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { Product, CartItem } from './types';
import { fetchProducts, fetchBundle } from './services/productService';
import { Search, CheckCircle2 } from 'lucide-react';

const FILTERS = [
  'All',
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Prescribed Elective',
  'Design Elective',
  'Technical Elective',
  'Others'
];

// Pricing Constants
const PRICE_NOTE_BASE = 10.0;
const PRICE_NOTE_TIER_1 = 8.0; // 3+ items
const PRICE_NOTE_TIER_2 = 7.0; // 5+ items
const PRICE_FULL_ACCESS = 89.0; // 21+ items or Bundle

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundleProduct, setBundleProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Students Helped Counter
  const [studentsHelped, setStudentsHelped] = useState(() => {
    const saved = localStorage.getItem('maxnotes_count');
    return saved ? parseInt(saved, 10) : 842; 
  });

  useEffect(() => {
    localStorage.setItem('maxnotes_count', studentsHelped.toString());
  }, [studentsHelped]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedProducts, loadedBundle] = await Promise.all([
          fetchProducts(),
          fetchBundle()
        ]);
        setProducts(loadedProducts);
        setBundleProduct(loadedBundle);
      } catch (e) {
        console.error("Failed to load app data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Pricing Logic
  const calculateCartTotals = (items: CartItem[]) => {
    const daBaoItem = bundleProduct && items.find(item => item.id === bundleProduct.id);
    const regularNoteItems = items.filter(item => item.category === 'Note' && (!bundleProduct || item.id !== bundleProduct.id));
    const otherItems = items.filter(item => item.category !== 'Note');

    const daBaoCount = daBaoItem ? daBaoItem.quantity : 0;
    const notesCount = regularNoteItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let notesTotalCost = 0;
    let message = "";

    if (daBaoCount > 0) {
      notesTotalCost = daBaoCount * PRICE_FULL_ACCESS;
      message = "DaBao Active: All Notes Included!";
    } else {
      if (notesCount >= 21) {
        notesTotalCost = PRICE_FULL_ACCESS;
        message = "Full Access Price Cap Applied ($89)";
      } else if (notesCount >= 5) {
        notesTotalCost = notesCount * PRICE_NOTE_TIER_2;
        message = `5-Pack Discount Applied ($${PRICE_NOTE_TIER_2}/note)`;
      } else if (notesCount >= 3) {
        notesTotalCost = notesCount * PRICE_NOTE_TIER_1;
        message = `3-Pack Discount Applied ($${PRICE_NOTE_TIER_1}/note)`;
      } else {
        notesTotalCost = notesCount * PRICE_NOTE_BASE;
        if (notesCount > 0) {
          if (notesCount < 3) message = `Add ${3 - notesCount} more notes to save ($${PRICE_NOTE_TIER_1}/each)!`;
          else if (notesCount < 5) message = `Add ${5 - notesCount} more notes for super saver ($${PRICE_NOTE_TIER_2}/each)!`;
        }
      }
    }

    const othersTotalCost = otherItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = notesTotalCost + othersTotalCost;
    
    return { total, message };
  };

  const { total: cartTotal, message: savingsMessage } = calculateCartTotals(cart);

  // Filtering Logic
  useEffect(() => {
    let result = products;

    if (activeFilter !== 'All') {
      result = result.filter(p => p.filterCategory === activeFilter);
    }

    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQ) || 
        p.code.toLowerCase().includes(lowerQ)
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, activeFilter, products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    const itemsSold = cart.reduce((acc, item) => acc + item.quantity, 0);
    setStudentsHelped(prev => prev + itemsSold);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-black selection:text-white">
      <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />

      {/* Hero / Search Section */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black leading-[0.9]">
              ACADEMIC <br/> ESSENTIALS.
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-lg">
              Curated notes, tools, and resources for students. Instant delivery to your Google Drive.
            </p>
            
            {/* Students Helped Component */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3">
                 <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-400">AG</div>
                 <div className="w-10 h-10 rounded-full bg-black border-2 border-white flex items-center justify-center text-xs font-bold text-white">JP</div>
                 <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">K</div>
              </div>
              <div className="pl-2">
                 <div className="flex items-center gap-1">
                   <span className="font-bold text-xl tracking-tight">{studentsHelped.toLocaleString()}</span>
                   <CheckCircle2 size={16} className="text-green-500 fill-green-500/10" />
                 </div>
                 <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Students Helped</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-end border-b border-gray-100 pb-8">
             {/* Search */}
             <div className="w-full md:max-w-md relative">
                <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                   <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code or subject..."
                  className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-gray-300 focus:border-black outline-none transition-colors text-lg placeholder-gray-300"
                />
             </div>
          </div>

          {/* Filters */}
          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
             {FILTERS.map(filter => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                   activeFilter === filter 
                     ? 'text-black border-b-2 border-black pb-1' 
                     : 'text-gray-400 hover:text-gray-600 pb-1'
                 }`}
               >
                 {filter}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Loading State */}
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
               <ProductSkeleton key={i} />
            ))}

            {!isLoading && (
              <>
                {/* Show Bundle */}
                {activeFilter === 'All' && !searchQuery && bundleProduct && (
                  <ProductCard 
                    product={bundleProduct} 
                    onAddToCart={addToCart} 
                    variant="bundle" 
                  />
                )}

                {/* Show Items */}
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))
                ) : (
                  // Empty State (only if bundle is also not shown or irrelevant)
                  (activeFilter !== 'All' || searchQuery) && (
                    <div className="col-span-full py-20 text-center">
                      <p className="text-gray-400 text-lg">No resources found.</p>
                      <button 
                        onClick={() => {setSearchQuery(''); setActiveFilter('All');}}
                        className="mt-4 text-black font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )
                )}
              </>
            )}
          </div>
      </main>

      <footer className="border-t border-gray-100 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* 上半部分：品牌与联系方式 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
            <div>
              <h4 className="font-black tracking-tighter text-xl mb-2">MAXNotes</h4>
              <p className="text-gray-500 text-sm max-w-xs">
                Premium engineering notes and academic resources delivered instantly via Google Drive.
              </p>
            </div>
            <div className="text-left md:text-right text-sm text-gray-500">
              <p className="font-bold text-gray-900">Support</p>
              <p>maxchenbiz0322@gmail.com</p>
              <p>© 2024 MAXNotes. All rights reserved.</p>
            </div>
          </div>

          {/* 下半部分：Stripe 审核专用折叠条款 (Legal Compliance) */}
          <div className="border-t border-gray-200 pt-8 text-xs text-gray-500 space-y-4">
            
            {/* 1. 退款政策 (最重要) */}
            <details className="group cursor-pointer">
              <summary className="font-bold text-gray-700 hover:text-black list-none flex items-center gap-2">
                <span>Refund Policy (Digital Goods)</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-2 pl-2 max-w-3xl leading-relaxed">
                <p>
                  <strong>All Sales Are Final:</strong> Due to the nature of digital products (instant access to Google Drive folders), MAXNotes generally does not offer refunds once access has been granted. Unlike physical goods, digital assets cannot be "returned."
                </p>
                <p className="mt-2">
                  <strong>Exceptions:</strong> We will issue a full refund if: (1) You are unable to access the files due to a technical error on our end that we cannot resolve within 48 hours; or (2) The content is significantly different from the description provided.
                </p>
                <p className="mt-2">
                  To request a refund under these exceptions, please contact maxchenbiz0322@gmail.com with your transaction ID.
                </p>
              </div>
            </details>

            {/* 2. 隐私政策 */}
            <details className="group cursor-pointer">
              <summary className="font-bold text-gray-700 hover:text-black list-none flex items-center gap-2">
                <span>Privacy Policy</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-2 pl-2 max-w-3xl leading-relaxed">
                <p>
                  <strong>Data Collection:</strong> We collect your email address solely for the purpose of delivering your purchased notes via Google Drive and sending transaction receipts.
                </p>
                <p className="mt-2">
                  <strong>Payment Information:</strong> We do not store your credit card details. All payments are securely processed by Stripe, a third-party payment processor.
                </p>
                <p className="mt-2">
                  <strong>Data Sharing:</strong> We do not sell, trade, or rent your personal identification information to others. Your email is only shared with Google (for file access) and Stripe (for payment receipt).
                </p>
              </div>
            </details>

            {/* 3. 服务条款 */}
            <details className="group cursor-pointer">
              <summary className="font-bold text-gray-700 hover:text-black list-none flex items-center gap-2">
                <span>Terms of Service</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-2 pl-2 max-w-3xl leading-relaxed">
                <p>
                  <strong>License:</strong> Upon purchase, you are granted a non-exclusive, non-transferable license to access and use the notes for personal education.
                </p>
                <p className="mt-2">
                  <strong>Copyright:</strong> All content is the intellectual property of MAXNotes. You may not resell, redistribute, or share the Google Drive links/files with non-purchasers. Unauthorized sharing may result in revocation of access without refund.
                </p>
                <p className="mt-2">
                  <strong>Delivery:</strong> Access is provided automatically to the email address used at checkout. Please ensure your email is a valid Google account or linked to one.
                </p>
              </div>
            </details>

          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        total={cartTotal}
        savingsMessage={savingsMessage}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={cartTotal}
        cart={cart}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default App;
