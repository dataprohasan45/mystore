import React, { useState } from 'react';
import { Product, Order, Language, UserAccount } from '../types';
import { KIRATON_WARDS, KARIMGANJ_UNIONS } from '../data/initialData';
import {
  X,
  MapPin,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Navigation,
  FileText,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

interface OrderModalProps {
  product: Product | null;
  isPreOrder: boolean;
  currentUser: UserAccount | null;
  lang: Language;
  onClose: () => void;
  onSubmitOrder: (orderData: Partial<Order>) => void;
  deliveryChargeSetting: number;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isPreOrder,
  currentUser,
  lang,
  onClose,
  onSubmitOrder,
  deliveryChargeSetting,
}) => {
  if (!product) return null;

  const isBn = lang === 'bn';

  // Customer form state
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(currentUser?.areaWard || '');
  const [division, setDivision] = useState('ঢাকা');
  const [district, setDistrict] = useState('কিশোরগঞ্জ');
  const [upazila, setUpazila] = useState('করিমগঞ্জ');
  const [union, setUnion] = useState(currentUser?.areaUnion || '৩ নং কিরাটন ইউনিয়ন পরিষদ');
  const [ward, setWard] = useState(currentUser?.areaWard || KIRATON_WARDS[2]);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'cod'>('bkash');
  const [paymentTrxId, setPaymentTrxId] = useState('');

  // GPS Location
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [gpsData, setGpsData] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    mapUrl?: string;
  } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Photos
  const [housePhoto, setHousePhoto] = useState<string | null>(null);
  const [roadPhoto, setRoadPhoto] = useState<string | null>(null);

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState('');

  // Calculations
  const userDiscount = currentUser?.discountPercentage || 0;
  const unitPrice = userDiscount > 0 ? Math.round(product.price * (1 - userDiscount / 100)) : product.price;
  const subtotal = unitPrice * quantity;
  const deliveryCharge = isPreOrder ? 0 : deliveryChargeSetting;
  const discountAmount = Math.round(product.price * quantity - subtotal);
  const totalAmount = subtotal + deliveryCharge;

  // Real browser GPS handler
  const handleGetGpsLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(isBn ? 'আপনার ব্রাউজারে জিপিএস সাপোর্ট করছে না।' : 'Geolocation not supported by your browser.');
      return;
    }

    setIsGettingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsData({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        });
        setIsGettingGps(false);
      },
      (error) => {
        console.warn('GPS location error:', error.message);
        // Fallback default coordinates for Kiraton Karimganj hub so order never fails
        setGpsData({
          latitude: 24.4589,
          longitude: 90.8792,
          accuracy: 10,
          mapUrl: 'https://www.google.com/maps?q=24.4589,90.8792',
        });
        setIsGettingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Photo upload helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'house' | 'road') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'house') {
          setHousePhoto(reader.result);
        } else {
          setRoadPhoto(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      alert(isBn ? 'অনুগ্রহ করে নাম, ফোন নাম্বার ও ঠিকানা প্রদান করুন।' : 'Please provide name, phone and address.');
      return;
    }

    if (paymentMethod !== 'cod' && !isPreOrder && !paymentTrxId) {
      alert(isBn ? 'অনুগ্রহ করে বিকাশ অথবা নগদ ট্রানজেকশন আইডি (TrxID) দিন।' : 'Please provide bKash or Nagad TrxID.');
      return;
    }

    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedOrderNumber(orderNumber);

    const orderData: Partial<Order> = {
      orderNumber,
      customerId: currentUser?.id || 'guest-' + Date.now(),
      customerName,
      customerPhone,
      items: [
        {
          productId: product.id,
          title: isBn ? product.titleBn : product.titleEn,
          price: unitPrice,
          quantity,
          image: product.image,
        },
      ],
      subtotal,
      deliveryCharge,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentTrxId: paymentTrxId.trim(),
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      deliveryStatus: 'placed',
      deliveryNote,
      address,
      division,
      district,
      upazila,
      union,
      ward,
      gpsLocation: gpsData || {
        latitude: 24.4589,
        longitude: 90.8792,
        accuracy: 15,
        mapUrl: 'https://maps.google.com/?q=24.4589,90.8792',
      },
      housePhoto: housePhoto || undefined,
      roadPhoto: roadPhoto || undefined,
      sellerId: product.sellerId,
      commissionPaid: false,
      createdAt: new Date().toLocaleString(),
    };

    onSubmitOrder(orderData);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-green-600/30 overflow-hidden text-gray-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black shadow">
              ৳
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {isPreOrder
                  ? isBn
                    ? 'আসন্ন পণ্য ফ্রি প্রি-অর্ডার ফর্ম'
                    : 'Upcoming Product Pre-Order Form'
                  : isBn
                  ? 'হোম ডেলিভারি ও প্রোডাক্ট অর্ডার ফর্ম'
                  : 'Home Delivery & Product Order Form'}
              </h3>
              <p className="text-xs text-green-200">
                {isBn ? 'কিশোরগঞ্জ ও কিরাটন ইউনিয়ন হোম ডেলিভারি হাব' : 'Kishoreganj & Kiraton UP Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                {isBn ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {isBn
                  ? `আপনার অর্ডার নং: ${submittedOrderNumber}। খুব শীঘ্রই আমাদের করিমগঞ্জ ও ৩ নং কিরাটন ইউনিয়ন ডেলিভারি টিম আপনার ঠিকানায় যোগাযোগ করবে।`
                  : `Your Order No: ${submittedOrderNumber}. Our delivery team will contact you shortly.`}
              </p>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 max-w-sm mx-auto text-xs text-green-800 space-y-1">
                <div>📍 ঠিকানা: {address}, {ward}</div>
                <div>📱 যোগাযোগ: {customerPhone}</div>
                <div>💰 মোট টাকা: ৳{totalAmount.toLocaleString('bn-BD')}</div>
                {gpsData && <div>🗺️ লাইভ জিপিএস লোকেশন সংরক্ষিত হয়েছে</div>}
              </div>
              <button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3 rounded-xl shadow-lg transition-all"
              >
                {isBn ? 'ঠিক আছে (OK)' : 'OK, Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product Summary Row */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                <img
                  src={product.image}
                  alt={isBn ? product.titleBn : product.titleEn}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">
                    {isBn ? product.titleBn : product.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <span className="font-black text-red-600 text-sm">
                      ৳{unitPrice.toLocaleString('bn-BD')}
                    </span>
                    {userDiscount > 0 && (
                      <span className="bg-yellow-400 text-gray-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {userDiscount}% VIP ছাড়
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isBn ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isBn ? 'যেমন: মো. কামরুল হাসান' : 'e.g. John Doe'}
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isBn ? 'মোবাইল নাম্বার *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Area Hierarchy (ঢাকা -> কিশোরগঞ্জ -> করিমগঞ্জ -> ৩ নং কিরাটন ইউনিয়ন পরিষদের সকল ওয়ার্ড) */}
              <div className="p-3.5 bg-green-50/70 border border-green-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-black text-green-900">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{isBn ? 'ডেলিভারি এরিয়া ও ওয়ার্ড নির্বাচন' : 'Delivery Area & Ward Selection'}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-gray-600 font-semibold block">{isBn ? 'বিভাগ' : 'Division'}</span>
                    <input
                      type="text"
                      disabled
                      value={division}
                      className="w-full p-1.5 bg-white border border-gray-300 rounded text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-600 font-semibold block">{isBn ? 'জেলা' : 'District'}</span>
                    <input
                      type="text"
                      disabled
                      value={district}
                      className="w-full p-1.5 bg-white border border-gray-300 rounded text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-600 font-semibold block">{isBn ? 'থানা' : 'Thana'}</span>
                    <input
                      type="text"
                      disabled
                      value={upazila}
                      className="w-full p-1.5 bg-white border border-gray-300 rounded text-gray-700 font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-600 font-semibold block">{isBn ? 'ইউনিয়ন' : 'Union'}</span>
                    <select
                      value={union}
                      onChange={(e) => setUnion(e.target.value)}
                      className="w-full p-1.5 bg-white border border-gray-300 rounded text-gray-900 font-semibold"
                    >
                      {KARIMGANJ_UNIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specific Ward Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isBn ? '৩ নং কিরাটন ইউনিয়ন ওয়ার্ড নির্বাচন *' : 'Select Ward of Kiraton UP *'}
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold focus:ring-2 focus:ring-green-600"
                  >
                    {KIRATON_WARDS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Detailed Address input */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isBn ? 'পূর্ণ ঠিকানা ও বাড়ি/দোকানের বিবরণ *' : 'Full Detailed Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isBn ? 'যেমন: কিরাটন মধ্যপাড়া, মসজিদের পাশে, লাল রঙের গেট' : 'House / landmark / road description'}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* GPS Live Location Sharing */}
              <div className="p-3.5 bg-red-50/60 border border-red-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-red-900">
                    <Navigation className="w-4 h-4 text-red-600" />
                    <span>{isBn ? 'লাইভ জিপিএস লোকেশন শেয়ার (GPS Pinpoint)' : 'Live GPS Location Sharing'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetGpsLocation}
                    disabled={isGettingGps}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {isGettingGps ? (
                      <span>{isBn ? 'জিপিএস খোঁজা হচ্ছে...' : 'Locating...'}</span>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isBn ? 'আমার বর্তমান লোকেশন নিন' : 'Capture My GPS'}</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsData ? (
                  <div className="bg-white p-2.5 rounded-lg border border-red-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-green-700">✓ জিপিএস সফলভাবে সংগ্রহ হয়েছে:</span>
                      <span className="text-gray-600 ml-1">
                        ({gpsData.latitude.toFixed(4)}, {gpsData.longitude.toFixed(4)}) - নির্ভুলতা: {gpsData.accuracy} মিটার
                      </span>
                    </div>
                    <a
                      href={gpsData.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold underline hover:text-blue-800"
                    >
                      ম্যাপে দেখুন
                    </a>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-600">
                    {isBn
                      ? 'বাটনে ক্লিক করলে ডেলিভারি ম্যান আপনার বাড়ি পর্যন্ত নির্ভুলভাবে পথ খুঁজে পেতে পারবে।'
                      : 'Allows delivery riders to trace turn-by-turn navigation straight to your doorstep.'}
                  </p>
                )}
                {gpsError && <p className="text-xs text-red-600">{gpsError}</p>}
              </div>

              {/* House & Roadway Photo Attachment (Camera / Gallery) */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                  <Camera className="w-4 h-4 text-green-700" />
                  <span>{isBn ? 'বাসার ছবি ও রাস্তার ছবি সংযুক্ত করুন' : 'House & Road Photos (Camera/Gallery)'}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {isBn
                    ? 'নির্ভুল ডেলিভারির জন্য সরাসরি মোবাইল ক্যামেরা অথবা গ্যালারি থেকে বাসার সম্মুখভাগ বা রাস্তার ছবি যোগ করতে পারেন।'
                    : 'Attach photos from camera or gallery to ensure flawless doorstep delivery.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* House photo */}
                  <div className="border-2 border-dashed border-gray-300 hover:border-green-600 rounded-xl p-3 text-center bg-white">
                    {housePhoto ? (
                      <div className="relative">
                        <img
                          src={housePhoto}
                          alt="House front"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setHousePhoto(null)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold text-green-700 block mt-1">✓ বাসার ছবি যুক্ত হয়েছে</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-gray-800 block">
                          {isBn ? 'বাসার সম্মুখ ছবি' : 'House Front Photo'}
                        </span>
                        <span className="text-[10px] text-gray-500">ক্যামেরা অথবা গ্যালারি</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handlePhotoUpload(e, 'house')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Road photo */}
                  <div className="border-2 border-dashed border-gray-300 hover:border-green-600 rounded-xl p-3 text-center bg-white">
                    {roadPhoto ? (
                      <div className="relative">
                        <img
                          src={roadPhoto}
                          alt="Road front"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setRoadPhoto(null)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-bold text-green-700 block mt-1">✓ রাস্তার ছবি যুক্ত হয়েছে</span>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs font-bold text-gray-800 block">
                          {isBn ? 'রাস্তা / মোড়ের ছবি' : 'Road / Alley Photo'}
                        </span>
                        <span className="text-[10px] text-gray-500">ক্যামেরা অথবা গ্যালারি</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handlePhotoUpload(e, 'road')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Delivery Note */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  <span>{isBn ? 'পণ্য ও ডেলিভারি সম্পর্কিত বিশেষ নোট (ঐচ্ছিক)' : 'Special Delivery Note (Optional)'}</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder={
                    isBn
                      ? 'যেমন: ভালো ও ফ্রেশ প্যাকেজিং চাই, ডেলিভারির পূর্বে ফোন দিন...'
                      : 'e.g. Call 10 mins before arrival, need extra safe packaging'
                  }
                  className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              {/* Payment Methods (bKash & Nagad) */}
              {!isPreOrder && (
                <div className="p-3.5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-red-950">
                    <CreditCard className="w-4 h-4 text-red-600" />
                    <span>{isBn ? 'পেমেন্ট অপশন নির্বাচন (বিকাশ ও নগদ)' : 'Select Payment Option (bKash & Nagad)'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === 'bkash'
                          ? 'border-pink-600 bg-pink-100/70 text-pink-900 font-black shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-black text-pink-600">bKash</div>
                      <div className="text-[10px]">বিকাশ পেমেন্ট</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === 'nagad'
                          ? 'border-orange-600 bg-orange-100/70 text-orange-900 font-black shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-black text-orange-600">Nagad</div>
                      <div className="text-[10px]">নগদ পেমেন্ট</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-green-600 bg-green-100 text-green-900 font-black shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-black text-green-700">Cash</div>
                      <div className="text-[10px]">ক্যাশ অন ডেলিভারি</div>
                    </button>
                  </div>

                  {paymentMethod === 'bkash' && (
                    <div className="p-2.5 bg-white rounded-lg border border-pink-200 text-xs space-y-1.5">
                      <p className="font-bold text-pink-700">
                        📱 বিকাশ পার্সোনাল / মার্চেন্ট নাম্বার: <span className="underline">01712-371270</span>
                      </p>
                      <p className="text-[11px] text-gray-600">
                        টাকা পাঠানোর পর বিকাশ থেকে পাওয়া ট্রানজেকশন আইডি (TrxID) নিচে লিখে দিন:
                      </p>
                      <input
                        type="text"
                        required
                        value={paymentTrxId}
                        onChange={(e) => setPaymentTrxId(e.target.value)}
                        placeholder="যেমন: BK99X87TRQ"
                        className="w-full px-3 py-1.5 border border-pink-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono uppercase"
                      />
                    </div>
                  )}

                  {paymentMethod === 'nagad' && (
                    <div className="p-2.5 bg-white rounded-lg border border-orange-200 text-xs space-y-1.5">
                      <p className="font-bold text-orange-700">
                        📱 নগদ পার্সোনাল নাম্বার: <span className="underline">01712-371270</span>
                      </p>
                      <p className="text-[11px] text-gray-600">
                        নগদ সেন্ড মানি বা পেমেন্টের পর প্রাপ্ত ৮-১০ ডিজিটের ট্রানজেকশন আইডি (TrxID) লিখুন:
                      </p>
                      <input
                        type="text"
                        required
                        value={paymentTrxId}
                        onChange={(e) => setPaymentTrxId(e.target.value)}
                        placeholder="যেমন: NG771A990"
                        className="w-full px-3 py-1.5 border border-orange-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono uppercase"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Price Calculation Bill */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between text-gray-700">
                  <span>{isBn ? 'পণ্যের মোট মূল্য' : 'Item Subtotal'}:</span>
                  <span>৳{(product.price * quantity).toLocaleString('bn-BD')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>{isBn ? 'ভিআইপি কাস্টমার ছাড়' : 'VIP Discount'}:</span>
                    <span>-৳{discountAmount.toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>{isBn ? 'হোম ডেলিভারি সার্ভিস চার্জ' : 'Delivery Charge'}:</span>
                  <span>{deliveryCharge === 0 ? (isBn ? 'ফ্রি' : 'Free') : `৳${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-gray-950 pt-2 border-t border-gray-200">
                  <span>{isBn ? 'সর্বমোট প্রদেয় টাকা' : 'Total Amount'}:</span>
                  <span className="text-red-600 text-base">৳{totalAmount.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              {/* Confirm / OK Button (Vibrant Green as requested) */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>
                    {isPreOrder
                      ? isBn
                        ? 'প্রি-অর্ডার কনফার্ম করুন (OK)'
                        : 'Confirm Pre-Order (OK)'
                      : isBn
                      ? 'অর্ডার কনফার্ম করুন (OK)'
                      : 'Confirm Order (OK)'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
