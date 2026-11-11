import { useState } from 'react';
import {
  LogOut,
  Menu,
  PlusCircle,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { AuthUser } from '../types/marketplace';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSellerModal: () => void;
  onOpenPostAd: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onResetFilters: () => void;
  activeView: 'storefront' | 'admin';
  onOpenAdminView: () => void;
  onNavigateStorefront: (targetId?: string) => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenSellerModal,
  onOpenPostAd,
  currentUser,
  onLogout,
  onResetFilters,
  activeView,
  onOpenAdminView,
  onNavigateStorefront,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t, brandName } = useLanguage();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    onNavigateStorefront(targetId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left Zone: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onResetFilters();
              onNavigateStorefront();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
          >
            {brandName}
          </a>

          {/* Center Zone: Nav links + Search bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5 flex-1 min-w-0">
            <nav className="flex items-center gap-3 xl:gap-4 text-xs xl:text-sm font-medium text-slate-600 shrink-0">
              <a
                href="#catalog"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('catalog');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.marketplace}
              </a>
              <a
                href="#used-products"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('used-products');
                }}
                className="text-amber-800 hover:text-amber-900 font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.usedProducts}
              </a>
              <a
                href="#daily-bazar"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('daily-bazar');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.dailyBazar}
              </a>
              <a
                href="#nearby-shops"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('nearby-shops');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.nearbyShops}
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminView();
                }}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'admin'
                    ? 'text-emerald-700 font-semibold underline underline-offset-4'
                    : 'hover:text-slate-900 hover:underline underline-offset-4'
                }`}
              >
                {t.nav.admin}
              </button>
            </nav>

            <form
              onSubmit={handleFormSubmit}
              className="relative flex-1 min-w-[140px] max-w-[260px]"
              role="search"
              aria-label="Search marketplace"
            >
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full h-9 pl-9 pr-12 text-xs xl:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={t.nav.clearSearch}
                  className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label={t.nav.go}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.nav.go}
              </button>
            </form>
          </div>

          {/* Right Zone: Seller, Customer Auth, Cart & Top-Right Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenSellerModal}
              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t.nav.becomeSeller}</span>
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
                <span className="inline-flex items-center gap-1 text-xs xl:text-sm font-medium text-slate-800 whitespace-nowrap max-w-[110px] truncate">
                  <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">{currentUser.name}</span>
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label={t.nav.signout}
                  title={t.nav.signout}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1 pl-1.5 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 py-1.5 text-xs xl:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-2.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.nav.signup}
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`${t.nav.cart} (${cartCount})`}
              className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              <span className="tabular-nums font-semibold text-emerald-300">
                {lang === 'bn' ? cartCount.toLocaleString('bn-BD') : cartCount}
              </span>
            </button>

            {/* Top-Right Bilingual Language Switcher: বাংলা / English */}
            <div
              role="group"
              aria-label={t.nav.langLabel}
              className="inline-flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg shrink-0"
            >
              <button
                type="button"
                onClick={() => setLang('bn')}
                aria-pressed={lang === 'bn'}
                className={`px-2 sm:px-2.5 h-7 text-[11px] sm:text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`px-2 sm:px-2.5 h-7 text-[11px] sm:text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  lang === 'en'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Non-sticky mobile/tablet search bar (keeps sticky mobile chrome at 64px) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5">
        <form
          onSubmit={handleFormSubmit}
          className="relative max-w-3xl mx-auto"
          role="search"
          aria-label="Search marketplace mobile"
        >
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.nav.searchMobilePlaceholder}
            className="w-full h-10 pl-10 pr-16 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label={t.nav.clearSearch}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-md cursor-pointer"
          >
            {t.nav.go}
          </button>
        </form>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-white border-b border-slate-200 shadow-lg px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('catalog')}
              className="text-left px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {t.nav.mobileCatalog}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('used-products')}
              className="text-left px-3 py-2.5 text-base font-semibold text-amber-800 hover:bg-amber-50 rounded-lg"
            >
              {t.nav.mobileUsed}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('daily-bazar')}
              className="text-left px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {t.nav.mobileBazar}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('nearby-shops')}
              className="text-left px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              {t.nav.mobileShops}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminView();
              }}
              className={`text-left px-3 py-2.5 text-base font-medium rounded-lg ${
                activeView === 'admin'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              {t.nav.mobileAdmin}
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPostAd();
              }}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.nav.postAd}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellerModal();
              }}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <Store className="w-4 h-4" />
              <span>{t.nav.registerSeller}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-800">
                  {t.nav.signedInAs} {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t.nav.signout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="h-11 px-4 text-sm font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="h-11 px-4 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  {t.nav.signup}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
