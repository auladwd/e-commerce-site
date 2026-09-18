"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.bn;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang] = useState<Language>("bn");

  useEffect(() => {
    // বাংলা ডিফল্ট ও একমাত্র সক্রিয় ভাষা হিসেবে নিশ্চিত করা
    localStorage.setItem("preferred_lang", "bn");
  }, []);

  const setLang = () => {};
  const toggleLanguage = () => {};

  const t = translations.bn;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
