import { useState, useEffect, useCallback } from 'react';
import type { SoundLayerId, SoundPresetId, SoundscapeConfig } from '../types';
import { loadStoredSoundConfig, saveStoredSoundConfig } from '../utils/storage';
import {
    setSoundscapeConfig,
    playCompletionChime,
    playTestChime,
} from '../utils/audio';
import { SOUND_PRESETS } from '../constants';

export function useSoundscape() {
    const [soundConfig, setSoundConfigState] = useState<SoundscapeConfig>(() => {
        const stored = loadStoredSoundConfig();
        setSoundscapeConfig(stored);
        return stored;
    });

    const [isMixerOpen, setIsMixerOpen] = useState(false);

    useEffect(() => {
        saveStoredSoundConfig(soundConfig);
        setSoundscapeConfig(soundConfig);
    }, [soundConfig]);

    const setMasterVolume = useCallback((volume: number) => {
        setSoundConfigState(prev => ({
            ...prev,
            masterVolume: Math.max(0, Math.min(1, volume)),
        }));
    }, []);

    const toggleMute = useCallback(() => {
        setSoundConfigState(prev => ({
            ...prev,
            isMuted: !prev.isMuted,
        }));
    }, []);

    const setLayerVolume = useCallback((layer: SoundLayerId, volume: number) => {
        setSoundConfigState(prev => ({
            ...prev,
            activePreset: 'custom',
            layers: {
                ...prev.layers,
                [layer]: Math.max(0, Math.min(1, volume)),
            },
        }));
    }, []);

    const selectPreset = useCallback((presetId: SoundPresetId) => {
        const preset = SOUND_PRESETS[presetId];
        if (!preset) return;

        setSoundConfigState(prev => ({
            ...prev,
            activePreset: presetId,
            layers: {
                ...preset.layers,
            },
        }));
    }, []);

    const openMixer = useCallback(() => {
        setIsMixerOpen(true);
    }, []);

    const closeMixer = useCallback(() => {
        setIsMixerOpen(false);
    }, []);

    return {
        soundConfig,
        isMixerOpen,
        openMixer,
        closeMixer,
        setMasterVolume,
        toggleMute,
        setLayerVolume,
        selectPreset,
        playCompletionChime,
        playTestChime,
    };
}
