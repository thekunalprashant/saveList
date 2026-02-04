"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
    Palette,
    Monitor,
    Trash2,
    LogOut,
    Download,
    Upload,
    Eye,
    Zap,
    Quote
} from "lucide-react";
import styles from "./settings.module.css";
import { clsx } from "clsx";
import { useState, useEffect } from "react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const [preferences, setPreferences] = useState({
        compactView: false,
        showTimestamps: true,
        animationsEnabled: true,
        motivationalQuotes: true,
    });

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            const res = await fetch("/api/user/preferences");
            const data = await res.json();
            if (data) setPreferences(data);
        } catch (error) {
            console.error("Failed to fetch preferences", error);
        }
    };

    const updatePreference = async (key: string, value: any) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);
        try {
            await fetch("/api/user/preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ preferences: newPrefs }),
            });
        } catch (error) {
            console.error("Failed to update preference", error);
        }
    };

    const themes: { id: 'light' | 'dark' | 'amoled' | 'auto'; label: string }[] = [
        { id: 'light', label: 'Light' },
        { id: 'dark', label: 'Dark' },
        { id: 'amoled', label: 'AMOLED' },
        { id: 'auto', label: 'Auto' },
    ];

    const handleExport = async () => {
        try {
            const res = await fetch("/api/user/export");
            const data = await res.json();

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `savelist-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert("Data exported successfully!");
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to export data.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you SURE you want to delete your account? This action is permanent and all your data (tasks, goals, watchlist) will be lost forever.")) return;

        try {
            const res = await fetch("/api/user/delete", { method: "DELETE" });
            if (res.ok) {
                alert("Account deleted. Turning out the lights...");
                signOut({ callbackUrl: "/auth/signin" });
            }
        } catch (error) {
            console.error("Deletion failed", error);
            alert("Failed to delete account. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p style={{ color: 'var(--secondary)', marginTop: '8px' }}>Personalize SaveList to your liking.</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Palette size={20} />
                    <span>Appearance</span>
                </h2>

                <p className={styles.label}>Theme</p>
                <div className={styles.themeGrid}>
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            className={clsx(styles.themeBtn, styles[t.id], theme === t.id && styles.active)}
                            onClick={() => setTheme(t.id)}
                        >
                            <div className={styles.themePreview} />
                            <span className={styles.themeLabel}>{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.item} style={{ marginTop: '24px' }}>
                    <div className={styles.info}>
                        <h4>Animations</h4>
                        <p>Smooth transitions across the app.</p>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={preferences.animationsEnabled}
                            onChange={(e) => updatePreference('animationsEnabled', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Monitor size={20} />
                    <span>Display</span>
                </h2>

                <div className={styles.item}>
                    <div className={styles.info}>
                        <h4>Compact View</h4>
                        <p>Show more items with less spacing.</p>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={preferences.compactView}
                            onChange={(e) => updatePreference('compactView', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.item}>
                    <div className={styles.info}>
                        <h4>Show Timestamps</h4>
                        <p>Visible creation and completion times.</p>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={preferences.showTimestamps}
                            onChange={(e) => updatePreference('showTimestamps', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <div className={styles.item}>
                    <div className={styles.info}>
                        <h4>Motivational Quotes</h4>
                        <p>Daily inspiration on your dashboard.</p>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={preferences.motivationalQuotes}
                            onChange={(e) => updatePreference('motivationalQuotes', e.target.checked)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Download size={20} />
                    <span>Data Management</span>
                </h2>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={styles.themeBtn}
                        style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
                        onClick={handleExport}
                    >
                        <Download size={18} />
                        <span>Export Data</span>
                    </button>
                    {/* <button className={styles.themeBtn} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Upload size={18} />
                        <span>Import Data</span>
                    </button> */}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <Trash2 size={20} color="var(--error)" />
                    <span style={{ color: 'var(--error)' }}>Danger Zone</span>
                </h2>

                <div className={styles.item}>
                    <div className={styles.info}>
                        <h4>Logout from all devices</h4>
                        <p>Securely end all active sessions.</p>
                    </div>
                    <button className={styles.actionBtn} onClick={() => signOut()}>
                        <LogOut size={18} />
                    </button>
                </div>

                <button className={styles.dangerBtn} onClick={handleDeleteAccount}>
                    Delete Account Permanently
                </button>
            </section>
        </div>
    );
}
