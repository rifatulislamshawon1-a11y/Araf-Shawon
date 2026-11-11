import {
  ArrowRight,
  Backpack,
  Cpu,
  LayoutGrid,
  Shirt,
  ShoppingBasket,
  Sofa,
  Sparkles,
  Tag,
} from 'lucide-react';
import { CATEGORIES, HERO_SHOWCASE_IMAGE } from '../data/marketplaceData';
import { useLanguage } from '../i18n/LanguageContext';
import { CATEGORY_TRANSLATIONS } from '../i18n/translations';
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
  const { lang, t, brandName } = useLanguage();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (id: CategoryId) => {
    if (id === 'grocery') {
      handleScrollTo('daily-bazar');
      return;
    }
    onSelectCategory(id);
    handleScrollTo('catalog');
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
              {t.hero.eyebrow}
            </p>

            <h1 className="mt-3 font-display text-[clamp(2rem,3.4vw,3.1rem)] font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
              {t.hero.headline}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {t.hero.subtext}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleScrollTo('catalog')}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.hero.ctaShop}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollTo('used-products')}
                className="inline-flex items-center justify-center gap-1.5 h-11 px-5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Tag className="w-4 h-4 text-amber-700" aria-hidden="true" />
                <span>{t.hero.ctaUsed}</span>
              </button>

              <button
                type="button"
                onClick={onOpenSellerModal}
                className="inline-flex items-center justify-center h-11 px-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.hero.ctaSeller}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600">
              <span>{t.hero.trust1}</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>{t.hero.trust2}</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span>{t.hero.trust3}</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="w-full h-full min-h-[260px] sm:min-h-[340px] lg:min-h-[410px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <ResilientImage
                src={HERO_SHOWCASE_IMAGE}
                alt={`${brandName} Showcase`}
                className="w-full h-full object-cover"
                fallbackLabel={`${brandName} Marketplace Showcase`}
              />
            </div>
          </div>
        </div>

        {/* Product Categories Navigation Strip */}
        <div className="mt-10 pt-8 border-t border-slate-200/80">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              {t.hero.categoriesTitle}
            </h2>
            <span className="text-xs sm:text-sm text-slate-500">
              {t.hero.categoriesHint}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.id];
              const isActive = selectedCategory === category.id;
              const catLabel =
                lang === 'bn'
                  ? CATEGORY_TRANSLATIONS[category.id].name
                  : category.name;
              const catCount =
                lang === 'bn'
                  ? CATEGORY_TRANSLATIONS[category.id].countLabel
                  : category.countLabel;

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
                      {catLabel}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 truncate">
                      {catCount}
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
