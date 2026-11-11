import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  EyeOff,
  Flag,
  Package,
  RotateCcw,
  Search,
  Settings2,
  ShieldAlert,
  Sparkles,
  Trash2,
  Truck,
  UserCheck,
} from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import {
  CUMILLA_DELIVERY_STAFF,
  DEFAULT_DELIVERY_CHARGES,
  DEMO_COURIER_PARTNERS,
} from '../data/deliveryDemoData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LISTING_STATUS_LABELS,
  MODERATION_STATUS_LABELS,
  ORDER_STATUS_BN,
  REPORT_REASON_LABELS,
  SELLER_VERIFICATION_LABELS,
  USED_CONDITION_LABELS,
  USED_DEMO_BN,
  translateDeliveryMethod,
  translateDistrict,
  translateDivision,
} from '../i18n/translations';
import type {
  CourierOrderStatus,
  DeliveryChargeConfig,
  DeliveryMethodType,
  LocalOrderStatus,
  MarketplaceOrder,
  ModerationStatus,
  SellerVerificationLevel,
  UsedProductListing,
} from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface AdminOrdersViewProps {
  orders: MarketplaceOrder[];
  deliveryCharges: DeliveryChargeConfig;
  usedListings: UsedProductListing[];
  onUpdateDeliveryCharges: (config: DeliveryChargeConfig) => void;
  onAssignLocalStaff: (orderId: string, staffId: string) => void;
  onUpdateOrderStatus: (
    orderId: string,
    status: LocalOrderStatus | CourierOrderStatus,
  ) => void;
  onUpdateCourierInfo: (
    orderId: string,
    courierPartner: string,
    trackingCode: string,
  ) => void;
  onUpdateModerationStatus: (listingId: string, status: ModerationStatus) => void;
  onToggleFeaturedAd: (listingId: string) => void;
  onToggleListingStatus: (listingId: string) => void;
  onUpdateSellerVerification: (
    listingId: string,
    level: SellerVerificationLevel,
  ) => void;
  onDismissListingReports: (listingId: string) => void;
  onDeleteUsedListing: (listingId: string) => void;
  onBackToStorefront: () => void;
}

type AdminTab = 'orders' | 'charges' | 'moderation';
type MethodFilter = 'All' | DeliveryMethodType;
type ModFilter = 'All' | 'Reported' | ModerationStatus;

const LOCAL_STATUSES: LocalOrderStatus[] = [
  'Pending Assignment',
  'Assigned to Rider',
  'Out for Delivery',
  'Delivered',
];

const COURIER_STATUSES: CourierOrderStatus[] = [
  'Awaiting Courier Handover',
  'Handed to Courier',
  'In Transit',
  'Delivered',
];

