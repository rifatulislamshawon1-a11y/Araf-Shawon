import { ArrowRight, Store } from 'lucide-react';

interface SellerBannerProps {
  onOpenSellerModal: () => void;
}

export function SellerBanner({ onOpenSellerModal }: SellerBannerProps) {
  return (
    <section className="py-12 sm:py-16 bg-[#FAFAFA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              KenaKata Seller Hub
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              Open your digital storefront across all 64 districts
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Built for Bangladeshi retail shops, local grocery stores, and artisan
              brands. List your catalog, manage neighborhood pickup slots, and reach
              customers nationwide.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenSellerModal}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Store className="w-4 h-4" aria-hidden="true" />
                <span>Start Seller Registration</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-6 lg:pt-0 lg:pl-10">
            <div className="flex items-baseline justify-between gap-4 py-2 border-b border-slate-800/80">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                12,000+
              </span>
              <span className="text-xs sm:text-sm text-slate-300 text-right">
                Verified merchants onboarded
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2 border-b border-slate-800/80">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                48 Hours
              </span>
              <span className="text-xs sm:text-sm text-slate-300 text-right">
                Settlement cycle in Dhaka
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2">
              <span className="font-display text-2xl font-bold text-white tabular-nums">
                0 BDT
              </span>
              <span className="text-xs sm:text-sm text-slate-300 text-right">
                Storefront listing setup fee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
