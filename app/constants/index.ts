import type {
    ChronotypeConfig,
    ChronotypeId,
    FocusSession,
    SoundLayerId,
    SoundPresetId,
    SoundscapeConfig,
    Task,
    TimerPreset,
    VisualizerMode,
    VisualizerModeOption,
    FocusQuote,
} from '../types';

export const PRESET_DURATIONS: Record<TimerPreset, number> = {
    deep: 50 * 60,
    classic: 25 * 60,
    micro: 15 * 60,
};

export const STORAGE_KEY_TASKS = 'kairos_tasks';
export const STORAGE_KEY_SESSIONS = 'kairos_focus_sessions';
export const STORAGE_KEY_DAILY_TARGET = 'kairos_daily_target_minutes';
export const STORAGE_KEY_SOUND_SETTINGS = 'kairos_sound_settings';
export const STORAGE_KEY_VISUALIZER_MODE = 'kairos_visualizer_mode';
export const DEFAULT_DAILY_TARGET_MINUTES = 180;

export const DEFAULT_VISUALIZER_MODE: VisualizerMode = 'oscilloscope';

export const VISUALIZER_MODES: VisualizerModeOption[] = [
    {
        id: 'oscilloscope',
        label: 'Radial Oscilloscope',
        shortLabel: 'Oscilloscope',
        description: 'Analog circular waveform trace with live transient jitter & phosphor glow',
    },
    {
        id: 'spectrum',
        label: 'Radial Spectrum',
        shortLabel: 'Spectrum',
        description: 'Winamp-style radiating frequency bars with gravity-delayed falling peak caps',
    },
    {
        id: 'crt',
        label: 'Classic CRT Scope',
        shortLabel: 'CRT Scope',
        description: 'Retro Winamp phosphor oscilloscope beam ribbon with precision reticle',
    },
    {
        id: 'halo',
        label: 'Organic Halo',
        shortLabel: 'Organic Halo',
        description: 'Smooth breathing ambient aura ring with harmonic energy modulation',
    },
];

export const DEFAULT_SOUND_CONFIG: SoundscapeConfig = {
    masterVolume: 0.65,
    isMuted: false,
    layers: {
        wind: 0.5,
        rain: 0.35,
        waves: 0.4,
        campfire: 0.2,
    },
    activePreset: 'balanced',
};

export const SOUND_PRESETS: Record<
    SoundPresetId,
    { name: string; description: string; layers: Record<SoundLayerId, number> }
> = {
    balanced: {
        name: 'Balanced Flow',
        description: 'Harmonious blend of gentle mountain wind and calming rain',
        layers: { wind: 0.45, rain: 0.35, waves: 0.3, campfire: 0.15 },
    },
    mountain_wind: {
        name: 'Mountain Wind',
        description: 'Atmospheric alpine breezes with organic dynamic gusts',
        layers: { wind: 0.85, rain: 0.0, waves: 0.2, campfire: 0.0 },
    },
    rainy_focus: {
        name: 'Rainy Sanctuary',
        description: 'Soothing rain on glass with distant soft wind',
        layers: { wind: 0.25, rain: 0.85, waves: 0.15, campfire: 0.2 },
    },
    deep_alpha: {
        name: 'Deep Alpha Flow',
        description: 'Binaural 10Hz/40Hz harmonic drone engineered for deep flow state',
        layers: { wind: 0.2, rain: 0.15, waves: 0.9, campfire: 0.1 },
    },
    cozy_campfire: {
        name: 'Cozy Hearth',
        description: 'Warm glowing campfire crackle with gentle evening breeze',
        layers: { wind: 0.2, rain: 0.1, waves: 0.15, campfire: 0.85 },
    },
    custom: {
        name: 'Custom Mix',
        description: 'Your tailored multi-layer soundscape balance',
        layers: { wind: 0.5, rain: 0.35, waves: 0.4, campfire: 0.2 },
    },
};

