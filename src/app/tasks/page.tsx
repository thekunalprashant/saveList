"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatRelativeTime } from "@/utils/dateFormat";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Pin,
    Calendar,
    Flag,
    Check,
    ClipboardList,
    Play,
    Pause,
    Square,
    RotateCcw
} from "lucide-react";
import styles from "./tasks.module.css";
import { clsx } from "clsx";
import { useStore } from "@/store/useStore";

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

    return <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{formatTime(elapsed)}</span>;
};

export default function TasksPage() {
    const { showToast } = useToast();
    const {
        tasks,
        loading,
        fetchTasks,
        addTask: storeAddTask,
        toggleTask: storeToggleTask,
        togglePin: storeTogglePin,
        deleteTask: storeDeleteTask,
        toggleTimer: storeToggleTimer,
        stopTimer: storeStopTimer,
        resetTimer: storeResetTimer,
        updateTask: storeUpdateTask
    } = useStore();

    const [editingDetails, setEditingDetails] = useState<{ id: string, title: string } | null>(null);

    const [filter, setFilter] = useState("all");
    const [newTitle, setNewTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (tasks.length === 0) {
            fetchTasks();
        }
    }, [tasks.length, fetchTasks]);

    const isInitialLoading = loading && tasks.length === 0;

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await storeAddTask({ title: newTitle });
            setNewTitle("");
            setIsAdding(false);
            showToast("Task added successfully", "success");
        } catch (error) {
            console.error("Failed to add task", error);
            showToast("Failed to add task", "error");
        }
    };

    const toggleTask = async (id: string, currentStatus: string) => {
        try {
            await storeToggleTask(id, currentStatus);
            const newStatus = currentStatus === "completed" ? "pending" : "completed";
            showToast(newStatus === "completed" ? "Task completed!" : "Task reopened", "success");
        } catch (error) {
            console.error("Failed to toggle task", error);
            showToast("Update failed", "error");
        }
    };

    const togglePin = async (id: string, currentPinned: boolean) => {
        try {
            await storeTogglePin(id, currentPinned);
            showToast(!currentPinned ? "Task pinned" : "Task unpinned");
        } catch (error) {
            console.error("Failed to pin task", error);
            showToast("Failed to pin task", "error");
        }
    };

    const deleteTask = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await storeDeleteTask(id);
            showToast("Task deleted", "info");
        } catch (error) {
            console.error("Failed to delete task", error);
            showToast("Delete failed", "error");
        }
    };

    const toggleTimer = async (id: string) => {
        try {
            await storeToggleTimer(id);
        } catch (error) {
            showToast("Failed to update timer", "error");
        }
    };

    const stopTimer = async (id: string) => {
        try {
            await storeStopTimer(id);
        } catch (error) {
            showToast("Failed to stop timer", "error");
        }
    };

    const resetTimer = async (id: string) => {
        if (!confirm("Reset timer to 00:00:00?")) return;
        try {
            await storeResetTimer(id);
            showToast("Timer reset", "info");
        } catch (error) {
            showToast("Failed to reset timer", "error");
        }
    };

    const startEditing = (id: string, title: string) => {
        setEditingDetails({ id, title });
    };

    const saveEditing = async () => {
        if (!editingDetails) return;
        if (!editingDetails.title.trim()) return;

        try {
            await storeUpdateTask(editingDetails.id, { title: editingDetails.title });
            setEditingDetails(null);
            showToast("Task updated", "success");
        } catch (error) {
            showToast("Failed to update task", "error");
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.status === "completed";
        if (filter === "pending") return task.status === "pending";
        if (filter === "high") return task.priority === "high";
        return true;
    }).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Tasks</h1>
                <button
                    className={styles.submitBtn}
                    onClick={() => setIsAdding(true)}
                >
                    <Plus size={18} />
                    <span>New Task</span>
                </button>
            </header>

            <div className={styles.filters}>
                {["all", "pending", "completed", "high"].map((f) => (
                    <button
                        key={f}
                        className={clsx(styles.filterBtn, filter === f && styles.activeFilter)}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {(isAdding || (tasks.length === 0 && !isInitialLoading)) && (
                <form className={styles.addForm} onSubmit={addTask}>
                    <input
                        autoFocus
                        className={styles.input}
                        placeholder="What needs to be done?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <div className={styles.formActions}>
                        <div className={styles.formOptions}>
                            <button type="button" className={styles.optionBtn}>
                                <Calendar size={16} />
                                <span>Today</span>
                            </button>
                            <button type="button" className={styles.optionBtn}>
                                <Flag size={16} />
                                <span>Priority</span>
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                className={styles.optionBtn}
                                onClick={() => setIsAdding(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={styles.submitBtn}>
                                Add Task
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {isInitialLoading ? (
                <div className={styles.empty}>Loading tasks...</div>
            ) : filteredTasks.length > 0 ? (
                <div className={styles.taskList}>
                    {filteredTasks.map((task) => (
                        <div key={task._id} className={styles.taskCard}>
                            <button
                                className={clsx(styles.checkbox, task.status === "completed" && styles.checked)}
                                onClick={() => toggleTask(task._id, task.status)}
                            >
                                {task.status === "completed" && <Check size={16} />}
                            </button>

                            <div className={styles.content}>
                                {editingDetails?.id === task._id ? (
                                    <input
                                        autoFocus
                                        className={styles.input}
                                        value={editingDetails.title}
                                        onChange={(e) => setEditingDetails({ ...editingDetails, title: e.target.value })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEditing();
                                            if (e.key === 'Escape') setEditingDetails(null);
                                        }}
                                        onBlur={saveEditing}
                                        style={{ fontSize: '15px', padding: '4px', margin: '-5px 0 5px -5px', width: '100%' }}
                                    />
                                ) : (
                                    <h3
                                        className={clsx(styles.taskTitle, task.status === "completed" && styles.completed)}
                                        onClick={() => startEditing(task._id, task.title)}
                                        title="Click to edit"
                                        style={{ cursor: 'text' }}
                                    >
                                        {task.title}
                                    </h3>
                                )}
                                <div className={styles.details}>
                                    <div className={clsx(styles.priority, styles[task.priority])}>
                                        <Flag size={12} />
                                        <span>{task.priority}</span>
                                    </div>
                                    {task.dueDate && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '11px', color: 'var(--secondary)', opacity: 0.8 }}>
                                        {formatRelativeTime(task.createdAt)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'var(--surface-hover)',
                                            padding: '4px 8px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '12px'
                                        }}>
                                            <TimerDisplay
                                                startTime={task.startTime}
                                                accumulatedTime={task.accumulatedTime || 0}
                                                status={task.timerStatus || 'idle'}
                                            />
                                        </div>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => toggleTimer(task._id)}
                                            style={{ color: task.timerStatus === 'running' ? 'var(--primary)' : 'var(--secondary)' }}
                                            title={task.timerStatus === 'running' ? "Pause" : "Start"}
                                        >
                                            {task.timerStatus === 'running' ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                                        </button>
                                        {(task.timerStatus === 'running' || task.timerStatus === 'paused') && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => stopTimer(task._id)}
                                                style={{ color: 'var(--error)' }}
                                                title="Stop & Save"
                                            >
                                                <Square size={16} fill="currentColor" />
                                            </button>
                                        )}
                                        {(task.accumulatedTime > 0 || task.timerStatus !== 'idle') && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => resetTimer(task._id)}
                                                title="Reset Timer"
                                                style={{ color: 'var(--secondary)' }}
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    className={clsx(styles.actionBtn, styles.pinBtn, task.pinned && styles.pinned)}
                                    onClick={() => togglePin(task._id, task.pinned)}
                                >
                                    <Pin size={16} />
                                </button>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => deleteTask(task._id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <ClipboardList size={48} />
                    <p>No tasks found. Time to add some!</p>
                </div>
            )}
        </div>
    );
}
