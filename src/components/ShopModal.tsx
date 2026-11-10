import { MapPin, Plus, Star, X } from 'lucide-react';
import { DAILY_BAZAR_ITEMS, MARKETPLACE_PRODUCTS } from '../data/marketplaceData';
import type { GroceryItem, NearbyShop, Product } from '../types/marketplace';
import { formatBDT } from '../utils/formatters';
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
  if (!shop) return null;

  const shopProducts = MARKETPLACE_PRODUCTS.filter((p) => p.vendorId === shop.id);
  const shopGroceries = DAILY_BAZAR_ITEMS.filter((g) => g.vendorId === shop.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={shop.name}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-44 sm:h-52 bg-zinc-100 shrink-0">
          <ResilientImage
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
            fallbackLabel={shop.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close storefront"
            className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 text-slate-900 hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{shop.address}</span>
              <span>·</span>
              <span>{shop.deliveryEta}</span>
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold">{shop.name}</h2>
            <p className="mt-1 text-xs text-slate-200 flex items-center gap-2 tabular-nums">
              <span className="inline-flex items-center gap-1 font-semibold text-white">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
                {shop.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{shop.ordersCompleted}</span>
              <span>·</span>
              <span>Open until {shop.openUntil}</span>
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              In-Store Catalog ({shopProducts.length + shopGroceries.length} items)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{shop.specialty}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shopProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-[#FAFAFA] border border-slate-200 rounded-xl"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                  <ResilientImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    fallbackLabel={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[11px] font-semibold uppercase text-slate-500">
                    {product.categoryLabel}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddProduct(product)}
                      className="inline-flex items-center gap-1 h-8 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {shopGroceries.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-[#FAFAFA] border border-slate-200 rounded-xl"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                  <ResilientImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    fallbackLabel={item.name}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-[11px] font-semibold uppercase text-emerald-700">
                    Daily Bazar · {item.unit}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatBDT(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAddGrocery(item)}
                      className="inline-flex items-center gap-1 h-8 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
