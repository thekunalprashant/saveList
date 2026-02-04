"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    Clapperboard,
    History,
    Settings,
    LogOut,
    ShieldCheck
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { clsx } from "clsx";

const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Watchlist", href: "/watchlist", icon: Clapperboard },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <ShieldCheck size={28} />
                <span>SaveList</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.navLink, isActive && styles.active)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.userSection}>
                <div className={styles.userAvatar}>
                    {session?.user?.image ? (
                        <img src={session.user.image} alt={session.user.name || "User"} />
                    ) : (
                        <div className={styles.avatarPlaceholder} />
                    )}
                </div>
                <div className={styles.userInfo}>
                    <p className={styles.userName}>{session?.user?.name || "User Name"}</p>
                    <p className={styles.userEmail}>{session?.user?.email || "user@example.com"}</p>
                </div>
                <button
                    className={styles.logoutBtn}
                    onClick={() => signOut()}
                    title="Log Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </aside>
    );
}
