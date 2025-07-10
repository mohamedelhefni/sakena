"use client";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://skoon.vercel.app/#webapp",
        "name": "Sakinah",
        "alternateName": "سكينة",
        "url": "https://skoon.vercel.app",
        "description": "A secure Progressive Web App for mood tracking, journaling, and mental wellness with Islamic features",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser, iOS, Android",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "Mood tracking with analytics",
          "Secure encrypted journaling",
          "Islamic features including Quran verses",
          "Offline functionality",
          "Multi-language support (Arabic, English)",
          "Data privacy and local storage"
        ],
        "screenshot": "https://skoon.vercel.app/screenshot.png",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1250"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://skoon.vercel.app/#organization",
        "name": "Sakinah Team",
        "url": "https://skoon.vercel.app",
        "logo": "https://skoon.vercel.app/icons/icon-512x512.png",
        "sameAs": [
          "https://twitter.com/SakinahApp",
          "https://github.com/sakinah-app"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://skoon.vercel.app/#website",
        "url": "https://skoon.vercel.app",
        "name": "Sakinah - Mental Health & Mood Tracker",
        "description": "Track your mood, write secure journals, and improve your mental wellness",
        "publisher": {
          "@id": "https://skoon.vercel.app/#organization"
        },
        "inLanguage": ["ar", "en"],
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://skoon.vercel.app/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "MobileApplication",
        "@id": "https://skoon.vercel.app/#mobileapp",
        "name": "Sakinah PWA",
        "alternateName": "سكينة",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "url": "https://skoon.vercel.app",
        "downloadUrl": "https://skoon.vercel.app",
        "installUrl": "https://skoon.vercel.app",
        "description": "Progressive Web App for mental health and mood tracking",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://skoon.vercel.app/#software",
        "name": "Sakinah Mental Health Tracker",
        "applicationCategory": "HealthApplication",
        "applicationSubCategory": "Mental Health",
        "operatingSystem": "Web, iOS, Android",
        "url": "https://skoon.vercel.app",
        "downloadUrl": "https://skoon.vercel.app",
        "screenshot": [
          "https://skoon.vercel.app/screenshot-1.png",
          "https://skoon.vercel.app/screenshot-2.png",
          "https://skoon.vercel.app/screenshot-3.png"
        ],
        "featureList": [
          "Mood Tracking",
          "Secure Journaling",
          "Visual Analytics",
          "Islamic Features",
          "Offline Support",
          "Data Encryption"
        ],
        "requirements": "Modern web browser with JavaScript enabled",
        "softwareVersion": "1.0.0",
        "releaseNotes": "Initial release with full mood tracking and journaling features",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
