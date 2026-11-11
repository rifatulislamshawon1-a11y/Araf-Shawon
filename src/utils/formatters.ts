import { BRAND_CONFIG, type AppLanguage } from '../config/brand';
import { isCumillaDistrict } from '../data/bangladeshLocations';
import type {
  DeliveryChargeConfig,
  DeliveryMethodType,
  LocalDeliverySpeed,
} from '../types/marketplace';

export function formatBDT(amount: number, lang: AppLanguage = 'en'): string {
  const formatted =
    lang === 'bn'
      ? amount.toLocaleString('bn-BD')
      : amount.toLocaleString('en-BD');
  return `৳ ${formatted}`;
}

export function formatNumber(num: number, lang: AppLanguage = 'en'): string {
  return lang === 'bn' ? num.toLocaleString('bn-BD') : num.toLocaleString('en-BD');
}

export interface DeliveryQuote {
  method: DeliveryMethodType;
  charge: number;
  label: string;
  etaText: string;
  isFreeThresholdApplied: boolean;
}

export function calculateHybridDeliveryQuote(params: {
  district: string;
  localSpeed: LocalDeliverySpeed;
  subtotal: number;
  itemCount: number;
  config: DeliveryChargeConfig;
  lang?: AppLanguage;
}): DeliveryQuote {
  const {
    district,
    localSpeed,
    subtotal,
    itemCount,
    config,
    lang = 'en',
  } = params;
  const isCumilla = isCumillaDistrict(district);
  const brand = lang === 'bn' ? BRAND_CONFIG.nameBn : BRAND_CONFIG.nameEn;

  if (itemCount === 0) {
    return {
      method: isCumilla ? BRAND_CONFIG.ownDeliveryMethodKey : 'Courier Delivery',
      charge: 0,
      label: isCumilla
        ? lang === 'bn'
          ? `${brand} নিজস্ব ডেলিভারি`
          : BRAND_CONFIG.ownDeliveryMethodKey
        : lang === 'bn'
          ? 'কুরিয়ার ডেলিভারি'
          : 'Courier Delivery',
      etaText: isCumilla
        ? localSpeed === 'same-day'
          ? lang === 'bn'
            ? 'কুমিল্লায় একই দিনে ডেলিভারি'
            : 'Same-day local dispatch in Cumilla'
          : lang === 'bn'
            ? 'কুমিল্লায় পরদিন ডেলিভারি'
            : 'Next-day local dispatch in Cumilla'
        : lang === 'bn'
          ? '৪৮–৭২ ঘণ্টায় থার্ড-পার্টি কুরিয়ার (ডেমো)'
          : '48–72 hrs third-party courier (Demo)',
      isFreeThresholdApplied: false,
    };
  }

  if (isCumilla) {
    const baseFee =
      localSpeed === 'same-day'
        ? config.cumillaSameDayFee
        : config.cumillaNextDayFee;
    const isFree =
      config.enableCumillaFreeThreshold &&
      subtotal >= config.cumillaFreeThresholdAmount;

    return {
      method: BRAND_CONFIG.ownDeliveryMethodKey,
      charge: isFree ? 0 : baseFee,
      label:
        localSpeed === 'same-day'
          ? lang === 'bn'
            ? `${brand} নিজস্ব ডেলিভারি · একই দিনে`
            : `${brand} Own Delivery · Same-Day`
          : lang === 'bn'
            ? `${brand} নিজস্ব ডেলিভারি · পরদিন`
            : `${brand} Own Delivery · Next-Day`,
      etaText:
        localSpeed === 'same-day'
          ? lang === 'bn'
            ? `${brand} কুমিল্লা রাইডার টিম দ্বারা আজই ডেলিভারি`
            : `Delivered today by ${brand} Cumilla rider team`
          : lang === 'bn'
            ? `${brand} কুমিল্লা রাইডার টিম দ্বারা আগামীকাল ডেলিভারি`
            : `Delivered tomorrow by ${brand} Cumilla rider team`,
      isFreeThresholdApplied: isFree,
    };
  }

  return {
    method: 'Courier Delivery',
    charge: config.outsideCumillaCourierFee,
    label:
      lang === 'bn'
        ? 'কুরিয়ার ডেলিভারি · সারাদেশ'
        : 'Courier Delivery · Nationwide',
    etaText:
      lang === 'bn'
        ? 'থার্ড-পার্টি কুরিয়ার সার্ভিসে ২–৪ দিনে ডেলিভারি (ডেমো)'
        : '2–4 days via third-party courier service (Demo)',
    isFreeThresholdApplied: false,
  };
}
