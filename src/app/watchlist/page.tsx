"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatRelativeTime } from "@/utils/dateFormat";
import {
    Plus,
    Search,
    Clapperboard,
    Trash2,
    Check,
    Play,
    Film,
    Tv,
    Star
} from "lucide-react";
import styles from "./watchlist.module.css";
import { clsx } from "clsx";
import { useStore } from "@/store/useStore";

export default function WatchlistPage() {
    const { showToast } = useToast();
    const {
        watchlist: items,
        loading: storeLoading,
        fetchWatchlist,
        addWatchlistItem: storeAddItem,
        updateWatchlistItem: storeUpdateItem,
        removeWatchlistItem: storeDeleteItem
    } = useStore();

    const loading = storeLoading.watchlist;
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<'movie' | 'show'>('movie');
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    useEffect(() => {
        if (items.length === 0) {
            fetchWatchlist();
        }
    }, [items.length, fetchWatchlist]);

    const isInitialLoading = loading && items.length === 0;

    const addItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await storeAddItem({ title: newTitle, type: newType });
            setNewTitle("");
            setNewType('movie');
            setIsAdding(false);
            showToast("Added to watchlist", "success");
        } catch (error) {
            console.error("Failed to add item", error);
            showToast("Failed to add item", "error");
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await storeUpdateItem(id, { status: newStatus as any });

            if (newStatus === "finished") {
                showToast("Marked as watched!", "success");
            } else {
                showToast("Status updated", "success");
            }
        } catch (error) {
            console.error("Failed to update status", error);
            showToast("Update failed", "error");
        }
    };

    const deleteItem = async (id: string) => {
        if (!confirm("Remove from watchlist?")) return;
        try {
            await storeDeleteItem(id);
            showToast("Removed from list", "info");
        } catch (error) {
            console.error("Failed to delete item", error);
            showToast("Delete failed", "error");
        }
    };

    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
            const isTypeFilter = ["movie", "show"].includes(filter);
            const isStatusFilter = ["watching", "finished"].includes(filter);

            let matchesFilter = filter === "all";
            if (isTypeFilter) matchesFilter = item.type === filter;
            if (isStatusFilter) matchesFilter = item.status === filter;

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Watchlist</h1>
                <button
                    className="submitBtn"
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                >
                    <Plus size={18} />
                    <span>New Watch</span>
                </button>
            </header>

            <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    className={styles.searchInput}
                    placeholder="Search your watchlist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto' }}>
                {["all", "movie", "show", "watching", "finished"].map((f) => (
                    <button
                        key={f}
                        className={clsx("filterBtn", filter === f && "activeFilter")}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-full)',
                            background: filter === f ? 'var(--primary)' : 'var(--surface)',
                            color: filter === f ? 'white' : 'var(--secondary)',
                            border: '1px solid var(--border)',
                            fontSize: '14px',
                            fontWeight: '500',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <span style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: '600', marginRight: '4px', alignSelf: 'center' }}>Sort:</span>
                {(["newest", "oldest"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        style={{
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: sortBy === s ? 'var(--surface-hover)' : 'transparent',
                            color: sortBy === s ? 'var(--primary)' : 'var(--secondary)',
                            border: '1px solid ' + (sortBy === s ? 'var(--border)' : 'transparent'),
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {isAdding && (
                <div style={{ marginBottom: '32px', background: 'var(--surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', animation: 'slideDown 0.3s ease-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '700' }}>New Watch</h2>
                        <div style={{ display: 'flex', background: 'var(--surface-hover)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            {(['movie', 'show'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setNewType(t)}
                                    style={{
                                        padding: '6px 20px',
                                        borderRadius: 'var(--radius-sm)',
                                        background: newType === t ? 'var(--primary)' : 'transparent',
                                        color: newType === t ? 'white' : 'var(--secondary)',
                                        border: 'none',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        minWidth: '80px'
                                    }}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={addItem}>
                        <input
                            autoFocus
                            className={styles.searchInput}
                            placeholder={`Enter ${newType} title...`}
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ paddingLeft: '20px', marginBottom: '20px', background: 'var(--surface-hover)' }}
                        />

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                style={{
                                    padding: '10px 20px',
                                    color: 'var(--secondary)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submitBtn"
                                style={{
                                    padding: '10px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                Add to Watchlist
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isInitialLoading ? (
                <div className={styles.empty}>Loading media...</div>
            ) : filteredItems.length > 0 ? (
                <div className={styles.grid}>
                    {filteredItems.map((item) => (
                        <div key={item._id} className={styles.card} style={{ minHeight: 'auto' }}>
                            <div style={{ padding: '16px', width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span
                                            className={styles.badge}
                                            style={{
                                                position: 'static',
                                                padding: '2px 10px',
                                                fontSize: '10px',
                                                marginBottom: '8px',
                                                display: 'inline-block',
                                                background: item.type === 'movie' ? 'rgba(255, 110, 110, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                                color: item.type === 'movie' ? '#ff6b6b' : '#6366f1',
                                                backdropFilter: 'none',
                                                fontWeight: '800',
                                                borderRadius: 'var(--radius-sm)'
                                            }}
                                        >
                                            {item.type}
                                        </span>
                                        <h3 className={styles.itemTitle}>{item.title}</h3>
                                    </div>
                                    <div className={styles.actions} style={{ position: 'static', opacity: 1, display: 'flex', flexDirection: 'row', gap: '4px', transform: 'none' }}>
                                        <button className={styles.actionBtn} title="Mark as Watching" onClick={() => updateStatus(item._id, "watching")} style={{ background: 'transparent', color: 'var(--secondary)', width: '28px', height: '28px' }}>
                                            <Play size={16} />
                                        </button>
                                        <button className={styles.actionBtn} title="Mark as Finished" onClick={() => updateStatus(item._id, "finished")} style={{ background: 'transparent', color: 'var(--secondary)', width: '28px', height: '28px' }}>
                                            <Check size={16} />
                                        </button>
                                        <button className={clsx(styles.actionBtn, styles.deleteBtn)} title="Delete" onClick={() => deleteItem(item._id)} style={{ background: 'transparent', color: 'var(--secondary)', width: '28px', height: '28px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.meta} style={{ marginTop: '8px' }}>
                                    {item.year && <span>{item.year}</span>}
                                    {item.rating && <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={12} fill="currentColor" /> {item.rating}</span>}
                                </div>

                                <div style={{ fontSize: '11px', color: 'var(--secondary)', opacity: 0.8, marginTop: '4px' }}>
                                    Added {formatRelativeTime(item.createdAt)}
                                </div>

                                <div style={{ marginTop: '12px', height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: item.status === 'finished' ? '100%' : item.status === 'watching' ? '50%' : '0%',
                                            height: '100%',
                                            background: item.status === 'finished' ? 'var(--success)' : 'var(--primary)',
                                            transition: 'width 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <Clapperboard size={64} />
                    <p>No media found. Time to save something for later!</p>
                </div>
            )}
        </div>
    );
}
