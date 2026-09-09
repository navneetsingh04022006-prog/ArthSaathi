import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations.js';

const LanguageContext = createContext();

const STORAGE_KEY = 'arthsaathi_lang';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'hi' ? 'hi' : 'en';
    } catch (_e) {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    const validLang = lang === 'hi' ? 'hi' : 'en';
    setLanguageState(validLang);
    try {
      localStorage.setItem(STORAGE_KEY, validLang);
    } catch (_e) {
      // Storage unavailable
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    const dict = translations[language] || translations.en;
    return dict[key] !== undefined ? dict[key] : (translations.en[key] || key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
