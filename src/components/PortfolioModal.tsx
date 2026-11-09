import React, { useState } from 'react';
import { UserAccount, Language } from '../types';
import {
  X,
  Facebook,
  Instagram,
  Mail,
  Phone,
  Clock,
  Star,
  Award,
  CheckCircle,
  Save,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

interface PortfolioModalProps {
  user: UserAccount;
  lang: Language;
  onClose: () => void;
  onUpdateUser: (updatedData: Partial<UserAccount>) => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({
  user,
  lang,
  onClose,
  onUpdateUser,
}) => {
  const isBn = lang === 'bn';

  const [facebookUrl, setFacebookUrl] = useState(user.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(user.instagramUrl || '');
  const [gmailAddress, setGmailAddress] = useState(user.gmailAddress || user.email);
  const [whatsappNumber, setWhatsappNumber] = useState(user.whatsappNumber || user.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      facebookUrl,
      instagramUrl,
      gmailAddress,
      whatsappNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const roleNameMap: Record<string, { bn: string; en: string }> = {
    admin: { bn: 'প্রধান অ্যাডমিন (Super Admin)', en: 'Super Admin' },
    seller: { bn: 'কোম্পানি সেলার (Seller)', en: 'Official Seller' },
    cashier: { bn: 'প্রধান ক্যাশিয়ার (Cashier)', en: 'Chief Cashier' },
    area_manager: { bn: 'করিমগঞ্জ এরিয়া ম্যানেজার', en: 'Area Manager' },
    distributor: { bn: 'কোম্পানি ডিস্ট্রিবিউটর', en: 'Distributor' },
    wholesaler: { bn: 'অনুমোদিত হোলসেলার', en: 'Wholesaler' },
    customer: { bn: 'সম্মানিত কাস্টমার', en: 'Valued Customer' },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-red-500/20 overflow-hidden text-gray-950">
        {/* Header Cover */}
        <div className="relative bg-gradient-to-r from-red-700 via-green-800 to-green-950 text-white p-6 sm:p-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-red-600/90 text-[10px] text-white text-center font-bold py-0.5">
                {user.role.toUpperCase()}
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">{user.name}</h3>
                {user.isVerified && (
                  <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" />
                    {isBn ? 'ভেরিফাইড' : 'Verified'}
                  </span>
                )}
              </div>

              <p className="text-green-200 text-xs sm:text-sm font-medium mb-2">
                {isBn ? roleNameMap[user.role]?.bn : roleNameMap[user.role]?.en}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-200">
                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                  📍 {user.areaUnion || '৩ নং কিরাটন ইউনিয়ন'}, {user.areaDistrict || 'কিশোরগঞ্জ'}
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-yellow-300" />
                  {isBn ? `সক্রিয় ছিলেন: ${user.activeMinutes} মিনিট` : `Active: ${user.activeMinutes} mins`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Metrics (Stars & Level) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Star Mark (1 to 7 Stars) */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-yellow-800 block mb-1">
                {isBn ? 'কাস্টমার স্টার রেটিং' : 'Star Rating'}
              </span>
              <div className="flex items-center justify-center gap-0.5 mb-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < user.starRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-yellow-950">
                {user.starRating} / ৭ স্টার
              </span>
            </div>

            {/* Loyalty Discount */}
            <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-red-800 block mb-1">
                {isBn ? 'রেগুলার ডিসকাউন্ট' : 'Loyalty Discount'}
              </span>
              <div className="text-xl font-black text-red-600 mb-0.5">
                {user.discountPercentage}%
              </div>
              <span className="text-[10px] text-red-700 font-semibold">
                {isBn ? 'প্রতিটি অর্ডারে কার্যকর' : 'On every purchase'}
              </span>
            </div>

            {/* Seller Level (1 to 7) if applicable */}
            <div className="bg-green-50 border border-green-200 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-green-800 block mb-1">
                {isBn ? 'কাজের লেভেল' : 'Performance Level'}
              </span>
              <div className="text-xl font-black text-green-700 mb-0.5">
                লেভেল {user.sellerLevel || 1}
              </div>
              <span className="text-[10px] text-green-700 font-semibold">
                (লেভেল ১ থেকে ৭)
              </span>
            </div>

            {/* Orders / Sales count */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-blue-800 block mb-1">
                {user.role === 'seller'
                  ? isBn
                    ? 'মোট সেলস'
                    : 'Total Sales'
                  : isBn
                  ? 'অর্ডারের সংখ্যা'
                  : 'Total Orders'}
              </span>
              <div className="text-xl font-black text-blue-700 mb-0.5">
                {user.role === 'seller' ? user.totalSales || 0 : user.totalOrdersCount || 0}
              </div>
              <span className="text-[10px] text-blue-700 font-semibold">
                {user.role === 'seller' ? `৳${user.earnedCommission || 0} কমিশন` : 'ভেরিফাইড অর্ডার'}
              </span>
            </div>
          </div>

          {/* Social Profiles & Contact Settings (Facebook, Instagram, Gmail, WhatsApp) */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-sm sm:text-base text-gray-900">
                  {isBn ? 'সোশ্যাল মিডিয়া ও যোগাযোগের আইডি সংযোগ' : 'Connected Social & Contact Channels'}
                </h4>
              </div>
              <span className="text-[11px] text-gray-500">
                {isBn ? 'পোর্টফোলিওতে দৃশ্যমান' : 'Visible on portfolio'}
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Facebook */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Facebook Profile Link</span>
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/your-username"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Instagram Profile Link</span>
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/your-username"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* Gmail ID */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-red-600" />
                    <span>Gmail / Email ID</span>
                  </label>
                  <input
                    type="email"
                    value={gmailAddress}
                    onChange={(e) => setGmailAddress(e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-green-600" />
                    <span>WhatsApp Number</span>
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+88017xxxxxxxx"
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Public quick clickable icons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100"
                  >
                    <Facebook className="w-3.5 h-3.5" /> Facebook খুলুন
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-pink-50 text-pink-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-pink-100"
                  >
                    <Instagram className="w-3.5 h-3.5" /> Instagram খুলুন
                  </a>
                )}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-100"
                  >
                    <Phone className="w-3.5 h-3.5" /> WhatsApp মেসেজ
                  </a>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {isBn ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Saved successfully!'}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সেটিংস সেভ করুন (OK)' : 'Save Info (OK)'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Session & Login info */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs text-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="font-bold text-gray-900 block">
                {isBn ? 'সাইটে লগইন টাইম ও সেশন ট্র্যাকিং' : 'Site Login & Active Time Tracking'}
              </span>
              <span className="text-gray-500">
                {isBn ? `শেষ লগইন: ${user.loginTime || 'আজ সকাল'}` : `Last Login: ${user.loginTime || 'Today'}`}
              </span>
            </div>
            <div className="bg-green-100 text-green-800 font-black px-3 py-1.5 rounded-lg">
              ⏱️ {isBn ? `মোট ব্রাউজিং সময়: ${user.activeMinutes} মিনিট` : `Total Time: ${user.activeMinutes} mins`}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-xl text-xs sm:text-sm shadow"
          >
            {isBn ? 'ঠিক আছে (OK)' : 'OK, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
