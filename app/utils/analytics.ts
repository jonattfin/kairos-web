import type { AnalyticsMetrics, DailyFocusStat, FocusSession, QuadrantId, QuadrantMetric, Task } from '../types';

const QUADRANT_META: Record<QuadrantId, { label: string; color: string }> = {
    q1: { label: 'Q1: Do First', color: '#f87171' },
    q2: { label: 'Q2: Deep Work', color: '#818cf8' },
    q3: { label: 'Q3: Quick Wins', color: '#34d399' },
    q4: { label: 'Q4: Minimize', color: '#94a3b8' },
};

export function computeAnalyticsMetrics(
    sessions: FocusSession[],
    tasks: Task[],
    dailyTargetMinutes: number,
): AnalyticsMetrics {
    const validSessions = sessions.filter(s => s.completed);

    const totalFocusMinutes = validSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const completedSessionsCount = validSessions.length;

    // Today's Date
    const today = new Date();
    const todayDateString = today.toDateString();

    const todaySessions = validSessions.filter(
        s => new Date(s.timestamp).toDateString() === todayDateString
    );
    const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // Peak energy focus minutes
    const peakEnergyFocusMinutes = validSessions
        .filter(s => s.energyLevelAtStart === 'peak')
        .reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // Circadian alignment score calculation
    let alignmentSum = 0;
    if (validSessions.length > 0) {
        for (const s of validSessions) {
            let sessionScore = 70;
            if (s.quadrant === 'q1' || s.quadrant === 'q2') {
                if (s.energyLevelAtStart === 'peak') sessionScore = 100;
                else if (s.energyLevelAtStart === 'normal') sessionScore = 80;
                else sessionScore = 35;
            } else if (s.quadrant === 'q3') {
                if (s.energyLevelAtStart === 'low') sessionScore = 100;
                else if (s.energyLevelAtStart === 'normal') sessionScore = 75;
                else sessionScore = 45;
            } else if (s.quadrant === 'q4') {
                if (s.energyLevelAtStart === 'low') sessionScore = 100;
                else if (s.energyLevelAtStart === 'normal') sessionScore = 50;
                else sessionScore = 20;
            }
            alignmentSum += sessionScore;
        }
    }
    const circadianAlignmentScore = validSessions.length > 0
        ? Math.round(alignmentSum / validSessions.length)
        : 100;

    // Quadrant Breakdown
    const qBreakdown: Record<QuadrantId, QuadrantMetric> = {
        q1: { quadrant: 'q1', label: QUADRANT_META.q1.label, color: QUADRANT_META.q1.color, count: 0, minutes: 0, percentage: 0 },
        q2: { quadrant: 'q2', label: QUADRANT_META.q2.label, color: QUADRANT_META.q2.color, count: 0, minutes: 0, percentage: 0 },
        q3: { quadrant: 'q3', label: QUADRANT_META.q3.label, color: QUADRANT_META.q3.color, count: 0, minutes: 0, percentage: 0 },
        q4: { quadrant: 'q4', label: QUADRANT_META.q4.label, color: QUADRANT_META.q4.color, count: 0, minutes: 0, percentage: 0 },
    };

    validSessions.forEach(s => {
        if (qBreakdown[s.quadrant]) {
            qBreakdown[s.quadrant].count += 1;
            qBreakdown[s.quadrant].minutes += s.durationMinutes;
        }
    });

    (Object.keys(qBreakdown) as QuadrantId[]).forEach(qKey => {
        qBreakdown[qKey].percentage = totalFocusMinutes > 0
            ? Math.round((qBreakdown[qKey].minutes / totalFocusMinutes) * 100)
            : 0;
    });

    // Daily Focus History for last 7 days
    const dailyFocusHistory: DailyFocusStat[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const targetDateString = d.toDateString();
        const daysSessions = validSessions.filter(
            s => new Date(s.timestamp).toDateString() === targetDateString
        );

        const dayMinutes = daysSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
        const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Yest' : dayNames[d.getDay()];
        const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;

        dailyFocusHistory.push({
            dayLabel,
            dateStr,
            minutes: dayMinutes,
            targetMinutes: dailyTargetMinutes,
            sessionsCount: daysSessions.length,
        });
    }

    // Streak calculation
    let currentStreakDays = 0;
    for (let i = dailyFocusHistory.length - 1; i >= 0; i--) {
        const item = dailyFocusHistory[i];
        if (item.minutes > 0) {
            currentStreakDays++;
        } else if (i === dailyFocusHistory.length - 1) {
            // Today might just be starting, don't break streak if yesterday was active
            continue;
        } else {
            break;
        }
    }

    // Task completion metrics
    const tasksTotalCount = tasks.length;
    const tasksCompletedCount = tasks.filter(t => t.completed).length;
    const taskCompletionRate = tasksTotalCount > 0
        ? Math.round((tasksCompletedCount / tasksTotalCount) * 100)
        : 0;

    // Recent sessions sorted latest first
    const recentSessions = [...validSessions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

    return {
        totalFocusMinutes,
        todayFocusMinutes,
        todayTargetMinutes: dailyTargetMinutes,
        completedSessionsCount,
        currentStreakDays,
        circadianAlignmentScore,
        quadrantBreakdown: qBreakdown,
        dailyFocusHistory,
        recentSessions,
        tasksCompletedCount,
        tasksTotalCount,
        taskCompletionRate,
        peakEnergyFocusMinutes,
    };
}
