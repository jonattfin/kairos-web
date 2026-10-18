import { useState, useEffect, useRef, useCallback } from 'react';
import { PRESET_DURATIONS } from '../constants';
import type { TimerPreset } from '../types';
import {
    startLiveWindSound,
    stopLiveWindSound,
    isAmbientSoundEnabled,
    setAmbientSoundEnabled,
    playCompletionChime,
} from '../utils/audio';

export function useTimer(onSessionComplete?: (durationMinutes: number) => void) {
    const [preset, setPreset] = useState<TimerPreset>('classic');
    const [timeLeft, setTimeLeft] = useState<number>(PRESET_DURATIONS.classic);
    const [isRunning, setIsRunning] = useState(false);
    const [soundEnabled, setSoundEnabledState] = useState(() => isAmbientSoundEnabled());
    const timerRef = useRef<number | null>(null);
    const onSessionCompleteRef = useRef(onSessionComplete);

    useEffect(() => {
        onSessionCompleteRef.current = onSessionComplete;
    }, [onSessionComplete]);

    // Live continuous generative ambient wind audio synchronized with timer execution
    useEffect(() => {
        if (isRunning) {
            startLiveWindSound();
        } else {
            stopLiveWindSound();
        }

        return () => {
            stopLiveWindSound(0.2);
        };
    }, [isRunning]);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        playCompletionChime();
                        const durationMins = Math.round(PRESET_DURATIONS[preset] / 60);
                        if (onSessionCompleteRef.current) {
                            onSessionCompleteRef.current(durationMins);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, preset]);

    const handleSelectPreset = useCallback((newPreset: TimerPreset) => {
        setPreset(newPreset);
        setIsRunning(false);
        setTimeLeft(PRESET_DURATIONS[newPreset]);
    }, []);

    const handleToggleTimer = useCallback(() => {
        if (timeLeft === 0) {
            setTimeLeft(PRESET_DURATIONS[preset]);
            setIsRunning(true);
        } else {
            setIsRunning(prev => !prev);
        }
    }, [timeLeft, preset]);

    const handleResetTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(PRESET_DURATIONS[preset]);
    }, [preset]);

    const handleSkipTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(0);
    }, []);

    const handleToggleSound = useCallback(() => {
        setSoundEnabledState(prev => {
            const next = !prev;
            setAmbientSoundEnabled(next);
            if (next && isRunning) {
                startLiveWindSound();
            } else if (!next) {
                stopLiveWindSound(0.5);
            }
            return next;
        });
    }, [isRunning]);

    const totalDuration = PRESET_DURATIONS[preset];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const circumference = 2 * Math.PI * 76;
    const progressFraction = (totalDuration - timeLeft) / totalDuration;
    const strokeDashoffset = circumference - (circumference * progressFraction);

    return {
        preset,
        timeLeft,
        isRunning,
        soundEnabled,
        formattedTime,
        circumference,
        strokeDashoffset,
        handleSelectPreset,
        handleToggleTimer,
        handleResetTimer,
        handleSkipTimer,
        handleToggleSound,
    };
}
