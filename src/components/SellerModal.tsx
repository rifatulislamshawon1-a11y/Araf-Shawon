import { useState } from 'react';
import { CheckCircle2, Store, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerModal({ isOpen, onClose }: SellerModalProps) {
  const { lang, t } = useLanguage();
  const s = t.sellerModal;

  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessTypeIdx, setBusinessTypeIdx] = useState(0);
  const [district, setDistrict] = useState('Cumilla Sadar');
  const [pickupAddress, setPickupAddress] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const businessType = s.bizTypes[businessTypeIdx] ?? s.bizTypes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !ownerName.trim() || !phone.trim() || !pickupAddress.trim()) {
      setError(s.errRequired);
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError('');
    setShopName('');
    setOwnerName('');
    setPhone('');
    setPickupAddress('');
    onClose();
  };

  const areaOptions = [
    { value: 'Cumilla Sadar', en: 'Cumilla Sadar', bn: 'কুমিল্লা সদর' },
    { value: 'Kandirpar, Cumilla', en: 'Kandirpar, Cumilla', bn: 'কান্দিরপাড়, কুমিল্লা' },
    { value: 'Kotbari & Cantonment', en: 'Kotbari & Cantonment', bn: 'কোটবাড়ি ও ক্যান্টনমেন্ট' },
    { value: 'Tomsom Bridge, Cumilla', en: 'Tomsom Bridge, Cumilla', bn: 'টমছম ব্রিজ, কুমিল্লা' },
    { value: 'Laksam, Cumilla', en: 'Laksam, Cumilla', bn: 'লাকসাম, কুমিল্লা' },
    { value: 'Chouddagram, Cumilla', en: 'Chouddagram, Cumilla', bn: 'চৌদ্দগ্রাম, কুমিল্লা' },
    { value: 'Daudkandi, Cumilla', en: 'Daudkandi, Cumilla', bn: 'দাউদকান্দি, কুমিল্লা' },
    { value: 'Other Districts', en: 'Other Bangladesh Districts', bn: 'বাংলাদেশের অন্যান্য জেলা' },
  ];

  const selectedAreaLabel =
    areaOptions.find((a) => a.value === district)?.[lang] ?? district;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={handleResetAndClose}
      />

      <div className="relative z-10 w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-slate-900">
              {s.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold text-slate-900">
                {s.successTitle}
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
                <span className="font-semibold text-slate-900">{shopName}</span> ({businessType}){' '}
                {s.successBody1} {selectedAreaLabel} {s.successBody2}
              </p>

              <div className="mt-6 text-left bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{s.owner}</span>
                  <span className="font-medium text-slate-900">{ownerName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{s.contact}</span>
                  <span className="font-medium text-slate-900 tabular-nums">{phone}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">{s.pickupLocation}</span>
                  <span className="font-medium text-slate-900 text-right">{pickupAddress}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="mt-6 w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {s.returnBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600">{s.intro}</p>

              {error && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {s.shopName}
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={s.shopPlaceholder}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {s.ownerName}
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder={s.ownerPlaceholder}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {s.category}
                  </label>
                  <select
                    value={businessTypeIdx}
                    onChange={(e) => setBusinessTypeIdx(Number(e.target.value))}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  >
                    {s.bizTypes.map((label, idx) => (
                      <option key={label} value={idx}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {s.area}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  >
                    {areaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt[lang]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {s.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 18XX-XXXXXX"
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {s.pickupAddress}
                </label>
                <textarea
                  rows={2}
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder={s.pickupPlaceholder}
                  className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {s.submitBtn}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
