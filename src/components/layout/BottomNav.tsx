"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    Clapperboard,
    Settings
} from "lucide-react";
import styles from "./BottomNav.module.css";
import { clsx } from "clsx";

const navItems = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Watchlist", href: "/watchlist", icon: Clapperboard },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.bottomNav}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(styles.navLink, isActive && styles.active)}
                    >
                        <Icon size={24} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
