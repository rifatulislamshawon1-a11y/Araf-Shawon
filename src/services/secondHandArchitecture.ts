import type {
  BuyerSellerMessage,
  NegotiationOffer,
  PromotionTier,
  SellerVerificationLevel,
  SubscriptionPlan,
} from '../types/marketplace';

/**
 * Extensible Service Contracts for Upcoming ShoppingBolt Second-Hand Platform Phases:
 * - End-to-end encrypted / moderated buyer-seller messaging backend
 * - Featured ad boosts & placement inventory
 * - Seller KYC (Phone OTP, NID Verification, Trade License)
 * - Monthly classifieds subscription tiers for power sellers & local shops
 */

export interface SecureMessagingService {
  sendMessage(params: {
    listingId: string;
    senderId: string;
    senderRole: 'buyer' | 'seller';
    body: string;
  }): Promise<BuyerSellerMessage>;
  submitPriceOffer(params: {
    listingId: string;
    buyerId: string;
    offeredPrice: number;
    note?: string;
  }): Promise<NegotiationOffer>;
  respondToOffer(params: {
    listingId: string;
    offerId: string;
    action: 'Accepted' | 'Countered' | 'Declined';
    counterPrice?: number;
  }): Promise<NegotiationOffer>;
}

export interface FeaturedAdService {
  promoteListing(params: {
    listingId: string;
    tier: PromotionTier;
    durationDays: number;
  }): Promise<{ isFeatured: boolean; expiresAt: string }>;
}

export interface SellerVerificationService {
  requestVerificationUpgrade(params: {
    sellerId: string;
    targetLevel: SellerVerificationLevel;
  }): Promise<{ verified: boolean; level: SellerVerificationLevel }>;
}

export interface AdSubscriptionService {
  getSellerPlan(sellerId: string): Promise<{
    plan: SubscriptionPlan;
    monthlyListingQuota: number;
    featuredCreditsRemaining: number;
  }>;
}

export interface SubscriptionPlanSpec {
  id: SubscriptionPlan;
  nameEn: string;
  nameBn: string;
  priceMonthlyBdt: number;
  maxActiveAdsLabelEn: string;
  maxActiveAdsLabelBn: string;
  featuredCreditsEn: string;
  featuredCreditsBn: string;
  badgeEn: string;
  badgeBn: string;
  perksEn: string[];
  perksBn: string[];
}

