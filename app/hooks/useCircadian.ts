import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ChronotypeId, EnergyLevel } from '../types';
import { evaluateCircadianEnergy, generateSvgCurveData } from '../utils/circadian';

export function useCircadian() {
    const [chronotype, setChronotype] = useState<ChronotypeId>('standard');
    const [isScheduleMenuOpen, setIsScheduleMenuOpen] = useState(false);
    const [isLiveClock, setIsLiveClock] = useState(true);
    const [selectedHour, setSelectedHour] = useState<number>(0);
    const [manualOverrideLevel, setManualOverrideLevel] = useState<EnergyLevel | null>(null);
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);

    // Live clock ticker
    useEffect(() => {
        if (!isLiveClock) return;

        const updateClock = () => {
            const now = new Date();
            setSelectedHour(now.getHours() + now.getMinutes() / 60);
        };

        updateClock();
        const interval = window.setInterval(updateClock, 30000); // update every 30s
        return () => clearInterval(interval);
    }, [isLiveClock]);

    const activeHourForDisplay = hoveredHour !== null ? hoveredHour : selectedHour;

    const computedEvaluation = useMemo(() => {
        return evaluateCircadianEnergy(activeHourForDisplay, chronotype, null);
    }, [activeHourForDisplay, chronotype]);

    const effectiveEnergy = useMemo(() => {
        return evaluateCircadianEnergy(activeHourForDisplay, chronotype, manualOverrideLevel);
    }, [activeHourForDisplay, chronotype, manualOverrideLevel]);

    const svgCurveData = useMemo(() => {
        return generateSvgCurveData(chronotype, activeHourForDisplay);
    }, [chronotype, activeHourForDisplay]);

    const handleSelectChronotype = useCallback((type: ChronotypeId) => {
        setChronotype(type);
        setIsScheduleMenuOpen(false);
        setManualOverrideLevel(null);
    }, []);

    const toggleScheduleMenu = useCallback(() => {
        setIsScheduleMenuOpen(prev => !prev);
    }, []);

    const handleScrubTime = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const fraction = clickX / rect.width;
        const newHour = fraction * 24;
        setSelectedHour(newHour);
        setIsLiveClock(false);
        setManualOverrideLevel(null);
    }, []);

    const handleMouseMoveGraph = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const fraction = clickX / rect.width;
        setHoveredHour(fraction * 24);
    }, []);

    const handleMouseLeaveGraph = useCallback(() => {
        setHoveredHour(null);
    }, []);

    const handleSyncLiveClock = useCallback(() => {
        const now = new Date();
        setSelectedHour(now.getHours() + now.getMinutes() / 60);
        setIsLiveClock(true);
        setManualOverrideLevel(null);
        setHoveredHour(null);
    }, []);

    return {
        chronotype,
        isScheduleMenuOpen,
        isLiveClock,
        manualOverrideLevel,
        effectiveEnergy,
        computedEvaluation,
        svgCurveData,
        setManualOverrideLevel,
        toggleScheduleMenu,
        handleSelectChronotype,
        handleScrubTime,
        handleMouseMoveGraph,
        handleMouseLeaveGraph,
        handleSyncLiveClock,
    };
}
