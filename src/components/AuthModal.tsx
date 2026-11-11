import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { AuthUser } from '../types/marketplace';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
}

export function AuthModal({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { lang, t } = useLanguage();
  const a = t.authModal;

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [district, setDistrict] = useState('Cumilla Sadar');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const areaOptions = [
    { value: 'Cumilla Sadar', en: 'Cumilla Sadar', bn: 'কুমিল্লা সদর' },
    { value: 'Kandirpar', en: 'Kandirpar, Cumilla', bn: 'কান্দিরপাড়, কুমিল্লা' },
    { value: 'Kotbari & Cantonment', en: 'Kotbari & Cantonment', bn: 'কোটবাড়ি ও ক্যান্টনমেন্ট' },
    { value: 'Tomsom Bridge', en: 'Tomsom Bridge, Cumilla', bn: 'টমছম ব্রিজ, কুমিল্লা' },
    { value: 'Laksam', en: 'Laksam, Cumilla', bn: 'লাকসাম, কুমিল্লা' },
    { value: 'Chouddagram', en: 'Chouddagram, Cumilla', bn: 'চৌদ্দগ্রাম, কুমিল্লা' },
    { value: 'Other Districts', en: 'Other Bangladesh Districts', bn: 'বাংলাদেশের অন্যান্য জেলা' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim() || !password.trim()) {
      setError(a.errEmpty);
      return;
    }
    if (mode === 'signup' && !fullName.trim()) {
      setError(a.errName);
      return;
    }

    const displayName =
      mode === 'signup'
        ? fullName.trim()
        : phoneOrEmail.includes('@')
          ? phoneOrEmail.split('@')[0]
          : lang === 'bn'
            ? 'রফিকুল ইসলাম'
            : 'Rafiqul Islam';

    onSuccess({
      name: displayName,
      phoneOrEmail: phoneOrEmail.trim(),
      district,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? a.loginTitle : a.signupTitle}
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">
            {mode === 'login' ? a.loginTitle : a.signupTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`h-9 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {a.loginTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`h-9 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {a.signupTab}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {a.fullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={a.namePlaceholder}
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {a.phoneOrEmail}
              </label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder={a.phonePlaceholder}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {a.district}
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
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {a.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.passwordPlaceholder}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {mode === 'login' ? a.loginSubmit : a.signupSubmit}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-slate-500">{a.demoNote}</p>
        </div>
      </div>
    </div>
  );
}
