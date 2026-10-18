import { CHRONOTYPES } from '../constants';
import type { ChronotypeId, EnergyEvaluation, EnergyLevel, QuadrantId, SvgCurveData } from '../types';

export function evaluateCircadianEnergy(
    decimalHour: number,
    chronotype: ChronotypeId,
    manualOverrideLevel: EnergyLevel | null = null
): EnergyEvaluation {
    const config = CHRONOTYPES[chronotype];
    const energy = config.getEnergy(decimalHour);
    const normalizedHour = ((decimalHour % 24) + 24) % 24;
    const hours = Math.floor(normalizedHour);
    const minutes = Math.round((normalizedHour - hours) * 60);
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    let level: EnergyLevel;
    let phaseName: string;
    let recommendation: string;
    let recommendedQuadrant: QuadrantId;
    let badgeBg: string;
    let badgeBorder: string;
    let badgeColor: string;
    let accentColor: string;

    if (energy >= 70) {
        level = 'peak';
        phaseName = 'Peak Performance';
        recommendation = 'Peak Energy Window: Best for Q1 Critical & Q2 Strategic Deep Work';
        recommendedQuadrant = 'q1';
        badgeBg = '#3b0764';
        badgeBorder = '#a855f7';
        badgeColor = '#c084fc';
        accentColor = '#c084fc';
    } else if (energy <= 35) {
        level = 'low';
        if (normalizedHour >= 22 || normalizedHour <= 6) {
            phaseName = 'Rest & Recharge';
            recommendation = 'Sleep / Wind-Down Window: Low cognitive load, plan next day';
            recommendedQuadrant = 'q4';
            badgeBg = '#022c22';
            badgeBorder = '#047857';
            badgeColor = '#6ee7b7';
            accentColor = '#10b981';
        } else {
            phaseName = 'Energy Slump';
            recommendation = 'Circadian Slump: Best for Q3 Quick Wins / Administrative Tasks';
            recommendedQuadrant = 'q3';
            badgeBg = '#032e27';
            badgeBorder = '#059669';
            badgeColor = '#34d399';
            accentColor = '#10b981';
        }
    } else {
        level = 'normal';
        phaseName = 'Sustained Flow';
        recommendation = 'Steady Execution Window: Ideal for Q2 Deep Work & Systematic Tasks';
        recommendedQuadrant = 'q2';
        badgeBg = '#172554';
        badgeBorder = '#1e40af';
        badgeColor = '#93c5fd';
        accentColor = '#38bdf8';
    }

    const baseEval: EnergyEvaluation = {
        hour: normalizedHour,
        formattedTime,
        percentage: energy,
        level,
        phaseName,
        recommendation,
        recommendedQuadrant,
        badgeBg,
        badgeBorder,
        badgeColor,
        accentColor,
    };

    if (!manualOverrideLevel) {
        return baseEval;
    }

    if (manualOverrideLevel === 'low') {
        return {
            ...baseEval,
            percentage: 15,
            level: 'low',
            phaseName: 'Energy Slump (Calibrated)',
            recommendation: 'Calibrated Energy Slump: Best for Q3 Quick Wins / Admin Tasks',
            recommendedQuadrant: 'q3',
            badgeBg: '#032e27',
            badgeBorder: '#059669',
            badgeColor: '#34d399',
            accentColor: '#10b981',
        };
    }

    if (manualOverrideLevel === 'peak') {
        return {
            ...baseEval,
            percentage: 95,
            level: 'peak',
            phaseName: 'Peak Performance (Calibrated)',
            recommendation: 'Calibrated Peak Energy: Best for Q1 Urgent & Q2 Deep Work',
            recommendedQuadrant: 'q1',
            badgeBg: '#3b0764',
            badgeBorder: '#a855f7',
            badgeColor: '#c084fc',
            accentColor: '#c084fc',
        };
    }

    return {
        ...baseEval,
        percentage: 60,
        level: 'normal',
        phaseName: 'Sustained Flow (Calibrated)',
        recommendation: 'Calibrated Sustained Flow: Optimal for Steady Execution',
        recommendedQuadrant: 'q2',
        badgeBg: '#172554',
        badgeBorder: '#1e40af',
        badgeColor: '#93c5fd',
        accentColor: '#38bdf8',
    };
}

export function generateSvgCurveData(
    chronotype: ChronotypeId,
    activeHourForDisplay: number
): SvgCurveData {
    const width = 1000;
    const height = 54;
    const baselineY = 46;
    const peakY = 8;
    const samples = 72; // Sample every 20 minutes
    const points: { x: number; y: number; hour: number; energy: number }[] = [];

    for (let i = 0; i <= samples; i++) {
        const hour = (i / samples) * 24;
        const energy = CHRONOTYPES[chronotype].getEnergy(hour);
        const x = (i / samples) * width;
        const y = baselineY - (energy / 100) * (baselineY - peakY);
        points.push({ x, y, hour, energy });
    }

    // Smooth cubic bezier SVG curve calculation
    let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = i > 0 ? points[i - 1] : points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = i < points.length - 2 ? points[i + 2] : p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        pathD += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const areaD = `${pathD} L ${width} ${baselineY} L 0 ${baselineY} Z`;

    const cursorX = (activeHourForDisplay / 24) * width;
    const cursorEnergy = CHRONOTYPES[chronotype].getEnergy(activeHourForDisplay);
    const cursorY = baselineY - (cursorEnergy / 100) * (baselineY - peakY);

    return { pathD, areaD, cursorX, cursorY, cursorEnergy, width, height, baselineY };
}
