import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EnergyLevel, FocusSession, Task } from '../types';
import {
    loadStoredDailyTarget,
    loadStoredSessions,
    saveStoredDailyTarget,
    saveStoredSessions,
} from '../utils/storage';
import { INITIAL_SESSIONS } from '../constants';
import { computeAnalyticsMetrics } from '../utils/analytics';

export function useAnalytics(tasks: Task[]) {
    const [sessions, setSessions] = useState<FocusSession[]>(loadStoredSessions);
    const [dailyTarget, setDailyTargetState] = useState<number>(loadStoredDailyTarget);
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

    useEffect(() => {
        saveStoredSessions(sessions);
    }, [sessions]);

    useEffect(() => {
        saveStoredDailyTarget(dailyTarget);
    }, [dailyTarget]);

    const metrics = useMemo(() => {
        return computeAnalyticsMetrics(sessions, tasks, dailyTarget);
    }, [sessions, tasks, dailyTarget]);

    const recordSession = useCallback((
        durationMinutes: number,
        activeTask: Task | null,
        energyLevel: EnergyLevel
    ) => {
        const newSession: FocusSession = {
            id: `s-${Date.now()}`,
            taskId: activeTask?.id,
            taskTitle: activeTask?.title || 'General Deep Focus Block',
            quadrant: activeTask?.quadrant || 'q2',
            durationMinutes,
            timestamp: Date.now(),
            energyLevelAtStart: energyLevel,
            completed: true,
        };

        setSessions(prev => [newSession, ...prev]);
    }, []);

    const clearSessions = useCallback(() => {
        setSessions([]);
    }, []);

    const resetToSampleData = useCallback(() => {
        setSessions(INITIAL_SESSIONS);
    }, []);

    const setDailyTarget = useCallback((targetMinutes: number) => {
        setDailyTargetState(Math.max(15, targetMinutes));
    }, []);

    const openAnalytics = useCallback(() => {
        setIsAnalyticsOpen(true);
    }, []);

    const closeAnalytics = useCallback(() => {
        setIsAnalyticsOpen(false);
    }, []);

    return {
        sessions,
        metrics,
        dailyTarget,
        isAnalyticsOpen,
        openAnalytics,
        closeAnalytics,
        recordSession,
        clearSessions,
        resetToSampleData,
        setDailyTarget,
    };
}
