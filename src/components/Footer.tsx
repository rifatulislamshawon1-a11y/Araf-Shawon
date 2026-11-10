import type { CategoryId } from '../types/marketplace';

interface FooterProps {
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenSellerModal: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Footer({
  onSelectCategory,
  onOpenSellerModal,
  onOpenAuth,
}: FooterProps) {
  const scrollToSection = (id: string, category?: CategoryId) => {
    if (category) {
      onSelectCategory(category);
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-200">
          <div className="md:col-span-4">
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
              KenaKata
            </span>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
              A clean multi-vendor marketplace connecting Bangladeshi shoppers with
              trusted electronics dealers, artisan looms, Daily Bazar grocers, and
              neighborhood stores.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Head Office: Kemal Ataturk Avenue, Banani, Dhaka 1213
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Marketplace
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog', 'electronics')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Electronics & Gadgets
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog', 'fashion')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Fashion & Jamdani Loom
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('daily-bazar')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Daily Bazar Grocery
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('nearby-shops')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Verified Nearby Shops
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Accounts & Sellers
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={onOpenSellerModal}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Seller Registration
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Customer Log In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Create Customer Account
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Delivery & Checkout Terms
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cash on Delivery (COD) supported nationwide. Free Dhaka standard
              delivery on orders above ৳ 1,500.
            </p>
            <p className="text-xs text-slate-500 pt-1">
              Planned gateways: bKash · Nagad · Visa · Mastercard · COD
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KenaKata Bangladesh. UI Prototype.</p>
          <p>Dhaka · Chattogram · Sylhet · Rajshahi · Khulna · 64 Districts</p>
        </div>
      </div>
    </footer>
  );
}
