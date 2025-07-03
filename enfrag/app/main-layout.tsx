"use client";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir();
    }, [i18n, i18n.language, i18n.dir()]);

    return <>{children}</>;
}
