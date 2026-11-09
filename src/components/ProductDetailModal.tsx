import React, { useState } from 'react';
import { Product, Language } from '../types';
import {
  X,
  Star,
  ShieldCheck,
  Clock,
  Share2,
  Facebook,
  MessageCircle,
  Mail,
  Check,
  Truck,
  RotateCcw,
  ShoppingCart,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  lang: Language;
  onClose: () => void;
  onOrder: (product: Product, isPreOrder: boolean) => void;
  userDiscount?: number;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  onClose,
  onOrder,
  userDiscount = 0,
}) => {
  if (!product) return null;

  const isBn = lang === 'bn';
  const [copied, setCopied] = useState(false);

  const title = isBn ? product.titleBn : product.titleEn;
  const category = isBn ? product.categoryBn : product.categoryEn;
  const desc = isBn ? product.descriptionBn : product.descriptionEn;

  const finalPrice = userDiscount > 0 ? Math.round(product.price * (1 - userDiscount / 100)) : product.price;

  const handleShare = (platform: 'fb' | 'wa' | 'mail' | 'copy') => {
    const url = window.location.href;
    const text = encodeURIComponent(`${title} - ৳${product.price} | My Store Site: ${url}`);

    if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } else if (platform === 'mail') {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${text}`;
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border-2 border-red-500/20 text-gray-950 flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Image Section */}
        <div className="md:w-1/2 relative bg-gray-100 min-h-[260px] md:min-h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={title}
            className="w-full h-full object-cover max-h-[380px] md:max-h-none"
          />
          {product.isUpcoming ? (
            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>{isBn ? 'আসন্ন পণ্য (Upcoming)' : 'Upcoming'}</span>
            </div>
          ) : (
            <div className="absolute top-4 left-4 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{isBn ? 'স্টকে প্রস্তুত' : 'Ready In Stock'}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="bg-green-50 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                {category}
              </span>
              <button
                onClick={onClose}
                className="hidden md:block text-gray-400 hover:text-gray-800 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-950 leading-snug mb-2">
              {title}
            </h3>

            {/* Ratings & Seller */}
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.reviewsCount} রিভিউ)</span>
              </div>
              {product.sellerName && (
                <span className="text-green-700 font-semibold">• সেলার: {product.sellerName}</span>
              )}
            </div>

            {/* Price Box */}
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 mb-4 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-gray-500 block">বর্তমান অফার মূল্য:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-red-600">
                    ৳{finalPrice.toLocaleString('bn-BD')}
                  </span>
                  {(product.originalPrice || userDiscount > 0) && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{(product.originalPrice || product.price).toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>
              </div>

              {userDiscount > 0 && (
                <div className="bg-yellow-400 text-gray-950 text-xs font-black px-2.5 py-1 rounded-xl shadow">
                  {userDiscount}% ভিআইপি ছাড়
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
              {desc}
            </p>

            {product.isUpcoming && product.expectedDate && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-900 mb-4 font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-700 shrink-0" />
                <span>{product.expectedDate}</span>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mb-4">
              <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border">
                <Truck className="w-4 h-4 text-green-600 shrink-0" />
                <span>৩ নং কিরাটন সকল ওয়ার্ডে দ্রুত ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                <span>১০০% ক্যাশ অন ডেলিভারি / বিকাশ</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs mb-4">
              <span className="font-semibold text-gray-500 flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> শেয়ার:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('fb')}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('wa')}
                  className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('mail')}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="px-2 py-1 bg-gray-100 rounded text-[11px] font-bold text-gray-700 hover:bg-gray-200"
                >
                  {copied ? 'কপি হয়েছে' : 'লিংক কপি'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Button (Green as requested for OK buttons) */}
          <div className="pt-2">
            {product.isUpcoming ? (
              <button
                onClick={() => {
                  onClose();
                  onOrder(product, true);
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-5 h-5 text-yellow-300" />
                <span>{isBn ? 'ফ্রি প্রি-অর্ডার বুকিং দিন (OK)' : 'Pre-Order Now (OK)'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOrder(product, false);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <span>{isBn ? 'এখনই কিনুন - অর্ডার করুন (OK)' : 'Order Now (OK)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
