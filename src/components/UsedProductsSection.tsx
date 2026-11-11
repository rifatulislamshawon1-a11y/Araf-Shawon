import { useMemo, useState } from 'react';
import {
  Award,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageSquare,
  Pencil,
  PlusCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import {
  BANGLADESH_DIVISIONS,
  getDistrictsForDivision,
} from '../data/bangladeshLocations';
import { USED_CATEGORIES, USED_CONDITIONS } from '../data/usedProductsData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LISTING_STATUS_LABELS,
  MODERATION_STATUS_LABELS,
  SELLER_VERIFICATION_LABELS,
  USED_CATEGORY_LABELS,
  USED_CONDITION_LABELS,
  USED_DEMO_BN,
  translateDistrict,
  translateDivision,
} from '../i18n/translations';
import {
  AD_SUBSCRIPTION_PLANS,
  SELLER_VERIFICATION_TIERS,
} from '../services/secondHandArchitecture';
import type {
  ListingStatus,
  UsedCategory,
  UsedCondition,
  UsedProductListing,
  UsedSortOption,
} from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface UsedProductsSectionProps {
  listings: UsedProductListing[];
  globalSearchQuery: string;
  sellerFilter: { sellerId: string; sellerName: string } | null;
  onClearSellerFilter: () => void;
  onOpenPostAd: () => void;
  onEditListing: (listing: UsedProductListing) => void;
  onToggleListingStatus: (listingId: string) => void;
  onDeleteListing: (listingId: string) => void;
  onSelectListing: (listing: UsedProductListing) => void;
}

type StatusScope = 'active-only' | 'all' | 'sold-only';
type MyStatusScope = 'all' | 'Active' | 'Sold';

