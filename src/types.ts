export type Language = 'bn' | 'en';

export type UserRole =
  | 'admin'
  | 'customer'
  | 'seller'
  | 'cashier'
  | 'area_manager'
  | 'distributor'
  | 'wholesaler';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  avatar: string;
  areaDivision: string;
  areaDistrict: string;
  areaUpazila: string;
  areaUnion: string;
  areaWard: string;
  facebookUrl?: string;
  instagramUrl?: string;
  gmailAddress?: string;
  whatsappNumber?: string;
  loginTime?: string;
  activeMinutes: number;
  starRating: number; // 1 to 7 stars
  isRegularCustomer: boolean;
  discountPercentage: number;
  sellerLevel?: number; // 1 to 7 for sellers
  totalSales?: number;
  totalOrdersCount?: number;
  earnedCommission?: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  isUpcoming: boolean;
  expectedDate?: string;
  descriptionBn: string;
  descriptionEn: string;
  rating: number;
  reviewsCount: number;
  sellerId?: string;
  sellerName?: string;
  sellerCommissionRate?: number; // e.g. 5%
  salesCount: number;
  tags: string[];
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'bkash' | 'nagad' | 'cod';
  paymentTrxId?: string;
  paymentStatus: 'pending' | 'verified' | 'failed';
  deliveryStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryNote?: string;
  address: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  ward: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    mapUrl?: string;
  };
  housePhoto?: string;
  roadPhoto?: string;
  sellerId?: string;
  commissionPaid?: boolean;
  createdAt: string;
}

export interface AreaPromotion {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  bannerImage?: string;
  discountBadge?: string;
  division: string;
  district: string;
  upazila: string;
  union: string;
  targetWards: string[]; // e.g. ['Ward 1', 'Ward 2', 'Ward 3', ...] or ['all']
  viewsCount: number;
  clicksCount: number;
  isActive: boolean;
  createdAt: string;
}

export type AdType = 'video' | 'image' | 'text' | 'link';
export type AdPlacement = 'top' | 'middle' | 'bottom';

export interface BannerAd {
  id: string;
  placement: AdPlacement;
  type: AdType;
  titleBn: string;
  titleEn: string;
  content: string; // video URL, image URL, or text message
  actionUrl?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  videoDurationSeconds?: number; // max 15
  isActive: boolean;
}

export interface ChatAttachment {
  type: 'image' | 'video' | 'pdf';
  url: string;
  fileName: string;
  fileSize?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string; // 'admin' or user id
  text: string;
  attachment?: ChatAttachment;
  timestamp: string;
  dateStr: string;
  isRead: boolean;
}

export interface DataCenterAsset {
  id: string;
  title: string;
  category: 'image' | 'video' | 'pdf' | 'document';
  url: string;
  fileSize: string;
  uploadedAt: string;
  dimensions?: string;
  duration?: string;
  usedInProductsCount: number;
}
