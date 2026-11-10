import {
  ArrowRight,
  Backpack,
  Cpu,
  LayoutGrid,
  Shirt,
  ShoppingBasket,
  Sofa,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, HERO_SHOWCASE_IMAGE } from '../data/marketplaceData';
import type { CategoryId } from '../types/marketplace';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  selectedCategory: CategoryId;
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenSellerModal: () => void;
}

const CATEGORY_ICONS: Record<CategoryId, typeof LayoutGrid> = {
  all: LayoutGrid,
  electronics: Cpu,
  fashion: Shirt,
  home: Sofa,
  accessories: Backpack,
  beauty: Sparkles,
  grocery: ShoppingBasket,
};

export function HeroSection({
  selectedCategory,
  onSelectCategory,
  onOpenSellerModal,
}: HeroSectionProps) {
  const handleExploreClick = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (id: CategoryId) => {
    if (id === 'grocery') {
      const bazar = document.getElementById('daily-bazar');
      if (bazar) {
        bazar.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    onSelectCategory(id);
    const catalog = document.getElementById('catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      className="bg-white border-b border-slate-200/80 pt-6 pb-10 sm:pt-10 sm:pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Editorial Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center py-2 lg:py-6">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-700">
              Bangladesh Multi-Vendor Marketplace · 64 Districts
            </p>

            <h1 className="mt-3 font-display text-[clamp(2.1rem,3.6vw,3.25rem)] font-extrabold tracking-tight text-slate-900 leading-[1.1] text-balance">
              Everything Bangladesh shops for, from verified local sellers.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Discover curated electronics, heritage Dhaka handloom fashion, and
              same-day Daily Bazar groceries delivered from neighborhood storefronts.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExploreClick}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Shop Marketplace</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenSellerModal}
                className="inline-flex items-center justify-center h-11 px-5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Register as a Seller
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600">
              <span>Cash on Delivery nationwide</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>Same-day Dhaka grocery slots</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>Verified neighborhood shops</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="w-full h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[410px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <ResilientImage
                src={HERO_SHOWCASE_IMAGE}
                alt="Curated wireless audio, ceramicware, handloom cotton, and fresh produce on KenaKata"
                className="w-full h-full object-cover"
                fallbackLabel="KenaKata Marketplace Showcase"
              />
            </div>
          </div>
        </div>

        {/* Product Categories Navigation Strip */}
        <div className="mt-10 pt-8 border-t border-slate-200/80">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Product Categories
            </h2>
            <span className="text-xs sm:text-sm text-slate-500">
              Select a category to filter catalog
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group text-left p-3.5 rounded-xl border transition-all duration-150 ease-market cursor-pointer flex flex-col justify-between min-h-[92px] ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-600 text-slate-900 shadow-xs'
                      : 'bg-[#FAFAFA] border-slate-200 text-slate-800 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-emerald-700'
                          : 'text-slate-500 group-hover:text-slate-800'
                      }`}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold leading-tight truncate">
                      {category.name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 truncate">
                      {category.countLabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
