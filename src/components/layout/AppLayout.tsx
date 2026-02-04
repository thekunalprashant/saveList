"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import styles from "./AppLayout.module.css";
import { useStore } from "@/store/useStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { bootstrapData } = useStore();

    // Public routes that don't require authentication
    const publicRoutes = ["/auth/signin", "/landing", "/about", "/privacy", "/terms"];
    const normalizedPath = pathname?.replace(/\/$/, "") || "/";
    const isPublicRoute = publicRoutes.includes(normalizedPath);

    useEffect(() => {
        if (status === "authenticated") {
            bootstrapData();
        }
    }, [status, bootstrapData]);

    useEffect(() => {
        if (status === "unauthenticated" && !isPublicRoute) {
            router.push("/landing");
        }
    }, [status, router, pathname, isPublicRoute]);

    if (status === "loading") {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    // Allow public routes to render without sidebar/navigation
    if (isPublicRoute) {
        return <>{children}</>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
