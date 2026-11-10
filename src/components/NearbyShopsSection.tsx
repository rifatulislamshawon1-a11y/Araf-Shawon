import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import { AREAS, NEARBY_SHOPS } from '../data/marketplaceData';
import type { AreaName, NearbyShop } from '../types/marketplace';
import { ResilientImage } from './ResilientImage';

interface NearbyShopsSectionProps {
  selectedArea: AreaName;
  onAreaChange: (area: AreaName) => void;
  onOpenShop: (shop: NearbyShop) => void;
}

export function NearbyShopsSection({
  selectedArea,
  onAreaChange,
  onOpenShop,
}: NearbyShopsSectionProps) {
  const filteredShops =
    selectedArea === 'All Areas'
      ? NEARBY_SHOPS
      : NEARBY_SHOPS.filter((shop) => shop.area === selectedArea);

  return (
    <section id="nearby-shops" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Hyperlocal Storefronts
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Nearby shops verified in your neighborhood
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
              Browse local Dhaka and Chattogram merchants with quick rider dispatch
              and physical store pickup options.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {AREAS.map((area) => {
              const active = selectedArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => onAreaChange(area)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <article
              key={shop.id}
              className="group bg-[#FAFAFA] border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 ease-market hover:-translate-y-0.5 hover:shadow-md hover:bg-white"
            >
              <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                <ResilientImage
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-market group-hover:scale-[1.03]"
                  fallbackLabel={shop.name}
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span className="truncate">{shop.address}</span>
                </p>

                <h3 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                  {shop.name}
                </h3>

                <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                  {shop.specialty}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 tabular-nums">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                    {shop.rating.toFixed(1)}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{shop.ordersCompleted}</span>
                  <span aria-hidden="true">·</span>
                  <span>{shop.distanceKm} km away</span>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-slate-200/80">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-emerald-800">{shop.deliveryEta}</span>
                    <span className="mx-1.5 text-slate-300" aria-hidden="true">
                      ·
                    </span>
                    <span>Open till {shop.openUntil}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenShop(shop)}
                    className="inline-flex items-center gap-1 h-9 px-3.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:border-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Visit Shop</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
