import { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingBag,
  Store,
  User,
  X,
  LogOut,
} from 'lucide-react';
import type { AuthUser } from '../types/marketplace';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenSellerModal: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onResetFilters: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenSellerModal,
  currentUser,
  onLogout,
  onResetFilters,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Zone: Single text wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onResetFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-display text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
          >
            KenaKata
          </a>

          {/* Center Zone: Nav links + Search bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 flex-1 max-w-3xl">
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-600 shrink-0">
              <a
                href="#catalog"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('catalog');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Marketplace
              </a>
              <a
                href="#daily-bazar"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('daily-bazar');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Daily Bazar
              </a>
              <a
                href="#nearby-shops"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('nearby-shops');
                }}
                className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Nearby Shops
              </a>
            </nav>

            <form
              onSubmit={handleFormSubmit}
              className="relative flex-1 min-w-[240px]"
              role="search"
              aria-label="Search marketplace"
            >
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search electronics, Jamdani, rice, or shops..."
                className="w-full h-10 pl-10 pr-16 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-11 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Go
              </button>
            </form>
          </div>

          {/* Right Zone: Seller registration, Customer auth & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSellerModal}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              <span>Become a Seller</span>
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 whitespace-nowrap max-w-[130px] truncate">
                  <User className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{currentUser.name}</span>
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  aria-label="Sign out"
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="inline-flex items-center gap-2 h-10 px-3.5 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums font-semibold text-emerald-300">
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Non-sticky mobile/tablet search bar (keeps mobile sticky height <= 64px / < 10%) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
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
            placeholder="Search electronics, groceries, or shops..."
            className="w-full h-11 pl-10 pr-16 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-md"
          >
            Go
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
              Marketplace Catalog
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('daily-bazar')}
              className="text-left px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Daily Bazar Grocery
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('nearby-shops')}
              className="text-left px-3 py-2.5 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Nearby Shops
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellerModal();
              }}
              className="w-full flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <Store className="w-4 h-4" />
              <span>Register as a Seller</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-800">
                  Signed in as {currentUser.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Sign out
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
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="h-11 px-4 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
