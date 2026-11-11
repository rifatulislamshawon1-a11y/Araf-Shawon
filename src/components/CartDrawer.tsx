import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import {
  BANGLADESH_DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
  isCumillaDistrict,
} from '../data/bangladeshLocations';
import { DEMO_COURIER_PARTNERS } from '../data/deliveryDemoData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  GROCERY_BN,
  PRODUCT_BN,
  translateDeliveryMethod,
  translateDistrict,
  translateDivision,
} from '../i18n/translations';
import type {
  CartItem,
  DeliveryChargeConfig,
  LocalDeliverySpeed,
  MarketplaceOrder,
} from '../types/marketplace';
import {
  calculateHybridDeliveryQuote,
  formatBDT,
  formatNumber,
} from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryCharges: DeliveryChargeConfig;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: MarketplaceOrder) => void;
  onOpenAdminOrders: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  deliveryCharges,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onOpenAdminOrders,
}: CartDrawerProps) {
  const { lang, t } = useLanguage();
  const c = t.cart;

  const [viewMode, setViewMode] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  const [division, setDivision] = useState('Chattogram');
  const [district, setDistrict] = useState('Cumilla');
  const [upazila, setUpazila] = useState('Cumilla Adarsha Sadar');
  const [fullAddress, setFullAddress] = useState('');

  const [localSpeed, setLocalSpeed] = useState<LocalDeliverySpeed>('same-day');
  const [courierPartner, setCourierPartner] = useState(
    DEMO_COURIER_PARTNERS[0].name,
  );
  const [formError, setFormError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<MarketplaceOrder | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setViewMode('cart');
      setFormError('');
      setPlacedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const districtsInDivision = getDistrictsForDivision(division);
  const upazilasInDistrict = getUpazilasForDistrict(division, district);
  const inCumilla = isCumillaDistrict(district);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const quote = calculateHybridDeliveryQuote({
    district,
    localSpeed,
    subtotal,
    itemCount: totalCount,
    config: deliveryCharges,
    lang,
  });

  const totalAmount = subtotal + quote.charge;

  const resolveCartItemDisplay = (item: CartItem) => {
    if (lang === 'bn' && item.productId) {
      const pBn = PRODUCT_BN[item.productId];
      if (pBn) {
        return { name: pBn.name, vendor: pBn.vendorName };
      }
      const gBn = GROCERY_BN[item.productId];
      if (gBn) {
        return { name: gBn.name, vendor: gBn.vendorName };
      }
    }
    return { name: item.name, vendor: item.vendorName };
  };

  const handleDivisionChange = (nextDivision: string) => {
    setDivision(nextDivision);
    const nextDistricts = getDistrictsForDivision(nextDivision);
    const firstDist = nextDistricts[0]?.name ?? '';
    setDistrict(firstDist);
    const nextUpazilas = getUpazilasForDistrict(nextDivision, firstDist);
    setUpazila(nextUpazilas[0] ?? '');
  };

  const handleDistrictChange = (nextDistrict: string) => {
    setDistrict(nextDistrict);
    const nextUpazilas = getUpazilasForDistrict(division, nextDistrict);
    setUpazila(nextUpazilas[0] ?? '');
  };

  const handleQuickCumillaSwitch = (targetCumilla: boolean) => {
    if (targetCumilla) {
      setDivision('Chattogram');
      setDistrict('Cumilla');
      setUpazila('Cumilla Adarsha Sadar');
    } else {
      setDivision('Dhaka');
      setDistrict('Dhaka');
      setUpazila('Dhanmondi');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !fullAddress.trim()) {
      setFormError(c.formError);
      return;
    }
    setFormError('');

    const orderNumber = `${BRAND_CONFIG.orderPrefix}-${Math.floor(2500 + Math.random() * 7000)}`;
    const itemsSummary = items
      .map((item) => `${item.name} × ${item.quantity}`)
      .join(', ');

    const newOrder: MarketplaceOrder = {
      id: orderNumber,
      createdAt: lang === 'bn' ? 'এইমাত্র' : 'Just now',
      customerName: customerName.trim(),
      phone: phone.trim(),
      division,
      district,
      upazila,
      fullAddress: fullAddress.trim(),
      deliveryMethod: quote.method,
      ...(inCumilla
        ? {
            localSpeed,
            status: 'Pending Assignment' as const,
          }
        : {
            courierPartner,
            status: 'Awaiting Courier Handover' as const,
          }),
      itemsSummary,
      itemCount: totalCount,
      subtotal,
      deliveryCharge: quote.charge,
      totalAmount,
      paymentMethod: 'Cash on Delivery (Demo)',
    };

    onPlaceOrder(newOrder);
    setPlacedOrder(newOrder);
    onClearCart();
    setViewMode('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={c.cartTitle}
    >
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      <aside className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {viewMode === 'checkout' && (
              <button
                type="button"
                onClick={() => setViewMode('cart')}
                aria-label="Back to cart"
                className="p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-lg font-bold text-slate-900">
              {viewMode === 'cart' &&
                `${c.cartTitle} (${formatNumber(totalCount, lang)})`}
              {viewMode === 'checkout' && c.checkoutTitle}
              {viewMode === 'confirmed' && c.confirmedTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {viewMode === 'confirmed' && placedOrder ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-slate-900">
                #{placedOrder.id} — {c.confirmedHeading}
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">
                {c.confirmedBody}
              </p>

              <div className="mt-6 text-left bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{c.deliveryMethod}</span>
                  <span className="font-semibold text-emerald-800">
                    {translateDeliveryMethod(placedOrder.deliveryMethod, lang)}
                  </span>
                </div>
                {placedOrder.localSpeed && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">{c.localSpeed}</span>
                    <span className="font-medium text-slate-900">
                      {placedOrder.localSpeed === 'same-day'
                        ? c.sameDayCumilla
                        : c.nextDayCumilla}
                    </span>
                  </div>
                )}
                {placedOrder.courierPartner && (
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">{c.courierPartner}</span>
                    <span className="font-medium text-slate-900">
                      {placedOrder.courierPartner}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{c.recipient}</span>
                  <span className="font-medium text-slate-900">
                    {placedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{c.destination}</span>
                  <span className="font-medium text-slate-900 text-right">
                    {placedOrder.upazila},{' '}
                    {translateDistrict(placedOrder.district, lang)} (
                    {translateDivision(placedOrder.division, lang)})
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{c.itemsSubtotal}</span>
                    <span className="tabular-nums">
                      {formatBDT(placedOrder.subtotal, lang)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>{c.deliveryCharge}</span>
                    <span className="tabular-nums">
                      {placedOrder.deliveryCharge === 0
                        ? c.free
                        : formatBDT(placedOrder.deliveryCharge, lang)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1">
                    <span>{c.totalCod}</span>
                    <span className="text-emerald-700 tabular-nums">
                      {formatBDT(placedOrder.totalAmount, lang)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminOrders();
                  }}
                  className="w-full h-11 inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>{c.manageOrderBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {c.continueShopping}
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                {c.emptyTitle}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xs">{c.emptyBody}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {c.browseProducts}
              </button>
            </div>
          ) : viewMode === 'checkout' ? (
            <form
              id="hybrid-checkout-form"
              onSubmit={handleConfirmOrder}
              className="space-y-4"
            >
              {formError && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {formError}
                </div>
              )}

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {c.fullName}
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {c.mobile}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 17XX-XXXXXX"
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* 8 Divisions / 64 Districts / Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {c.division}
                  </label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  >
                    {BANGLADESH_DIVISIONS.map((div) => (
                      <option key={div.name} value={div.name}>
                        {translateDivision(div.name, lang)} {c.divisionSuffix}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {c.district}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  >
                    {districtsInDivision.map((dist) => (
                      <option key={dist.name} value={dist.name}>
                        {translateDistrict(dist.name, lang)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {c.upazila}
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                >
                  {upazilasInDistrict.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {c.streetAddress}
                </label>
                <textarea
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder={
                    inCumilla
                      ? 'House 18, Jhautala Road, Kandirpar, Cumilla'
                      : `House, Road, Ward / Sector in ${upazila}, ${district}`
                  }
                  className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Dynamic Hybrid Delivery Method Box */}
              <div
                className={`rounded-xl border p-4 space-y-3 ${
                  inCumilla
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck
                      className={`w-4 h-4 shrink-0 ${
                        inCumilla ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {c.activeDeliveryMethod}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {translateDeliveryMethod(quote.method, lang)}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">
                    {quote.charge === 0 ? c.free : formatBDT(quote.charge, lang)}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{quote.etaText}</p>

                {inCumilla ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setLocalSpeed('same-day')}
                      className={`p-2.5 text-left rounded-lg border transition-colors cursor-pointer ${
                        localSpeed === 'same-day'
                          ? 'bg-white border-emerald-600 text-slate-900 shadow-xs'
                          : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.sameDayLabel}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                        {formatBDT(deliveryCharges.cumillaSameDayFee, lang)} ·{' '}
                        {c.today}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLocalSpeed('next-day')}
                      className={`p-2.5 text-left rounded-lg border transition-colors cursor-pointer ${
                        localSpeed === 'next-day'
                          ? 'bg-white border-emerald-600 text-slate-900 shadow-xs'
                          : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{c.nextDayLabel}</div>
                      <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                        {formatBDT(deliveryCharges.cumillaNextDayFee, lang)} ·{' '}
                        {c.tomorrow}
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {c.preferredCourier}
                    </label>
                    <select
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      className="w-full h-9 px-2.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    >
                      {DEMO_COURIER_PARTNERS.map((partner) => (
                        <option key={partner.id} value={partner.name}>
                          {partner.name} — {partner.serviceType}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500">{c.codNote}</p>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Quick Destination Selector inside Cart */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {c.deliveryDestination}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {translateDeliveryMethod(quote.method, lang)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickCumillaSwitch(true)}
                    className={`h-9 px-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      inCumilla
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {c.insideCumilla}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickCumillaSwitch(false)}
                    className={`h-9 px-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      !inCumilla
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {c.outsideCumilla}
                  </button>
                </div>

                {inCumilla ? (
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <span className="text-slate-600">{c.cumillaSpeed}</span>
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setLocalSpeed('same-day')}
                        className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer ${
                          localSpeed === 'same-day'
                            ? 'bg-white border-emerald-600 text-emerald-800'
                            : 'bg-transparent border-slate-200 text-slate-600'
                        }`}
                      >
                        {c.sameDayLabel} (
                        {formatBDT(deliveryCharges.cumillaSameDayFee, lang)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalSpeed('next-day')}
                        className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer ${
                          localSpeed === 'next-day'
                            ? 'bg-white border-emerald-600 text-emerald-800'
                            : 'bg-transparent border-slate-200 text-slate-600'
                        }`}
                      >
                        {c.nextDayLabel} (
                        {formatBDT(deliveryCharges.cumillaNextDayFee, lang)})
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    {c.selectedCourierPrefix}{' '}
                    <span className="font-semibold">
                      {translateDistrict(district, lang)}
                    </span>{' '}
                    ({translateDivision(division, lang)} {c.divisionSuffix}) ·{' '}
                    {c.thirdPartyCourier} (
                    {formatBDT(deliveryCharges.outsideCumillaCourierFee, lang)})
                  </p>
                )}
              </div>

              <ul className="divide-y divide-slate-200">
                {items.map((item) => {
                  const resolved = resolveCartItemDisplay(item);
                  return (
                    <li key={item.id} className="py-4 flex gap-3.5">
                      <div className="w-20 h-16 rounded-lg bg-zinc-100 border border-slate-200 overflow-hidden shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={resolved.name}
                          className="w-full h-full object-cover"
                          fallbackLabel={resolved.name}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                            {resolved.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${resolved.name}`}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-xs text-slate-500 truncate">
                          {item.isUsed && (
                            <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider align-baseline">
                              {t.usedSection.usedTag}
                            </span>
                          )}
                          {resolved.vendor} · {item.variantOrUnit}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              aria-label={`Decrease quantity for ${resolved.name}`}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-900 tabular-nums">
                              {formatNumber(item.quantity, lang)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label={`Increase quantity for ${resolved.name}`}
                              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {formatBDT(item.price * item.quantity, lang)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Summary showing Delivery Method & Delivery Charge separately */}
        {items.length > 0 && viewMode !== 'confirmed' && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{c.subtotal}</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {formatBDT(subtotal, lang)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{c.deliveryMethod}</span>
                <span className="font-semibold text-emerald-800">
                  {translateDeliveryMethod(quote.method, lang)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>
                  {c.deliveryCharge} (
                  {inCumilla
                    ? localSpeed === 'same-day'
                      ? c.sameDayLabel
                      : c.nextDayLabel
                    : c.outsideCumilla}
                  )
                </span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {quote.charge === 0 ? c.free : formatBDT(quote.charge, lang)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>{c.totalBdt}</span>
                <span className="tabular-nums">{formatBDT(totalAmount, lang)}</span>
              </div>
            </div>

            {viewMode === 'cart' ? (
              <button
                type="button"
                onClick={() => setViewMode('checkout')}
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {c.continueCheckout}
              </button>
            ) : (
              <button
                type="submit"
                form="hybrid-checkout-form"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {c.placeDemoOrder} ({formatBDT(totalAmount, lang)})
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