export function UsedProductsSection({
  listings,
  globalSearchQuery,
  sellerFilter,
  onClearSellerFilter,
  onOpenPostAd,
  onEditListing,
  onToggleListingStatus,
  onDeleteListing,
  onSelectListing,
}: UsedProductsSectionProps) {
  const { lang, t } = useLanguage();
  const s = t.usedSection;

  const [viewScope, setViewScope] = useState<'all' | 'mine'>('all');
  const [myStatusFilter, setMyStatusFilter] = useState<MyStatusScope>('all');
  const [statusScope, setStatusScope] = useState<StatusScope>('all');
  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<UsedCategory | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<UsedCondition | 'all'>('all');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [sortBy, setSortBy] = useState<UsedSortOption>('featured');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showFutureRoadmap, setShowFutureRoadmap] = useState(false);

  const districtsForSelectedDivision = useMemo(() => {
    if (selectedDivision === 'all') {
      return BANGLADESH_DIVISIONS.flatMap((d) => d.districts);
    }
    return getDistrictsForDivision(selectedDivision);
  }, [selectedDivision]);

  const approvedListingsCount = useMemo(
    () => listings.filter((l) => l.moderationStatus === 'Approved').length,
    [listings],
  );

  const myListingsCount = useMemo(
    () => listings.filter((l) => l.isUserOwned).length,
    [listings],
  );

  const myActiveCount = useMemo(
    () =>
      listings.filter((l) => l.isUserOwned && l.listingStatus === 'Active')
        .length,
    [listings],
  );

  const mySoldCount = useMemo(
    () =>
      listings.filter((l) => l.isUserOwned && l.listingStatus === 'Sold')
        .length,
    [listings],
  );

  const effectiveSearch = (localSearch || globalSearchQuery).trim().toLowerCase();

  const parsedMinPrice =
    minPriceInput.trim() !== '' && Number.isFinite(Number(minPriceInput))
      ? Number(minPriceInput)
      : null;
  const parsedMaxPrice =
    maxPriceInput.trim() !== '' && Number.isFinite(Number(maxPriceInput))
      ? Number(maxPriceInput)
      : null;

  const filteredListings = useMemo(() => {
    const base = listings.filter((item) => {
      if (viewScope === 'mine') {
        if (!item.isUserOwned) return false;
        if (myStatusFilter !== 'all' && item.listingStatus !== myStatusFilter) {
          return false;
        }
      } else {
        if (item.moderationStatus !== 'Approved') {
          return false;
        }
        if (statusScope === 'active-only' && item.listingStatus !== 'Active') {
          return false;
        }
        if (statusScope === 'sold-only' && item.listingStatus !== 'Sold') {
          return false;
        }
      }

      if (sellerFilter && item.sellerId !== sellerFilter.sellerId) {
        return false;
      }

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
        return false;
      }
      if (selectedDivision !== 'all' && item.division !== selectedDivision) {
        return false;
      }
      if (selectedDistrict !== 'all' && item.district !== selectedDistrict) {
        return false;
      }
      if (parsedMinPrice !== null && item.price < parsedMinPrice) {
        return false;
      }
      if (parsedMaxPrice !== null && item.price > parsedMaxPrice) {
        return false;
      }

      if (effectiveSearch) {
        const bn = USED_DEMO_BN[item.id];
        const haystack = [
          item.title,
          item.description,
          item.district,
          item.upazila,
          item.areaDetail,
          item.sellerName,
          USED_CATEGORY_LABELS[item.category].en,
          USED_CATEGORY_LABELS[item.category].bn,
          USED_CONDITION_LABELS[item.condition].en,
          USED_CONDITION_LABELS[item.condition].bn,
          bn?.title ?? '',
          bn?.description ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(effectiveSearch)) {
          return false;
        }
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return [...base].sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    }
    // Featured & Newest (puts Active before Sold, and Featured items first)
    return [...base].sort((a, b) => {
      if (a.listingStatus !== b.listingStatus) {
        return a.listingStatus === 'Active' ? -1 : 1;
      }
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return b.createdTimestamp - a.createdTimestamp;
    });
  }, [
    listings,
    viewScope,
    myStatusFilter,
    statusScope,
    sellerFilter,
    selectedCategory,
    selectedCondition,
    selectedDivision,
    selectedDistrict,
    parsedMinPrice,
    parsedMaxPrice,
    effectiveSearch,
    sortBy,
  ]);

  const handleDivisionSelect = (nextDiv: string) => {
    setSelectedDivision(nextDiv);
    setSelectedDistrict('all');
  };

  const handleQuickCumillaToggle = (cumillaOnly: boolean) => {
    if (cumillaOnly) {
      setSelectedDivision('Chattogram');
      setSelectedDistrict('Cumilla');
    } else {
      setSelectedDivision('all');
      setSelectedDistrict('all');
    }
  };

  const handleBudgetPreset = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedDivision('all');
    setSelectedDistrict('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setStatusScope('all');
    setMyStatusFilter('all');
    setSortBy('featured');
    onClearSellerFilter();
  };

  const isCumillaFilterActive = selectedDistrict === 'Cumilla';
  const hasAnyActiveFilter =
    Boolean(localSearch) ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedDivision !== 'all' ||
    selectedDistrict !== 'all' ||
    minPriceInput !== '' ||
    maxPriceInput !== '' ||
    statusScope !== 'all' ||
    Boolean(sellerFilter);

  const isBudgetPreset = (min: string, max: string) =>
    minPriceInput === min && maxPriceInput === max;

  return (
    <section
      id="used-products"
      className="py-12 sm:py-16 bg-[#FDFBF7] border-y border-amber-200/70"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Post Your Ad CTA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              {s.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              {s.headline}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {s.subtext}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="inline-flex p-1 bg-amber-100/70 border border-amber-200 rounded-lg">
              <button
                type="button"
                onClick={() => setViewScope('all')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewScope === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {s.browseAllTab} ({formatNumber(approvedListingsCount, lang)})
              </button>
              <button
                type="button"
                onClick={() => setViewScope('mine')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  viewScope === 'mine'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {s.myAdsTab} ({formatNumber(myListingsCount, lang)})
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenPostAd}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>{s.postAdBtn}</span>
            </button>
          </div>
        </div>

        {/* 9 Second-Hand Categories Quick Strip */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {s.allCategories}
          </button>
          {USED_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
                }`}
              >
                {USED_CATEGORY_LABELS[cat][lang]}
              </button>
            );
          })}
        </div>

        {/* Active Seller Filter Banner (if navigated from Seller Profile) */}
        {sellerFilter && (
          <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-medium text-amber-950 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                {s.sellerFilterPrefix}{' '}
                <strong className="font-bold">{sellerFilter.sellerName}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={onClearSellerFilter}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-slate-900 bg-white border border-amber-300 rounded-md px-2.5 py-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{s.showAllSellers}</span>
            </button>
          </div>
        )}

        {/* My Posted Ads Management Bar & Future Seller Architecture Roadmap */}
        {viewScope === 'mine' && (
          <div className="mb-5 bg-white border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    {
                      key: 'all',
                      label: `${s.myAllFilter} (${formatNumber(myListingsCount, lang)})`,
                    },
                    {
                      key: 'Active',
                      label: `${s.myActiveFilter} (${formatNumber(myActiveCount, lang)})`,
                    },
                    {
                      key: 'Sold',
                      label: `${s.mySoldFilter} (${formatNumber(mySoldCount, lang)})`,
                    },
                  ] as { key: MyStatusScope; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMyStatusFilter(tab.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      myStatusFilter === tab.key
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowFutureRoadmap((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{s.futurePanelToggle}</span>
                {showFutureRoadmap ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {showFutureRoadmap && (
              <div className="pt-3 border-t border-slate-200 space-y-4">
                <p className="text-xs text-slate-600">{s.futurePanelSubtitle}</p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Seller Verification Tiers */}
                  <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>{s.verificationRoadmapTitle}</span>
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {SELLER_VERIFICATION_TIERS.map((tier) => (
                        <li
                          key={tier.level}
                          className="p-2 bg-white border border-slate-200 rounded-lg"
                        >
                          <div className="font-semibold text-slate-900">
                            {lang === 'bn' ? tier.titleBn : tier.titleEn}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {lang === 'bn' ? tier.reqBn : tier.reqEn}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Subscription & Featured Tiers */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {AD_SUBSCRIPTION_PLANS.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                            {lang === 'bn' ? plan.badgeBn : plan.badgeEn}
                          </span>
                          <h5 className="mt-1 font-display text-sm font-bold text-slate-900">
                            {lang === 'bn' ? plan.nameBn : plan.nameEn}
                          </h5>
                          <p className="mt-1 text-lg font-bold text-slate-900 tabular-nums">
                            {plan.priceMonthlyBdt === 0
                              ? lang === 'bn'
                                ? 'ফ্রি'
                                : 'Free'
                              : `${formatBDT(plan.priceMonthlyBdt, lang)} / mo`}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold text-amber-800">
                            {lang === 'bn'
                              ? plan.maxActiveAdsLabelBn
                              : plan.maxActiveAdsLabelEn}
                          </p>
                          <ul className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                            {(lang === 'bn' ? plan.perksBn : plan.perksEn).map(
                              (perk) => (
                                <li
                                  key={perk}
                                  className="flex items-start gap-1.5"
                                >
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{perk}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Classifieds Advanced Search, Location Discovery, Price Range & Filters Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-7 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search */}
            <div className="md:col-span-4 relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={s.searchPlaceholder}
                className="w-full h-10 pl-9 pr-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                aria-label={s.allCategories}
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as UsedCategory | 'all')
                }
                className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 cursor-pointer"
              >
                <option value="all">{s.allCategories}</option>
                {USED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {USED_CATEGORY_LABELS[cat][lang]}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Dropdown */}
            <div className="md:col-span-2">
              <select
                aria-label={s.allConditions}
                value={selectedCondition}
                onChange={(e) =>
                  setSelectedCondition(e.target.value as UsedCondition | 'all')
                }
                className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 cursor-pointer"
              >
                <option value="all">{s.allConditions}</option>
                {USED_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {USED_CONDITION_LABELS[cond][lang]}
                  </option>
                ))}
              </select>
            </div>

            {/* Listing Status Filter */}
            {viewScope === 'all' && (
              <div className="md:col-span-1">
                <select
                  aria-label="Availability"
                  value={statusScope}
                  onChange={(e) => setStatusScope(e.target.value as StatusScope)}
                  className="w-full h-10 px-2 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="all">{s.statusFilterAll}</option>
                  <option value="active-only">{s.statusFilterActive}</option>
                  <option value="sold-only">{s.statusFilterSold}</option>
                </select>
              </div>
            )}

            {/* Sort */}
            <div className={viewScope === 'all' ? 'md:col-span-2' : 'md:col-span-3'}>
              <select
                aria-label={t.catalog.sortBy}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as UsedSortOption)}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 cursor-pointer"
              >
                <option value="featured">{s.sortFeatured}</option>
                <option value="newest">{s.sortNewest}</option>
                <option value="price-asc">{s.sortPriceAsc}</option>
                <option value="price-desc">{s.sortPriceDesc}</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter Row */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
                <Tag className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>{s.priceRangeLabel}:</span>
              </span>

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  placeholder={s.minPriceLabel}
                  className="w-24 h-8 px-2.5 text-xs tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-amber-600"
                />
                <span className="text-slate-400 text-xs">–</span>
                <input
                  type="number"
                  min={0}
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  placeholder={s.maxPriceLabel}
                  className="w-24 h-8 px-2.5 text-xs tabular-nums bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: s.budgetAll, min: '', max: '' },
                  { label: s.budgetUnder5k, min: '', max: '5000' },
                  { label: s.budget5kTo20k, min: '5000', max: '20000' },
                  { label: s.budgetAbove20k, min: '20000', max: '' },
                ].map((preset) => {
                  const active = isBudgetPreset(preset.min, preset.max);
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleBudgetPreset(preset.min, preset.max)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                        active
                          ? 'bg-amber-100 border-amber-400 text-amber-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Discovery Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                <span>{s.showingIn}:</span>
              </span>

              <button
                type="button"
                onClick={() => handleQuickCumillaToggle(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isCumillaFilterActive
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {s.cumillaQuick}
              </button>

              <button
                type="button"
                onClick={() => handleQuickCumillaToggle(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  selectedDivision === 'all' && selectedDistrict === 'all'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {s.allBdQuick}
              </button>

              <select
                aria-label={s.allDivisions}
                value={selectedDivision}
                onChange={(e) => handleDivisionSelect(e.target.value)}
                className="h-8 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="all">{s.allDivisions}</option>
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div.name} value={div.name}>
                    {translateDivision(div.name, lang)}
                  </option>
                ))}
              </select>

              <select
                aria-label={s.allDistricts}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="h-8 px-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="all">{s.allDistricts}</option>
                {districtsForSelectedDivision.map((dist) => (
                  <option key={dist.name} value={dist.name}>
                    {translateDistrict(dist.name, lang)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
              <span className="tabular-nums">
                {formatNumber(filteredListings.length, lang)} {s.resultsCount}
              </span>
              {hasAnyActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>{s.resetFilters}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-lg mx-auto">
            <h3 className="font-display text-lg font-bold text-slate-900">
              {viewScope === 'mine' ? s.emptyMyAdsTitle : s.noResultsTitle}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {viewScope === 'mine' ? s.emptyMyAdsBody : s.noResultsBody}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {viewScope === 'mine' ? (
                <button
                  type="button"
                  onClick={onOpenPostAd}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{s.postAdBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg cursor-pointer"
                >
                  {s.resetFilters}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const bn = USED_DEMO_BN[item.id];
              const displayTitle = lang === 'bn' && bn ? bn.title : item.title;
              const displayPostedAt =
                lang === 'bn' && bn ? bn.postedAt : item.postedAt;
              const displaySeller =
                lang === 'bn' && bn ? bn.sellerName : item.sellerName;
              const categoryLabel = USED_CATEGORY_LABELS[item.category][lang];
              const conditionLabel = USED_CONDITION_LABELS[item.condition][lang];
              const verificationLabel =
                SELLER_VERIFICATION_LABELS[item.sellerVerification][lang];
              const districtLabel = translateDistrict(item.district, lang);
              const isConfirmingDelete = confirmDeleteId === item.id;
              const isSold = item.listingStatus === 'Sold';

              const overlayLabel = isSold
                ? s.soldUsedTag
                : item.isFeatured
                  ? s.featuredUsedTag
                  : s.usedTag;

              const overlayStyle = isSold
                ? 'bg-slate-900 text-white'
                : item.isFeatured
                  ? 'bg-emerald-700 text-white'
                  : 'bg-amber-500 text-slate-950';

              return (
                <article
                  key={item.id}
                  className={`group bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-200 ease-market hover:-translate-y-0.5 hover:shadow-md ${
                    isSold
                      ? 'border border-slate-200 opacity-85'
                      : item.isFeatured
                        ? 'border-2 border-emerald-600/50'
                        : 'border border-amber-200/80'
                  }`}
                >
                  {/* Strictly ONE corner tag per card image */}
                  <button
                    type="button"
                    onClick={() => onSelectListing(item)}
                    className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-600"
                    aria-label={displayTitle}
                  >
                    <ResilientImage
                      src={item.images[0]}
                      alt={displayTitle}
                      className={`w-full h-full object-cover transition-transform duration-300 ease-market group-hover:scale-[1.03] ${
                        isSold ? 'grayscale-[45%]' : ''
                      }`}
                      fallbackLabel={displayTitle}
                    />
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[11px] font-extrabold tracking-wider uppercase shadow-xs ${overlayStyle}`}
                    >
                      {overlayLabel}
                    </span>
                  </button>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Single unboxed metadata strip using · separator */}
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 truncate">
                      {conditionLabel} · {categoryLabel}
                      {item.isUserOwned ? ` · ${s.yourAdTag}` : ''}
                    </p>

                    <button
                      type="button"
                      onClick={() => onSelectListing(item)}
                      className="mt-1.5 text-left font-display text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-amber-700 transition-colors cursor-pointer"
                    >
                      {displayTitle}
                    </button>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin
                          className="w-3.5 h-3.5 text-amber-700 shrink-0"
                          aria-hidden="true"
                        />
                        <span>
                          {item.upazila}, {districtLabel}
                        </span>
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Camera
                          className="w-3.5 h-3.5 text-slate-400 shrink-0"
                          aria-hidden="true"
                        />
                        {formatNumber(item.images.length, lang)}{' '}
                        {item.images.length === 1 ? s.photoSingular : s.photosCount}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{displayPostedAt}</span>
                    </div>

                    {/* Seller profile trust & status metadata */}
                    <p className="mt-1.5 text-[11px] text-slate-600 flex flex-wrap items-center gap-1.5 truncate">
                      <ShieldCheck
                        className={`w-3.5 h-3.5 shrink-0 ${
                          item.sellerVerification === 'Unverified'
                            ? 'text-slate-400'
                            : 'text-emerald-700'
                        }`}
                      />
                      <span className="font-semibold text-slate-800 truncate">
                        {displaySeller}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{verificationLabel}</span>
                      {item.offers.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-800 font-semibold tabular-nums">
                            {formatNumber(item.offers.length, lang)}{' '}
                            {s.offersCountLabel}
                          </span>
                        </>
                      )}
                      {item.messages.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-0.5 text-slate-600 tabular-nums">
                            <MessageSquare className="w-3 h-3" />
                            {formatNumber(item.messages.length, lang)}
                          </span>
                        </>
                      )}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-[11px]">
                      {item.moderationStatus !== 'Approved' && (
                        <span className="font-semibold text-amber-700">
                          {MODERATION_STATUS_LABELS[item.moderationStatus][lang]}
                        </span>
                      )}
                      {isSold && (
                        <span className="font-bold text-slate-700 uppercase">
                          {LISTING_STATUS_LABELS[item.listingStatus][lang]}
                        </span>
                      )}
                      {item.isFeatured && !isSold && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <Sparkles className="w-3 h-3" />
                          <span>{s.featuredText}</span>
                        </span>
                      )}
                    </div>

                    {/* Price & Actions Footer */}
                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-slate-100">
                      <div>
                        <div
                          className={`text-base font-bold tabular-nums ${
                            isSold
                              ? 'text-slate-400 line-through'
                              : 'text-slate-900'
                          }`}
                        >
                          {formatBDT(item.price, lang)}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.negotiable ? s.negotiable : s.fixedPrice}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.isUserOwned && (
                          <>
                            {isConfirmingDelete ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteListing(item.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="h-8 px-2.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded-md inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{s.deleteAd}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="h-8 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md cursor-pointer"
                                >
                                  {s.cancel}
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => onToggleListingStatus(item.id)}
                                  title={isSold ? s.relistBtn : s.markSoldBtn}
                                  className={`h-8 px-2 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${
                                    isSold
                                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                      : 'border-slate-200 text-slate-700 hover:border-slate-900'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">
                                    {isSold ? s.relistBtn : s.markSoldBtn}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onEditListing(item)}
                                  aria-label={`${s.editAd} ${displayTitle}`}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 cursor-pointer"
                                  title={s.editAd}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(item.id)}
                                  aria-label={`${s.deleteAd} ${displayTitle}`}
                                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                  title={s.deleteAd}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {!isConfirmingDelete && (
                          <button
                            type="button"
                            onClick={() => onSelectListing(item)}
                            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {s.viewDetails}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-xs text-slate-500 flex items-center gap-1.5">
          <UserCheck
            className="w-3.5 h-3.5 text-amber-700 shrink-0"
            aria-hidden="true"
          />
          <span>{s.demoNotice}</span>
        </p>
      </div>
    </section>
  );
}
