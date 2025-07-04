"use client";

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://sakinah-app.com/#webapp",
        "name": "Sakinah",
        "alternateName": "سكينة",
        "url": "https://sakinah-app.com",
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
        "screenshot": "https://sakinah-app.com/screenshot.png",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1250"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://sakinah-app.com/#organization",
        "name": "Sakinah Team",
        "url": "https://sakinah-app.com",
        "logo": "https://sakinah-app.com/icons/icon-512x512.png",
        "sameAs": [
          "https://twitter.com/SakinahApp",
          "https://github.com/sakinah-app"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://sakinah-app.com/#website",
        "url": "https://sakinah-app.com",
        "name": "Sakinah - Mental Health & Mood Tracker",
        "description": "Track your mood, write secure journals, and improve your mental wellness",
        "publisher": {
          "@id": "https://sakinah-app.com/#organization"
        },
        "inLanguage": ["ar", "en"],
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://sakinah-app.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "MobileApplication",
        "@id": "https://sakinah-app.com/#mobileapp",
        "name": "Sakinah PWA",
        "alternateName": "سكينة",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "url": "https://sakinah-app.com",
        "downloadUrl": "https://sakinah-app.com",
        "installUrl": "https://sakinah-app.com",
        "description": "Progressive Web App for mental health and mood tracking",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://sakinah-app.com/#software",
        "name": "Sakinah Mental Health Tracker",
        "applicationCategory": "HealthApplication",
        "applicationSubCategory": "Mental Health",
        "operatingSystem": "Web, iOS, Android",
        "url": "https://sakinah-app.com",
        "downloadUrl": "https://sakinah-app.com",
        "screenshot": [
          "https://sakinah-app.com/screenshot-1.png",
          "https://sakinah-app.com/screenshot-2.png",
          "https://sakinah-app.com/screenshot-3.png"
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
