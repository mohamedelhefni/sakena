import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import I18nProvider from "@/components/i18n-provider";
import { PWAFeatures } from "@/components/pwa-features";
import { StructuredData } from "@/components/structured-data";
import { OfflineAppInitializer } from "@/components/offline-app-initializer";
import { PWAInstaller } from "@/components/pwa-installer";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sakinah - Mental Health & Mood Tracker | سكينة - تطبيق الصحة النفسية",
    template: "%s | Sakinah"
  },
  description: "A beautiful, secure, and encrypted Progressive Web App for mood tracking, journaling, and mental wellness with Islamic features. Track your emotions, write private journals, and improve your mental health with advanced analytics. تطبيق آمن ومشفر لتتبع المزاج والصحة النفسية مع الميزات الإسلامية",
  keywords: [
    "mood tracker",
    "mental health",
    "depression",
    "anxiety",
    "wellbeing",
    "journal",
    "diary",
    "islamic",
    "quran",
    "mindfulness",
    "emotions",
    "psychology",
    "therapy",
    "progressive web app",
    "PWA",
    "encrypted",
    "privacy",
    "secure",
    "تتبع المزاج",
    "الصحة النفسية",
    "اليوميات",
    "القرآن الكريم",
    "الإسلام",
    "العافية النفسية"
  ],
  authors: [{ name: "Sakinah Team", url: "https://sakinah-app.com" }],
  creator: "Sakinah Team",
  publisher: "Sakinah Team",
  category: "Health & Fitness",
  classification: "Mental Health Application",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://sakinah-app.com",
    languages: {
      'ar': 'https://sakinah-app.com/ar',
      'en': 'https://sakinah-app.com/en',
    },
  },
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icons/icon-192x192.png",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sakinah",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  applicationName: "Sakinah",
  referrer: "origin-when-cross-origin",
  appLinks: {
    web: {
      url: "https://sakinah-app.com",
      should_fallback: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    url: "https://sakinah-app.com",
    siteName: "Sakinah - Mental Health & Mood Tracker",
    title: "Sakinah - Your Personal Mental Health Companion | سكينة",
    description: "Track your mood, write secure journals, and improve your mental wellness with our beautiful Progressive Web App. Features Islamic content including Quran verses and spiritual guidance.",
    images: [
      {
        url: "https://sakinah-app.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sakinah - Mental Health & Mood Tracker",
        type: "image/png",
      },
      {
        url: "https://sakinah-app.com/og-image-ar.png",
        width: 1200,
        height: 630,
        alt: "سكينة - تطبيق الصحة النفسية وتتبع المزاج",
        type: "image/png",
      },
    ],
    videos: [
      {
        url: "https://sakinah-app.com/demo-video.mp4",
        width: 1280,
        height: 720,
        type: "video/mp4",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SakinahApp",
    creator: "@SakinahApp",
    title: "Sakinah - Mental Health & Mood Tracker",
    description: "A secure Progressive Web App for mood tracking and mental wellness with Islamic features",
    images: ["https://sakinah-app.com/twitter-image.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#16a34a",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#16a34a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Sakinah" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sakinah" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#16a34a" />

        {/* App Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#16a34a" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <Analytics />
            <OfflineAppInitializer />
            <StructuredData />
            <PWAFeatures />
            <PWAInstaller />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
