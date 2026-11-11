import { useLanguage } from '../i18n/LanguageContext';
import type { CategoryId } from '../types/marketplace';
import { formatNumber } from '../utils/formatters';

interface FooterProps {
  onSelectCategory: (categoryId: CategoryId) => void;
  onNavigateSection: (targetId: string) => void;
  onOpenSellerModal: () => void;
  onOpenPostAd: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenAdminOrders: () => void;
}

export function Footer({
  onSelectCategory,
  onNavigateSection,
  onOpenSellerModal,
  onOpenPostAd,
  onOpenAuth,
  onOpenAdminOrders,
}: FooterProps) {
  const { lang, t, brandName } = useLanguage();
  const f = t.footer;

  const scrollToSection = (id: string, category?: CategoryId) => {
    if (category) {
      onSelectCategory(category);
    }
    onNavigateSection(id);
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          <div className="md:col-span-4">
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
              {brandName}
            </span>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
              {f.description}
            </p>
            <p className="mt-4 text-xs text-slate-500">{f.hq}</p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {f.colMarketplace}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog', 'electronics')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkElectronics}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog', 'fashion')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkFashion}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('used-products')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkUsed}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('daily-bazar')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkBazar}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('nearby-shops')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkShops}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {f.colAccounts}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={onOpenSellerModal}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkSellerReg}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPostAd}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkPostAd}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkLogin}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkSignup}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdminOrders}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {f.linkAdmin}
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              {f.colDelivery}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {f.deliveryCopy}
            </p>
            <p className="text-xs text-slate-500 pt-1">{f.deliverySub}</p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {formatNumber(new Date().getFullYear(), lang).replace(/,/g, '')}{' '}
            {f.copyright}
          </p>
          <p>{f.areasFoot}</p>
        </div>
      </div>
    </footer>
  );
}
