"use client";

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'app';
  locale?: 'ar' | 'en';
}

export function SEO({
  title = "Sakinah - Mental Health & Mood Tracker",
  description = "A secure Progressive Web App for mood tracking, journaling, and mental wellness with Islamic features",
  keywords = [],
  image = "/og-image.png",
  url = "https://sakinah-app.com",
  type = "website",
  locale = "ar"
}: SEOProps) {
  const fullTitle = title.includes("Sakinah") ? title : `${title} | Sakinah`;
  const defaultKeywords = [
    "mood tracker",
    "mental health", 
    "journal",
    "islamic",
    "wellbeing",
    "progressive web app",
    "encrypted",
    "privacy"
  ];
  const allKeywords = [...defaultKeywords, ...keywords];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": fullTitle,
    "description": description,
    "url": url,
    "inLanguage": locale,
    "isPartOf": {
      "@type": "WebSite", 
      "name": "Sakinah",
      "url": "https://sakinah-app.com"
    },
    "about": {
      "@type": "MedicalWebPage",
      "mainContentOfPage": {
        "@type": "WebPageElement",
        "description": "Mental health and mood tracking application"
      },
      "medicalAudience": {
        "@type": "MedicalAudience",
        "audienceType": "General Public"
      }
    }
  };

  return (
    <Head>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(", ")} />
      
      {/* Language and direction */}
      <meta httpEquiv="Content-Language" content={locale} />
      <meta name="language" content={locale} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://sakinah-app.com${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={locale === "ar" ? "ar_SA" : "en_US"} />
      <meta property="og:site_name" content="Sakinah" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://sakinah-app.com${image}`} />
      
      {/* Additional meta tags */}
      <meta name="author" content="Sakinah Team" />
      <meta name="robots" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
    </Head>
  );
}
