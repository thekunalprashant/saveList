"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Plus,
  CheckSquare,
  Target,
  Clapperboard,
  TrendingUp,
  Check,
  ArrowRight,
  Film,
  Tv
} from "lucide-react";
import styles from "./dashboard.module.css";
import { clsx } from "clsx";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { formatRelativeTime } from "@/utils/dateFormat";
import { Play, Pause } from "lucide-react";

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)));
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TimerDisplay = ({ startTime, accumulatedTime, status }: { startTime?: string, accumulatedTime: number, status: string }) => {
  const [elapsed, setElapsed] = useState(accumulatedTime);

  useEffect(() => {
    if (status === 'running' && startTime) {
      const start = new Date(startTime).getTime();
      const interval = setInterval(() => {
        setElapsed(accumulatedTime + (Date.now() - start));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsed(accumulatedTime);
    }
  }, [status, startTime, accumulatedTime]);

  return <span>{formatTime(elapsed)}</span>;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const {
    tasks: allTasks,
    goals: allGoals,
    watchlist: allWatchlist,
    fetchTasks,
    fetchGoals,
    fetchWatchlist,
    updateWatchlistItem,
    updateTask,
    toggleTimer,
    loading: storeLoading
  } = useStore();

  const [analytics, setAnalytics] = useState<{ weeklycompletions: number[], stats: any } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    // Initial load for dashboard if store is empty
    if (allTasks.length === 0) fetchTasks();
    if (allGoals.length === 0) fetchGoals();
    if (allWatchlist.length === 0) fetchWatchlist();

    // Analytics is unique to dashboard for now
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [allTasks.length, allGoals.length, allWatchlist.length, fetchTasks, fetchGoals, fetchWatchlist]);

  const loading = storeLoading.tasks || storeLoading.goals || storeLoading.watchlist || analyticsLoading;

  const dashboardData = {
    tasks: allTasks.filter((t: any) => t.status === 'pending').slice(0, 5),
    activeGoal: allGoals.find((g: any) => g.status === 'active'),
    watchlist: allWatchlist
      .filter((item: any) => item.status !== 'finished')
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3),
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const calculateProgress = (subtasks: any[]) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(s => s.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  };


  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1>{greeting}, {session?.user?.name?.split(" ")[0] || "User"}</h1>
        <p>Here's what's happening with your SaveList today.</p>
      </header>

      <div className={styles.grid}>
        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <Link href="/watchlist" className={styles.actionBtn}>
            <Plus size={20} />
            <span>Watchlist</span>
          </Link>
          <Link href="/tasks" className={styles.actionBtn}>
            <Plus size={20} />
            <span>New Task</span>
          </Link>

          <Link href="/goals" className={styles.actionBtn}>
            <Plus size={20} />
            <span>New Goal</span>
          </Link>

        </div>

        {/* Tasks Widget */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <CheckSquare size={20} color="var(--primary)" />
              <span>Pending Tasks</span>
            </div>
            <Link href="/tasks" className={styles.cardAction}>View all</Link>
          </div>
          <div className={styles.taskList}>
            {loading ? <p>Loading...</p> : dashboardData.tasks.length > 0 ? dashboardData.tasks.map((task: any) => (
              <div key={task._id} className={styles.taskItem}>
                <div
                  className={clsx(styles.taskCheckbox, task.status === 'completed' && styles.checked)}
                  onClick={() => updateTask(task._id, { status: 'completed' })}
                  role="button"
                  tabIndex={0}
                >
                  {task.status === 'completed' && <Check size={16} strokeWidth={3} />}
                </div>
                <div className={styles.taskInfo}>
                  <p className={clsx(styles.taskTitle, task.status === 'completed' && styles.completed)}>{task.title}</p>
                </div>

                <div className={clsx(styles.taskTimer, task.timerStatus === 'running' && styles.timerActive)}>
                  <TimerDisplay
                    startTime={task.startTime}
                    accumulatedTime={task.accumulatedTime || 0}
                    status={task.timerStatus || 'idle'}
                  />
                </div>

                <div className={styles.timerControls}>
                  <button
                    className={clsx(styles.timerBtn, task.timerStatus === 'running' && styles.active)}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTimer(task._id);
                    }}
                    title={task.timerStatus === 'running' ? "Pause" : "Start"}
                  >
                    {task.timerStatus === 'running' ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  </button>
                </div>
              </div>
            )) : <p className={styles.description}>No pending tasks!</p>}
          </div>
        </div>

        {/* Goals Widget */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Target size={20} color="var(--accent)" />
              <span>Active Goal</span>
            </div>
            <Link href="/goals" className={styles.cardAction}>Details</Link>
          </div>
          {loading ? <p>Loading...</p> : dashboardData.activeGoal ? (
            <div className={styles.goalPreview}>
              <div className={styles.goalInfo}>
                <span className={styles.goalEmoji}>{dashboardData.activeGoal.emoji}</span>
                <div>
                  <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{dashboardData.activeGoal.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--secondary)' }}>{calculateProgress(dashboardData.activeGoal.subtasks)}% completed</p>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${calculateProgress(dashboardData.activeGoal.subtasks)}%` }}
                />
              </div>
            </div>
          ) : <p className={styles.description}>No active goals set.</p>}
        </div>

        {/* Watchlist Widget */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Clapperboard size={20} color="var(--error)" />
              <span>Watchlist Highlights</span>
            </div>
            <Link href="/watchlist" className={styles.cardAction}>Browse</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? <p>Loading...</p> : dashboardData.watchlist.length > 0 ? dashboardData.watchlist.map((item: any) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--surface-hover)', border: '1px solid transparent' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: item.type === 'movie' ? 'rgba(255, 110, 110, 0.1)' : 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.type === 'movie' ? '#ff6b6b' : '#6366f1' }}>
                  {item.type === 'movie' ? <Film size={18} /> : <Tv size={18} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{item.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--secondary)' }}>
                    <span style={{ textTransform: 'capitalize', color: item.type === 'movie' ? '#ff6b6b' : '#6366f1', fontWeight: '700' }}>{item.type}</span>
                    <span>• {formatRelativeTime(item.updatedAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => updateWatchlistItem(item._id, { status: 'finished' })}
                  className={styles.watchlistActionBtn}
                  title="Mark as watched"
                >
                  <Check size={16} />
                </button>
              </div>
            )) : <p className={styles.description}>Watchlist is empty. Add some media!</p>}
          </div>
        </div>

        {/* Insights Widget */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <TrendingUp size={20} color="var(--success)" />
              <span>Weekly Task Completions</span>
            </div>
          </div>

          {/* Chart Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Bars */}
            <div style={{ height: '100px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              {analytics?.weeklycompletions ? analytics.weeklycompletions.map((val: number, i: number) => {
                const max = Math.max(...analytics.weeklycompletions, 5); // Minimum scale of 5 to avoid flat charts
                const height = Math.max((val / max) * 100, 10); // Min height 10%
                return (
                  <div
                    key={i}
                    title={`${val} tasks completed`}
                    style={{
                      flex: 1,
                      height: `${height}%`,
                      background: i === 6 ? 'var(--primary)' : 'var(--surface-pressed)',
                      borderRadius: '4px',
                      transition: 'height 1s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      alignItems: 'center'
                    }}
                  >
                    {val > 0 && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        marginBottom: '4px',
                        color: 'var(--foreground)',
                        position: 'absolute',
                        top: '-18px'
                      }}>
                        {val}
                      </span>
                    )}
                  </div>
                );
              }) : Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: '10%', background: 'var(--surface-pressed)', borderRadius: '4px', opacity: 0.5 }} />
              ))}
            </div>

            {/* Day Labels */}
            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--secondary)', fontWeight: '600' }}>
                    {d.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </div>
                );
              })}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '24px', textAlign: 'center' }}>
            Tasks completed over the last 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
