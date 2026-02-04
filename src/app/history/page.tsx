"use client";

import { useState, useEffect } from "react";
import {
    History,
    CheckSquare,
    Target,
    Clapperboard,
    User,
    Plus,
    Check,
    TrendingUp,
    Activity as ActivityIcon
} from "lucide-react";
import styles from "./history.module.css";
import { clsx } from "clsx";

interface Activity {
    _id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: { title?: string; type?: string };
    createdAt: string;
}

export default function HistoryPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/history");
            const data = await res.json();
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    const groupActivitiesByDate = (activities: Activity[]) => {
        const groups: { [key: string]: Activity[] } = {};
        activities.forEach((activity) => {
            const date = new Date(activity.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(activity);
        });
        return groups;
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case "task_created": return <Plus size={18} />;
            case "task_completed": return <Check size={18} />;
            case "goal_created": return <Plus size={18} />;
            case "goal_completed": return <Check size={18} />;
            case "watchlist_added": return <Plus size={18} />;
            case "watchlist_finished": return <Check size={18} />;
            default: return <ActivityIcon size={18} />;
        }
    };

    const getActionText = (activity: Activity) => {
        const { action, details } = activity;
        const title = details.title || "Unknown item";

        switch (action) {
            case "task_created": return `Created task "${title}"`;
            case "task_completed": return `Completed task "${title}"`;
            case "goal_created": return `Started goal "${title}"`;
            case "goal_completed": return `Achieved goal "${title}"!`;
            case "watchlist_added": return `Added "${title}" to watchlist`;
            case "watchlist_finished": return `Watched "${title}"`;
            default: return action.replace("_", " ");
        }
    };

    const activityGroups = groupActivitiesByDate(activities);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>History</h1>
                <p style={{ color: 'var(--secondary)', marginTop: '8px' }}>Tracking your progress through time.</p>
            </header>

            {loading ? (
                <div className={styles.empty}>Loading history...</div>
            ) : Object.keys(activityGroups).length > 0 ? (
                <div className={styles.timeline}>
                    {Object.entries(activityGroups).map(([date, items]) => (
                        <div key={date} className={styles.dayGroup}>
                            <h2 className={styles.dayTitle}>{date}</h2>
                            {items.map((item) => (
                                <div key={item._id} className={styles.item}>
                                    <div className={styles.dot} />
                                    <div className={styles.card}>
                                        <div className={clsx(styles.iconWrapper, styles[item.action])}>
                                            {getActionIcon(item.action)}
                                        </div>
                                        <div className={styles.content}>
                                            <p className={styles.action}>{getActionText(item)}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                <span className={styles.details}>{item.entityType.charAt(0).toUpperCase() + item.entityType.slice(1)}</span>
                                                <span className={styles.time}>
                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <History size={64} />
                    <p>Your timeline is empty. Start doing something!</p>
                </div>
            )}
        </div>
    );
}
