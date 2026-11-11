import { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Flag,
  HandCoins,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import { REPORT_REASON_KEYS } from '../data/usedProductsData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  REPORT_REASON_LABELS,
  SELLER_VERIFICATION_LABELS,
  USED_CATEGORY_LABELS,
  USED_CONDITION_LABELS,
  USED_DEMO_BN,
  translateDistrict,
  translateDivision,
} from '../i18n/translations';
import type { UsedProductListing } from '../types/marketplace';
import { formatBDT, formatNumber } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface UsedProductModalProps {
  listing: UsedProductListing | null;
  inCartItemIds: Set<string>;
  onClose: () => void;
  onEdit: (listing: UsedProductListing) => void;
  onToggleStatus: (listingId: string) => void;
  onToggleFeatured: (listingId: string) => void;
  onDelete: (listingId: string) => void;
  onSubmitOffer: (
    listingId: string,
    offeredPrice: number,
    note: string,
  ) => void;
  onRespondOffer: (
    listingId: string,
    offerId: string,
    action: 'Accepted' | 'Declined',
  ) => void;
  onSendMessage: (
    listingId: string,
    text: string,
    asSender: 'buyer' | 'seller',
  ) => void;
  onBuyUsedItem: (listing: UsedProductListing, unitPrice?: number) => void;
  onViewSellerAds: (sellerId: string, sellerName: string) => void;
  onReport: (listingId: string, reason: string, details: string) => void;
}

