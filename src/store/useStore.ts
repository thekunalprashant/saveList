import { create } from 'zustand';

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'completed';
    dueDate?: string;
    pinned: boolean;
    createdAt: string;
    updatedAt: string;
    // Timer Fields
    timerStatus: 'idle' | 'running' | 'paused';
    startTime?: string; // ISO string for Date
    accumulatedTime: number; // milliseconds
}

interface Goal {
    _id: string;
    title: string;
    description: string;
    emoji: string;
    deadline?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'archived';
    subtasks: { _id?: string; title: string; completed: boolean }[];
    createdAt: string;
    updatedAt: string;
}

interface WatchlistItem {
    _id: string;
    title: string;
    type: 'movie' | 'show';
    posterUrl?: string;
    status: 'not-started' | 'watching' | 'finished';
    year?: number;
    genre?: string[];
    rating?: number;
    createdAt: string;
    updatedAt: string;
}

interface AppState {
    tasks: Task[];
    goals: Goal[];
    watchlist: WatchlistItem[];
    loading: {
        tasks: boolean;
        goals: boolean;
        watchlist: boolean;
    };

    // Task Actions
    setTasks: (tasks: Task[]) => void;
    fetchTasks: () => Promise<void>;
    addTask: (task: Partial<Task>) => Promise<Task>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    toggleTask: (id: string, currentStatus: string) => Promise<void>;
    togglePin: (id: string, currentPinned: boolean) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;

    // Timer Actions
    toggleTimer: (id: string) => Promise<void>;
    stopTimer: (id: string) => Promise<void>;
    resetTimer: (id: string) => Promise<void>;

    // Goal Actions
    setGoals: (goals: Goal[]) => void;
    fetchGoals: () => Promise<void>;
    addGoal: (goal: Partial<Goal>) => Promise<Goal>;
    updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;

    // Watchlist Actions
    setWatchlist: (items: WatchlistItem[]) => void;
    fetchWatchlist: () => Promise<void>;
    addWatchlistItem: (item: Partial<WatchlistItem>) => Promise<WatchlistItem>;
    updateWatchlistItem: (id: string, updates: Partial<WatchlistItem>) => Promise<void>;
    removeWatchlistItem: (id: string) => Promise<void>;

    // Global Actions
    bootstrapData: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
    tasks: [],
    goals: [],
    watchlist: [],
    loading: {
        tasks: false,
        goals: false,
        watchlist: false,
    },

    // Task Actions
    setTasks: (tasks) => set({ tasks }),
    fetchTasks: async () => {
        const isInitialFetch = get().tasks.length === 0;
        if (isInitialFetch) {
            set((state) => ({ loading: { ...state.loading, tasks: true } }));
        }
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            if (Array.isArray(data)) set({ tasks: data });
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            if (isInitialFetch) {
                set((state) => ({ loading: { ...state.loading, tasks: false } }));
            }
        }
    },
    addTask: async (task) => {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        const newTask = await res.json();
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return newTask;
    },
    updateTask: async (id, updates) => {
        set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        }));
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },
    toggleTask: async (id, currentStatus) => {
        const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
        const tasks = get().tasks.map((t) => (t._id === id ? { ...t, status: newStatus as any } : t));
        set({ tasks });
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
    },
    togglePin: async (id, currentPinned) => {
        const tasks = get().tasks.map((t) => (t._id === id ? { ...t, pinned: !currentPinned } : t));
        set({ tasks });
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pinned: !currentPinned }),
        });
    },
    deleteTask: async (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }));
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    },

    // Timer Implementation
    toggleTimer: async (id) => {
        const task = get().tasks.find((t) => t._id === id);
        if (!task) return;

        const now = new Date().toISOString();
        let updates: Partial<Task> = {};

        if (task.timerStatus === 'running') {
            // Pause Timer
            const start = new Date(task.startTime!).getTime();
            const elapsed = Date.now() - start;
            updates = {
                timerStatus: 'paused',
                accumulatedTime: (task.accumulatedTime || 0) + elapsed,
                startTime: undefined,
            };
        } else {
            // Start Timer (from idle or paused)
            updates = {
                timerStatus: 'running',
                startTime: now,
            };
        }

        // Optimistic Update
        set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        }));

        // Persist
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },

    stopTimer: async (id) => {
        const task = get().tasks.find((t) => t._id === id);
        if (!task) return;

        let updates: Partial<Task> = {
            timerStatus: 'idle',
            startTime: undefined,
        };

        if (task.timerStatus === 'running') {
            const start = new Date(task.startTime!).getTime();
            const elapsed = Date.now() - start;
            updates.accumulatedTime = (task.accumulatedTime || 0) + elapsed;
        }

        // Optimistic Update
        set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        }));

        // Persist
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },

    resetTimer: async (id) => {
        const updates: Partial<Task> = {
            timerStatus: 'idle',
            startTime: undefined,
            accumulatedTime: 0,
        };

        // Optimistic Update
        set((state) => ({
            tasks: state.tasks.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        }));

        // Persist
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },

    // Goal Actions
    setGoals: (goals) => set({ goals }),
    fetchGoals: async () => {
        const isInitialFetch = get().goals.length === 0;
        if (isInitialFetch) {
            set((state) => ({ loading: { ...state.loading, goals: true } }));
        }
        try {
            const res = await fetch('/api/goals');
            const data = await res.json();
            if (Array.isArray(data)) set({ goals: data });
        } catch (error) {
            console.error('Failed to fetch goals', error);
        } finally {
            if (isInitialFetch) {
                set((state) => ({ loading: { ...state.loading, goals: false } }));
            }
        }
    },
    addGoal: async (goal) => {
        const res = await fetch('/api/goals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal),
        });
        const newGoal = await res.json();
        set((state) => ({ goals: [newGoal, ...state.goals] }));
        return newGoal;
    },
    updateGoal: async (id, updates) => {
        set((state) => ({
            goals: state.goals.map((g) => (g._id === id ? { ...g, ...updates } : g)),
        }));
        await fetch(`/api/goals/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },
    deleteGoal: async (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g._id !== id) }));
        await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    },

    // Watchlist Actions
    setWatchlist: (watchlist) => set({ watchlist }),
    fetchWatchlist: async () => {
        const isInitialFetch = get().watchlist.length === 0;
        if (isInitialFetch) {
            set((state) => ({ loading: { ...state.loading, watchlist: true } }));
        }
        try {
            const res = await fetch('/api/watchlist');
            const data = await res.json();
            if (Array.isArray(data)) set({ watchlist: data });
        } catch (error) {
            console.error('Failed to fetch watchlist', error);
        } finally {
            if (isInitialFetch) {
                set((state) => ({ loading: { ...state.loading, watchlist: false } }));
            }
        }
    },
    addWatchlistItem: async (item) => {
        const res = await fetch('/api/watchlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        const newItem = await res.json();
        set((state) => ({ watchlist: [newItem, ...state.watchlist] }));
        return newItem;
    },
    updateWatchlistItem: async (id, updates) => {
        set((state) => ({
            watchlist: state.watchlist.map((item) => (item._id === id ? { ...item, ...updates } : item)),
        }));
        await fetch(`/api/watchlist/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
    },
    removeWatchlistItem: async (id) => {
        set((state) => ({ watchlist: state.watchlist.filter((item) => item._id !== id) }));
        await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    },

    // Global Actions
    bootstrapData: async () => {
        await Promise.all([
            get().fetchTasks(),
            get().fetchGoals(),
            get().fetchWatchlist(),
        ]);
    },
}));
