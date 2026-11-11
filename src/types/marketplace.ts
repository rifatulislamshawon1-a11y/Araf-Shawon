export type CategoryId =
  | 'all'
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'grocery'
  | 'beauty'
  | 'accessories';

export type GroceryAisleId =
  | 'all'
  | 'staples'
  | 'produce'
  | 'protein'
  | 'oils-spices'
  | 'fruits';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

export type AreaName =
  | 'Cumilla Sadar'
  | 'Kandirpar'
  | 'Kotbari & Cantonment'
  | 'Tomsom Bridge'
  | 'Laksam'
  | 'Chouddagram';

export type ShopAreaFilter = 'All Cumilla' | AreaName;

export type DeliveryMethodType = 'ShoppingBolt Own Delivery' | 'Courier Delivery';

export type LocalDeliverySpeed = 'same-day' | 'next-day';

export type LocalOrderStatus =
  | 'Pending Assignment'
  | 'Assigned to Rider'
  | 'Out for Delivery'
  | 'Delivered';

export type CourierOrderStatus =
  | 'Awaiting Courier Handover'
  | 'Handed to Courier'
  | 'In Transit'
  | 'Delivered';

export type OrderStatus = LocalOrderStatus | CourierOrderStatus;

export interface DeliveryChargeConfig {
  cumillaSameDayFee: number;
  cumillaNextDayFee: number;
  outsideCumillaCourierFee: number;
  enableCumillaFreeThreshold: boolean;
  cumillaFreeThresholdAmount: number;
}

export interface DeliveryStaff {
  id: string;
  name: string;
  phone: string;
  zone: string;
}

export interface CourierPartner {
  id: string;
  name: string;
  serviceType: string;
}

export interface MarketplaceOrder {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  fullAddress: string;
  deliveryMethod: DeliveryMethodType;
  localSpeed?: LocalDeliverySpeed;
  assignedStaffId?: string;
  courierPartner?: string;
  courierTrackingCode?: string;
  status: OrderStatus;
  itemsSummary: string;
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery (Demo)';
}

export interface Category {
  id: CategoryId;
  name: string;
  countLabel: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  vendorId: string;
  vendorName: string;
  vendorDistrict: string;
  price: number;
  originalPrice?: number;
  rating: number;
  soldCount: number;
  image: string;
  variants: string[];
  stockNote: string;
  description: string;
  deliveryEstimate: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  aisle: Exclude<GroceryAisleId, 'all'>;
  aisleLabel: string;
  unit: string;
  origin: string;
  vendorId: string;
  vendorName: string;
  price: number;
  originalPrice?: number;
  image: string;
  stockNote: string;
  description: string;
}

export interface NearbyShop {
  id: string;
  name: string;
  area: AreaName;
  address: string;
  distanceKm: number;
  openUntil: string;
  specialty: string;
  rating: number;
  ordersCompleted: string;
  deliveryEta: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  isUsed?: boolean;
  name: string;
  vendorName: string;
  price: number;
  image: string;
  variantOrUnit: string;
  quantity: number;
  isGrocery?: boolean;
}

export interface AuthUser {
  name: string;
  phoneOrEmail: string;
  district: string;
}

/* Second-Hand Buy & Sell Marketplace Types */
export type UsedCondition = 'Brand New' | 'Like New' | 'Used' | 'Refurbished';

export type UsedCategory =
  | 'used-mobile'
  | 'used-computers'
  | 'used-electronics'
  | 'used-furniture'
  | 'used-bicycles'
  | 'used-vehicles'
  | 'used-appliances'
  | 'used-fashion'
  | 'used-other';

export type UsedSortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export type ModerationStatus = 'Approved' | 'Pending Review' | 'Rejected';

export type ListingStatus = 'Active' | 'Sold';

export type SellerVerificationLevel =
  | 'Unverified'
  | 'Phone Verified'
  | 'NID Verified'
  | 'Trusted Merchant';

export type PromotionTier = 'None' | 'Featured' | 'Spotlight';

export type SubscriptionPlan = 'Free' | 'Bolt Plus' | 'Bolt Pro Merchant';

export interface ListingReport {
  id: string;
  reason: string;
  details: string;
  reportedAt: string;
}

export interface NegotiationOffer {
  id: string;
  buyerName: string;
  offeredPrice: number;
  note?: string;
  status: 'Pending' | 'Accepted' | 'Countered' | 'Declined';
  counterPrice?: number;
  createdAt: string;
}

export interface BuyerSellerMessage {
  id: string;
  sender: 'buyer' | 'seller';
  senderName: string;
  text: string;
  sentAt: string;
}

export interface UsedProductListing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  category: UsedCategory;
  condition: UsedCondition;
  images: string[];
  division: string;
  district: string;
  upazila: string;
  areaDetail: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'Individual' | 'Verified Shop';
  sellerPhone: string;
  sellerVerification: SellerVerificationLevel;
  sellerMemberSince: string;
  sellerRating: number;
  postedAt: string;
  createdTimestamp: number;
  isUserOwned?: boolean;
  moderationStatus: ModerationStatus;
  listingStatus: ListingStatus;
  isFeatured: boolean;
  promotionTier: PromotionTier;
  reports: ListingReport[];
  offers: NegotiationOffer[];
  messages: BuyerSellerMessage[];
}
