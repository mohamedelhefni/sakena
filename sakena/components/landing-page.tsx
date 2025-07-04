"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Globe, Sparkles, Moon, Sun, BookOpen, BarChart3, Lock, Palette, Download, Smartphone, Wifi, Zap } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallApp = async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setCanInstall(false);
        }
        
        setDeferredPrompt(null);
    };

    const content = {
        ar: {
            title: "سكينة",
            subtitle: "رفيقك الشخصي للصحة النفسية والعافية",
            description: "تطبيق آمن ومشفر لتتبع مزاجك، كتابة اليوميات، والعناية بصحتك النفسية مع ميزات إسلامية مميزة",
            getStarted: "ابدأ الآن",
            features: {
                title: "لماذا سكينة ؟",
                list: [
                    {
                        icon: Heart,
                        title: "تتبع المزاج",
                        description: "راقب مزاجك اليومي مع إحصائيات مفصلة"
                    },
                    {
                        icon: BookOpen,
                        title: "اليوميات الآمنة",
                        description: "اكتب أفكارك في بيئة آمنة ومشفرة"
                    },
                    {
                        icon: BarChart3,
                        title: "إحصائيات بصرية",
                        description: "رسوم بيانية وخرائط حرارية لفهم أنماطك"
                    },
                    {
                        icon: Shield,
                        title: "الأمان أولاً",
                        description: "تشفير محلي آمن - بياناتك ملكك فقط"
                    },
                    {
                        icon: Sparkles,
                        title: "ميزات إسلامية",
                        description: "مشغل آيات قرآنية وميزات روحانية"
                    },
                    {
                        icon: Globe,
                        title: "ثنائي اللغة",
                        description: "دعم كامل للعربية والإنجليزية"
                    },
                    {
                        icon: Download,
                        title: "تطبيق ويب تقدمي",
                        description: "قابل للتثبيت مع إمكانية العمل بدون إنترنت"
                    },
                    {
                        icon: Zap,
                        title: "أداء سريع",
                        description: "تحميل فوري وتخزين ذكي"
                    }
                ]
            },
            pwa: {
                title: "تطبيق ويب تقدمي",
                subtitle: "ثبت التطبيق في جهازك واستخدمه في أي مكان",
                install: "ثبت التطبيق",
                features: [
                    "يعمل بدون إنترنت",
                    "تجربة مشابهة للتطبيقات الأصلية", 
                    "تحديثات تلقائية",
                    "سرعة عالية"
                ]
            },
            security: {
                title: "الأمان والخصوصية",
                description: "بياناتك محفوظة محلياً ومشفرة بأحدث التقنيات",
                points: [
                    "تشفير قوي للبيانات",
                    "لا توجد خوادم خارجية",
                    "حماية بكلمة مرور",
                    "تحكم كامل في بياناتك"
                ]
            },
            footer: "© 2024 سكينة - رفيقك للصحة النفسية"
        },
        en: {
            title: "Sakinah",
            subtitle: "Your Personal Mental Health & Wellness Companion",
            description: "A secure, encrypted app for mood tracking, journaling, and mental wellness with unique Islamic features",
            getStarted: "Get Started",
            features: {
                title: "Why Sakinah?",
                list: [
                    {
                        icon: Heart,
                        title: "Mood Tracking",
                        description: "Monitor your daily mood with detailed insights"
                    },
                    {
                        icon: BookOpen,
                        title: "Secure Journaling",
                        description: "Write your thoughts in a safe, encrypted environment"
                    },
                    {
                        icon: BarChart3,
                        title: "Visual Analytics",
                        description: "Charts and heatmaps to understand your patterns"
                    },
                    {
                        icon: Shield,
                        title: "Security First",
                        description: "Local encryption - your data belongs only to you"
                    },
                    {
                        icon: Sparkles,
                        title: "Islamic Features",
                        description: "Quran verse player and spiritual features"
                    },
                    {
                        icon: Globe,
                        title: "Bilingual Support",
                        description: "Full support for Arabic and English"
                    },
                    {
                        icon: Download,
                        title: "Progressive Web App",
                        description: "Installable with offline capabilities"
                    },
                    {
                        icon: Zap,
                        title: "Lightning Fast",
                        description: "Instant loading with smart caching"
                    }
                ]
            },
            pwa: {
                title: "Progressive Web App",
                subtitle: "Install on your device and use anywhere",
                install: "Install App",
                features: [
                    "Works offline",
                    "Native app experience",
                    "Automatic updates",
                    "Lightning fast"
                ]
            },
            security: {
                title: "Security & Privacy",
                description: "Your data is safely stored locally and encrypted with latest technology",
                points: [
                    "Strong data encryption",
                    "No external servers",
                    "Password protection",
                    "Full control of your data"
                ]
            },
            footer: "© 2024 Sakinah - Your Mental Health Companion"
        }
    };

    const currentContent = content[language];

    return (
        <div className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${language === 'ar' ? 'font-arabic' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {currentContent.title}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    language === 'ar'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                            >
                                العربية
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    language === 'en'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                            >
                                English
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-xl">
                        <Heart className="w-12 h-12 text-white" />
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                        {currentContent.title}
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {currentContent.subtitle}
                    </p>
                    
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {currentContent.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                            onClick={onGetStarted}
                            size="lg" 
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <Heart className="w-5 h-5 mr-2" />
                            {currentContent.getStarted}
                        </Button>
                        
                        {canInstall && (
                            <Button
                                onClick={handleInstallApp}
                                variant="outline"
                                size="lg"
                                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                {currentContent.pwa.install}
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* PWA Features Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
                    <CardHeader className="text-center pb-8">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                            <Smartphone className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-3xl mb-4">{currentContent.pwa.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                            {currentContent.pwa.subtitle}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {currentContent.pwa.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {currentContent.features.title}
                    </h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {currentContent.features.list.map((feature, index) => (
                        <Card key={index} className="text-center border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Security Section */}
            <section className="container mx-auto px-4 py-20">
                <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
                    <CardHeader className="text-center pb-8">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <CardTitle className="text-3xl mb-4">{currentContent.security.title}</CardTitle>
                        <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                            {currentContent.security.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {currentContent.security.points.map((point, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm">✓</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-12 text-center border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {currentContent.title}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{currentContent.footer}</p>
            </footer>
        </div>
    );
}
