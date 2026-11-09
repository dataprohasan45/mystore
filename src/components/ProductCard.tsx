import React, { useState } from 'react';
import { Product, Language } from '../types';
import { Star, Share2, Facebook, MessageCircle, Mail, Check, Clock, ShoppingCart, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  lang: Language;
  onOrder: (product: Product, isPreOrder: boolean) => void;
  onViewDetails: (product: Product) => void;
  userDiscount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onOrder,
  onViewDetails,
  userDiscount = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const isBn = lang === 'bn';

  const title = isBn ? product.titleBn : product.titleEn;
  const category = isBn ? product.categoryBn : product.categoryEn;
  const desc = isBn ? product.descriptionBn : product.descriptionEn;

  // Calculate regular customer / user discount if applicable
  const finalPrice = userDiscount > 0 ? Math.round(product.price * (1 - userDiscount / 100)) : product.price;

  const handleShare = (platform: 'fb' | 'wa' | 'mail' | 'copy') => {
    const url = window.location.href;
    const shareText = encodeURIComponent(`${title} - ৳${product.price} | My Store Site: ${url}`);

    if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    } else if (platform === 'mail') {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${shareText}`;
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareMenu(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-red-400">
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge */}
        {product.isUpcoming ? (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isBn ? 'আসন্ন পণ্য (Upcoming)' : 'Upcoming Product'}</span>
          </div>
        ) : (
          <div className="absolute top-3 left-3 bg-green-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow-md flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isBn ? 'স্টকে রেডি' : 'In Stock'}</span>
          </div>
        )}

        {/* Regular Customer Discount Tag if any */}
        {userDiscount > 0 && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-950 text-[11px] font-black px-2 py-0.5 rounded shadow">
            {isBn ? `${userDiscount}% স্পেশাল ছাড়` : `${userDiscount}% VIP OFF`}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold text-green-800 bg-green-50 px-2 py-0.5 rounded border border-green-200">
            {category}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-gray-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>

        <h3
          onClick={() => onViewDetails(product)}
          className="font-bold text-gray-950 text-base leading-snug line-clamp-2 hover:text-red-600 transition-colors cursor-pointer mb-2"
        >
          {title}
        </h3>

        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
          {desc}
        </p>

        {product.isUpcoming && product.expectedDate && (
          <div className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 mb-3">
            📅 {product.expectedDate}
          </div>
        )}

        {/* Price & Stock info */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-baseline justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-red-600">
                ৳{finalPrice.toLocaleString('bn-BD')}
              </span>
              {(product.originalPrice || userDiscount > 0) && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{(product.originalPrice || product.price).toLocaleString('bn-BD')}
                </span>
              )}
            </div>
            {!product.isUpcoming && (
              <span className="text-[11px] text-gray-500">
                {isBn ? `স্টক: ${product.stock} পিস` : `Stock: ${product.stock} left`}
              </span>
            )}
          </div>

          {/* Social Share toggle */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
              title="Share Product"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-30 flex flex-col gap-1 w-36">
                <button
                  onClick={() => handleShare('fb')}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded font-medium text-left"
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </button>
                <button
                  onClick={() => handleShare('wa')}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-green-600 hover:bg-green-50 rounded font-medium text-left"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
                <button
                  onClick={() => handleShare('mail')}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded font-medium text-left"
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded font-medium text-left"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'লিংক কপি' : 'Copy link')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order / Pre-order Button */}
        <div className="mt-3">
          {product.isUpcoming ? (
            <button
              onClick={() => onOrder(product, true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>{isBn ? 'ফ্রি প্রি-অর্ডার বুকিং' : 'Pre-Order Now'}</span>
            </button>
          ) : (
            <button
              onClick={() => onOrder(product, false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>{isBn ? 'এখনই কিনুন (অর্ডার)' : 'Order Now'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
