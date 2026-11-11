export const BRAND_CONFIG = {
  nameEn: 'ShoppingBolt',
  nameBn: 'শপিংবোল্ট',
  orderPrefix: 'SB',
  ownDeliveryMethodKey: 'ShoppingBolt Own Delivery' as const,
  hqAddressEn: 'Kandirpar Circle, Cumilla Sadar, Cumilla 3500',
  hqAddressBn: 'কান্দিরপাড় সার্কেল, কুমিল্লা সদর, কুমিল্লা ৩৫০০',
  storageLangKey: 'shoppingbolt_language',
} as const;

export type AppLanguage = 'en' | 'bn';

export function getBrandName(lang: AppLanguage): string {
  return lang === 'bn' ? BRAND_CONFIG.nameBn : BRAND_CONFIG.nameEn;
}
