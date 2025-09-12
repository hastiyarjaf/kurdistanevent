
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Language, User } from '../types';
import { getTranslations, updateUserLanguage } from '../services/api';
import { useAuth } from '../hooks/useAuth';

type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
  t: (key: string, params?: Record<string, string | number>) => string;
  isInitialized: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && ['en', 'ar', 'ku'].includes(storedLang)) {
        return storedLang as Language;
    }
    return 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  const [translations, setTranslations] = useState<Translations>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchAndSetTranslations = async (lang: Language) => {
      try {
        const fetchedTranslations = await getTranslations(lang);
        setTranslations(fetchedTranslations);
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        setTranslations({}); // Fallback to empty
      } finally {
        setIsInitialized(true);
      }
    };

    fetchAndSetTranslations(language);

    // Set document direction
    const dir = (language === 'ar' || language === 'ku') ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    
  }, [language]);

  // Sync language with authenticated user's preference
  useEffect(() => {
    const userLang = user?.language;
    if (userLang && userLang !== language) {
      setLanguageState(userLang);
      localStorage.setItem('language', userLang);
    }
  }, [user]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    if (user) {
        updateUserLanguage(user.id, lang)
            .then(updateUser)
            .catch(err => console.error("Failed to update user language:", err));
    }
  };

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
            translation = translation.replace(`{${paramKey}}`, String(paramValue));
        });
    }
    return translation;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t, isInitialized }}>
      {!isInitialized ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : children}
    </LanguageContext.Provider>
  );
};