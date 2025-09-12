
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { Language, Category, Location } from '../types';
import { UI_TRANSLATIONS, LANGUAGES } from '../constants';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translateName: (item: Category | Location) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const dir = LANGUAGES.find(lang => lang.code === language)?.dir || 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language]);

  const t = useCallback((key: string): string => {
    return UI_TRANSLATIONS[key]?.[language] || key;
  }, [language]);

  const translateName = useCallback((item: Category | Location): string => {
    return item.name[language] || item.name.en;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, translateName }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
