"use client";

import Link from "next/link";
import { ShieldCheck, LogIn } from "lucide-react";
import styles from "./LandingNav.module.css";

export default function LandingNav() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <Link href="/landing" className={styles.logo}>
                    <ShieldCheck size={32} />
                    <span>SaveList</span>
                </Link>
                <Link href="/auth/signin" className={styles.navButton}>
                    <LogIn size={18} />
                    <span>Sign In</span>
                </Link>
            </div>
        </nav>
    );
}