export function AdminOrdersView({
  orders,
  deliveryCharges,
  usedListings,
  onUpdateDeliveryCharges,
  onAssignLocalStaff,
  onUpdateOrderStatus,
  onUpdateCourierInfo,
  onUpdateModerationStatus,
  onToggleFeaturedAd,
  onToggleListingStatus,
  onUpdateSellerVerification,
  onDismissListingReports,
  onDeleteUsedListing,
  onBackToStorefront,
}: AdminOrdersViewProps) {
  const { lang, t } = useLanguage();
  const ad = t.admin;

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [modFilter, setModFilter] = useState<ModFilter>('All');

  const [draftCharges, setDraftCharges] =
    useState<DeliveryChargeConfig>(deliveryCharges);
  const [chargesSavedMsg, setChargesSavedMsg] = useState(false);

  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>({});

  const filteredOrders = orders.filter((order) => {
    const matchesMethod =
      methodFilter === 'All' || order.deliveryMethod === methodFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.district.toLowerCase().includes(q) ||
      order.upazila.toLowerCase().includes(q) ||
      (order.courierTrackingCode ?? '').toLowerCase().includes(q);
    return matchesMethod && matchesSearch;
  });

  const cumillaOrdersCount = orders.filter(
    (o) => o.deliveryMethod === BRAND_CONFIG.ownDeliveryMethodKey,
  ).length;
  const courierOrdersCount = orders.filter(
    (o) => o.deliveryMethod === 'Courier Delivery',
  ).length;
  const pendingActionCount = orders.filter(
    (o) =>
      o.status === 'Pending Assignment' ||
      o.status === 'Awaiting Courier Handover',
  ).length;

  const pendingModCount = usedListings.filter(
    (l) => l.moderationStatus === 'Pending Review',
  ).length;
  const reportedAdsCount = usedListings.filter(
    (l) => l.reports.length > 0,
  ).length;
  const liveUsedCount = usedListings.filter(
    (l) => l.moderationStatus === 'Approved',
  ).length;
  const attentionModCount = usedListings.filter(
    (l) => l.moderationStatus === 'Pending Review' || l.reports.length > 0,
  ).length;

  const filteredModListings = usedListings.filter((item) => {
    if (modFilter === 'All') return true;
    if (modFilter === 'Reported') return item.reports.length > 0;
    return item.moderationStatus === modFilter;
  });

  const handleSaveCharges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDeliveryCharges({
      cumillaSameDayFee: Math.max(0, Number(draftCharges.cumillaSameDayFee) || 0),
      cumillaNextDayFee: Math.max(0, Number(draftCharges.cumillaNextDayFee) || 0),
      outsideCumillaCourierFee: Math.max(
        0,
        Number(draftCharges.outsideCumillaCourierFee) || 0,
      ),
      enableCumillaFreeThreshold: draftCharges.enableCumillaFreeThreshold,
      cumillaFreeThresholdAmount: Math.max(
        0,
        Number(draftCharges.cumillaFreeThresholdAmount) || 0,
      ),
    });
    setChargesSavedMsg(true);
    window.setTimeout(() => setChargesSavedMsg(false), 2400);
  };

  const handleResetCharges = () => {
    setDraftCharges(DEFAULT_DELIVERY_CHARGES);
    onUpdateDeliveryCharges(DEFAULT_DELIVERY_CHARGES);
    setChargesSavedMsg(true);
    window.setTimeout(() => setChargesSavedMsg(false), 2400);
  };

  const generateDemoTracking = (orderId: string, partnerName: string) => {
    const prefix = partnerName.slice(0, 2).toUpperCase();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const code = `DEMO-${prefix}-${randomDigits}`;
    setTrackingDrafts((prev) => ({ ...prev, [orderId]: code }));
    onUpdateCourierInfo(orderId, partnerName, code);
  };

  return (
    <section className="py-8 sm:py-10 bg-[#FAFAFA] min-h-[calc(100vh-140px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Console Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              {ad.eyebrow}
            </p>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {ad.headline}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{ad.subtext}</p>
          </div>

          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-2 h-10 px-4 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{ad.backBtn}</span>
          </button>
        </div>

        {/* KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">{ad.kpiOrders}</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {formatNumber(orders.length, lang)}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">
              {ad.kpiOwnDelivery}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-emerald-700 tabular-nums">
              {formatNumber(cumillaOrdersCount, lang)}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">{ad.kpiCourier}</p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900 tabular-nums">
              {formatNumber(courierOrdersCount, lang)}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">{ad.kpiPending}</p>
            <p className="mt-1 font-display text-2xl font-bold text-amber-700 tabular-nums">
              {formatNumber(pendingActionCount, lang)}
            </p>
          </div>
        </div>

        {/* Workspace Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap p-1 bg-slate-200/70 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" aria-hidden="true" />
              <span>
                {ad.tabOrders} ({formatNumber(orders.length, lang)})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('charges')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'charges'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings2 className="w-4 h-4" aria-hidden="true" />
              <span>{ad.tabCharges}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('moderation')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>
                {ad.tabModeration} ({formatNumber(attentionModCount, lang)})
              </span>
            </button>
          </div>
        </div>

        {activeTab === 'orders' ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Filter & Search Toolbar */}
            <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    'All',
                    BRAND_CONFIG.ownDeliveryMethodKey,
                    'Courier Delivery',
                  ] as MethodFilter[]
                ).map((filter) => {
                  const active = methodFilter === filter;
                  const label =
                    filter === 'All'
                      ? ad.allOrders
                      : translateDeliveryMethod(filter, lang);
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setMethodFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-72">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={ad.searchPlaceholder}
                  className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  {ad.noOrdersMatch}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMethodFilter('All');
                    setSearchTerm('');
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg cursor-pointer"
                >
                  {ad.resetFilters}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {filteredOrders.map((order) => {
                  const isLocal =
                    order.deliveryMethod === BRAND_CONFIG.ownDeliveryMethodKey;
                  const currentTracking =
                    trackingDrafts[order.id] ?? order.courierTrackingCode ?? '';
                  const currentPartner =
                    order.courierPartner ?? DEMO_COURIER_PARTNERS[0].name;

                  return (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
                    >
                      {/* Column 1: Order ID, Customer & Address */}
                      <div className="lg:col-span-4 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                          <span className="font-mono font-bold text-slate-900">
                            #{order.id}
                          </span>
                          <span>·</span>
                          <span>{order.createdAt}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {order.customerName}{' '}
                          <span className="font-normal text-xs text-slate-500 tabular-nums">
                            ({order.phone})
                          </span>
                        </p>
                        <p className="text-xs text-slate-600">
                          {order.fullAddress}
                        </p>
                        <p className="text-xs font-medium text-slate-700">
                          {order.upazila}, {translateDistrict(order.district, lang)} (
                          {translateDivision(order.division, lang)})
                        </p>
                      </div>

                      {/* Column 2: Items & Pricing Breakdown */}
                      <div className="lg:col-span-3 space-y-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {formatNumber(order.itemCount, lang)}{' '}
                          {order.itemCount === 1
                            ? ad.itemSingular
                            : ad.itemsPlural}{' '}
                          · COD
                        </p>
                        <p className="text-xs text-slate-700 line-clamp-2">
                          {order.itemsSummary}
                        </p>
                        <div className="pt-1 text-xs text-slate-600 space-y-0.5 tabular-nums">
                          <div>
                            {ad.subtotal}: {formatBDT(order.subtotal, lang)} ·{' '}
                            {ad.delivery}:{' '}
                            {order.deliveryCharge === 0
                              ? ad.free
                              : formatBDT(order.deliveryCharge, lang)}
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {ad.total}: {formatBDT(order.totalAmount, lang)}
                          </div>
                        </div>
                      </div>

                      {/* Column 3: Delivery Method & Status */}
                      <div className="lg:col-span-2 space-y-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {ad.deliveryMethod}
                          </p>
                          <p
                            className={`mt-0.5 text-xs font-bold flex items-center gap-1.5 ${
                              isLocal ? 'text-emerald-700' : 'text-slate-900'
                            }`}
                          >
                            {isLocal ? (
                              <UserCheck className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <Truck className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span>
                              {translateDeliveryMethod(order.deliveryMethod, lang)}
                            </span>
                          </p>
                          {isLocal && order.localSpeed && (
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {order.localSpeed === 'same-day'
                                ? ad.sameDayDispatch
                                : ad.nextDayDispatch}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            {ad.orderStatus}
                          </label>
                          <select
                            aria-label={`Order status for ${order.id}`}
                            value={order.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(
                                order.id,
                                e.target.value as
                                  | LocalOrderStatus
                                  | CourierOrderStatus,
                              )
                            }
                            className={`w-full h-8 px-2 text-xs font-semibold rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : order.status === 'Pending Assignment' ||
                                    order.status === 'Awaiting Courier Handover'
                                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                                  : 'bg-white border-slate-300 text-slate-800'
                            }`}
                          >
                            {(isLocal ? LOCAL_STATUSES : COURIER_STATUSES).map(
                              (st) => (
                                <option key={st} value={st}>
                                  {lang === 'bn' ? ORDER_STATUS_BN[st] : st}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Column 4: Local Rider Assignment OR Courier Tracking Management */}
                      <div className="lg:col-span-3 space-y-2">
                        {isLocal ? (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              {ad.assignStaffLabel}
                            </label>
                            <select
                              aria-label={`Assign delivery staff for ${order.id}`}
                              value={order.assignedStaffId ?? ''}
                              onChange={(e) =>
                                onAssignLocalStaff(order.id, e.target.value)
                              }
                              className="w-full h-9 px-2.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                            >
                              <option value="">{ad.selectRider}</option>
                              {CUMILLA_DELIVERY_STAFF.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                  {staff.name} ({staff.zone})
                                </option>
                              ))}
                            </select>
                            {order.assignedStaffId && (
                              <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                                {ad.assignedPrefix}{' '}
                                {
                                  CUMILLA_DELIVERY_STAFF.find(
                                    (s) => s.id === order.assignedStaffId,
                                  )?.phone
                                }
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                {ad.courierLabel}
                              </label>
                              <select
                                aria-label={`Courier partner for ${order.id}`}
                                value={currentPartner}
                                onChange={(e) =>
                                  onUpdateCourierInfo(
                                    order.id,
                                    e.target.value,
                                    currentTracking,
                                  )
                                }
                                className="w-full h-8 px-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                              >
                                {DEMO_COURIER_PARTNERS.map((partner) => (
                                  <option key={partner.id} value={partner.name}>
                                    {partner.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                                {ad.trackingLabel}
                              </label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={currentTracking}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTrackingDrafts((prev) => ({
                                      ...prev,
                                      [order.id]: val,
                                    }));
                                    onUpdateCourierInfo(
                                      order.id,
                                      currentPartner,
                                      val,
                                    );
                                  }}
                                  placeholder={ad.trackingPlaceholder}
                                  className="flex-1 min-w-0 h-8 px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    generateDemoTracking(order.id, currentPartner)
                                  }
                                  className="h-8 px-2.5 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  {ad.generateBtn}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : activeTab === 'charges' ? (
          /* Configurable Demo Delivery Charges Panel */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveCharges}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5"
            >
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {ad.chargeConfigTitle}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  {ad.chargeConfigDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {ad.sameDayFeeLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draftCharges.cumillaSameDayFee}
                    onChange={(e) =>
                      setDraftCharges((prev) => ({
                        ...prev,
                        cumillaSameDayFee: Number(e.target.value),
                      }))
                    }
                    className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {ad.nextDayFeeLabel}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={draftCharges.cumillaNextDayFee}
                    onChange={(e) =>
                      setDraftCharges((prev) => ({
                        ...prev,
                        cumillaNextDayFee: Number(e.target.value),
                      }))
                    }
                    className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {ad.courierFeeLabel}
                </label>
                <input
                  type="number"
                  min={0}
                  value={draftCharges.outsideCumillaCourierFee}
                  onChange={(e) =>
                    setDraftCharges((prev) => ({
                      ...prev,
                      outsideCumillaCourierFee: Number(e.target.value),
                    }))
                  }
                  className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftCharges.enableCumillaFreeThreshold}
                    onChange={(e) =>
                      setDraftCharges((prev) => ({
                        ...prev,
                        enableCumillaFreeThreshold: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {ad.enableFreeLabel}
                  </span>
                </label>

                {draftCharges.enableCumillaFreeThreshold && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {ad.minSubtotalLabel}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={draftCharges.cumillaFreeThresholdAmount}
                      onChange={(e) =>
                        setDraftCharges((prev) => ({
                          ...prev,
                          cumillaFreeThresholdAmount: Number(e.target.value),
                        }))
                      }
                      className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {chargesSavedMsg ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{ad.ratesApplied}</span>
                    </>
                  ) : (
                    <span>{ad.saveCharges}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetCharges}
                  className="inline-flex items-center gap-1.5 h-10 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{ad.resetDefaults}</span>
                </button>
              </div>
            </form>

            {/* Live Rate Summary Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-slate-900">
                {ad.rulesPreviewTitle}
              </h3>

              <div className="divide-y divide-slate-200 text-sm">
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-emerald-800">
                      {ad.cumillaSameDayRule}
                    </p>
                    <p className="text-xs text-slate-500">
                      {translateDeliveryMethod(
                        BRAND_CONFIG.ownDeliveryMethodKey,
                        lang,
                      )}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatBDT(deliveryCharges.cumillaSameDayFee, lang)}
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-emerald-800">
                      {ad.cumillaNextDayRule}
                    </p>
                    <p className="text-xs text-slate-500">
                      {translateDeliveryMethod(
                        BRAND_CONFIG.ownDeliveryMethodKey,
                        lang,
                      )}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatBDT(deliveryCharges.cumillaNextDayFee, lang)}
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {ad.outsideCumillaRule}
                    </p>
                    <p className="text-xs text-slate-500">{ad.courierDemoSub}</p>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatBDT(deliveryCharges.outsideCumillaCourierFee, lang)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                {deliveryCharges.enableCumillaFreeThreshold
                  ? `${ad.freeRulePrefix} ${formatBDT(deliveryCharges.cumillaFreeThresholdAmount, lang)} ${ad.freeRuleSuffix}`
                  : ad.flatRatesNote}
              </p>
            </div>
          </div>
        ) : (
          /* Used Products Admin Moderation Queue */
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">{ad.modTotalStat}</p>
                <p className="mt-1 font-display text-xl font-bold text-slate-900 tabular-nums">
                  {formatNumber(usedListings.length, lang)}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">{ad.modLiveStat}</p>
                <p className="mt-1 font-display text-xl font-bold text-emerald-700 tabular-nums">
                  {formatNumber(liveUsedCount, lang)}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">{ad.modPendingStat}</p>
                <p className="mt-1 font-display text-xl font-bold text-amber-700 tabular-nums">
                  {formatNumber(pendingModCount, lang)}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">{ad.modReportedStat}</p>
                <p className="mt-1 font-display text-xl font-bold text-red-700 tabular-nums">
                  {formatNumber(reportedAdsCount, lang)}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">
                    {ad.modTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ad.modSubtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { key: 'All', label: ad.modFilterAll },
                      { key: 'Reported', label: ad.modFilterReported },
                      { key: 'Pending Review', label: ad.modFilterPending },
                      { key: 'Approved', label: ad.modFilterApproved },
                      { key: 'Rejected', label: ad.modFilterRejected },
                    ] as { key: ModFilter; label: string }[]
                  ).map((tab) => {
                    const active = modFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setModFilter(tab.key)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {filteredModListings.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-600">
                  {ad.modNoAds}
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredModListings.map((item) => {
                    const bn = USED_DEMO_BN[item.id];
                    const title = lang === 'bn' && bn ? bn.title : item.title;
                    const seller =
                      lang === 'bn' && bn ? bn.sellerName : item.sellerName;
                    const modBadgeColor =
                      item.moderationStatus === 'Approved'
                        ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        : item.moderationStatus === 'Pending Review'
                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                          : 'text-red-800 bg-red-50 border-red-200';

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
                      >
                        <div className="lg:col-span-5 flex gap-3.5">
                          <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-zinc-100 border border-slate-200 shrink-0">
                            <ResilientImage
                              src={item.images[0]}
                              alt={title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                              {t.usedSection.usedTag}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${modBadgeColor}`}
                              >
                                {MODERATION_STATUS_LABELS[item.moderationStatus][lang]}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                                  item.listingStatus === 'Sold'
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                {LISTING_STATUS_LABELS[item.listingStatus][lang]}
                              </span>
                              {item.isFeatured && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                  <Sparkles className="w-3 h-3" />
                                  {t.usedSection.featuredText}
                                </span>
                              )}
                              <span className="text-slate-500 font-medium">
                                {USED_CONDITION_LABELS[item.condition][lang]}
                              </span>
                            </div>

                            <p className="text-sm font-bold text-slate-900 line-clamp-2">
                              {title}
                            </p>

                            <p className="text-xs text-slate-600 tabular-nums">
                              {formatBDT(item.price, lang)} · {item.upazila},{' '}
                              {translateDistrict(item.district, lang)}
                            </p>

                            <p className="text-xs text-slate-500 tabular-nums">
                              {seller} · {item.sellerPhone}
                            </p>

                            <div className="pt-1 flex items-center gap-2">
                              <label className="text-[11px] font-semibold text-slate-500">
                                {ad.modVerifyLabel}:
                              </label>
                              <select
                                aria-label={`Seller verification tier for ${item.id}`}
                                value={item.sellerVerification}
                                onChange={(e) =>
                                  onUpdateSellerVerification(
                                    item.id,
                                    e.target.value as SellerVerificationLevel,
                                  )
                                }
                                className="h-7 px-2 text-[11px] font-medium bg-white border border-slate-300 rounded text-slate-800 focus:outline-none"
                              >
                                {(
                                  [
                                    'Unverified',
                                    'Phone Verified',
                                    'NID Verified',
                                    'Trusted Merchant',
                                  ] as SellerVerificationLevel[]
                                ).map((lvl) => (
                                  <option key={lvl} value={lvl}>
                                    {SELLER_VERIFICATION_LABELS[lvl][lang]}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Buyer Reports Column */}
                        <div className="lg:col-span-4">
                          {item.reports.length > 0 ? (
                            <div className="bg-red-50/70 border border-red-200 rounded-lg p-3 space-y-1.5">
                              <p className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                                <Flag className="w-3.5 h-3.5 text-red-600" />
                                <span>
                                  {ad.modReportsTitle} (
                                  {formatNumber(item.reports.length, lang)})
                                </span>
                              </p>
                              {item.reports.map((rep) => (
                                <div
                                  key={rep.id}
                                  className="text-xs text-red-800 border-t border-red-200/70 pt-1.5"
                                >
                                  <span className="font-semibold">
                                    {REPORT_REASON_LABELS[rep.reason]?.[lang] ??
                                      rep.reason}
                                  </span>
                                  {rep.details && (
                                    <p className="text-red-700 mt-0.5">
                                      {rep.details}
                                    </p>
                                  )}
                                  <span className="block text-[10px] text-red-600/80 mt-0.5">
                                    {rep.reportedAt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 italic pt-1">
                              —
                            </p>
                          )}
                        </div>

                        {/* Admin Moderation Actions */}
                        <div className="lg:col-span-3 flex flex-wrap lg:justify-end gap-2">
                          {item.moderationStatus !== 'Approved' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateModerationStatus(item.id, 'Approved')
                              }
                              className="inline-flex items-center gap-1 h-8 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{ad.modApproveBtn}</span>
                            </button>
                          )}

                          {item.moderationStatus !== 'Rejected' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateModerationStatus(item.id, 'Rejected')
                              }
                              className="inline-flex items-center gap-1 h-8 px-3 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>{ad.modRejectBtn}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onToggleFeaturedAd(item.id)}
                            className={`inline-flex items-center gap-1 h-8 px-3 text-xs font-semibold rounded-lg border cursor-pointer ${
                              item.isFeatured
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-emerald-600'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>
                              {item.isFeatured
                                ? ad.modUnfeatureBtn
                                : ad.modFeatureBtn}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleListingStatus(item.id)}
                            className="inline-flex items-center gap-1 h-8 px-3 bg-white border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            <span>
                              {item.listingStatus === 'Sold'
                                ? ad.modMarkActiveBtn
                                : ad.modMarkSoldBtn}
                            </span>
                          </button>

                          {item.reports.length > 0 && (
                            <button
                              type="button"
                              onClick={() => onDismissListingReports(item.id)}
                              className="inline-flex items-center gap-1 h-8 px-3 bg-white border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{ad.modClearReportsBtn}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDeleteUsedListing(item.id)}
                            className="inline-flex items-center gap-1 h-8 px-3 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{ad.modDeleteBtn}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
