"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize client-side features
if (typeof window !== 'undefined') {
    i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            // This re-initializes i18n on the client with browser-specific features
            fallbackLng: 'en',
            debug: false,
            interpolation: {
                escapeValue: false,
            },
            detection: {
                order: ['localStorage', 'navigator'],
                caches: ['localStorage'],
            }
        });
}

export default function I18nProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
