import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '@/types';
import { en, Translations } from '@/i18n/en';
import { id } from '@/i18n/id';
import { getSettings, saveSettings } from '@/services/storage';

const translations: Record<Language, Translations> = { en, id };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');

  useEffect(() => {
    getSettings().then((settings) => setLanguageState(settings.language));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    saveSettings({ language: lang });
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
