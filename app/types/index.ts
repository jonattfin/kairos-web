export type QuadrantId = 'q1' | 'q2' | 'q3' | 'q4';

export interface Task {
    id: string;
    title: string;
    quadrant: QuadrantId;
    completed: boolean;
    createdAt: number;
}

export type TimerPreset = 'deep' | 'classic' | 'micro';

export type ChronotypeId = 'standard' | 'early' | 'night';

export interface ChronotypeConfig {
    id: ChronotypeId;
    name: string;
    description: string;
    peakHours: string;
    slumpHours: string;
    getEnergy: (decimalHour: number) => number;
}

export type EnergyLevel = 'low' | 'normal' | 'peak';

export interface FocusSession {
    id: string;
    taskId?: string;
    taskTitle?: string;
    quadrant: QuadrantId;
    durationMinutes: number;
    timestamp: number;
    energyLevelAtStart: EnergyLevel;
    completed: boolean;
}

export interface DailyFocusStat {
    dayLabel: string;
    dateStr: string;
    minutes: number;
    targetMinutes: number;
    sessionsCount: number;
}

export interface QuadrantMetric {
    quadrant: QuadrantId;
    label: string;
    color: string;
    count: number;
    minutes: number;
    percentage: number;
}

export interface AnalyticsMetrics {
    totalFocusMinutes: number;
    todayFocusMinutes: number;
    todayTargetMinutes: number;
    completedSessionsCount: number;
    currentStreakDays: number;
    circadianAlignmentScore: number;
    quadrantBreakdown: Record<QuadrantId, QuadrantMetric>;
    dailyFocusHistory: DailyFocusStat[];
    recentSessions: FocusSession[];
    tasksCompletedCount: number;
    tasksTotalCount: number;
    taskCompletionRate: number;
    peakEnergyFocusMinutes: number;
}

export interface EnergyEvaluation {
    hour: number;
    formattedTime: string;
    percentage: number;
    level: EnergyLevel;
    phaseName: string;
    recommendation: string;
    recommendedQuadrant: QuadrantId;
    badgeBg: string;
    badgeBorder: string;
    badgeColor: string;
    accentColor: string;
}

export interface SvgCurveData {
    pathD: string;
    areaD: string;
    cursorX: number;
    cursorY: number;
    cursorEnergy: number;
    width: number;
    height: number;
    baselineY: number;
}

export type SoundLayerId = 'wind' | 'rain' | 'waves' | 'campfire';

export type SoundPresetId =
    | 'balanced'
    | 'mountain_wind'
    | 'rainy_focus'
    | 'deep_alpha'
    | 'cozy_campfire'
    | 'custom';

export interface SoundscapeConfig {
    masterVolume: number; // 0 to 1
    isMuted: boolean;
    layers: Record<SoundLayerId, number>; // each 0 to 1
    activePreset: SoundPresetId;
}

export type VisualizerMode = 'oscilloscope' | 'spectrum' | 'crt' | 'halo';

export interface VisualizerModeOption {
    id: VisualizerMode;
    label: string;
    shortLabel: string;
    description: string;
}

export interface FocusQuote {
    id: string;
    text: string;
    author: string;
    category?: 'circadian' | 'morning' | 'deep_work' | 'discipline' | 'mindfulness' | 'renewal';
}
