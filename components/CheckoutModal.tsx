import React, { useState, useEffect } from 'react';
import { OrderDetails, CartItem } from '../types';
import { Loader2, Check, ArrowRight, X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  cart: CartItem[];
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  cart,
  onSuccess
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [email, setEmail] = useState('');
  const [log, setLog] = useState<string[]>([]);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setLog([]);
      setEmail('');
      setOrderId('ORD-' + Math.floor(100000 + Math.random() * 900000));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    const addLog = (msg: string) => setLog(prev => [...prev, msg]);

    setTimeout(() => addLog("Initializing secure payment..."), 500);
    setTimeout(() => addLog(`Verifying Reference ${orderId}...`), 1500);
    setTimeout(() => addLog("Payment Verified."), 3000);
    setTimeout(() => addLog("Authenticating Service Account..."), 4500);
    
    cart.forEach((item, index) => {
      setTimeout(() => {
        addLog(`Granting access: ${item.code}`);
      }, 5500 + (index * 800));
    });

    setTimeout(() => addLog("Permissions updated."), 5500 + (cart.length * 800) + 500);
    setTimeout(() => addLog(`Sending confirmation to ${email}...`), 5500 + (cart.length * 800) + 1500);
    
    setTimeout(() => {
      setStep('success');
      onSuccess();
    }, 5500 + (cart.length * 800) + 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-black text-xl tracking-tight">
            {step === 'form' ? 'Checkout' : step === 'processing' ? 'Processing' : 'Confirmed'}
          </h3>
          {step === 'form' && (
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
               <X size={24} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Delivery Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-b-2 border-gray-200 px-4 py-3 text-lg focus:border-black focus:outline-none focus:bg-white transition-colors placeholder-gray-300"
                  placeholder="name@example.com"
                />
                <p className="text-xs text-gray-400">Google Drive links will be shared with this address.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Payment</label>
                <div className="border border-gray-200 p-6 flex flex-col items-center justify-center gap-4 hover:border-black transition-colors">
                   <div className="text-center">
                      <p className="font-bold text-lg mb-1">PayNow</p>
                      <p className="text-sm text-gray-500">Scan QR Code</p>
                   </div>
                   <div className="bg-white p-2 border border-gray-100">
                     <img 
                       src="https://placehold.co/200x200/000000/FFFFFF?text=QR" 
                       alt="QR" 
                       className="w-32 h-32 object-contain mix-blend-multiply" 
                     />
                   </div>
                   <div className="text-center w-full">
                     <div className="flex justify-between text-sm py-1 border-b border-gray-100">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-bold">¥{totalAmount.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-500">Ref ID</span>
                        <span className="font-mono">{orderId}</span>
                     </div>
                   </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold text-sm uppercase tracking-widest py-4 transition-all flex items-center justify-center gap-2">
                 <span>Confirm Payment</span>
                 <ArrowRight size={16} />
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="animate-spin text-black mb-8" size={48} strokeWidth={1} />
              <div className="w-full font-mono text-xs text-gray-500 space-y-2">
                 {log.map((l, i) => (
                   <div key={i} className="animate-fade-in">
                     <span className="opacity-50 mr-2">&gt;</span>{l}
                   </div>
                 ))}
                 <div className="animate-pulse">_</div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Order Confirmed</h2>
              <p className="text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
                Access granted for <strong>{email}</strong>. Check your Google Drive "Shared with me" folder.
              </p>
              
              <p className="text-black font-medium text-lg italic mb-8">
                All the best to your study!
              </p>
              
              <div className="border-t border-gray-100 pt-6">
                <button 
                  onClick={onClose}
                  className="w-full bg-white border border-black text-black font-bold text-sm uppercase tracking-widest py-4 hover:bg-black hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;