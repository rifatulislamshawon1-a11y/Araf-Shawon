import { MapPin, Plus, Star, X } from 'lucide-react';
import { DAILY_BAZAR_ITEMS, MARKETPLACE_PRODUCTS } from '../data/marketplaceData';
import { useLanguage } from '../i18n/LanguageContext';
import { GROCERY_BN, PRODUCT_BN, SHOP_BN } from '../i18n/translations';
import type { GroceryItem, NearbyShop, Product } from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface ShopModalProps {
  shop: NearbyShop | null;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  onAddGrocery: (item: GroceryItem) => void;
}

export function ShopModal({
  shop,
  onClose,
  onAddProduct,
  onAddGrocery,
}: ShopModalProps) {
  const { lang, t } = useLanguage();
  const s = t.shopModal;

  if (!shop) return null;

  const sBn = SHOP_BN[shop.id];
  const shopName = lang === 'bn' && sBn ? sBn.name : shop.name;
  const shopAddr = lang === 'bn' && sBn ? sBn.address : shop.address;
  const shopEta = lang === 'bn' && sBn ? sBn.deliveryEta : shop.deliveryEta;
  const shopOrders =
    lang === 'bn' && sBn ? sBn.ordersCompleted : shop.ordersCompleted;
  const shopOpen = lang === 'bn' && sBn ? sBn.openUntil : shop.openUntil;
  const shopSpec = lang === 'bn' && sBn ? sBn.specialty : shop.specialty;

  const shopProducts = MARKETPLACE_PRODUCTS.filter((p) => p.vendorId === shop.id);
  const shopGroceries = DAILY_BAZAR_ITEMS.filter((g) => g.vendorId === shop.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={shopName}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-44 sm:h-52 bg-zinc-100 shrink-0">
          <ResilientImage
            src={shop.image}
            alt={shopName}
            className="w-full h-full object-cover"
            fallbackLabel={shopName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label={s.close}
            className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 text-slate-900 hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{shopAddr}</span>
              <span>·</span>
              <span>{shopEta}</span>
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">{shopName}</h2>
            <p className="mt-1 text-xs text-slate-200 flex items-center gap-2 tabular-nums">
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                {lang === 'bn'
                  ? shop.rating.toLocaleString('bn-BD', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })
                  : shop.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{shopOrders}</span>
              <span>·</span>
              <span>
                {s.openUntil} {shopOpen}
              </span>
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              {s.inStoreCatalog} (
              {formatNumber(shopProducts.length + shopGroceries.length, lang)}{' '}
              {s.items})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{shopSpec}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopProducts.map((product) => {
              const pBn = PRODUCT_BN[product.id];
              const pName = lang === 'bn' && pBn ? pBn.name : product.name;
              const pCat =
                lang === 'bn' && pBn ? pBn.categoryLabel : product.categoryLabel;

              return (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-[#FAFAFA] border border-slate-200 rounded-xl"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <ResilientImage
                      src={product.image}
                      alt={pName}
                      className="w-full h-full object-cover"
                      fallbackLabel={pName}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[11px] font-semibold uppercase text-slate-500">
                      {pCat}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {pName}
                    </h4>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatBDT(product.price, lang)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddProduct(product)}
                        className="inline-flex items-center gap-1 h-8 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{s.add}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {shopGroceries.map((item) => {
              const gBn = GROCERY_BN[item.id];
              const gName = lang === 'bn' && gBn ? gBn.name : item.name;
              const gUnit = lang === 'bn' && gBn ? gBn.unit : item.unit;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-[#FAFAFA] border border-slate-200 rounded-xl"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <ResilientImage
                      src={item.image}
                      alt={gName}
                      className="w-full h-full object-cover"
                      fallbackLabel={gName}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[11px] font-semibold uppercase text-emerald-700">
                      {s.dailyBazarTag} · {gUnit}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {gName}
                    </h4>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatBDT(item.price, lang)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddGrocery(item)}
                        className="inline-flex items-center gap-1 h-8 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{s.add}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
