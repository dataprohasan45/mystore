import React from 'react';
import { Logo } from './Logo';
import { UserAccount, Language, UserRole } from '../types';
import {
  Search,
  ShoppingCart,
  User,
  Globe,
  Clock,
  Sparkles,
  MessageSquare,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenPortfolio: () => void;
  onOpenChat: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  activeFilter: 'all' | 'in_stock' | 'upcoming';
  onFilterChange: (filter: 'all' | 'in_stock' | 'upcoming') => void;
  currentViewRole: UserRole;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  currentUser,
  onOpenAuth,
  onOpenPortfolio,
  onOpenChat,
  onLogout,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  currentViewRole,
  onOpenAdmin,
}) => {
  const isBn = lang === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-red-500/20 shadow-sm">
      {/* View-As Notice Banner if Admin is active in a custom role view */}
      {currentUser?.role === 'admin' && currentViewRole !== 'admin' && (
        <div className="bg-amber-500 text-gray-950 px-4 py-1.5 text-xs font-black flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {isBn ? `অ্যাডমিন ভিউ মোড সক্রিয়: আপনি বর্তমানে ` : 'Admin View Mode Active: Viewing as '}
              <span className="uppercase underline">{currentViewRole}</span>
              {isBn ? ' হিসেবে সাইটটি দেখছেন' : ''}
            </span>
          </div>
          <button
            onClick={onOpenAdmin}
            className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-gray-800"
          >
            অ্যাডমিন প্যানেলে ফিরুন
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <a href="#" className="cursor-pointer shrink-0">
            <Logo size="md" />
          </a>

          {/* Search Bar with Quick Filter */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isBn
                    ? 'পণ্য খুঁজুন (যেমন: ড্রোন, মধু, রাইস কুকার, স্মার্টওয়াচ)...'
                    : 'Search products (e.g. drone, honey, smart cooker, watch)...'
                }
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border-2 border-green-700/30 hover:border-green-600 focus:border-red-600 rounded-full focus:outline-none focus:bg-white transition-all text-gray-950 placeholder-gray-500 font-medium"
              />
              <Search className="w-4 h-4 text-green-700 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher (Bangla / English) */}
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-full border border-gray-300 hover:border-green-600 text-xs font-bold text-gray-800 flex items-center gap-1 transition-colors bg-white shadow-sm"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Chat with Admin button */}
            <button
              onClick={onOpenChat}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-800 border border-green-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Live Chat"
            >
              <MessageSquare className="w-4 h-4 text-green-700" />
              <span className="hidden sm:inline">{isBn ? 'সাপোর্ট চ্যাট' : 'Chat'}</span>
            </button>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPortfolio}
                  className="flex items-center gap-2 p-1 sm:px-3 sm:py-1 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-red-400"
                  />
                  <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
                    <span className="font-bold text-gray-950 truncate max-w-[100px]">{currentUser.name}</span>
                    <span className="text-[10px] text-red-600 font-black">
                      {isBn ? `★ ${currentUser.starRating} স্টার` : `★ ${currentUser.starRating} Stars`}
                    </span>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 hover:text-green-800 transition-colors"
                >
                  {isBn ? 'লগইন' : 'Login'}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 py-1.5 rounded-full text-xs shadow-sm transition-all"
                >
                  {isBn ? 'রেজিস্টার' : 'Sign Up'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search products...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:border-green-600"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Secondary Category & Stock Filter Bar */}
        <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isBn ? 'সকল প্রোডাক্ট' : 'All Products'}
            </button>

            <button
              onClick={() => onFilterChange('in_stock')}
              className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                activeFilter === 'in_stock'
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isBn ? '✓ স্টকে রেডি' : 'In Stock'}
            </button>

            <button
              onClick={() => onFilterChange('upcoming')}
              className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 flex items-center gap-1 ${
                activeFilter === 'upcoming'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{isBn ? 'আসন্ন পণ্য (Pre-order)' : 'Upcoming (Pre-order)'}</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500 hidden sm:flex items-center gap-2">
            <span className="font-semibold text-green-700">৩ নং কিরাটন হাব:</span>
            <span>১ থেকে ৯ নং সকল ওয়ার্ডে হোম ডেলিভারি</span>
          </div>
        </div>
      </div>
    </header>
  );
};