export const CHRONOTYPES: Record<ChronotypeId, ChronotypeConfig> = {
    standard: {
        id: 'standard',
        name: 'Standard (9–to–5)',
        description: 'Typical circadian rhythm with morning & late afternoon peaks',
        peakHours: '09:30 – 12:30 & 17:00 – 19:30',
        slumpHours: '13:30 – 15:30',
        getEnergy: (hour: number) => {
            const h = (hour + 24) % 24;
            let val = 15; // baseline sleep
            if (h >= 6 && h <= 13) {
                const dist = Math.abs(h - 10.5);
                val = 20 + 75 * Math.exp(-(dist * dist) / 4.5);
            } else if (h > 13 && h <= 16) {
                const dist = Math.abs(h - 14.5);
                val = 18 + 18 * Math.exp(-(dist * dist) / 2.0);
            } else if (h > 16 && h <= 21.5) {
                const dist = Math.abs(h - 18.2);
                val = 25 + 55 * Math.exp(-(dist * dist) / 4.0);
            } else if (h > 21.5 || h < 6) {
                const nightDist = h >= 21.5 ? (h - 21.5) : (h + 2.5);
                val = Math.max(12, 35 - nightDist * 3.5);
            }
            return Math.min(100, Math.max(10, Math.round(val)));
        },
    },
    early: {
        id: 'early',
        name: 'Early Lark (5 AM–1 PM)',
        description: 'Shifted earlier with rapid morning alertness and early evening fatigue',
        peakHours: '07:30 – 11:00 & 15:30 – 17:30',
        slumpHours: '12:30 – 14:30',
        getEnergy: (hour: number) => {
            const h = (hour + 24) % 24;
            let val: number;
            if (h >= 4.5 && h <= 12) {
                const dist = Math.abs(h - 8.5);
                val = 20 + 78 * Math.exp(-(dist * dist) / 4.0);
            } else if (h > 12 && h <= 15) {
                const dist = Math.abs(h - 13.5);
                val = 18 + 16 * Math.exp(-(dist * dist) / 1.8);
            } else if (h > 15 && h <= 20) {
                const dist = Math.abs(h - 16.8);
                val = 22 + 50 * Math.exp(-(dist * dist) / 3.5);
            } else {
                val = 12;
            }
            return Math.min(100, Math.max(10, Math.round(val)));
        },
    },
    night: {
        id: 'night',
        name: 'Night Owl (Wolf)',
        description: 'Delayed circadian cycle with peak analytical flow during late evening',
        peakHours: '14:00 – 16:30 & 19:30 – 23:30',
        slumpHours: '16:45 – 18:30',
        getEnergy: (hour: number) => {
            const h = (hour + 24) % 24;
            let val: number;
            if (h >= 10 && h <= 16.5) {
                const dist = Math.abs(h - 14.5);
                val = 25 + 55 * Math.exp(-(dist * dist) / 5.0);
            } else if (h > 16.5 && h <= 19) {
                const dist = Math.abs(h - 17.5);
                val = 20 + 15 * Math.exp(-(dist * dist) / 2.0);
            } else if (h > 19 || h <= 1.5) {
                const effectiveH = h < 2 ? h + 24 : h;
                const dist = Math.abs(effectiveH - 21.5);
                val = 30 + 68 * Math.exp(-(dist * dist) / 4.8);
            } else {
                val = 12;
            }
            return Math.min(100, Math.max(10, Math.round(val)));
        },
    },
};

export const INITIAL_TASKS: Task[] = [
    {
        id: '1',
        title: 'Deploy Critical Bug Patch',
        quadrant: 'q1',
        completed: false,
        createdAt: Date.now() - 3600000,
    },
    {
        id: '2',
        title: 'Outline Strategic Architecture Plan',
        quadrant: 'q2',
        completed: false,
        createdAt: Date.now() - 7200000,
    },
    {
        id: '3',
        title: 'Clear Inbox & Standard Admin Replies',
        quadrant: 'q3',
        completed: false,
        createdAt: Date.now() - 1800000,
    },
];

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

