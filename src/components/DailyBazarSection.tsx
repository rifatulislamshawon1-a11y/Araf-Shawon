import { useState } from 'react';
import { Clock, MapPin, Minus, Plus } from 'lucide-react';
import {
  AREAS,
  DAILY_BAZAR_ITEMS,
  GROCERY_AISLES,
} from '../data/marketplaceData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  AISLE_LABELS_BN,
  AREA_LABELS,
  GROCERY_BN,
  SLOT_LABELS,
} from '../i18n/translations';
import type {
  AreaName,
  CartItem,
  GroceryAisleId,
  GroceryItem,
} from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface DailyBazarSectionProps {
  selectedArea: AreaName;
  onAreaChange: (area: AreaName) => void;
  cartItems: CartItem[];
  onAddGrocery: (item: GroceryItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  searchQuery: string;
}

export function DailyBazarSection({
  selectedArea,
  onAreaChange,
  cartItems,
  onAddGrocery,
  onUpdateQuantity,
  searchQuery,
}: DailyBazarSectionProps) {
  const [selectedAisle, setSelectedAisle] = useState<GroceryAisleId>('all');
  const { lang, t } = useLanguage();
  const d = t.dailyBazar;

  const query = searchQuery.trim().toLowerCase();

  const visibleItems = DAILY_BAZAR_ITEMS.filter((item) => {
    const matchesAisle = selectedAisle === 'all' || item.aisle === selectedAisle;
    const gBn = GROCERY_BN[item.id];
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.aisleLabel.toLowerCase().includes(query) ||
      item.origin.toLowerCase().includes(query) ||
      (gBn?.name.toLowerCase().includes(query) ?? false);
    return matchesAisle && matchesQuery;
  });

  const getCartQuantity = (id: string): number => {
    return cartItems.find((ci) => ci.id === id)?.quantity ?? 0;
  };

  return (
    <section
      id="daily-bazar"
      className="bg-[#F3F6F4] border-y border-slate-200/90 py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Daily Bazar Header + Area Delivery Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {d.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              {d.headline}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
              {d.subtext}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              <select
                aria-label="Select delivery area"
                value={selectedArea}
                onChange={(e) => onAreaChange(e.target.value as AreaName)}
                className="text-sm font-semibold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {AREA_LABELS[area][lang]}
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              |
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>{SLOT_LABELS[selectedArea][lang]}</span>
            </div>
          </div>
        </div>

        {/* Grocery Aisle Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {GROCERY_AISLES.map((aisle) => {
            const active = selectedAisle === aisle.id;
            const label =
              lang === 'bn' ? AISLE_LABELS_BN[aisle.id] : aisle.label;
            return (
              <button
                key={aisle.id}
                type="button"
                onClick={() => setSelectedAisle(aisle.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Grocery Product Grid */}
        {visibleItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-600">{d.noMatch}</p>
            <button
              type="button"
              onClick={() => setSelectedAisle('all')}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg cursor-pointer"
            >
              {d.showAll}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((item) => {
              const qty = getCartQuantity(item.id);
              const gBn = GROCERY_BN[item.id];
              const displayName = lang === 'bn' && gBn ? gBn.name : item.name;
              const displayAisle =
                lang === 'bn' && gBn ? gBn.aisleLabel : item.aisleLabel;
              const displayUnit = lang === 'bn' && gBn ? gBn.unit : item.unit;
              const displayOrigin =
                lang === 'bn' && gBn ? gBn.origin : item.origin;
              const displayStock =
                lang === 'bn' && gBn ? gBn.stockNote : item.stockNote;
              const displayDesc =
                lang === 'bn' && gBn ? gBn.description : item.description;

              return (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 ease-market hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                    <ResilientImage
                      src={item.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      fallbackLabel={displayName}
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                      {displayAisle} · {displayUnit}
                    </p>

                    <h3 className="mt-1.5 font-display text-base font-semibold text-slate-900 leading-snug">
                      {displayName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {displayOrigin} · {displayStock}
                    </p>

                    <p className="mt-2.5 text-sm text-slate-600 line-clamp-2">
                      {displayDesc}
                    </p>

                    <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                      <div className="tabular-nums">
                        <span className="text-base font-bold text-slate-900">
                          {formatBDT(item.price, lang)}
                        </span>
                        {item.originalPrice && (
                          <span className="ml-2 text-xs text-slate-400 line-through">
                            {formatBDT(item.originalPrice, lang)}
                          </span>
                        )}
                      </div>

                      {qty > 0 ? (
                        <div className="inline-flex items-center border border-emerald-700 rounded-lg overflow-hidden bg-emerald-50">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${displayName}`}
                            className="w-9 h-9 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-emerald-950 tabular-nums">
                            {formatNumber(qty, lang)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${displayName}`}
                            className="w-9 h-9 flex items-center justify-center text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddGrocery(item)}
                          className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{d.addToBasket}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
