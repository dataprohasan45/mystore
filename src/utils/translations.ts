import { Language } from '../types';

export const t = (lang: Language) => {
  const isBn = lang === 'bn';
  return {
    siteName: isBn ? 'মাই স্টোর সাইট' : 'My Store Site',
    tagline: isBn ? 'কিশোরগঞ্জ ও করিমগঞ্জ ৩ নং কিরাটন ইউনিয়ন ডেলিভারি হাব' : 'Kishoreganj & Karimganj Kiraton UP Delivery Hub',
    home: isBn ? 'হোম' : 'Home',
    products: isBn ? 'সকল প্রোডাক্ট' : 'All Products',
    upcoming: isBn ? 'আসন্ন পণ্য (Pre-order)' : 'Upcoming (Pre-order)',
    offers: isBn ? 'এরিয়া অফার ও প্রচার' : 'Area Offers & Campaigns',
    chat: isBn ? 'এডমিন চ্যাট' : 'Admin Chat',
    portfolio: isBn ? 'পোর্টফোলিও' : 'Portfolio',
    cart: isBn ? 'কার্ট' : 'Cart',
    login: isBn ? 'লগইন' : 'Login',
    register: isBn ? 'রেজিস্টার' : 'Register',
    logout: isBn ? 'লগআউট' : 'Logout',
    adminPanel: isBn ? 'এডমিন প্যানেল' : 'Admin Panel',
    viewAs: isBn ? 'ভিউ অ্যাজ (View As)' : 'View As',
    searchPlaceholder: isBn ? 'প্রোডাক্ট খুঁজুন (যেমন: ড্রোন, মধু, কুকার, ওয়াচ)...' : 'Search products (e.g. drone, honey, cooker, watch)...',
    availableProducts: isBn ? 'স্টকে থাকা পণ্যসমূহ' : 'Available Products',
    upcomingProducts: isBn ? 'শীঘ্রই আসছে - আসন্ন পণ্য' : 'Coming Soon - Upcoming Products',
    preOrderNow: isBn ? 'ফ্রি প্রি-অর্ডার করুন' : 'Pre-Order Now',
    orderNow: isBn ? 'এখনই কিনুন' : 'Order Now',
    price: isBn ? 'মূল্য' : 'Price',
    bdt: isBn ? '৳' : '৳',
    inStock: isBn ? 'স্টকে আছে' : 'In Stock',
    stockLeft: isBn ? 'পিস বাকি আছে' : 'items left',
    regularCustomerDiscount: isBn ? 'রেগুলার কাস্টমার ছাড়' : 'Regular Customer Discount',
    verifiedQuality: isBn ? '১০০% অরিজিনাল ও নিশ্চিত কোয়ালিটি' : '100% Original & Verified Quality',
    shareOn: isBn ? 'শেয়ার করুন:' : 'Share on:',
    linkCopied: isBn ? 'লিংক কপি করা হয়েছে!' : 'Link copied to clipboard!',
    activeTime: isBn ? 'সক্রিয় সময়' : 'Active Time',
    minutes: isBn ? 'মিনিট' : 'mins',
    starRating: isBn ? 'কাস্টমার স্টার' : 'Customer Stars',
    sellerLevel: isBn ? 'সেলার লেভেল' : 'Seller Level',
    bkashNagadTitle: isBn ? 'বিকাশ ও নগদে সহজ পেমেন্ট' : 'Easy Payment with bKash & Nagad',
    liveLocationGps: isBn ? 'লাইভ জিপিএস লোকেশন শেয়ার' : 'Share Live GPS Location',
    houseRoadPhoto: isBn ? 'বাসা ও রাস্তার ছবি' : 'House & Roadway Photo',
    deliveryNotes: isBn ? 'ডেলিভারি বিশেষ নোট' : 'Special Delivery Note',
    kiratonHubBanner: isBn
      ? '৩ নং কিরাটন ইউনিয়ন পরিষদের ১ থেকে ৯ নং সকল ওয়ার্ডে নিজস্ব ডেলিভারি টিম দ্বারা হোম ডেলিভারি!'
      : 'Door-to-door delivery across all 9 Wards of No. 3 Kiraton Union by our dedicated delivery team!',
  };
};
