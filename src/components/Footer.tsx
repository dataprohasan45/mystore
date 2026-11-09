import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Shield,
  Facebook,
  Instagram,
  MessageCircle,
  Lock,
  Heart,
  Truck,
  CreditCard,
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  onOpenAdminAuth: () => void;
  onOpenPortfolio: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenAdminAuth,
  onOpenPortfolio,
}) => {
  const isBn = lang === 'bn';

  return (
    <footer className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-300 pt-12 pb-6 border-t-4 border-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" className="[&_span]:text-white" />
            <p className="text-xs text-gray-400 leading-relaxed">
              {isBn
                ? 'কিশোরগঞ্জ জেলার করিমগঞ্জ থানার ৩ নং কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ড সহ সারাদেশে দ্রুত ও বিশ্বস্ত হোম ডেলিভারি সেবা।'
                : 'Fast and verified doorstep delivery across all 9 wards of No. 3 Kiraton Union, Karimganj, Kishoreganj, and nationwide.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-gray-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801712371270"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-green-600 hover:text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kiraton Coverage Wards List */}
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-green-500" />
              <span>{isBn ? '৩ নং কিরাটন ডেলিভারি জোন' : 'Kiraton Delivery Coverage'}</span>
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>• ১ নং ওয়ার্ড (বাটরা গ্রাম)</li>
              <li>• ২ নং ওয়ার্ড (কিরাটন মধ্যপাড়া)</li>
              <li>• ৩ নং ওয়ার্ড (কিরাটন বাজার ও স্কুল)</li>
              <li>• ৪ নং ওয়ার্ড (দক্ষিণ কিরাটন)</li>
              <li>• ৫ নং ওয়ার্ড (উত্তর পাড়া ও বিল পাড়)</li>
              <li>• ৬, ৭, ৮, ৯ নং ওয়ার্ড ও নদী তীরবর্তী এলাকা</li>
            </ul>
          </div>

          {/* Secure Payment & Guarantees */}
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-red-500" />
              <span>{isBn ? 'নিরাপদ পেমেন্ট পার্টনার' : 'Accepted Payments'}</span>
            </h4>
            <p className="text-gray-400 text-xs leading-relaxed mb-3">
              {isBn
                ? 'বিকাশ ও নগদ পেমেন্টের মাধ্যমে ঘরে বসেই নিশ্চিত ও স্বচ্ছ পেমেন্ট করুন।'
                : 'Instant and secure payment verification via bKash and Nagad MFS.'}
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-pink-900/60 border border-pink-700/80 px-3 py-1.5 rounded-lg text-pink-300 font-black text-xs">
                bKash বিকাশ
              </div>
              <div className="bg-orange-900/60 border border-orange-700/80 px-3 py-1.5 rounded-lg text-orange-300 font-black text-xs">
                Nagad নগদ
              </div>
            </div>
          </div>

          {/* Address & Contact Info */}
          <div className="text-xs space-y-2">
            <h4 className="font-bold text-white text-sm mb-3">
              {isBn ? 'কেন্দ্রীয় অফিস ও হাব' : 'Central Hub & Contact'}
            </h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>কিরাটন বাজার, ৩ নং কিরাটন ইউনিয়ন, করিমগঞ্জ থানা, কিশোরগঞ্জ জেলা, ঢাকা।</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                <span>হেল্পলাইন: 01712-371270</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@mystoresite.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discrete Hidden Admin Access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} My Store Site (মাই স্টোর সাইট)। সর্বস্বত্ব সংরক্ষিত।
          </div>

          {/* Discreet Hidden Admin & Controller Portal link */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPortfolio}
              className="hover:text-green-400 transition-colors"
            >
              {isBn ? 'আমার পোর্টফোলিও' : 'My Portfolio'}
            </button>
            <span className="text-gray-700">•</span>

            {/* Hidden admin access as explicitly requested */}
            <button
              onClick={onOpenAdminAuth}
              className="flex items-center gap-1 text-gray-600 hover:text-red-400 transition-colors text-[11px]"
              title="Staff Access"
            >
              <Lock className="w-3 h-3 text-gray-600" />
              <span>{isBn ? 'গোপন এডমিন ও স্টাফ লগইন' : 'Staff Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
