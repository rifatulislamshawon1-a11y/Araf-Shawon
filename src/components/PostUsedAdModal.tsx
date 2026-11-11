import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import {
  BANGLADESH_DIVISIONS,
  getDistrictsForDivision,
  getUpazilasForDistrict,
} from '../data/bangladeshLocations';
import {
  USED_CATEGORIES,
  USED_CONDITIONS,
  USED_PRESET_IMAGES,
} from '../data/usedProductsData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LISTING_STATUS_LABELS,
  USED_CATEGORY_LABELS,
  USED_CONDITION_LABELS,
  translateDistrict,
  translateDivision,
} from '../i18n/translations';
import type {
  ListingStatus,
  UsedCategory,
  UsedCondition,
  UsedProductListing,
} from '../types/marketplace';
import { ResilientImage } from './ResilientImage';

interface PostUsedAdModalProps {
  isOpen: boolean;
  editingListing: UsedProductListing | null;
  onClose: () => void;
  onSaveListing: (listing: UsedProductListing, isEdit: boolean) => void;
}

export function PostUsedAdModal({
  isOpen,
  editingListing,
  onClose,
  onSaveListing,
}: PostUsedAdModalProps) {
  const { lang, t } = useLanguage();
  const p = t.postAdModal;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<UsedCategory>('used-computers');
  const [condition, setCondition] = useState<UsedCondition>('Used');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [listingStatus, setListingStatus] = useState<ListingStatus>('Active');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([USED_PRESET_IMAGES[0].src]);

  const [division, setDivision] = useState('Chattogram');
  const [district, setDistrict] = useState('Cumilla');
  const [upazila, setUpazila] = useState('Cumilla Adarsha Sadar');
  const [areaDetail, setAreaDetail] = useState('');

  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerType, setSellerType] = useState<'Individual' | 'Verified Shop'>(
    'Individual',
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (editingListing) {
      setTitle(editingListing.title);
      setCategory(editingListing.category);
      setCondition(editingListing.condition);
      setPrice(String(editingListing.price));
      setNegotiable(editingListing.negotiable);
      setIsFeatured(editingListing.isFeatured);
      setListingStatus(editingListing.listingStatus);
      setDescription(editingListing.description);
      setImages(
        editingListing.images.length > 0
          ? editingListing.images
          : [USED_PRESET_IMAGES[0].src],
      );
      setDivision(editingListing.division);
      setDistrict(editingListing.district);
      setUpazila(editingListing.upazila);
      setAreaDetail(editingListing.areaDetail);
      setSellerName(editingListing.sellerName);
      setSellerPhone(editingListing.sellerPhone);
      setSellerType(editingListing.sellerType);
    } else {
      setTitle('');
      setCategory('used-computers');
      setCondition('Used');
      setPrice('');
      setNegotiable(true);
      setIsFeatured(false);
      setListingStatus('Active');
      setDescription('');
      setImages([USED_PRESET_IMAGES[1].src, USED_PRESET_IMAGES[2].src]);
      setDivision('Chattogram');
      setDistrict('Cumilla');
      setUpazila('Cumilla Adarsha Sadar');
      setAreaDetail('');
      setSellerName('');
      setSellerPhone('');
      setSellerType('Individual');
    }
  }, [editingListing, isOpen]);

  if (!isOpen) return null;

  const districts = getDistrictsForDivision(division);
  const upazilas = getUpazilasForDistrict(division, district);

  const handleDivisionChange = (nextDiv: string) => {
    setDivision(nextDiv);
    const nextDistricts = getDistrictsForDivision(nextDiv);
    const firstDist = nextDistricts[0]?.name ?? '';
    setDistrict(firstDist);
    const nextUpazilas = getUpazilasForDistrict(nextDiv, firstDist);
    setUpazila(nextUpazilas[0] ?? '');
  };

  const handleDistrictChange = (nextDist: string) => {
    setDistrict(nextDist);
    const nextUpazilas = getUpazilasForDistrict(division, nextDist);
    setUpazila(nextUpazilas[0] ?? '');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files)
      .slice(0, Math.max(0, 6 - images.length))
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setImages((prev) =>
              prev.length < 6 ? [...prev, reader.result as string] : prev,
            );
          }
        };
        reader.readAsDataURL(file);
      });
    e.target.value = '';
  };

  const handleTogglePresetImage = (src: string) => {
    setImages((prev) => {
      if (prev.includes(src)) {
        return prev.length > 1 ? prev.filter((item) => item !== src) : prev;
      }
      if (prev.length >= 6) return prev;
      return [...prev, src];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (
      !title.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0 ||
      !description.trim() ||
      !sellerName.trim() ||
      !sellerPhone.trim() ||
      images.length === 0
    ) {
      setError(p.errorRequired);
      return;
    }

    const cleanSellerName = sellerName.trim();

    const nextListing: UsedProductListing = {
      id: editingListing
        ? editingListing.id
        : `used-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      description: description.trim(),
      price: Math.round(numericPrice),
      negotiable,
      category,
      condition,
      images,
      division,
      district,
      upazila,
      areaDetail: areaDetail.trim() || upazila,
      sellerId: editingListing
        ? editingListing.sellerId
        : `seller-${cleanSellerName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'member'}`,
      sellerName: cleanSellerName,
      sellerType,
      sellerPhone: sellerPhone.trim(),
      sellerVerification: editingListing
        ? editingListing.sellerVerification
        : sellerType === 'Verified Shop'
          ? 'Trusted Merchant'
          : 'Phone Verified',
      sellerMemberSince: editingListing
        ? editingListing.sellerMemberSince
        : String(new Date().getFullYear()),
      sellerRating: editingListing ? editingListing.sellerRating : 4.8,
      postedAt: editingListing
        ? editingListing.postedAt
        : lang === 'bn'
          ? 'এইমাত্র'
          : 'Just now',
      createdTimestamp: editingListing
        ? editingListing.createdTimestamp
        : Date.now(),
      isUserOwned: true,
      moderationStatus: editingListing
        ? editingListing.moderationStatus
        : 'Approved',
      listingStatus: editingListing ? listingStatus : 'Active',
      isFeatured,
      promotionTier: isFeatured ? 'Featured' : 'None',
      reports: editingListing ? editingListing.reports : [],
      offers: editingListing ? editingListing.offers : [],
      messages: editingListing ? editingListing.messages : [],
    };

    onSaveListing(nextListing, Boolean(editingListing));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={editingListing ? p.editTitle : p.createTitle}
    >
      <div
        className="fixed inset-0 bg-slate-900/55 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              {editingListing ? p.editTitle : p.createTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{p.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Title & Classification */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {p.titleLabel}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={p.titlePlaceholder}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {p.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as UsedCategory)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                >
                  {USED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {USED_CATEGORY_LABELS[cat][lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {p.conditionLabel}
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as UsedCondition)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                >
                  {USED_CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {USED_CONDITION_LABELS[cond][lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {p.priceLabel}
                </label>
                <input
                  type="number"
                  min={1}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="15000"
                  className="w-full h-10 px-3 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                  />
                  <span>{p.negotiableLabel}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-amber-900 font-medium">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-600"
                  />
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{p.featureOptionLabel}</span>
                </label>
              </div>

              {editingListing && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-600">
                    {p.listingStatusLabel}:
                  </label>
                  <select
                    value={listingStatus}
                    onChange={(e) =>
                      setListingStatus(e.target.value as ListingStatus)
                    }
                    className="h-8 px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-md focus:outline-none focus:border-amber-600"
                  >
                    <option value="Active">
                      {LISTING_STATUS_LABELS.Active[lang]}
                    </option>
                    <option value="Sold">
                      {LISTING_STATUS_LABELS.Sold[lang]}
                    </option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {p.descLabel}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={p.descPlaceholder}
                className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600 resize-none"
              />
            </div>
          </div>

          {/* Multi-Image Picker / Upload */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ImagePlus className="w-4 h-4 text-amber-700" />
                <span>
                  {p.imagesLabel} ({images.length}/6)
                </span>
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-300 hover:border-slate-900 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{p.uploadBtn}</span>
              </button>
            </div>

            {/* Active Image Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {images.map((img, idx) => (
                <div
                  key={`selected-img-${idx}`}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-300 bg-white group"
                >
                  <ResilientImage
                    src={img}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      aria-label={p.removeImg}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sample Demo Photos Selector */}
            <div className="pt-2 border-t border-slate-200/80">
              <p className="text-[11px] font-medium text-slate-500 mb-2">
                {p.addPresetLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {USED_PRESET_IMAGES.map((preset) => {
                  const selected = images.includes(preset.src);
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleTogglePresetImage(preset.src)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {lang === 'bn' ? preset.labelBn : preset.labelEn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {p.locationTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {p.divisionLabel}
                </label>
                <select
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div.name} value={div.name}>
                      {translateDivision(div.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {p.districtLabel}
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                >
                  {districts.map((dist) => (
                    <option key={dist.name} value={dist.name}>
                      {translateDistrict(dist.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {p.upazilaLabel}
                </label>
                <select
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                >
                  {upazilas.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="text"
              value={areaDetail}
              onChange={(e) => setAreaDetail(e.target.value)}
              placeholder={p.areaDetailPlaceholder}
              className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Seller Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {p.sellerNameLabel}
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="e.g. Tariq Hasan"
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {p.sellerPhoneLabel}
              </label>
              <input
                type="tel"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {p.sellerTypeLabel}
              </label>
              <select
                value={sellerType}
                onChange={(e) =>
                  setSellerType(e.target.value as 'Individual' | 'Verified Shop')
                }
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="Individual">{p.sellerIndividual}</option>
                <option value="Verified Shop">{p.sellerShop}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {editingListing ? p.submitSave : p.submitCreate}
          </button>
        </form>
      </div>
    </div>
  );
}
