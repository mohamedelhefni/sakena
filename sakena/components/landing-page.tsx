"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Globe, Sparkles, Moon, Sun, BookOpen, BarChart3, Lock, Palette } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');

    const content = {
        ar: {
            title: "إنفراج",
            subtitle: "رفيقك الشخصي للصحة النفسية والعافية",
            description: "تطبيق آمن ومشفر لتتبع مزاجك، كتابة اليوميات، والعناية بصحتك النفسية مع ميزات إسلامية مميزة",
            getStarted: "ابدأ الآن",
            features: {
                title: "لماذا إنفراج؟",
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
                    }
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
            footer: "© 2024 إنفراج - رفيقك للصحة النفسية"
        },
        en: {
            title: "sakena",
            subtitle: "Your Personal Mental Health & Wellness Companion",
            description: "A secure, encrypted app for mood tracking, journaling, and mental wellness with unique Islamic features",
            getStarted: "Get Started",
            features: {
                title: "Why sakena?",
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
                        title: "Bilingual",
                        description: "Full support for Arabic and English"
                    }
                ]
            },
            security: {
                title: "Security & Privacy",
                description: "Your data is stored locally and encrypted with cutting-edge technology",
                points: [
                    "Strong data encryption",
                    "No external servers",
                    "Password protection",
                    "Full control over your data"
                ]
            },
            footer: "© 2024 sakena - Your Mental Health Companion"
        }
    };

    const currentContent = content[language];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {currentContent.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                        className="flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        {language === 'ar' ? 'English' : 'العربية'}
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <Badge variant="outline" className="mb-6 text-green-600 border-green-200">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mental Health & Wellness
                    </Badge>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                        {currentContent.subtitle}
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        {currentContent.description}
                    </p>

                    <Button
                        onClick={onGetStarted}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <Heart className="w-5 h-5 mr-2" />
                        {currentContent.getStarted}
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                        {currentContent.features.title}
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {currentContent.features.list.map((feature, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
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
