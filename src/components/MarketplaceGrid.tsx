import { useState } from 'react';
import { Check, Plus, RotateCcw, Star } from 'lucide-react';
import { CATEGORIES } from '../data/marketplaceData';
import type { CategoryId, Product, SortOption } from '../types/marketplace';
import { formatBDT } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface MarketplaceGridProps {
  products: Product[];
  selectedCategory: CategoryId;
  searchQuery: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onAddToCart: (product: Product, variant?: string) => void;
  onOpenProduct: (product: Product) => void;
}

export function MarketplaceGrid({
  products,
  selectedCategory,
  searchQuery,
  sortBy,
  onSortChange,
  onResetFilters,
  onAddToCart,
  onOpenProduct,
}: MarketplaceGridProps) {
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const activeCategoryName =
    CATEGORIES.find((c) => c.id === selectedCategory)?.name ?? 'All Marketplace';

  const hasActiveFilter = selectedCategory !== 'all' || searchQuery.trim().length > 0;

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product, product.variants[0]);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  return (
    <section id="catalog" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Curated Multi-Vendor Catalog
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              {searchQuery.trim()
                ? `Search results for "${searchQuery.trim()}"`
                : activeCategoryName}
            </h2>
            <p className="mt-1 text-sm text-slate-500 tabular-nums">
              {products.length} {products.length === 1 ? 'product' : 'products'} available across verified sellers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hasActiveFilter && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 h-10 px-3.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                Sort by
              </span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="h-10 px-3 text-sm font-medium bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </label>
          </div>
        </div>

        {/* Empty Search / Filter State */}
        {products.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center max-w-lg mx-auto">
            <h3 className="font-display text-lg font-bold text-slate-900">
              No matching products found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try a different keyword or reset your category filter to browse all items on KenaKata.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex items-center justify-center h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Show All Marketplace Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-200 ease-market hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Product Image Frame */}
                  <button
                    type="button"
                    onClick={() => onOpenProduct(product)}
                    className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600"
                    aria-label={`View details for ${product.name}`}
                  >
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-market group-hover:scale-[1.03]"
                      fallbackLabel={product.name}
                    />
                  </button>

                  {/* Product Card Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Unboxed 1-line Vendor & Category Metadata */}
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                      {product.vendorName} · {product.categoryLabel}
                    </p>

                    <button
                      type="button"
                      onClick={() => onOpenProduct(product)}
                      className="mt-1.5 text-left font-display text-[15px] font-semibold text-slate-900 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </button>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                      <Star
                        className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-slate-800">
                        {product.rating.toFixed(1)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{product.soldCount} sold</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{product.vendorDistrict}</span>
                    </div>

                    {/* Price & Add to Cart Row */}
                    <div className="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                      <div className="tabular-nums">
                        <div className="text-base font-bold text-slate-900">
                          {formatBDT(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-xs text-slate-400 line-through">
                            {formatBDT(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isJustAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
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