export function UsedProductModal({
  listing,
  inCartItemIds,
  onClose,
  onEdit,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
  onSubmitOffer,
  onRespondOffer,
  onSendMessage,
  onBuyUsedItem,
  onViewSellerAds,
  onReport,
}: UsedProductModalProps) {
  const { lang, t } = useLanguage();
  const m = t.usedModal;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const [offerAmount, setOfferAmount] = useState('');
  const [offerNote, setOfferNote] = useState('');

  const [messageText, setMessageText] = useState('');
  const [chatRole, setChatRole] = useState<'buyer' | 'seller'>('buyer');

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string>(REPORT_REASON_KEYS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setActiveImageIdx(0);
    setPhoneRevealed(false);
    setPhoneCopied(false);
    setOfferAmount(listing ? String(Math.round(listing.price * 0.92)) : '');
    setOfferNote('');
    setMessageText('');
    setChatRole('buyer');
    setReportOpen(false);
    setReportReason(REPORT_REASON_KEYS[0]);
    setReportDetails('');
    setReportDone(false);
    setConfirmDelete(false);
  }, [listing?.id]);

  if (!listing) return null;

  const bn = USED_DEMO_BN[listing.id];
  const displayTitle = lang === 'bn' && bn ? bn.title : listing.title;
  const displayDesc = lang === 'bn' && bn ? bn.description : listing.description;
  const displaySeller = lang === 'bn' && bn ? bn.sellerName : listing.sellerName;
  const displayPosted = lang === 'bn' && bn ? bn.postedAt : listing.postedAt;

  const isSold = listing.listingStatus === 'Sold';
  const images = listing.images.length > 0 ? listing.images : [''];
  const currentImg = images[Math.min(activeImageIdx, images.length - 1)];

  const acceptedOffer = listing.offers.find((o) => o.status === 'Accepted');
  const activePurchasePrice = acceptedOffer ? acceptedOffer.offeredPrice : listing.price;
  const isInCart = inCartItemIds.has(listing.id);

  const cornerBadgeText = isSold
    ? m.soldBadge
    : listing.isFeatured
      ? m.featuredBadge
      : m.usedBadge;
  const cornerBadgeClass = isSold
    ? 'bg-slate-900 text-white'
    : listing.isFeatured
      ? 'bg-emerald-700 text-white'
      : 'bg-amber-500 text-slate-950';

  const handleCopyPhone = async () => {
    setPhoneRevealed(true);
    try {
      await navigator.clipboard.writeText(listing.sellerPhone);
    } catch {
      // Ignore clipboard failures in restricted frames
    }
    setPhoneCopied(true);
    window.setTimeout(() => setPhoneCopied(false), 2000);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSold) return;
    const numeric = Number(offerAmount);
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    onSubmitOffer(listing.id, Math.round(numeric), offerNote.trim());
    setOfferNote('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(listing.id, messageText.trim(), chatRole);
    setMessageText('');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    onReport(listing.id, reportReason, reportDetails.trim());
    setReportDone(true);
    setReportOpen(false);
    setReportDetails('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={displayTitle}
    >
      <div
        className="fixed inset-0 bg-slate-900/55 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label={m.close}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 flex items-center justify-center rounded-lg bg-white/95 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
          {/* Left Column: Multi-Image Gallery & Direct Buy + Seller Profile */}
          <div className="md:col-span-5 bg-slate-50 p-5 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-zinc-100 border border-slate-200">
              <ResilientImage
                src={currentImg}
                alt={displayTitle}
                className={`w-full h-full object-cover ${isSold ? 'grayscale-[45%]' : ''}`}
                fallbackLabel={displayTitle}
              />

              <span
                className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[11px] font-extrabold uppercase tracking-wider shadow-xs ${cornerBadgeClass}`}
              >
                {cornerBadgeText}
              </span>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((idx) =>
                        idx === 0 ? images.length - 1 : idx - 1,
                      )
                    }
                    aria-label="Previous photo"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((idx) =>
                        idx === images.length - 1 ? 0 : idx + 1,
                      )
                    }
                    aria-label="Next photo"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow hover:bg-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[11px] font-semibold tabular-nums">
                    {formatNumber(activeImageIdx + 1, lang)} /{' '}
                    {formatNumber(images.length, lang)}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={`${listing.id}-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-amber-600'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <ResilientImage
                      src={img}
                      alt={`${displayTitle} (${idx + 1})`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Profile & Contact Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {m.sellerSectionTitle}
                  </p>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{displaySeller}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {listing.sellerRating.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 font-medium text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {SELLER_VERIFICATION_LABELS[listing.sellerVerification][lang]}
                </span>
                <span>·</span>
                <span>
                  {listing.sellerType === 'Verified Shop'
                    ? m.sellerRoleShop
                    : m.sellerRoleIndividual}
                </span>
                <span>·</span>
                <span>
                  {m.memberSince} {listing.sellerMemberSince}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPhoneRevealed(true)}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>
                    {phoneRevealed ? listing.sellerPhone : m.revealCall}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-slate-300 hover:border-slate-500 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  {phoneCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{m.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{m.copyPhone}</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onViewSellerAds(listing.sellerId, displaySeller);
                  onClose();
                }}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer"
              >
                {m.viewSellerAdsBtn} →
              </button>
            </div>

            <div className="mt-auto pt-1 flex items-start gap-2 text-xs text-slate-500">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{m.safetyNote}</span>
            </div>
          </div>

          {/* Right Column: Info, Direct Buy, Negotiation, Chat Thread, Owner Controls & Report */}
          <div className="md:col-span-7 p-6 flex flex-col space-y-5">
            <div>
              <p className="text-xs font-semibold text-amber-800">
                {m.conditionLabel}:{' '}
                <span className="text-slate-900">
                  {USED_CONDITION_LABELS[listing.condition][lang]}
                </span>{' '}
                · {USED_CATEGORY_LABELS[listing.category][lang]} · {m.postedLabel}:{' '}
                {displayPosted}
              </p>

              <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {displayTitle}
              </h2>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-baseline gap-2.5 tabular-nums">
                  <span
                    className={`text-2xl font-bold ${
                      isSold ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                  >
                    {formatBDT(listing.price, lang)}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    ·{' '}
                    {listing.negotiable
                      ? t.usedSection.negotiable
                      : t.usedSection.fixedPrice}
                  </span>
                </div>

                {!isSold && listing.moderationStatus === 'Approved' && (
                  <button
                    type="button"
                    onClick={() => onBuyUsedItem(listing, activePurchasePrice)}
                    className={`inline-flex items-center gap-1.5 h-10 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                      isInCart
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{m.alreadyInCartBtn}</span>
                      </>
                    ) : acceptedOffer ? (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {m.buyAtOfferBtn} ({formatBDT(activePurchasePrice, lang)})
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{m.buyNowBtn}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isSold && (
                <div className="mt-3 p-3 bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-800">
                  {m.soldBanner}
                </div>
              )}

              <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {listing.areaDetail ? `${listing.areaDetail}, ` : ''}
                  {listing.upazila}, {translateDistrict(listing.district, lang)} (
                  {translateDivision(listing.division, lang)})
                </span>
              </div>
            </div>

            <div className="py-3 border-y border-slate-200 text-sm text-slate-700 leading-relaxed">
              {displayDesc}
            </div>

            {/* Interactive Price Negotiation & Offers */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <HandCoins className="w-4 h-4 text-amber-700" />
                  <span>{m.negotiationTitle}</span>
                </h3>
                {!isSold && listing.negotiable && (
                  <div className="flex items-center gap-1">
                    {[0.95, 0.9, 0.85].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() =>
                          setOfferAmount(String(Math.round(listing.price * pct)))
                        }
                        className="px-2 py-0.5 text-[11px] font-semibold bg-white border border-amber-300 text-amber-900 rounded hover:bg-amber-100 cursor-pointer tabular-nums"
                      >
                        -{Math.round((1 - pct) * 100)}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {listing.offers.length > 0 && (
                <div className="space-y-2">
                  {listing.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 tabular-nums">
                          {offer.buyerName} → {formatBDT(offer.offeredPrice, lang)}
                        </div>
                        {offer.note && (
                          <p className="text-slate-600 mt-0.5">{offer.note}</p>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {offer.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            offer.status === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.status === 'Declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {offer.status === 'Accepted'
                            ? m.offerAcceptedStatus
                            : offer.status === 'Declined'
                              ? m.offerDeclinedStatus
                              : m.offerPendingStatus}
                        </span>

                        {listing.isUserOwned && offer.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                onRespondOffer(listing.id, offer.id, 'Accepted')
                              }
                              className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold cursor-pointer"
                            >
                              {m.acceptOfferBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onRespondOffer(listing.id, offer.id, 'Declined')
                              }
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                            >
                              {m.declineOfferBtn}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSold && (
                <form onSubmit={handleOfferSubmit} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={1}
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={m.offerInputPlaceholder}
                      className="h-9 px-3 text-xs tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                    <input
                      type="text"
                      value={offerNote}
                      onChange={(e) => setOfferNote(e.target.value)}
                      placeholder={m.offerNotePlaceholder}
                      className="h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <HandCoins className="w-3.5 h-3.5" />
                    <span>{m.submitOfferBtn}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Buyer-Seller Messaging Thread */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-slate-700" />
                  <span>{m.chatTitle}</span>
                </h3>
                {listing.isUserOwned && (
                  <div className="inline-flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setChatRole('buyer')}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        chatRole === 'buyer'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatRole('seller')}
                      className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                        chatRole === 'seller'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      Seller Reply
                    </button>
                  </div>
                )}
              </div>

              {listing.messages.length === 0 ? (
                <p className="text-xs text-slate-500">{m.noMessagesYet}</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {listing.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg text-xs ${
                        msg.sender === 'seller'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 ml-4'
                          : 'bg-white border border-slate-200 text-slate-800 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] font-semibold text-slate-500 mb-0.5">
                        <span>{msg.senderName}</span>
                        <span>{msg.sentAt}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {[m.quickQ1, m.quickQ2, m.quickQ3].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setMessageText(q)}
                      className="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={m.messagePlaceholder}
                    className="flex-1 min-w-0 h-9 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{m.sendMsgBtn}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Owner Management Actions & Buyer Report */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
              {listing.isUserOwned && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(listing.id)}
                    className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-lg border cursor-pointer ${
                      isSold
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-white border-slate-300 text-slate-900 hover:border-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isSold ? m.relistBtn : m.markSoldBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleFeatured(listing.id)}
                    className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-lg border cursor-pointer ${
                      listing.isFeatured
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-emerald-600'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {listing.isFeatured ? m.unfeatureBtn : m.featureBtn}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(listing);
                    }}
                    className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-slate-300 hover:border-slate-900 text-slate-900 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{m.editBtn}</span>
                  </button>

                  {confirmDelete ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(listing.id);
                          onClose();
                        }}
                        className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        {t.usedSection.confirmDelete}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="h-9 px-3 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        {t.usedSection.cancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="inline-flex items-center gap-1.5 h-9 px-3 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{m.deleteBtn}</span>
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setReportOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-700 cursor-pointer ml-auto"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{m.reportTrigger}</span>
              </button>
            </div>

            {reportDone && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-900">
                {m.reportSubmittedNotice}
              </div>
            )}

            {reportOpen && (
              <form
                onSubmit={handleSubmitReport}
                className="bg-red-50/60 border border-red-200 rounded-xl p-4 space-y-3"
              >
                <p className="text-xs font-bold text-red-900">{m.reportTitle}</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {m.reportReasonLabel}
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none"
                  >
                    {REPORT_REASON_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {REPORT_REASON_LABELS[key][lang]}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder={m.reportDetailsPlaceholder}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg resize-none focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="h-8 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg cursor-pointer"
                  >
                    {t.usedSection.cancel}
                  </button>
                  <button
                    type="submit"
                    className="h-8 px-3.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                  >
                    {m.submitReportBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
