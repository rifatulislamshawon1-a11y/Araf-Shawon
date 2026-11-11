import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  BRAND_CONFIG,
  getBrandName,
  type AppLanguage,
} from '../config/brand';
import { UI_TEXT } from './translations';

interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (nextLang: AppLanguage) => void;
  t: (typeof UI_TEXT)[AppLanguage];
  brandName: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(BRAND_CONFIG.storageLangKey);
    if (saved === 'bn' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>(readInitialLanguage);

  const setLang = (nextLang: AppLanguage) => {
    setLangState(nextLang);
    try {
      window.localStorage.setItem(BRAND_CONFIG.storageLangKey, nextLang);
    } catch {
      // Ignore storage write errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI_TEXT[lang].pageTitle;
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: UI_TEXT[lang],
    brandName: getBrandName(lang),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside a LanguageProvider');
  }
  return ctx;
}
