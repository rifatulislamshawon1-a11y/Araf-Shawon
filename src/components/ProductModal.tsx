import { useEffect, useState } from 'react';
import { Check, Minus, Plus, ShieldCheck, Star, Truck, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PRODUCT_BN } from '../i18n/translations';
import type { Product } from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: string, quantity: number) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { lang, t } = useLanguage();
  const m = t.productModal;

  useEffect(() => {
    if (product) {
      setSelectedVariantIdx(0);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const pBn = PRODUCT_BN[product.id];
  const displayName = lang === 'bn' && pBn ? pBn.name : product.name;
  const displayVendor = lang === 'bn' && pBn ? pBn.vendorName : product.vendorName;
  const displayDistrict =
    lang === 'bn' && pBn ? pBn.vendorDistrict : product.vendorDistrict;
  const displayStock = lang === 'bn' && pBn ? pBn.stockNote : product.stockNote;
  const displayDesc = lang === 'bn' && pBn ? pBn.description : product.description;
  const displayEst =
    lang === 'bn' && pBn ? pBn.deliveryEstimate : product.deliveryEstimate;
  const displayVariants =
    lang === 'bn' && pBn ? pBn.variants : product.variants;
  const canonicalVariant =
    product.variants[selectedVariantIdx] ?? product.variants[0] ?? 'Standard';
  const displaySelectedVariant =
    displayVariants[selectedVariantIdx] ?? canonicalVariant;

  const handleAdd = () => {
    onAddToCart(product, canonicalVariant, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={displayName}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label={m.close}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 flex items-center justify-center rounded-lg bg-white/90 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Gallery Left */}
          <div className="md:col-span-6 bg-zinc-100 aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <ResilientImage
              src={product.image}
              alt={displayName}
              className="w-full h-full object-cover"
              fallbackLabel={displayName}
            />
          </div>

          {/* Contiguous Purchase Module Right */}
          <div className="md:col-span-6 p-6 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {displayVendor} · {displayDistrict}
            </p>

            <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {displayName}
            </h2>

            <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 tabular-nums">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
              <span className="font-semibold text-slate-900">
                {lang === 'bn'
                  ? product.rating.toLocaleString('bn-BD', {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })
                  : product.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>
                {formatNumber(product.soldCount, lang)} {m.orders}
              </span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">{displayStock}</span>
            </div>

            <div className="mt-4 pb-4 border-b border-slate-200 flex items-baseline gap-3 tabular-nums">
              <span className="text-2xl font-bold text-slate-900">
                {formatBDT(product.price, lang)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatBDT(product.originalPrice, lang)}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {displayDesc}
            </p>

            {/* Variant Selector */}
            <div className="mt-5">
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                {m.option}: {displaySelectedVariant}
              </span>
              <div className="flex flex-wrap gap-2">
                {displayVariants.map((variantLabel, idx) => {
                  const active = selectedVariantIdx === idx;
                  return (
                    <button
                      key={variantLabel}
                      type="button"
                      onClick={() => setSelectedVariantIdx(idx)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {variantLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Warranty Notes */}
            <div className="mt-5 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{displayEst}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{m.easyReturn}</span>
              </div>
            </div>

            {/* Quantity & Add CTA */}
            <div className="mt-auto pt-6 flex items-center gap-3">
              <div className="inline-flex items-center border border-slate-300 rounded-lg h-11 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center text-sm font-bold text-slate-900 tabular-nums">
                  {formatNumber(quantity, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 h-11 px-5 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{m.addedToCart}</span>
                  </>
                ) : (
                  <span>
                    {m.addToCart} · {formatBDT(product.price * quantity, lang)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
