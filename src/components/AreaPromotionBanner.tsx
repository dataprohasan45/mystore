import React, { useState } from 'react';
import { AreaPromotion, Language } from '../types';
import { MapPin, Share2, Facebook, MessageCircle, Mail, Check, Sparkles } from 'lucide-react';

interface AreaPromotionBannerProps {
  promotions: AreaPromotion[];
  lang: Language;
  userWard?: string;
  onSelectWardFilter?: (ward: string) => void;
}

export const AreaPromotionBanner: React.FC<AreaPromotionBannerProps> = ({
  promotions,
  lang,
  userWard = 'সব ওয়ার্ড',
  onSelectWardFilter,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isBn = lang === 'bn';

  const activePromos = promotions.filter((p) => p.isActive);
  if (activePromos.length === 0) return null;

  const handleShare = (promo: AreaPromotion, platform: 'fb' | 'wa' | 'mail' | 'copy') => {
    const title = isBn ? promo.titleBn : promo.titleEn;
    const url = window.location.href;
    const text = encodeURIComponent(`${title} - My Store Site: ${url}`);

    if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    } else if (platform === 'mail') {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${text}`;
    } else {
      navigator.clipboard.writeText(url);
      setCopiedId(promo.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section aria-label="Area Promotions" className="max-w-7xl mx-auto px-4 sm:px-6 my-6">
      <div className="bg-gradient-to-r from-red-50 via-white to-green-50 border-2 border-red-500/20 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow">
              <MapPin className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-gray-900">
                  {isBn ? 'এলাকাভিত্তিক বিশেষ প্রচারণা ও প্রচার বুলেটিন' : 'Area-Targeted Regional Campaign'}
                </h3>
                <span className="bg-green-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {isBn ? 'লাইভ প্রচার' : 'Live Broadcast'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {isBn
                  ? 'ঢাকা বিভাগ > কিশোরগঞ্জ জেলা > করিমগঞ্জ থানা > ৩ নং কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ড'
                  : 'Dhaka Division > Kishoreganj District > Karimganj Thana > No. 3 Kiraton Union Wards 1 to 9'}
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-700 bg-white/80 border border-gray-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <span className="font-bold text-green-700">{isBn ? 'লক্ষ্যমাত্রা:' : 'Coverage:'}</span>
            <span>{userWard || (isBn ? '৩ নং কিরাটন সকল ওয়ার্ড' : 'Kiraton UP All Wards')}</span>
          </div>
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {activePromos.map((promo) => {
            const title = isBn ? promo.titleBn : promo.titleEn;
            const desc = isBn ? promo.descriptionBn : promo.descriptionEn;

            return (
              <div
                key={promo.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded shadow-sm">
                      {promo.discountBadge || (isBn ? 'বিশেষ অফার' : 'Special Offer')}
                    </span>
                    <span className="text-[11px] font-semibold text-green-800 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-green-700" />
                      {promo.union}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-2">{title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-3 mb-3 leading-relaxed">{desc}</p>

                  <div className="text-[11px] text-gray-500 flex flex-wrap gap-1 mb-2">
                    <span className="font-semibold text-gray-700">{isBn ? 'টার্গেট ওয়ার্ড:' : 'Target Wards:'}</span>
                    {promo.targetWards.includes('all') ? (
                      <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                        {isBn ? 'সকল ওয়ার্ড (১-৯)' : 'All Wards (1-9)'}
                      </span>
                    ) : (
                      promo.targetWards.map((w, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                          {w}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Social Share Bar */}
                <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-gray-400" />
                    {isBn ? 'প্রচার শেয়ার করুন:' : 'Share:'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(promo, 'fb')}
                      className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(promo, 'wa')}
                      className="p-1.5 rounded-md hover:bg-green-50 text-green-600 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(promo, 'mail')}
                      className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                      title="Share via Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(promo, 'copy')}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === promo.id ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                        </>
                      ) : (
                        <span>{isBn ? 'লিংক কপি' : 'Copy'}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