export const INITIAL_SESSIONS: FocusSession[] = [
    {
        id: 's-1',
        taskId: '1',
        taskTitle: 'Deploy Critical Bug Patch',
        quadrant: 'q1',
        durationMinutes: 50,
        timestamp: now - 1000 * 60 * 45, // today
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-2',
        taskId: '2',
        taskTitle: 'Outline Strategic Architecture Plan',
        quadrant: 'q2',
        durationMinutes: 50,
        timestamp: now - 1000 * 60 * 180, // today
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-3',
        taskId: '3',
        taskTitle: 'Clear Inbox & Standard Admin Replies',
        quadrant: 'q3',
        durationMinutes: 25,
        timestamp: now - 1000 * 60 * 300, // today (afternoon slump)
        energyLevelAtStart: 'low',
        completed: true,
    },
    {
        id: 's-4',
        taskId: '4',
        taskTitle: 'Database Schema Optimization',
        quadrant: 'q2',
        durationMinutes: 50,
        timestamp: now - oneDayMs - 1000 * 60 * 120, // yesterday
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-5',
        taskId: '5',
        taskTitle: 'Emergency Production Incident',
        quadrant: 'q1',
        durationMinutes: 25,
        timestamp: now - oneDayMs - 1000 * 60 * 360, // yesterday
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-6',
        taskId: '6',
        taskTitle: 'Weekly Team Sync & Sprint Review',
        quadrant: 'q3',
        durationMinutes: 25,
        timestamp: now - 2 * oneDayMs, // 2 days ago
        energyLevelAtStart: 'normal',
        completed: true,
    },
    {
        id: 's-7',
        taskId: '7',
        taskTitle: 'High-Throughput Caching Layer',
        quadrant: 'q2',
        durationMinutes: 50,
        timestamp: now - 2 * oneDayMs - 1000 * 60 * 100, // 2 days ago
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-8',
        taskId: '8',
        taskTitle: 'Review API Security Headers',
        quadrant: 'q2',
        durationMinutes: 50,
        timestamp: now - 3 * oneDayMs, // 3 days ago
        energyLevelAtStart: 'peak',
        completed: true,
    },
    {
        id: 's-9',
        taskId: '9',
        taskTitle: 'Vendor Subscription Audit',
        quadrant: 'q4',
        durationMinutes: 15,
        timestamp: now - 4 * oneDayMs, // 4 days ago
        energyLevelAtStart: 'low',
        completed: true,
    },
    {
        id: 's-10',
        taskId: '10',
        taskTitle: 'System Observability Dashboard',
        quadrant: 'q2',
        durationMinutes: 50,
        timestamp: now - 5 * oneDayMs, // 5 days ago
        energyLevelAtStart: 'peak',
        completed: true,
    },
];

export const FOCUS_QUOTES: FocusQuote[] = [
    {
        id: 'fq-1',
        text: 'Who gets earlier first, gets the work done.',
        author: 'Traditional Proverb',
        category: 'morning',
    },
    {
        id: 'fq-2',
        text: 'Deep work is the superpower of the 21st century.',
        author: 'Cal Newport',
        category: 'deep_work',
    },
    {
        id: 'fq-3',
        text: 'The early morning hath gold in its mouth.',
        author: 'Benjamin Franklin',
        category: 'morning',
    },
    {
        id: 'fq-4',
        text: 'Focus is not about saying yes to what you want to do; it is about saying no to the hundred other good ideas.',
        author: 'Steve Jobs',
        category: 'deep_work',
    },
    {
        id: 'fq-5',
        text: 'Align your deepest work with your circadian peak; let biological momentum lift your craft.',
        author: 'Kairos Principle',
        category: 'circadian',
    },
    {
        id: 'fq-6',
        text: 'Win the morning, win the day.',
        author: 'Tim Ferriss',
        category: 'morning',
    },
    {
        id: 'fq-7',
        text: 'Do one thing at a time, and do it with your whole heart and undivided presence.',
        author: 'Marcus Aurelius',
        category: 'mindfulness',
    },
    {
        id: 'fq-8',
        text: 'Concentrate all your thoughts upon the work at hand. The sun’s rays do not burn until brought to a focus.',
        author: 'Alexander Graham Bell',
        category: 'deep_work',
    },
    {
        id: 'fq-9',
        text: 'Energy flows where attention goes.',
        author: 'Michael Beckwith',
        category: 'mindfulness',
    },
    {
        id: 'fq-10',
        text: 'Small daily disciplines repeated with consistency lead to monumental achievements over time.',
        author: 'John C. Maxwell',
        category: 'discipline',
    },
    {
        id: 'fq-11',
        text: 'Rest is not quitting; it is biological renewal preparing you for the next peak.',
        author: 'Circadian Wisdom',
        category: 'renewal',
    },
    {
        id: 'fq-12',
        text: 'Simplicity boils down to two steps: Identify the essential. Eliminate the rest.',
        author: 'Leo Babauta',
        category: 'discipline',
    },
    {
        id: 'fq-13',
        text: 'Action cures fear. Start the first five minutes and momentum will carry you forward.',
        author: 'David J. Schwartz',
        category: 'deep_work',
    },
    {
        id: 'fq-14',
        text: 'It is not that we have a short time to live, but that we waste much of it on distractions.',
        author: 'Seneca',
        category: 'discipline',
    },
    {
        id: 'fq-15',
        text: 'Flow is the effortless state of total immersion where action and awareness merge.',
        author: 'Mihaly Csikszentmihalyi',
        category: 'deep_work',
    },
    {
        id: 'fq-16',
        text: 'During the afternoon slump, pivot to quick wins and administrative tasks without guilt.',
        author: 'Kairos Circadian Engine',
        category: 'circadian',
    },
];
