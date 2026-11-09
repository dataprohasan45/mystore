import React, { useState } from 'react';
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
} from '../types';
import { KIRATON_WARDS, KARIMGANJ_UNIONS } from '../data/initialData';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  TrendingUp,
  Database,
  MapPin,
  Megaphone,
  MessageSquare,
  DollarSign,
  Download,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  ExternalLink,
  Star,
  Award,
  Video,
  Image,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  products: Product[];
  orders: Order[];
  promotions: AreaPromotion[];
  bannerAds: BannerAd[];
  chatMessages: ChatMessage[];
  dataCenterAssets: DataCenterAsset[];
  lang: Language;
  onClose: () => void;
  // State updaters
  onUpdateUsers: (users: UserAccount[]) => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdatePromotions: (promos: AreaPromotion[]) => void;
  onUpdateBannerAds: (ads: BannerAd[]) => void;
  onUpdateDataCenter: (assets: DataCenterAsset[]) => void;
  onSendMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  deliveryCharge: number;
  onUpdateDeliveryCharge: (charge: number) => void;
  // View As handler
  currentViewRole: UserRole;
  onChangeViewRole: (role: UserRole) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  allUsers,
  products,
  orders,
  promotions,
  bannerAds,
  chatMessages,
  dataCenterAssets,
  lang,
  onClose,
  onUpdateUsers,
  onUpdateProducts,
  onUpdateOrders,
  onUpdatePromotions,
  onUpdateBannerAds,
  onUpdateDataCenter,
  onSendMessage,
  deliveryCharge,
  onUpdateDeliveryCharge,
  currentViewRole,
  onChangeViewRole,
}) => {
  const isBn = lang === 'bn';

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'users'
    | 'orders'
    | 'products'
    | 'area_promotions'
    | 'data_center'
    | 'ads'
    | 'chats'
    | 'cashier'
    | 'report'
  >('dashboard');

  // Password visibility toggle per user
  const [visiblePasswordUserId, setVisiblePasswordUserId] = useState<string | null>(null);

  // New User Creation Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('seller');
  const [newUserWard, setNewUserWard] = useState(KIRATON_WARDS[2]);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [prodTitleBn, setProdTitleBn] = useState('');
  const [prodTitleEn, setProdTitleEn] = useState('');
  const [prodPrice, setProdPrice] = useState(1200);
  const [prodStock, setProdStock] = useState(20);
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80');
  const [prodIsUpcoming, setProdIsUpcoming] = useState(false);
  const [prodExpectedDate, setProdExpectedDate] = useState('');
  const [prodDescBn, setProdDescBn] = useState('');

  // New Area Campaign State
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoWard, setPromoWard] = useState<string>('all');
  const [promoBadge, setPromoBadge] = useState('বিশেষ ছাড়');

  // New Data Center Asset
  const [assetTitle, setAssetTitle] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [assetType, setAssetType] = useState<'image' | 'video' | 'pdf'>('image');

  // Chat reply in admin
  const [adminReplyText, setAdminReplyText] = useState('');

  // Calculations for Monthly Chart
  const totalOrders = orders.length;
  const verifiedOrders = orders.filter((o) => o.paymentStatus === 'verified').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'verified' ? o.totalAmount : 0), 0);
  const totalCommissions = orders.reduce((sum, o) => sum + (o.commissionPaid ? Math.round(o.subtotal * 0.08) : 0), 0);

  // Quick printable monthly report
  const handlePrintMonthlyReport = () => {
    window.print();
  };

  // Add staff / user by Admin
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: `staff-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      password: newUserPassword.trim(),
      role: newUserRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      areaDivision: 'ঢাকা',
      areaDistrict: 'কিশোরগঞ্জ',
      areaUpazila: 'করিমগঞ্জ',
      areaUnion: '৩ নং কিরাটন ইউনিয়ন পরিষদ',
      areaWard: newUserWard,
      starRating: 5,
      isRegularCustomer: false,
      discountPercentage: 10,
      sellerLevel: newUserRole === 'seller' ? 1 : undefined,
      totalSales: 0,
      earnedCommission: 0,
      activeMinutes: 1,
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateUsers([...allUsers, newUser]);
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserPassword('');
  };

  // Delete User
  const handleDeleteUser = (userId: string) => {
    if (confirm(isBn ? 'আপনি কি নিশ্চিত এই একাউন্টটি মুছে দিতে চান?' : 'Are you sure to delete this user?')) {
      onUpdateUsers(allUsers.filter((u) => u.id !== userId));
    }
  };

  // Promote Customer to Wholesaler or adjust Star Rating
  const handleUpdateUserStars = (userId: string, newStars: number) => {
    onUpdateUsers(
      allUsers.map((u) => {
        if (u.id === userId) {
          const shouldPromoteWholesale = newStars >= 7;
          return {
            ...u,
            starRating: newStars,
            role: shouldPromoteWholesale && u.role === 'customer' ? 'wholesaler' : u.role,
            isRegularCustomer: newStars >= 5,
            discountPercentage: newStars * 3,
          };
        }
        return u;
      })
    );
  };

  // Adjust Seller Level (1 to 7)
  const handleUpdateSellerLevel = (userId: string, newLevel: number) => {
    onUpdateUsers(
      allUsers.map((u) => (u.id === userId ? { ...u, sellerLevel: Math.min(7, Math.max(1, newLevel)) } : u))
    );
  };

  // Add Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      titleBn: prodTitleBn.trim(),
      titleEn: prodTitleEn.trim() || prodTitleBn.trim(),
      categoryBn: prodIsUpcoming ? 'আসন্ন পণ্য' : 'সাধারণ প্রোডাক্ট',
      categoryEn: prodIsUpcoming ? 'Upcoming' : 'General',
      price: Number(prodPrice),
      originalPrice: Math.round(Number(prodPrice) * 1.25),
      image: prodImage.trim(),
      stock: prodIsUpcoming ? 0 : Number(prodStock),
      isUpcoming: prodIsUpcoming,
      expectedDate: prodExpectedDate.trim() || undefined,
      descriptionBn: prodDescBn.trim() || 'উচ্চমানের সেরা পণ্য। কিরাটন ইউনিয়ন ও করিমগঞ্জে হোম ডেলিভারি।',
      descriptionEn: 'High quality product with local door delivery.',
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      tags: prodIsUpcoming ? ['upcoming'] : ['featured'],
    };

    onUpdateProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setProdTitleBn('');
    setProdTitleEn('');
    setProdDescBn('');
    setProdExpectedDate('');
  };

  // Add Area Promotion
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: AreaPromotion = {
      id: `promo-${Date.now()}`,
      titleBn: promoTitle.trim(),
      titleEn: promoTitle.trim(),
      descriptionBn: promoDesc.trim(),
      descriptionEn: promoDesc.trim(),
      discountBadge: promoBadge,
      division: 'ঢাকা',
      district: 'কিশোরগঞ্জ',
      upazila: 'করিমগঞ্জ',
      union: '৩ নং কিরাটন ইউনিয়ন পরিষদ',
      targetWards: promoWard === 'all' ? ['all'] : [promoWard],
      viewsCount: 0,
      clicksCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdatePromotions([newPromo, ...promotions]);
    setShowAddPromoModal(false);
    setPromoTitle('');
    setPromoDesc('');
  };

  // Add Data Center Asset
  const handleCreateDataAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: DataCenterAsset = {
      id: `asset-${Date.now()}`,
      title: assetTitle.trim(),
      category: assetType,
      url: assetUrl.trim(),
      fileSize: '3.5 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      usedInProductsCount: 1,
    };
    onUpdateDataCenter([newAsset, ...dataCenterAssets]);
    setAssetTitle('');
    setAssetUrl('');
  };

  // Admin reply in chat
  const handleAdminSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;

    onSendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'admin',
      receiverId: 'customer-01',
      text: adminReplyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toISOString().split('T')[0],
      isRead: false,
    });
    setAdminReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-950 text-gray-100 flex flex-col print:bg-white print:text-black">
      {/* Top Bar with "View As" Dropdown & Close */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-green-600 flex items-center justify-center font-black text-white shadow">
            AD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                {isBn ? 'মাই স্টোর সাইট - সেন্ট্রাল অ্যাডমিন ও স্টাফ প্যানেল' : 'Central Admin & Staff Control Panel'}
              </h2>
              <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {isBn
                ? 'কিশোরগঞ্জ ও ৩ নং কিরাটন হাব | ইউজার, সেলস, ডাটা সেন্টার ও এরিয়া ব্রডকাস্ট'
                : 'Kishoreganj & Kiraton UP Delivery Logistics'}
            </p>
          </div>
        </div>

        {/* View As & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* VIEW AS OPTION (Crucial User Requirement) */}
          <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-xl">
            <Layers className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-300 font-bold">
              {isBn ? 'ভিউ অ্যাজ (View As):' : 'View As:'}
            </span>
            <select
              value={currentViewRole}
              onChange={(e) => onChangeViewRole(e.target.value as UserRole)}
              className="bg-gray-900 text-yellow-300 text-xs font-black px-2 py-1 rounded-lg border border-gray-600 focus:outline-none"
            >
              <option value="admin">প্রধান অ্যাডমিন (Super Admin)</option>
              <option value="customer">কাস্টমার (Customer View)</option>
              <option value="seller">সেলার (Seller View - Level 1 to 7)</option>
              <option value="cashier">ক্যাশিয়ার (Cashier View)</option>
              <option value="area_manager">এরিয়া ম্যানেজার (Karimganj Lead)</option>
              <option value="distributor">ডিস্ট্রিবিউটর (Distributor)</option>
              <option value="wholesaler">হোলসেলার (Wholesaler)</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {isBn ? 'প্যানেল বন্ধ করুন (Exit)' : 'Exit Panel'}
          </button>
        </div>
      </div>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-3 space-y-1 shrink-0 overflow-y-auto print:hidden">
          {[
            { id: 'dashboard', labelBn: 'ড্যাশবোর্ড ও ওভারভিউ', labelEn: 'Dashboard', icon: LayoutDashboard },
            { id: 'report', labelBn: 'মাসিক পারফর্মেন্স চার্ট ও PDF', labelEn: 'Monthly PDF Chart', icon: TrendingUp },
            { id: 'users', labelBn: 'ইউজার ও স্টাফ ম্যানেজমেন্ট', labelEn: 'Staff & Users', icon: Users },
            { id: 'orders', labelBn: 'অর্ডার ও লাইভ জিপিএস লোকেশন', labelEn: 'Orders & GPS', icon: MapPin },
            { id: 'products', labelBn: 'প্রোডাক্ট ও আসন্ন পণ্য (Pre-order)', labelEn: 'Products & Upcoming', icon: ShoppingBag },
            { id: 'area_promotions', labelBn: '৩ নং কিরাটন ওয়ার্ড প্রচারণা', labelEn: 'Kiraton Ward Campaigns', icon: Megaphone },
            { id: 'data_center', labelBn: 'নিজস্ব ডাটা সেন্টার (মিডিয়া)', labelEn: 'Data Center Storage', icon: Database },
            { id: 'ads', labelBn: 'এড ম্যানেজার (ভিডিও/ব্যানার)', labelEn: '15s Ads & Banners', icon: Video },
            { id: 'chats', labelBn: 'গ্রাহক চ্যাট ও ফাইল আদান-প্রদান', labelEn: 'Customer Chat Hub', icon: MessageSquare },
            { id: 'cashier', labelBn: 'ক্যাশ ও সেলার কমিশন হিসাব', labelEn: 'Cashier & Commissions', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-600 to-green-700 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-yellow-300' : 'text-gray-500'}`} />
                <span className="truncate">{isBn ? tab.labelBn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-950 text-gray-200">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow">
                  <span className="text-xs text-gray-400 block mb-1">মোট অর্ডারের সংখ্যা</span>
                  <div className="text-2xl font-black text-white">{totalOrders}</div>
                  <span className="text-[11px] text-green-400">✓ {verifiedOrders} টি ভেরিফাইড</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow">
                  <span className="text-xs text-gray-400 block mb-1">মোট বিক্রয় (Revenue)</span>
                  <div className="text-2xl font-black text-green-400">
                    ৳{totalRevenue.toLocaleString('bn-BD')}
                  </div>
                  <span className="text-[11px] text-gray-400">বিকাশ ও নগদে সংগৃহীত</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow">
                  <span className="text-xs text-gray-400 block mb-1">নিবন্ধিত ইউজার ও কর্মী</span>
                  <div className="text-2xl font-black text-yellow-400">{allUsers.length} জন</div>
                  <span className="text-[11px] text-gray-400">সেলার, ক্যাশিয়ার ও ক্রেতা</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow">
                  <span className="text-xs text-gray-400 block mb-1">সেলার মোট কমিশন প্রদেয়</span>
                  <div className="text-2xl font-black text-red-400">
                    ৳{totalCommissions.toLocaleString('bn-BD')}
                  </div>
                  <span className="text-[11px] text-gray-400">লেভেল ১-৭ সেলার আর্নিং</span>
                </div>
              </div>

              {/* Delivery Charge Setting Card */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {isBn ? 'হোম ডেলিভারি সার্ভিস চার্জ নিয়ন্ত্রণ' : 'Delivery Service Charge Control'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'করিমগঞ্জ থানা ও ৩ নং কিরাটন ইউনিয়নের জন্য প্রতিটি অর্ডারের ডেলিভারি ফি সেট করুন।'
                      : 'Configure default delivery fee across Karimganj and Kiraton UP.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-300">বর্তমান চার্জ:</span>
                  <input
                    type="number"
                    value={deliveryCharge}
                    onChange={(e) => onUpdateDeliveryCharge(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-xl text-green-400 font-black text-base focus:outline-none"
                  />
                  <span className="text-sm font-bold text-gray-300">টাকা (৳)</span>
                </div>
              </div>

              {/* Kiraton Coverage Notice */}
              <div className="bg-gradient-to-r from-red-950 via-gray-900 to-green-950 border border-green-800/40 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>ঢাকা বিভাগ - কিশোরগঞ্জ জেলা - করিমগঞ্জ থানা - ৩ নং কিরাটন ইউনিয়ন পরিষদ</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  আমাদের সাইটের মাধ্যমে কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ডে বাড়ি বাড়ি পণ্য পৌঁছে
                  দেওয়ার জন্য গ্রাহকের লাইভ জিপিএস লোকেশন ও বাসার সম্মুখভাগের ছবি সংগ্রহ করা হচ্ছে।
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MONTHLY PERFORMANCE CHART & PDF REPORT */}
          {activeTab === 'report' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-800 print:hidden">
                <div>
                  <h3 className="text-xl font-black text-white">
                    {isBn ? 'মাসিক পারফর্মেন্স চার্ট ও ডাউনলোডযোগ্য রিপোর্ট' : 'Monthly Performance & PDF Report'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'কর্মীদের সেলস, পোস্ট সংখ্যা ও কমিশন তথ্যের ভিত্তিতে স্বয়ংক্রিয় তৈরি চার্ট।'
                      : 'Automated staff performance breakdown and printable ledger.'}
                  </p>
                </div>
                <button
                  onClick={handlePrintMonthlyReport}
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isBn ? 'রিপোর্ট প্রিন্ট / PDF ডাউনলোড (OK)' : 'Print / Download PDF'}</span>
                </button>
              </div>

              {/* Printable Monthly Performance Document */}
              <div className="bg-white text-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
                {/* Report Header */}
                <div className="flex items-center justify-between border-b-2 border-red-600 pb-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-950">My Store Site (মাই স্টোর সাইট)</h2>
                    <p className="text-xs text-gray-600">
                      করিমগঞ্জ ডেলিভারি হাব • ৩ নং কিরাটন ইউনিয়ন পরিষদ সকল ওয়ার্ড
                    </p>
                    <p className="text-[11px] text-gray-500">
                      অফিশিয়াল মাসিক অগ্রগতি ও কর্মী মূল্যায়ন প্রতিবেদন • তারিখ: {new Date().toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                      OFFICIAL REPORT
                    </span>
                  </div>
                </div>

                {/* Monthly Metrics Summary Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                  <div className="bg-gray-50 p-3 rounded-xl border">
                    <span className="text-xs text-gray-500 block">মোট পোস্ট সংখ্যা</span>
                    <span className="text-xl font-black text-gray-900">{products.length + promotions.length}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border">
                    <span className="text-xs text-gray-500 block">মোট সেল সম্পন্ন</span>
                    <span className="text-xl font-black text-green-700">{verifiedOrders} টি</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border">
                    <span className="text-xs text-gray-500 block">মোট বিক্রয় রেভিনিউ</span>
                    <span className="text-xl font-black text-gray-900">৳{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border">
                    <span className="text-xs text-gray-500 block">মোট কমিশন প্রদান</span>
                    <span className="text-xl font-black text-red-600">৳{totalCommissions.toLocaleString()}</span>
                  </div>
                </div>

                {/* Visual Performance Bar Chart (SVG) */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-800 mb-3">
                    মাসিক বিক্রয় ও পোস্ট অগ্রগতি চার্ট (Monthly Growth Visual):
                  </h4>
                  <div className="h-44 bg-gray-50 rounded-xl p-4 border flex items-end justify-between gap-4 text-xs font-semibold text-gray-600">
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full max-w-[40px] bg-red-500 rounded-t-lg transition-all" style={{ height: '45%' }} />
                      <span>১ম সপ্তাহ</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full max-w-[40px] bg-red-600 rounded-t-lg transition-all" style={{ height: '65%' }} />
                      <span>২য় সপ্তাহ</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full max-w-[40px] bg-green-600 rounded-t-lg transition-all" style={{ height: '85%' }} />
                      <span>৩য় সপ্তাহ</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full max-w-[40px] bg-green-700 rounded-t-lg transition-all" style={{ height: '95%' }} />
                      <span>৪র্থ সপ্তাহ (বর্তমান)</span>
                    </div>
                  </div>
                </div>

                {/* Staff & Seller Performance Ranking Table (Level 1 to 7) */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-3">
                    কর্মীদের কাজের মূল্যায়ন ও লেভেল তালিকা (Seller Progression & Grades):
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-gray-700 border-b">
                          <th className="p-2.5">কর্মীর নাম</th>
                          <th className="p-2.5">পদবী</th>
                          <th className="p-2.5">এলাকা / ওয়ার্ড</th>
                          <th className="p-2.5">লেভেল (১-৭)</th>
                          <th className="p-2.5">মোট সেলস</th>
                          <th className="p-2.5">অর্জিত কমিশন</th>
                          <th className="p-2.5">রেটিং</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allUsers
                          .filter((u) => u.role === 'seller' || u.role === 'area_manager' || u.role === 'wholesaler')
                          .map((staff) => (
                            <tr key={staff.id} className="hover:bg-gray-50">
                              <td className="p-2.5 font-bold text-gray-900">{staff.name}</td>
                              <td className="p-2.5 capitalize">{staff.role}</td>
                              <td className="p-2.5">{staff.areaWard}</td>
                              <td className="p-2.5">
                                <span className="bg-green-100 text-green-800 font-black px-2 py-0.5 rounded">
                                  লেভেল {staff.sellerLevel || 4}
                                </span>
                              </td>
                              <td className="p-2.5 font-semibold">{staff.totalSales || 15} টি</td>
                              <td className="p-2.5 font-bold text-red-600">৳{staff.earnedCommission || 1200}</td>
                              <td className="p-2.5 text-amber-500 font-bold">★ {staff.starRating}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sign-off footer */}
                <div className="mt-8 pt-6 border-t border-gray-300 flex justify-between text-xs text-gray-600">
                  <div>
                    <p className="font-bold">সিস্টেম জেনারেটেড রিপোর্ট</p>
                    <p>My Store Site সেন্ট্রাল ডাটাবেজ</p>
                  </div>
                  <div className="text-right">
                    <div className="w-36 border-b border-gray-400 mb-1" />
                    <p className="font-bold">আল হাসান (প্রধান এডমিন)</p>
                    <p className="text-[10px]">স্বাক্ষর ও সিল</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USER & STAFF MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isBn ? 'সকল ইউজার ও স্টাফ একাউন্ট পরিচালনা' : 'User & Staff Management'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'এডমিন ছাড়া অন্য কোনো কর্মী স্বয়ংক্রিয়ভাবে অ্যাকাউন্ট করতে পারবে না। এডমিন পাসওয়ার্ড ও ছবি সহ নিয়ন্ত্রণ করতে পারবেন।'
                      : 'Admin creates & regulates sub-admin, seller, cashier, manager, and customer roles.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন কর্মী/ইউজার একাউন্ট যোগ করুন' : 'Add New Staff / User'}</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-gray-800 text-gray-400 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3">ইউজার / কর্মী</th>
                        <th className="p-3">পদবী (Role)</th>
                        <th className="p-3">ফোন ও ইমেইল</th>
                        <th className="p-3">পাসওয়ার্ড (এডমিন ভিউ)</th>
                        <th className="p-3">সক্রিয় সময়</th>
                        <th className="p-3">স্টার মার্ক (১-৭)</th>
                        <th className="p-3">লেভেল (১-৭)</th>
                        <th className="p-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {allUsers.map((user) => {
                        const isPassVisible = visiblePasswordUserId === user.id;

                        return (
                          <tr key={user.id} className="hover:bg-gray-800/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-700"
                                />
                                <div>
                                  <span className="font-bold text-white block">{user.name}</span>
                                  <span className="text-[10px] text-gray-400">{user.areaWard}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  user.role === 'admin'
                                    ? 'bg-red-950 text-red-400 border border-red-800'
                                    : user.role === 'seller'
                                    ? 'bg-green-950 text-green-400 border border-green-800'
                                    : user.role === 'cashier'
                                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                    : 'bg-gray-800 text-gray-300'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>

                            <td className="p-3">
                              <div className="text-[11px] text-gray-300 font-mono">{user.phone}</div>
                              <div className="text-[10px] text-gray-500 truncate max-w-[130px]">{user.email}</div>
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs text-yellow-300">
                                  {isPassVisible ? user.password || 'N/A' : '••••••••'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setVisiblePasswordUserId(isPassVisible ? null : user.id)
                                  }
                                  className="text-gray-400 hover:text-white"
                                  title="Toggle View Password"
                                >
                                  {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            <td className="p-3 text-[11px] text-green-400 font-bold">
                              ⏱️ {user.activeMinutes} মি.
                            </td>

                            {/* 1 to 7 Stars customer promotion */}
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <select
                                  value={user.starRating}
                                  onChange={(e) => handleUpdateUserStars(user.id, Number(e.target.value))}
                                  className="bg-gray-800 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded border border-gray-700"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                                    <option key={s} value={s}>
                                      {s} স্টার
                                    </option>
                                  ))}
                                </select>
                                {user.starRating === 7 && (
                                  <span className="text-[10px] bg-yellow-400 text-gray-950 px-1 font-bold rounded">
                                    হোলসেলার
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Seller Level 1 to 7 */}
                            <td className="p-3">
                              {user.role === 'seller' ? (
                                <select
                                  value={user.sellerLevel || 1}
                                  onChange={(e) => handleUpdateSellerLevel(user.id, Number(e.target.value))}
                                  className="bg-gray-800 text-green-400 text-xs font-bold px-1.5 py-0.5 rounded border border-gray-700"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                                    <option key={lvl} value={lvl}>
                                      লেভেল {lvl}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & LIVE GPS LOCATIONS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">
                  {isBn ? 'গ্রাহক অর্ডার, লাইভ জিপিএস লোকেশন ও বাসার ছবি' : 'Orders, Live GPS Locations & Photos'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn
                    ? 'গ্রাহক কর্তৃক শেয়ার করা জিপিএস স্থানাঙ্ক, গুগল ম্যাপ ট্র্যাক এবং বাসার/রাস্তার ছবি।'
                    : 'Customer shared coordinates, google map routing and camera photos.'}
                </p>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{order.orderNumber}</span>
                        <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                          {order.createdAt}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                            order.paymentStatus === 'verified'
                              ? 'bg-green-950 text-green-400 border border-green-800'
                              : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                          }`}
                        >
                          পেমেন্ট: {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold">স্ট্যাটাস:</span>
                        <select
                          value={order.deliveryStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            onUpdateOrders(
                              orders.map((o) => (o.id === order.id ? { ...o, deliveryStatus: newStatus } : o))
                            );
                          }}
                          className="bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-lg border border-gray-700"
                        >
                          <option value="placed">অর্ডার গৃহীত (Placed)</option>
                          <option value="processing">প্রসেসিং (Processing)</option>
                          <option value="shipped">শিপড / রাইডার পথে (Shipped)</option>
                          <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                          <option value="cancelled">বাতিল (Cancelled)</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Info & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block">কাস্টমার নাম ও মোবাইল:</span>
                        <span className="font-bold text-white text-sm">{order.customerName}</span>
                        <span className="text-gray-300 block font-mono">{order.customerPhone}</span>
                      </div>

                      <div>
                        <span className="text-gray-500 block">ডেলিভারি এলাকা ও ওয়ার্ড:</span>
                        <span className="text-green-400 font-bold">{order.ward}</span>
                        <span className="text-gray-300 block">{order.address}</span>
                      </div>

                      <div>
                        <span className="text-gray-500 block">টাকার পরিমাণ ও TrxID:</span>
                        <span className="text-base font-black text-red-400">
                          ৳{order.totalAmount.toLocaleString()}
                        </span>
                        {order.paymentTrxId && (
                          <span className="text-yellow-400 block font-mono text-[11px]">
                            TrxID: {order.paymentTrxId}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Note */}
                    {order.deliveryNote && (
                      <div className="p-2.5 bg-gray-800/60 rounded-xl text-xs text-gray-300 border border-gray-700">
                        <span className="font-bold text-yellow-300">কাস্টমারের ডেলিভারি নোট:</span> {order.deliveryNote}
                      </div>
                    )}

                    {/* GPS Coordinates & Map Link */}
                    {order.gpsLocation && (
                      <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="font-bold text-white">লাইভ জিপিএস স্থানাঙ্ক:</span>
                          <span className="font-mono text-gray-300">
                            Latitude: {order.gpsLocation.latitude.toFixed(4)}, Longitude: {order.gpsLocation.longitude.toFixed(4)}
                          </span>
                        </div>
                        <a
                          href={order.gpsLocation.mapUrl || `https://maps.google.com/?q=${order.gpsLocation.latitude},${order.gpsLocation.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <span>গুগল ম্যাপে লাইভ রুট দেখুন</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Attached Photos (House Front & Roadways) */}
                    {(order.housePhoto || order.roadPhoto) && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-gray-400 block mb-2">
                          কাস্টমার কর্তৃক সংযুক্ত ছবি (ক্যামেরা/গ্যালারি):
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {order.housePhoto && (
                            <div className="rounded-xl overflow-hidden border border-gray-700 w-36">
                              <img
                                src={order.housePhoto}
                                alt="House Front"
                                className="w-full h-24 object-cover"
                              />
                              <span className="text-[10px] text-center block bg-gray-800 p-1 font-semibold text-gray-300">
                                বাসার সম্মুখভাগ
                              </span>
                            </div>
                          )}
                          {order.roadPhoto && (
                            <div className="rounded-xl overflow-hidden border border-gray-700 w-36">
                              <img
                                src={order.roadPhoto}
                                alt="Roadway Front"
                                className="w-full h-24 object-cover"
                              />
                              <span className="text-[10px] text-center block bg-gray-800 p-1 font-semibold text-gray-300">
                                রাস্তার মোড়ের ছবি
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS & UPCOMING PRE-ORDERS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isBn ? 'প্রোডাক্ট ও আসন্ন পণ্য (Upcoming Products) পরিচালনা' : 'Products & Upcoming Manager'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'নতুন পণ্য যোগ করুন, স্টক নিয়ন্ত্রণ করুন এবং আসন্ন পণ্যের ফ্রি প্রি-অর্ডার সক্রিয় করুন।'
                      : 'Add products, update stock, and schedule upcoming pre-order items.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন পণ্য বা আসন্ন পণ্য যোগ করুন' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-3 shadow hover:border-gray-700"
                  >
                    <img
                      src={p.image}
                      alt={p.titleBn}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {p.isUpcoming ? (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            আসন্ন পণ্য
                          </span>
                        ) : (
                          <span className="bg-green-950 text-green-400 border border-green-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            স্টকে আছে: {p.stock} পিস
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs truncate mb-1">{p.titleBn}</h4>
                      <div className="text-red-400 font-black text-sm">৳{p.price.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                        <span>বিক্রয়: {p.salesCount} টি</span>
                        <button
                          onClick={() => {
                            if (confirm('এই পণ্যটি মুছে দিতে চান?')) {
                              onUpdateProducts(products.filter((item) => item.id !== p.id));
                            }
                          }}
                          className="text-red-400 hover:underline"
                        >
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AREA PROMOTIONS & KIRATON WARDS BROADCAST */}
          {activeTab === 'area_promotions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isBn ? '৩ নং কিরাটন ইউনিয়ন পরিষদের ওয়ার্ড প্রচার ও ব্রডকাস্ট' : 'Kiraton UP Ward Campaigns'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isBn
                      ? 'কিশোরগঞ্জ জেলা, করিমগঞ্জ থানা ও কিরাটন ইউনিয়নের প্রতিটি ওয়ার্ডে টার্গেটেড পোস্ট প্রচার।'
                      : 'Create targeted promotional campaigns for Kishoreganj & Kiraton UP wards.'}
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBn ? 'নতুন এরিয়া প্রচারণা তৈরি করুন' : 'Create Area Promo'}</span>
                </button>
              </div>

              {/* Promotions List with Reach Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                        {promo.discountBadge}
                      </span>
                      <span className="text-xs text-gray-400">তৈরি: {promo.createdAt}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{promo.titleBn}</h4>
                    <p className="text-xs text-gray-300 leading-relaxed">{promo.descriptionBn}</p>

                    <div className="p-3 bg-gray-800/70 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px]">টার্গেট এলাকা:</span>
                        <span className="font-bold text-green-400">
                          {promo.targetWards.includes('all') ? 'সকল ওয়ার্ড (১-৯)' : promo.targetWards.join(', ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block text-[11px]">প্রচার দর্শন (Views):</span>
                        <span className="font-black text-yellow-400">{promo.viewsCount} বার</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DATA CENTER (আমার নিজস্ব ডাটা সেন্টার) */}
          {activeTab === 'data_center' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">
                  {isBn ? 'আমার নিজস্ব ডাটা সেন্টার (ছবি, ভিডিও ও ফাইল স্টোরেজ)' : 'Data Center Storage'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn
                    ? 'আপনার ছবি, ডেমো ভিডিও ও পিডিএফ নথি এখানে নিরাপদভাবে সংরক্ষণ করুন এবং যেকোনো পণ্যের সাথে যুক্ত করুন।'
                    : 'Upload, store, copy links, and attach digital assets to product listings.'}
                </p>
              </div>

              {/* Upload Asset Bar */}
              <form onSubmit={handleCreateDataAsset} className="bg-gray-900 border border-gray-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-white block">নতুন ফাইল ডাটা সেন্টারে আপলোড / যুক্ত করুন:</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    placeholder="ফাইলের নাম (যেমন: ড্রোন ক্যামেরা আনবক্সিং ভিডিও)"
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                  <input
                    type="url"
                    required
                    value={assetUrl}
                    onChange={(e) => setAssetUrl(e.target.value)}
                    placeholder="ফাইলের URL বা লিংক"
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white sm:col-span-2"
                  />
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold"
                  >
                    <option value="image">ছবি (Image)</option>
                    <option value="video">ভিডিও (Video Clip)</option>
                    <option value="pdf">পিডিএফ (PDF Document)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>ডাটা সেন্টারে সেভ করুন (OK)</span>
                </button>
              </form>

              {/* Assets Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataCenterAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-gray-800 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {asset.category}
                        </span>
                        <span className="text-[11px] text-gray-400">{asset.fileSize}</span>
                      </div>
                      <h4 className="font-bold text-white text-xs mb-2 line-clamp-1">{asset.title}</h4>

                      {asset.category === 'image' && (
                        <img
                          src={asset.url}
                          alt={asset.title}
                          className="w-full h-32 object-cover rounded-xl mb-2"
                        />
                      )}
                      {asset.category === 'video' && (
                        <video
                          src={asset.url}
                          controls
                          className="w-full h-32 object-contain bg-black rounded-xl mb-2"
                        />
                      )}
                      {asset.category === 'pdf' && (
                        <div className="w-full h-32 bg-gray-800 rounded-xl flex items-center justify-center text-red-500 flex-col gap-1 mb-2">
                          <FileText className="w-8 h-8" />
                          <span className="text-[11px] text-gray-300">পিডিএফ নথি</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(asset.url);
                          alert('লিংক কপি করা হয়েছে!');
                        }}
                        className="text-green-400 hover:underline font-semibold"
                      >
                        লিংক কপি করুন
                      </button>
                      <button
                        onClick={() => {
                          onUpdateDataCenter(dataCenterAssets.filter((a) => a.id !== asset.id));
                        }}
                        className="text-red-400 hover:underline"
                      >
                        মুছুন
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ADS MANAGER (শীর্ষে, মাঝে, নিচে ১৫ সেকেন্ডের ভিডিও এড) */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">
                  {isBn ? 'বিজ্ঞাপন ও ব্যানার ম্যানেজার (উপরে, মাঝে ও নিচে)' : 'Ads & 15-Second Video Manager'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn
                    ? 'ওয়েবসাইটের ৩টি পজিশনে (শীর্ষে, মাঝে, নিচে) ১৫ সেকেন্ডের ভিডিও, ব্যানার ছবি বা নোটিশ সক্রিয়/নিষ্ক্রিয় করুন।'
                    : 'Toggle and update top, middle, and bottom marketing ads across video, images, text, and promo links.'}
                </p>
              </div>

              <div className="space-y-4">
                {bannerAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded uppercase">
                          পজিশন: {ad.placement.toUpperCase()}
                        </span>
                        <span className="bg-gray-800 text-yellow-300 text-xs px-2 py-0.5 rounded font-mono">
                          টাইপ: {ad.type.toUpperCase()}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onUpdateBannerAds(
                            bannerAds.map((a) => (a.id === ad.id ? { ...a, isActive: !a.isActive } : a))
                          );
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          ad.isActive ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {ad.isActive ? '✓ লাইভ চলছে (Active)' : 'নিষ্ক্রিয় (Off)'}
                      </button>
                    </div>

                    <h4 className="font-bold text-white text-sm">{ad.titleBn}</h4>
                    <p className="text-xs text-gray-400 truncate">{ad.content}</p>

                    {ad.type === 'video' && (
                      <div className="text-[11px] text-green-400">
                        🎬 ভিডিও অ্যাড লিমিট: সর্বোচ্চ ১৫ সেকেন্ড
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CHAT INBOX WITH USERS (TEXT, PHOTO, VIDEO, PDF) */}
          {activeTab === 'chats' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">
                  {isBn ? 'গ্রাহক সহায়তা ইনবক্স (চ্যাট ও মিডিয়া এক্সচেঞ্জ)' : 'Customer Support Chat Hub'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn
                    ? 'গ্রাহকদের সাথে সরাসরি চ্যাটিং, ছবি, ভিডিও এবং পিডিএফ ব্রোশিউর প্রেরণ করুন।'
                    : 'Exchange text, images, videos, and PDFs with customers.'}
                </p>
              </div>

              {/* Chat Thread */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 h-[420px] flex flex-col justify-between">
                <div className="overflow-y-auto space-y-3 flex-1 pr-2">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderRole === 'admin' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-gray-400 mb-0.5">
                        {msg.senderName} ({msg.timestamp})
                      </span>
                      <div
                        className={`p-3 rounded-2xl max-w-md text-xs ${
                          msg.senderRole === 'admin'
                            ? 'bg-green-700 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.attachment && (
                          <div className="mt-2 pt-2 border-t border-white/20 text-[11px] font-bold">
                            📎 {msg.attachment.type.toUpperCase()}: {msg.attachment.fileName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Admin Quick Reply Box */}
                <form onSubmit={handleAdminSendReply} className="pt-3 border-t border-gray-800 flex gap-2">
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="অ্যাডমিনের পক্ষ থেকে বার্তা লিখুন..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    পাঠান (OK)
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 10: CASHIER & SELLER COMMISSIONS */}
          {activeTab === 'cashier' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">
                  {isBn ? 'ক্যাশিয়ার লেনদেন ও সেলার কমিশন হিসাব' : 'Cashier & Seller Commission Accounting'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isBn
                    ? 'বিকাশ ও নগদ ভেরিফিকেশন, সেলারের কাজের অগ্রগতির ভিত্তিতে কমিশন পরিশোধ।'
                    : 'Verify bKash and Nagad transactions and disburse seller commissions.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs text-gray-400 block">ক্যাশ কাউন্টার / বিকাশ ব্যালেন্স:</span>
                  <div className="text-3xl font-black text-green-400">
                    ৳{totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400">
                    প্রধান ক্যাশিয়ার দ্বারা ভেরিফাইড অর্ডারসমূহ।
                  </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
                  <span className="text-xs text-gray-400 block">অনুমোদিত সেলার কমিশন বাবদ খরচ:</span>
                  <div className="text-3xl font-black text-red-400">
                    ৳{totalCommissions.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400">
                    লেভেল ১ থেকে ৭ সেলারদের সেলস ভিত্তিক স্বয়ংক্রিয় প্রদেয়।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-5 text-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="font-bold text-white text-base">নতুন কর্মী / ইউজার একাউন্ট তৈরি</h4>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">পদবী (Role) *</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-bold"
                >
                  <option value="seller">সেলার (Seller - Level 1 to 7)</option>
                  <option value="cashier">ক্যাশিয়ার (Cashier)</option>
                  <option value="area_manager">এরিয়া ম্যানেজার (Karimganj)</option>
                  <option value="distributor">কোম্পানি ডিস্ট্রিবিউটর</option>
                  <option value="wholesaler">অনুমোদিত হোলসেলার</option>
                  <option value="customer">সাধারণ গ্রাহক (Customer)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">মোবাইল ফোন নাম্বার *</label>
                <input
                  type="tel"
                  required
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">ইমেইল অ্যাড্রেস *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@mystoresite.com"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">লগইন পাসওয়ার্ড সেট করুন *</label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="SecretPassword123"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">৩ নং কিরাটন ওয়ার্ড দায়িত্ব</label>
                <select
                  value={newUserWard}
                  onChange={(e) => setNewUserWard(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-semibold"
                >
                  {KIRATON_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                একাউন্ট সংরক্ষণ করুন (OK)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-5 text-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="font-bold text-white text-base">নতুন পণ্য / আসন্ন পণ্য যোগ করুন</h4>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">পণ্যের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  value={prodTitleBn}
                  onChange={(e) => setProdTitleBn(e.target.value)}
                  placeholder="যেমন: স্মার্ট ড্রোন ক্যামেরা"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-800/80 rounded-xl space-y-2 border border-gray-700">
                <label className="flex items-center gap-2 text-yellow-300 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsUpcoming}
                    onChange={(e) => setProdIsUpcoming(e.target.checked)}
                    className="rounded text-green-600 focus:ring-0"
                  />
                  <span>এটি কি "আসন্ন পণ্য (Upcoming Item)"?</span>
                </label>

                {prodIsUpcoming && (
                  <div>
                    <label className="block text-gray-400 mb-1">কবে স্টকে আসবে (আনুমানিক তারিখ):</label>
                    <input
                      type="text"
                      value={prodExpectedDate}
                      onChange={(e) => setProdExpectedDate(e.target.value)}
                      placeholder="যেমন: ১৫ দিনের মধ্যে শিপমেন্ট হবে"
                      className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-1">ছবির লিঙ্ক (Image URL)</label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                পণ্য সেভ করুন (OK)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE AREA PROMOTION MODAL */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-5 text-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h4 className="font-bold text-white text-base">৩ নং কিরাটন নতুন এরিয়া প্রচার</h4>
              <button onClick={() => setShowAddPromoModal(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1">প্রচার শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="যেমন: কিরাটন ৩ নং ওয়ার্ডের জন্য ফ্রি ডেলিভারি ধামাকা!"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">প্রচার বিস্তারিত বিবরণ *</label>
                <textarea
                  rows={3}
                  required
                  value={promoDesc}
                  onChange={(e) => setPromoDesc(e.target.value)}
                  placeholder="অফারের বিস্তারিত নিয়ম ও সময়..."
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">টার্গেট ওয়ার্ড নির্বাচন *</label>
                <select
                  value={promoWard}
                  onChange={(e) => setPromoWard(e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-bold"
                >
                  <option value="all">৩ নং কিরাটন সকল ওয়ার্ড (ওয়ার্ড ১-৯)</option>
                  {KIRATON_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                প্রচার পোস্ট করুন (OK)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
