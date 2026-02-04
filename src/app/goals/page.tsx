"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { formatRelativeTime } from "@/utils/dateFormat";
import {
    Plus,
    Target,
    Trash2,
    Check,
    ChevronRight,
    ChevronDown,
    Calendar,
    Flag,
    MoreVertical,
    Smile
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./goals.module.css";
import { clsx } from "clsx";
import { useStore } from "@/store/useStore";

export default function GoalsPage() {
    const { showToast } = useToast();
    const {
        goals,
        loading: storeLoading,
        fetchGoals,
        addGoal: storeAddGoal,
        updateGoal: storeUpdateGoal,
        deleteGoal: storeDeleteGoal
    } = useStore();

    const loading = storeLoading.goals;
    const [isAdding, setIsAdding] = useState(false);
    const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
    const [addingSubtaskTo, setAddingSubtaskTo] = useState<string | null>(null);
    const [newSubtask, setNewSubtask] = useState("");

    // New Goal Form State
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        emoji: "🎯",
        priority: "medium" as const,
    });
    const [initialSubtasks, setInitialSubtasks] = useState<string[]>([]);
    const [tempSubtask, setTempSubtask] = useState("");

    useEffect(() => {
        if (goals.length === 0) {
            fetchGoals();
        }
    }, [goals.length, fetchGoals]);

    const isInitialLoading = loading && goals.length === 0;

    const addGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGoal.title.trim()) return;

        try {
            await storeAddGoal({
                ...newGoal,
                subtasks: initialSubtasks.map(t => ({ title: t, completed: false }))
            });
            setIsAdding(false);
            setNewGoal({ title: "", description: "", emoji: "🎯", priority: "medium" });
            setInitialSubtasks([]);
            showToast("Goal created!", "success");
        } catch (error) {
            console.error("Failed to add goal", error);
            showToast("Failed to create goal", "error");
        }
    };

    const addSubtask = async (goalId: string) => {
        if (!newSubtask.trim()) return;
        const goal = goals.find(g => g._id === goalId);
        if (!goal) return;

        const updatedSubtasks = [...goal.subtasks, { title: newSubtask, completed: false }];

        try {
            await storeUpdateGoal(goalId, { subtasks: updatedSubtasks });
            setNewSubtask("");
            setAddingSubtaskTo(null);
        } catch (error) {
            console.error("Failed to add subtask", error);
            showToast("Failed to add subtask", "error");
        }
    };

    const removeSubtask = async (goalId: string, index: number) => {
        const goal = goals.find(g => g._id === goalId);
        if (!goal) return;

        const updatedSubtasks = goal.subtasks.filter((_, i) => i !== index);
        try {
            await storeUpdateGoal(goalId, { subtasks: updatedSubtasks });
        } catch (error) {
            console.error("Failed to remove subtask", error);
        }
    };

    const toggleSubtask = async (goalId: string, subtaskIndex: number) => {
        const goal = goals.find(g => g._id === goalId);
        if (!goal) return;

        const updatedSubtasks = [...goal.subtasks];
        const subtask = updatedSubtasks[subtaskIndex];
        const wasCompleted = subtask.completed;
        subtask.completed = !subtask.completed;

        try {
            const progressBefore = calculateProgress(goal.subtasks);
            // In a real optimized store, we might just update the specific subtask
            // For now, we update the whole subtasks array as per existing API pattern
            await storeUpdateGoal(goalId, { subtasks: updatedSubtasks });

            const progressAfter = calculateProgress(updatedSubtasks);
            if (progressAfter === 100 && progressBefore < 100) {
                showToast("Goal 100% complete! Great job! 🎉", "success");
            }
        } catch (error) {
            console.error("Failed to update subtask", error);
        }
    };

    const deleteGoal = async (id: string) => {
        if (!confirm("Delete this goal?")) return;
        try {
            await storeDeleteGoal(id);
            showToast("Goal deleted", "info");
        } catch (error) {
            console.error("Failed to delete goal", error);
            showToast("Delete failed", "error");
        }
    };

    const calculateProgress = (subtasks: any[]) => {
        if (subtasks.length === 0) return 0;
        const completed = subtasks.filter(s => s.completed).length;
        return Math.round((completed / subtasks.length) * 100);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Goals</h1>
                <button
                    className="submitBtn"
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                >
                    <Plus size={18} />
                    <span>New Goal</span>
                </button>
            </header>

            {isAdding && (
                <form className={styles.addForm} onSubmit={addGoal}>
                    <div className={styles.formGrid}>
                        <div>
                            <label className={styles.label}>Goal Title</label>
                            <input
                                autoFocus
                                className={styles.input}
                                placeholder="e.g. Learn to Play Guitar, Run a Marathon..."
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className={styles.label}>Description (Optional)</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Why is this important? e.g. I want to play my favorite songs by summer."
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label className={styles.label}>Emoji</label>
                                <input
                                    className={styles.input}
                                    value={newGoal.emoji}
                                    onChange={(e) => setNewGoal({ ...newGoal, emoji: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 2 }}>
                                <label className={styles.label}>Priority</label>
                                <select
                                    className={styles.input}
                                    value={newGoal.priority}
                                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Initial Subtasks Section */}
                        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <label className={styles.label}>Steps to Achieve This</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <input
                                    className={styles.input}
                                    placeholder="Break it down: e.g. Buy a guitar, Find a teacher..."
                                    value={tempSubtask}
                                    onChange={(e) => setTempSubtask(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (tempSubtask.trim()) {
                                                setInitialSubtasks([...initialSubtasks, tempSubtask]);
                                                setTempSubtask("");
                                            }
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (tempSubtask.trim()) {
                                            setInitialSubtasks([...initialSubtasks, tempSubtask]);
                                            setTempSubtask("");
                                        }
                                    }}
                                    className={styles.actionBtn}
                                    style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', padding: '0 12px' }}
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {initialSubtasks.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {initialSubtasks.map((step, idx) => (
                                        <div key={idx} className={styles.subtaskItem} style={{ background: 'var(--surface-hover)' }}>
                                            <span style={{ fontSize: '13px', flex: 1 }}>{step}</span>
                                            <button
                                                type="button"
                                                className={styles.subtaskRemoveBtn}
                                                style={{ opacity: 1 }}
                                                onClick={() => setInitialSubtasks(initialSubtasks.filter((_, i) => i !== idx))}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button type="button" onClick={() => setIsAdding(false)} style={{ color: 'var(--secondary)' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 24px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600' }}>Create Goal</button>
                    </div>
                </form>
            )}

            {isInitialLoading ? (
                <div className={styles.empty}>Loading goals...</div>
            ) : goals.length > 0 ? (
                <div className={styles.grid}>
                    <AnimatePresence>
                        {goals.map((goal) => {
                            const progress = calculateProgress(goal.subtasks);
                            const isExpanded = expandedGoal === goal._id;
                            const isAddingSubtask = addingSubtaskTo === goal._id;

                            return (
                                <motion.div
                                    key={goal._id}
                                    className={styles.card}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.goalInfo}>
                                            <div className={styles.emoji}>{goal.emoji}</div>
                                            <div>
                                                <h3 className={styles.goalTitle}>{goal.title}</h3>
                                                <p className={styles.description}>{goal.description}</p>
                                                {goal.priority && (
                                                    <span className={clsx(styles.priorityBadge, styles[`priority-${goal.priority}`])}>
                                                        {goal.priority} Priority
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn} onClick={() => setExpandedGoal(isExpanded ? null : goal._id)}>
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </button>
                                            <button className={clsx(styles.actionBtn, styles.deleteBtn)} onClick={() => deleteGoal(goal._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.progressSection}>
                                        <div className={styles.progressLabel}>
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <motion.div
                                                className={styles.progressFill}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--secondary)', opacity: 0.8, marginTop: '8px' }}>
                                            Created {formatRelativeTime(goal.createdAt)}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                className={styles.subtasks}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <h4 style={{ fontSize: '13px', fontWeight: '700' }}>Subtasks</h4>
                                                    <button
                                                        className={styles.addSubtaskBtn}
                                                        onClick={() => {
                                                            setAddingSubtaskTo(goal._id);
                                                            // Keep expanded when adding
                                                            setExpandedGoal(goal._id);
                                                        }}
                                                    >
                                                        <Plus size={14} /> Add Step
                                                    </button>
                                                </div>

                                                {isAddingSubtask && (
                                                    <form
                                                        className={styles.inlineSubtaskForm}
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            addSubtask(goal._id);
                                                        }}
                                                    >
                                                        <input
                                                            autoFocus
                                                            className={styles.inlineInput}
                                                            placeholder="Enter subtask..."
                                                            value={newSubtask}
                                                            onChange={(e) => setNewSubtask(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    setAddingSubtaskTo(null);
                                                                    setNewSubtask("");
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setAddingSubtaskTo(null)}
                                                            className={styles.actionBtn}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    </form>
                                                )}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {goal.subtasks.map((sub, idx) => (
                                                        <div key={idx} className={styles.subtaskItem}>
                                                            <button
                                                                className={clsx(styles.subtaskCheckbox, sub.completed && styles.checked)}
                                                                onClick={() => toggleSubtask(goal._id, idx)}
                                                            >
                                                                {sub.completed && <Check size={12} />}
                                                            </button>
                                                            <span className={clsx(styles.subtaskTitle, sub.completed && styles.checked)}>
                                                                {sub.title}
                                                            </span>
                                                            <button
                                                                className={styles.subtaskRemoveBtn}
                                                                onClick={() => removeSubtask(goal._id, idx)}
                                                                title="Remove step"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {goal.subtasks.length === 0 && !isAddingSubtask && (
                                                    <p style={{ fontSize: '12px', color: 'var(--secondary)', textAlign: 'center', padding: '12px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                                                        Break this goal down into smaller steps!
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className={styles.empty}>
                    <Target size={64} />
                    <p>You haven't set any goals yet. Start achieving today!</p>
                </div>
            )}
        </div>
    );
}
