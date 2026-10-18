import {
    DEFAULT_DAILY_TARGET_MINUTES,
    DEFAULT_SOUND_CONFIG,
    DEFAULT_VISUALIZER_MODE,
    INITIAL_SESSIONS,
    INITIAL_TASKS,
    STORAGE_KEY_DAILY_TARGET,
    STORAGE_KEY_SESSIONS,
    STORAGE_KEY_SOUND_SETTINGS,
    STORAGE_KEY_TASKS,
    STORAGE_KEY_VISUALIZER_MODE,
} from '../constants';
import type { FocusSession, SoundscapeConfig, Task, VisualizerMode } from '../types';

export function loadStoredTasks(): Task[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_TASKS);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch {
        // Fallback to initial tasks on read/parse error
    }
    return INITIAL_TASKS;
}

export function saveStoredTasks(tasks: Task[]): void {
    try {
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
        // Silently ignore quota / access errors
    }
}

export function loadStoredSessions(): FocusSession[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch {
        // Fallback
    }
    return INITIAL_SESSIONS;
}

export function saveStoredSessions(sessions: FocusSession[]): void {
    try {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch {
        // Silently ignore errors
    }
}

export function loadStoredDailyTarget(): number {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_DAILY_TARGET);
        if (saved) {
            const num = parseInt(saved, 10);
            if (!isNaN(num) && num > 0) {
                return num;
            }
        }
    } catch {
        // Fallback
    }
    return DEFAULT_DAILY_TARGET_MINUTES;
}

export function saveStoredDailyTarget(target: number): void {
    try {
        localStorage.setItem(STORAGE_KEY_DAILY_TARGET, target.toString());
    } catch {
        // Silently ignore errors
    }
}

export function loadStoredSoundConfig(): SoundscapeConfig {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_SOUND_SETTINGS);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object' && parsed.layers) {
                return {
                    ...DEFAULT_SOUND_CONFIG,
                    ...parsed,
                    layers: {
                        ...DEFAULT_SOUND_CONFIG.layers,
                        ...parsed.layers,
                    },
                };
            }
        }
    } catch {
        // Fallback
    }
    return DEFAULT_SOUND_CONFIG;
}

export function saveStoredSoundConfig(config: SoundscapeConfig): void {
    try {
        localStorage.setItem(STORAGE_KEY_SOUND_SETTINGS, JSON.stringify(config));
    } catch {
        // Silently ignore errors
    }
}

export function loadStoredVisualizerMode(): VisualizerMode {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_VISUALIZER_MODE);
        if (saved === 'oscilloscope' || saved === 'spectrum' || saved === 'crt' || saved === 'halo') {
            return saved;
        }
    } catch {
        // Fallback
    }
    return DEFAULT_VISUALIZER_MODE;
}

export function saveStoredVisualizerMode(mode: VisualizerMode): void {
    try {
        localStorage.setItem(STORAGE_KEY_VISUALIZER_MODE, mode);
    } catch {
        // Silently ignore errors
    }
}