export const AD_SUBSCRIPTION_PLANS: SubscriptionPlanSpec[] = [
  {
    id: 'Free',
    nameEn: 'Free Personal Seller',
    nameBn: 'ফ্রি ব্যক্তিগত বিক্রেতা',
    priceMonthlyBdt: 0,
    maxActiveAdsLabelEn: 'Up to 3 active ads/month',
    maxActiveAdsLabelBn: 'মাসে সর্বোচ্চ ৩টি সক্রিয় বিজ্ঞাপন',
    featuredCreditsEn: 'Pay-per-boost option (Future)',
    featuredCreditsBn: 'পৃথক বুস্ট অপশন (ভবিষ্যৎ সুবিধা)',
    badgeEn: 'Active Demo Tier',
    badgeBn: 'সক্রিয় ডেমো প্ল্যান',
    perksEn: [
      'Direct buyer phone & chat inquiry',
      'Price negotiation offers inbox',
      'Standard search & Cumilla location indexing',
    ],
    perksBn: [
      'ক্রেতার সরাসরি ফোন ও চ্যাট মেসেজ সুবিধা',
      'দরদাম ও অফার ইনবক্স ম্যানেজমেন্ট',
      'কুমিল্লা ও ৬৪ জেলায় স্ট্যান্ডার্ড লিস্টিং',
    ],
  },
  {
    id: 'Bolt Plus',
    nameEn: 'Bolt Plus Reseller',
    nameBn: 'বোল্ট প্লাস রিসেলার',
    priceMonthlyBdt: 299,
    maxActiveAdsLabelEn: 'Up to 15 active ads/month',
    maxActiveAdsLabelBn: 'মাসে সর্বোচ্চ ১৫টি সক্রিয় বিজ্ঞাপন',
    featuredCreditsEn: '2 Featured Ad boosts/month',
    featuredCreditsBn: 'মাসে ২টি ফিচার্ড বিজ্ঞাপন বুস্ট',
    badgeEn: 'Future Subscription Preview',
    badgeBn: 'ভবিষ্যৎ সাবস্ক্রিপশন প্রিভিউ',
    perksEn: [
      'Priority Featured placement in category searches',
      'NID Seller Verification fast-track review',
      'Offer auto-counter rules & buyer insights',
    ],
    perksBn: [
      'ক্যাটাগরি অনুসন্ধানে অগ্রাধিকার ফিচার্ড প্লেসমেন্ট',
      'এনআইডি ভেরিফিকেশন দ্রুত পর্যালোচনা',
      'অফার অটো-কাউন্টার ও ক্রেতার আগ্রহ বিশ্লেষণ',
    ],
  },
  {
    id: 'Bolt Pro Merchant',
    nameEn: 'Bolt Pro Storefront',
    nameBn: 'বোল্ট প্রো স্টোরফ্রন্ট',
    priceMonthlyBdt: 799,
    maxActiveAdsLabelEn: 'Unlimited ads + Bulk CSV',
    maxActiveAdsLabelBn: 'আনলিমিটেড বিজ্ঞাপন ও বাল্ক আপলোড',
    featuredCreditsEn: '6 Featured + Spotlight banner',
    featuredCreditsBn: '৬টি ফিচার্ড + স্পটলাইট ব্যানার',
    badgeEn: 'Future Merchant Suite',
    badgeBn: 'ভবিষ্যৎ মার্চেন্ট স্যুট',
    perksEn: [
      'Trusted Merchant verification seal & custom store URL',
      'Escrow-assisted Cumilla Rider Pickup & Inspection (Roadmap)',
      'Dedicated team multi-agent encrypted inbox',
    ],
    perksBn: [
      'ট্রাস্টেড মার্চেন্ট ব্যাজ ও আলাদা দোকান লিংক',
      'কুমিল্লায় রাইডার পিকআপ ও যাচাই সুবিধা (রোডম্যাপ)',
      'মাল্টি-স্টাফ নিরাপদ মেসেজিং ইনবক্স',
    ],
  },
];

export interface VerificationTierSpec {
  level: SellerVerificationLevel;
  titleEn: string;
  titleBn: string;
  reqEn: string;
  reqBn: string;
}

export const SELLER_VERIFICATION_TIERS: VerificationTierSpec[] = [
  {
    level: 'Phone Verified',
    titleEn: 'Phone OTP Verified',
    titleBn: 'মোবাইল ওটিপি যাচাইকৃত',
    reqEn: 'Valid +880 Bangladeshi number confirmation',
    reqBn: 'সক্রিয় +৮৮০ মোবাইল নম্বর যাচাই',
  },
  {
    level: 'NID Verified',
    titleEn: 'National ID (NID) Verified',
    titleBn: 'জাতীয় পরিচয়পত্র (NID) যাচাইকৃত',
    reqEn: 'Smart NID + live selfie identity match (Roadmap)',
    reqBn: 'স্মার্ট এনআইডি ও লাইভ সেলফি যাচাই (রোডম্যাপ)',
  },
  {
    level: 'Trusted Merchant',
    titleEn: 'Trusted Local Merchant',
    titleBn: 'বিশ্বস্ত স্থানীয় মার্চেন্ট',
    reqEn: 'Physical shop address in Cumilla/BD + Trade License',
    reqBn: 'কুমিল্লা/বাংলাদেশে স্থায়ী দোকানের ঠিকানা ও ট্রেড লাইসেন্স',
  },
];
