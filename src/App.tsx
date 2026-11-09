import React, { useState, useEffect } from 'react';
import {
  UserAccount,
  UserRole,
  Product,
  Order,
  AreaPromotion,
  BannerAd,
  ChatMessage,
  DataCenterAsset,
  Language,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_PROMOTIONS,
  INITIAL_BANNER_ADS,
  INITIAL_ORDERS,
  INITIAL_DATA_CENTER_ASSETS,
  INITIAL_CHAT_MESSAGES,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { BannerAds } from './components/BannerAds';
import { AreaPromotionBanner } from './components/AreaPromotionBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderModal } from './components/OrderModal';
import { PortfolioModal } from './components/PortfolioModal';
import { AuthModal } from './components/AuthModal';
import { ChatModal } from './components/ChatModal';
import { AiAssistant } from './components/AiAssistant';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { t } from './utils/translations';
import { Sparkles, ShoppingBag, Truck, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export default function App() {
  // Language State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('mystore_lang') as Language) || 'bn';
  });

  const isBn = lang === 'bn';
  const strings = t(lang);

  const toggleLanguage = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    localStorage.setItem('mystore_lang', nextLang);
  };

  // Central Application Data States with LocalStorage Persistence
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('mystore_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mystore_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mystore_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [promotions, setPromotions] = useState<AreaPromotion[]>(() => {
    const saved = localStorage.getItem('mystore_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [bannerAds, setBannerAds] = useState<BannerAd[]>(() => {
    const saved = localStorage.getItem('mystore_ads');
    return saved ? JSON.parse(saved) : INITIAL_BANNER_ADS;
  });

  const [dataCenterAssets, setDataCenterAssets] = useState<DataCenterAsset[]>(() => {
    const saved = localStorage.getItem('mystore_assets');
    return saved ? JSON.parse(saved) : INITIAL_DATA_CENTER_ASSETS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mystore_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [deliveryChargeSetting, setDeliveryChargeSetting] = useState<number>(30);

  // Active Authenticated User & View-As Role State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('mystore_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentViewRole, setCurrentViewRole] = useState<UserRole>('customer');

  // Search & Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_stock' | 'upcoming'>('all');

  // Modal Control States
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<{
    product: Product;
    isPreOrder: boolean;
  } | null>(null);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'admin_login'>('login');
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Active time tracking interval (increments every minute of browsing)
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        setCurrentUser((prev) => {
          if (!prev) return null;
          const updated = { ...prev, activeMinutes: (prev.activeMinutes || 0) + 1 };
          return updated;
        });

        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === currentUser.id ? { ...u, activeMinutes: (u.activeMinutes || 0) + 1 } : u
          )
        );
      }
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [currentUser]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mystore_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('mystore_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mystore_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mystore_promos', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('mystore_ads', JSON.stringify(bannerAds));
  }, [bannerAds]);

  useEffect(() => {
    localStorage.setItem('mystore_assets', JSON.stringify(dataCenterAssets));
  }, [dataCenterAssets]);

  useEffect(() => {
    localStorage.setItem('mystore_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mystore_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mystore_current_user');
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentViewRole(user.role);
    if (user.role === 'admin') {
      setShowAdminPanel(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentViewRole('customer');
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setAllUsers((prev) => [...prev, newUser]);
  };

  const handleResetPassword = (phone: string, newPass: string) => {
    let found = false;
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.phone === phone) {
          found = true;
          return { ...u, password: newPass };
        }
        return u;
      })
    );
    return found;
  };

  const handleUpdateCurrentUser = (updatedData: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Order Submission Handler
  const handleSubmitOrder = (orderData: Partial<Order>) => {
    const newOrder = orderData as Order;
    setOrders((prev) => [newOrder, ...prev]);

    // Update product stock and sales count if not upcoming
    const item = newOrder.items?.[0];
    if (item) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId && !p.isUpcoming) {
            return {
              ...p,
              stock: Math.max(0, p.stock - item.quantity),
              salesCount: p.salesCount + item.quantity,
            };
          }
          return p;
        })
      );
    }

    // Reward customer orders count
    if (currentUser) {
      const newOrdersCount = (currentUser.totalOrdersCount || 0) + 1;
      const newStars = Math.min(7, Math.max(currentUser.starRating, Math.floor(newOrdersCount / 3) + 1));
      handleUpdateCurrentUser({
        totalOrdersCount: newOrdersCount,
        starRating: newStars,
        isRegularCustomer: newOrdersCount >= 3,
        discountPercentage: newStars * 3,
      });
    }
  };

  // Chat message sending
  const handleSendMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const newChat: ChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
    };
    setChatMessages((prev) => [...prev, newChat]);
  };

  // Filtered Products Calculation
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStock =
      activeFilter === 'all'
        ? true
        : activeFilter === 'in_stock'
        ? !p.isUpcoming && p.stock > 0
        : p.isUpcoming;

    return matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-white text-gray-950 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* 1. TOP BANNER AD (Ticker or Announcement with Red/Green Brand Theme) */}
      <BannerAds placement="top" ads={bannerAds} lang={lang} />

      {/* 2. MAIN NAVBAR & CONTROLS */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLanguage}
        currentUser={currentUser}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setShowAuthModal(true);
        }}
        onOpenPortfolio={() => {
          if (currentUser) {
            setShowPortfolioModal(true);
          } else {
            setAuthMode('login');
            setShowAuthModal(true);
          }
        }}
        onOpenChat={() => {
          if (currentUser) {
            setShowChatModal(true);
          } else {
            setAuthMode('login');
            setShowAuthModal(true);
          }
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        currentViewRole={currentViewRole}
        onOpenAdmin={() => setShowAdminPanel(true)}
      />

      {/* 3. AREA PROMOTION BANNER (ঢাকা বিভাগ -> কিশোরগঞ্জ জেলা -> করিমগঞ্জ থানা -> ৩ নং কিরাটন ইউনিয়ন পরিষদের সকল ওয়ার্ড) */}
      <AreaPromotionBanner
        promotions={promotions}
        lang={lang}
        userWard={currentUser?.areaWard}
      />

      {/* 4. HERO INTRO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 my-4">
        <div className="bg-gradient-to-r from-red-600 via-green-800 to-green-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase text-yellow-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? '৩ নং কিরাটন ইউনিয়ন হাব' : 'Kiraton UP Hub'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {isBn
                ? 'সেরা দামে অরিজিনাল পণ্য ও দ্রুততম ডোরস্টেপ ডেলিভারি!'
                : 'Premium Products at Best Prices with Fastest Doorstep Delivery!'}
            </h1>
            <p className="text-xs sm:text-sm text-green-100 leading-relaxed max-w-xl">
              {isBn
                ? 'কিশোরগঞ্জ ও করিমগঞ্জের ৩ নং কিরাটন ইউনিয়নের ১ থেকে ৯ নং সকল ওয়ার্ডে নিজস্ব ডেলিভারি টিম দ্বারা হোম ডেলিভারি। বিকাশ ও নগদে নিরাপদ পেমেন্ট এবং অর্ডার করার পর লাইভ জিপিএস লোকেশন শেয়ার সুবিধা।'
                : 'Rapid delivery across all wards of Kiraton Union, Karimganj, Kishoreganj with live GPS sharing and 100% verified bKash & Nagad checkout.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="bg-white text-gray-950 hover:bg-yellow-300 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow transition-colors inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-red-600" />
                <span>{isBn ? 'প্রোডাক্ট দেখুন' : 'Explore Products'}</span>
              </a>

              <button
                onClick={() => {
                  setActiveFilter('upcoming');
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-red-700/80 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm border border-red-500/50 shadow transition-colors"
              >
                {isBn ? 'আসন্ন পণ্য ও প্রি-অর্ডার' : 'Upcoming Pre-Orders'}
              </button>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-25">
            <ShoppingBag className="w-64 h-64 text-white" />
          </div>
        </div>
      </section>

      {/* 5. MIDDLE 15-SECOND VIDEO BANNER AD */}
      <BannerAds placement="middle" ads={bannerAds} lang={lang} />

      {/* 6. MAIN PRODUCTS CATALOG SECTION */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-950">
                {activeFilter === 'upcoming'
                  ? isBn
                    ? 'আসন্ন পণ্যসমূহ (Pre-order Available)'
                    : 'Upcoming Pre-Order Products'
                  : isBn
                  ? 'আমাদের সকল পণ্য ও কালেকশন'
                  : 'Store Product Catalog'}
              </h2>
              <span className="bg-red-100 text-red-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-red-200">
                {filteredProducts.length} টি পণ্য
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {isBn
                ? 'নিয়মিত কাস্টমারদের জন্য ৫% থেকে ২০% বিশেষ ছাড় ও ৭ স্টার লয়্যালটি সুবিধা।'
                : 'Exclusive discounts for regular buyers with 1 to 7 star loyalty rankings.'}
            </p>
          </div>

          {/* Value Badges */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 font-semibold text-green-700">
              <ShieldCheck className="w-4 h-4" /> ১০০% আসল পণ্য
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-red-600">
              <Truck className="w-4 h-4" /> কিরাটন ১-৯ ওয়ার্ডে হোম ডেলিভারি
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                lang={lang}
                userDiscount={currentUser?.discountPercentage || 0}
                onViewDetails={(prod) => setSelectedProductForDetail(prod)}
                onOrder={(prod, isPreOrder) => setSelectedProductForOrder({ product: prod, isPreOrder })}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-gray-50 rounded-3xl border border-gray-200 p-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No products found'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {isBn
                ? 'অন্য কোনো নাম লিখে সার্চ করুন অথবা ফিল্টার পরিবর্তন করুন।'
                : 'Try searching with another keyword or resetting the filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              {isBn ? 'সকল পণ্য দেখুন' : 'View All Products'}
            </button>
          </div>
        )}
      </main>

      {/* 7. BOTTOM BANNER AD */}
      <BannerAds placement="bottom" ads={bannerAds} lang={lang} />

      {/* 8. FOOTER WITH DISCRETE HIDDEN ADMIN PORTAL */}
      <Footer
        lang={lang}
        onOpenAdminAuth={() => {
          setAuthMode('admin_login');
          setShowAuthModal(true);
        }}
        onOpenPortfolio={() => {
          if (currentUser) {
            setShowPortfolioModal(true);
          } else {
            setAuthMode('login');
            setShowAuthModal(true);
          }
        }}
      />

      {/* 9. FLOATING STORE AI ASSISTANT WIDGET */}
      <AiAssistant lang={lang} />

      {/* MODAL: PRODUCT DETAIL */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          lang={lang}
          userDiscount={currentUser?.discountPercentage || 0}
          onClose={() => setSelectedProductForDetail(null)}
          onOrder={(prod, isPreOrder) => {
            setSelectedProductForDetail(null);
            setSelectedProductForOrder({ product: prod, isPreOrder });
          }}
        />
      )}

      {/* MODAL: ORDER & CHECKOUT WITH LIVE GPS & CAMERA/GALLERY PHOTOS */}
      {selectedProductForOrder && (
        <OrderModal
          product={selectedProductForOrder.product}
          isPreOrder={selectedProductForOrder.isPreOrder}
          currentUser={currentUser}
          lang={lang}
          deliveryChargeSetting={deliveryChargeSetting}
          onClose={() => setSelectedProductForOrder(null)}
          onSubmitOrder={handleSubmitOrder}
        />
      )}

      {/* MODAL: USER PORTFOLIO WITH SOCIAL LINKS, ACTIVE TIME & 7-STAR PROGRESS */}
      {showPortfolioModal && currentUser && (
        <PortfolioModal
          user={currentUser}
          lang={lang}
          onClose={() => setShowPortfolioModal(false)}
          onUpdateUser={handleUpdateCurrentUser}
        />
      )}

      {/* MODAL: AUTHENTICATION (REGISTER WITH SMS OTP, FORGOT PASSWORD, HIDDEN ADMIN) */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authMode}
          lang={lang}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          allUsers={allUsers}
          onRegisterUser={handleRegisterUser}
          onResetPassword={handleResetPassword}
        />
      )}

      {/* MODAL: TWO-WAY LIVE CHAT HUB (ADMIN <-> CUSTOMER SUPPORTING TEXT, IMAGE, VIDEO, PDF) */}
      {showChatModal && currentUser && (
        <ChatModal
          isOpen={showChatModal}
          currentUser={currentUser}
          lang={lang}
          onClose={() => setShowChatModal(false)}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          isAdminView={currentUser.role === 'admin'}
        />
      )}

      {/* FULL ADMIN & STAFF MANAGEMENT DASHBOARD */}
      {showAdminPanel && currentUser?.role === 'admin' && (
        <AdminPanel
          currentUser={currentUser}
          allUsers={allUsers}
          products={products}
          orders={orders}
          promotions={promotions}
          bannerAds={bannerAds}
          chatMessages={chatMessages}
          dataCenterAssets={dataCenterAssets}
          lang={lang}
          onClose={() => setShowAdminPanel(false)}
          onUpdateUsers={setAllUsers}
          onUpdateProducts={setProducts}
          onUpdateOrders={setOrders}
          onUpdatePromotions={setPromotions}
          onUpdateBannerAds={setBannerAds}
          onUpdateDataCenter={setDataCenterAssets}
          onSendMessage={handleSendMessage}
          deliveryCharge={deliveryChargeSetting}
          onUpdateDeliveryCharge={setDeliveryChargeSetting}
          currentViewRole={currentViewRole}
          onChangeViewRole={(role) => setCurrentViewRole(role)}
        />
      )}
    </div>
  );
}
