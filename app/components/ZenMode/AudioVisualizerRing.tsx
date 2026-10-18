import { useEffect, useRef, useState } from 'react';
import type { VisualizerMode } from '../../types';
import {
    getLiveAudioFrequencyData,
    getLiveAudioVisualizationData,
    getLiveAudioWaveformData,
} from '../../utils/audio';

interface AudioVisualizerRingProps {
    visualizerMode: VisualizerMode;
    isRunning: boolean;
    soundEnabled: boolean;
    accentColor: string;
}

export function AudioVisualizerRing({
    visualizerMode,
    isRunning,
    soundEnabled,
    accentColor,
}: AudioVisualizerRingProps) {
    const [audioBands, setAudioBands] = useState<number[]>([0.2, 0.3, 0.4, 0.3, 0.2, 0.35, 0.25, 0.15]);
    const [waveformData, setWaveformData] = useState<number[]>(() =>
        Array.from({ length: 64 }, (_, i) => 0.5 + Math.sin((i / 64) * Math.PI * 4) * 0.03)
    );
    const [frequencyData, setFrequencyData] = useState<number[]>(() =>
        Array.from({ length: 32 }, (_, i) => Math.max(0.04, 0.3 * Math.exp(-i / 10)))
    );
    const [peaks, setPeaks] = useState<number[]>(() =>
        Array.from({ length: 32 }, () => 0.1)
    );

    const peaksRef = useRef<number[]>(Array.from({ length: 32 }, () => 0.1));
    const peakHoldRef = useRef<number[]>(Array.from({ length: 32 }, () => 0));
    const rafIdRef = useRef<number | null>(null);
    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        let isCancelled = false;

        const updateVisuals = (timestamp: number) => {
            if (isCancelled) return;

            // Throttle to ~45 FPS for silky smoothness and optimal CPU efficiency
            if (timestamp - lastUpdateRef.current >= 22) {
                lastUpdateRef.current = timestamp;

                if (visualizerMode === 'halo') {
                    const bands = getLiveAudioVisualizationData();
                    setAudioBands(bands);
                } else if (visualizerMode === 'oscilloscope' || visualizerMode === 'crt') {
                    const wave = getLiveAudioWaveformData(64);
                    setWaveformData(wave);
                } else if (visualizerMode === 'spectrum') {
                    const freqs = getLiveAudioFrequencyData(32);
                    setFrequencyData(freqs);

                    // Winamp-style falling peak caps physics simulation
                    const newPeaks = [...peaksRef.current];
                    const newHold = [...peakHoldRef.current];

                    for (let i = 0; i < 32; i++) {
                        const current = freqs[i] || 0.02;
                        if (current >= newPeaks[i]) {
                            newPeaks[i] = current;
                            newHold[i] = 8; // hold for 8 frames
                        } else if (newHold[i] > 0) {
                            newHold[i]--;
                        } else {
                            // Gravity decay drop
                            newPeaks[i] = Math.max(0.02, newPeaks[i] - 0.022);
                        }
                    }

                    peaksRef.current = newPeaks;
                    peakHoldRef.current = newHold;
                    setPeaks(newPeaks);
                }
            }

            rafIdRef.current = requestAnimationFrame(updateVisuals);
        };

        rafIdRef.current = requestAnimationFrame(updateVisuals);

        return () => {
            isCancelled = true;
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [visualizerMode, isRunning, soundEnabled]);

    const center = 180;
    const baseRadius = 148;

    // ==========================================
    // 1. ORGANIC HALO RENDERING
    // ==========================================
    const renderHalo = () => {
        const numPoints = 24;
        const points: string[] = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const bandIndex = i % audioBands.length;
            const energy = audioBands[bandIndex] || 0.2;
            const radius = isRunning && soundEnabled ? baseRadius + energy * 18 : baseRadius + 3;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        const polygonPoints = points.join(' ');

        return (
            <>
                <defs>
                    <radialGradient id="zenAuraGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="60%" stopColor={accentColor} stopOpacity="0.0" />
                        <stop offset="85%" stopColor={accentColor} stopOpacity={isRunning ? "0.18" : "0.05"} />
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
                    </radialGradient>
                </defs>

                {/* Ambient Aura Background */}
                <circle cx="180" cy="180" r="170" fill="url(#zenAuraGradient)" />

                {/* Outer undulating wave ring */}
                <polygon
                    points={polygonPoints}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth={isRunning ? "2" : "1"}
                    strokeOpacity={isRunning ? "0.55" : "0.25"}
                    strokeDasharray={isRunning ? "4 3" : undefined}
                    style={{
                        transition: 'all 0.1s ease-out',
                    }}
                />

                {/* Inner secondary wave harmonic */}
                {isRunning && soundEnabled && (
                    <circle
                        cx="180"
                        cy="180"
                        r={baseRadius + (audioBands[0] || 0.2) * 10}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        style={{
                            animation: 'zenRingPulse 3s ease-in-out infinite',
                        }}
                    />
                )}
            </>
        );
    };

    // ==========================================
    // 2. RADIAL OSCILLOSCOPE RENDERING
    // ==========================================
    const renderOscilloscope = () => {
        const numSamples = waveformData.length;
        const gain = isRunning && soundEnabled ? 38 : 12;
        const pathPoints: string[] = [];

        for (let i = 0; i <= numSamples; i++) {
            const idx = i % numSamples;
            const angle = (i / numSamples) * 2 * Math.PI - Math.PI / 2;
            const val = waveformData[idx] ?? 0.5;
            const delta = (val - 0.5) * gain;
            const r = baseRadius + delta;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);

            if (i === 0) {
                pathPoints.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
            } else {
                pathPoints.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
            }
        }

        const pathD = pathPoints.join(' ') + ' Z';

        // 12 Radar reticle tick marks
        const reticleTicks = Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * 2 * Math.PI;
            const rInner = baseRadius - 22;
            const rOuter = baseRadius + 22;
            const x1 = center + rInner * Math.cos(angle);
            const y1 = center + rInner * Math.sin(angle);
            const x2 = center + rOuter * Math.cos(angle);
            const y2 = center + rOuter * Math.sin(angle);
            return (
                <line
                    key={`tick-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    strokeOpacity="0.7"
                />
            );
        });

        return (
            <>
                <defs>
                    <filter id="oscilloscopeGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <radialGradient id="scopeBackdrop" cx="50%" cy="50%" r="50%">
                        <stop offset="65%" stopColor={accentColor} stopOpacity="0.0" />
                        <stop offset="85%" stopColor={accentColor} stopOpacity={isRunning ? "0.14" : "0.03"} />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                    </radialGradient>
                </defs>

                {/* Oscilloscope Backdrop Aura */}
                <circle cx="180" cy="180" r="172" fill="url(#scopeBackdrop)" />

                {/* Reticle Guideline Rings */}
                <circle
                    cx="180"
                    cy="180"
                    r={baseRadius - 18}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="0.75"
                    strokeDasharray="2 4"
                    strokeOpacity="0.4"
                />
                <circle
                    cx="180"
                    cy="180"
                    r={baseRadius}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="0.75"
                    strokeDasharray="3 3"
                    strokeOpacity="0.5"
                />
                <circle
                    cx="180"
                    cy="180"
                    r={baseRadius + 18}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="0.75"
                    strokeDasharray="2 4"
                    strokeOpacity="0.4"
                />

                {/* Reticle Radial Axis Ticks */}
                {reticleTicks}

                {/* Faint Phosphor Persistence Ghost Trail */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="4"
                    strokeOpacity={isRunning && soundEnabled ? "0.2" : "0.08"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Primary Dancing Oscilloscope Beam */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={isRunning ? "#38bdf8" : accentColor}
                    strokeWidth={isRunning ? "2.2" : "1.5"}
                    strokeOpacity={isRunning ? "0.9" : "0.5"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#oscilloscopeGlow)"
                    style={{
                        transition: 'stroke 0.2s ease',
                    }}
                />
            </>
        );
    };

    // ==========================================
    // 3. RADIAL SPECTRUM ANALYZER RENDERING
    // ==========================================
    const renderSpectrum = () => {
        const numBands = 32;
        const innerRadius = 138;
        const maxBarLength = 34;

        const bars = [];
        const peakDots = [];

        for (let i = 0; i < numBands; i++) {
            const angle = (i / numBands) * 2 * Math.PI - Math.PI / 2;
            const energy = frequencyData[i] || 0.02;
            const peakEnergy = peaks[i] || 0.02;

            const barLen = Math.max(2, (isRunning && soundEnabled ? energy : energy * 0.4) * maxBarLength);
            const peakLen = Math.max(3, (isRunning && soundEnabled ? peakEnergy : peakEnergy * 0.4) * maxBarLength);

            const xStart = center + innerRadius * Math.cos(angle);
            const yStart = center + innerRadius * Math.sin(angle);

            const xEnd = center + (innerRadius + barLen) * Math.cos(angle);
            const yEnd = center + (innerRadius + barLen) * Math.sin(angle);

            const xPeak = center + (innerRadius + peakLen + 2) * Math.cos(angle);
            const yPeak = center + (innerRadius + peakLen + 2) * Math.sin(angle);

            // Bass -> Mids -> Treble hue transition
            const hue = 190 + (i / numBands) * 110; // Cyan -> Indigo -> Magenta
            const barColor = `hsl(${hue}, 85%, 60%)`;

            bars.push(
                <line
                    key={`bar-${i}`}
                    x1={xStart.toFixed(1)}
                    y1={yStart.toFixed(1)}
                    x2={xEnd.toFixed(1)}
                    y2={yEnd.toFixed(1)}
                    stroke={barColor}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeOpacity={isRunning ? "0.85" : "0.4"}
                />
            );

            // Winamp gravity-delayed peak dot caps
            peakDots.push(
                <circle
                    key={`peak-${i}`}
                    cx={xPeak.toFixed(1)}
                    cy={yPeak.toFixed(1)}
                    r="1.75"
                    fill="#facc15"
                    fillOpacity={isRunning ? "0.95" : "0.5"}
                />
            );
        }

        return (
            <>
                <defs>
                    <radialGradient id="spectrumBackdrop" cx="50%" cy="50%" r="50%">
                        <stop offset="65%" stopColor={accentColor} stopOpacity="0.0" />
                        <stop offset="88%" stopColor={accentColor} stopOpacity={isRunning ? "0.15" : "0.04"} />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                    </radialGradient>
                </defs>

                <circle cx="180" cy="180" r="172" fill="url(#spectrumBackdrop)" />

                {/* Base Anchor Circle */}
                <circle
                    cx="180"
                    cy="180"
                    r={innerRadius - 1}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                />

                {/* Radiating Spectrum Bars */}
                {bars}

                {/* Falling Peak-Hold Caps */}
                {peakDots}
            </>
        );
    };

    // ==========================================
    // 4. CLASSIC CRT OSCILLOSCOPE RENDERING
    // ==========================================
    const renderCrt = () => {
        const numSamples = waveformData.length;
        const gain = isRunning && soundEnabled ? 65 : 20;

        const screenLeft = 32;
        const screenRight = 328;
        const screenWidth = screenRight - screenLeft;
        const pathPoints: string[] = [];

        for (let i = 0; i < numSamples; i++) {
            const x = screenLeft + (i / (numSamples - 1)) * screenWidth;
            const val = waveformData[i] ?? 0.5;
            const delta = (val - 0.5) * gain;
            const y = center + delta;

            if (i === 0) {
                pathPoints.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
            } else {
                pathPoints.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
            }
        }

        const pathD = pathPoints.join(' ');

        return (
            <>
                <defs>
                    <filter id="crtBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="crtGlassGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.08" />
                        <stop offset="50%" stopColor="#0f172a" stopOpacity="0.0" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
                    </linearGradient>
                </defs>

                {/* CRT Monitor Bounding Box Frame */}
                <rect
                    x="24"
                    y="60"
                    width="312"
                    height="240"
                    rx="20"
                    fill="#020817"
                    stroke="#1e293b"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                />

                <rect
                    x="24"
                    y="60"
                    width="312"
                    height="240"
                    rx="20"
                    fill="url(#crtGlassGlow)"
                />

                {/* Oscilloscope Grid Reticle */}
                {/* Horizontal Grid Lines */}
                {[-60, -30, 0, 30, 60].map(dy => (
                    <line
                        key={`h-${dy}`}
                        x1="34"
                        y1={center + dy}
                        x2="326"
                        y2={center + dy}
                        stroke="#1e293b"
                        strokeWidth={dy === 0 ? "1" : "0.5"}
                        strokeDasharray={dy === 0 ? undefined : "2 3"}
                        strokeOpacity={dy === 0 ? "0.9" : "0.5"}
                    />
                ))}

                {/* Vertical Grid Lines */}
                {[-100, -50, 0, 50, 100].map(dx => (
                    <line
                        key={`v-${dx}`}
                        x1={center + dx}
                        y1="70"
                        x2={center + dx}
                        y2="290"
                        stroke="#1e293b"
                        strokeWidth={dx === 0 ? "1" : "0.5"}
                        strokeDasharray={dx === 0 ? undefined : "2 3"}
                        strokeOpacity={dx === 0 ? "0.9" : "0.5"}
                    />
                ))}

                {/* CRT Corner Status Readouts */}
                <text x="36" y="80" fill="#10b981" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.85">
                    CH1: 50mV/DIV
                </text>
                <text x="36" y="92" fill="#38bdf8" fontSize="7.5" fontFamily="monospace" opacity="0.75">
                    WINAMP CRT SCOPE
                </text>
                <text x="240" y="80" fill="#10b981" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.85">
                    TRIG: AUTO
                </text>
                <text x="248" y="92" fill="#64748b" fontSize="7.5" fontFamily="monospace" opacity="0.75">
                    TIME: 1.0ms
                </text>

                {/* CRT Bottom Center Crosshair Notch */}
                <line x1="170" y1="180" x2="190" y2="180" stroke="#10b981" strokeWidth="1.2" opacity="0.7" />
                <line x1="180" y1="170" x2="180" y2="190" stroke="#10b981" strokeWidth="1.2" opacity="0.7" />

                {/* Ghost Phosphor Persistence Trail */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeOpacity={isRunning && soundEnabled ? "0.2" : "0.08"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Sharp Neon Oscilloscope Beam */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={isRunning ? "#22c55e" : "#38bdf8"}
                    strokeWidth={isRunning ? "2.2" : "1.5"}
                    strokeOpacity={isRunning ? "0.95" : "0.6"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#crtBeamGlow)"
                />
            </>
        );
    };

    return (
        <svg
            viewBox="0 0 360 360"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
            }}
        >
            {visualizerMode === 'oscilloscope' && renderOscilloscope()}
            {visualizerMode === 'spectrum' && renderSpectrum()}
            {visualizerMode === 'crt' && renderCrt()}
            {visualizerMode === 'halo' && renderHalo()}
        </svg>
    );
}
