import type { SoundLayerId, SoundscapeConfig } from '../types';
import { DEFAULT_SOUND_CONFIG } from '../constants';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

/**
 * Creates a high quality seamless multi-second pink noise audio buffer.
 */
function createPinkNoiseBuffer(ctx: AudioContext, durationSeconds = 6): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSeconds);
    const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const output = noiseBuffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
            b6 = white * 0.115926;
        }

        // Apply gentle crossfade at buffer boundaries for seamless infinite looping
        const fadeLength = Math.floor(sampleRate * 0.25);
        for (let i = 0; i < fadeLength; i++) {
            const ratio = i / fadeLength;
            output[i] = output[i] * ratio + output[bufferSize - 1 - i] * (1 - ratio);
        }
    }

    return noiseBuffer;
}

/**
 * Creates brown noise buffer for deep warm rumble (campfire & rain bed).
 */
function createBrownNoiseBuffer(ctx: AudioContext, durationSeconds = 6): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * durationSeconds);
    const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const output = noiseBuffer.getChannelData(channel);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 0.35;
        }

        const fadeLength = Math.floor(sampleRate * 0.25);
        for (let i = 0; i < fadeLength; i++) {
            const ratio = i / fadeLength;
            output[i] = output[i] * ratio + output[bufferSize - 1 - i] * (1 - ratio);
        }
    }

    return noiseBuffer;
}

interface ActiveSoundscapeSession {
    masterGain: GainNode;
    analyserNode: AnalyserNode | null;
    layerGains: Record<SoundLayerId, GainNode>;
    noiseSources: AudioBufferSourceNode[];
    oscillators: OscillatorNode[];
    timerIds: number[];
    isStopping: boolean;
}

let activeSoundscape: ActiveSoundscapeSession | null = null;
let currentSoundConfig: SoundscapeConfig = { ...DEFAULT_SOUND_CONFIG };

/**
 * Returns current soundscape configuration.
 */
export function getSoundscapeConfig(): SoundscapeConfig {
    return currentSoundConfig;
}

/**
 * Sets and applies soundscape configuration.
 */
export function setSoundscapeConfig(config: SoundscapeConfig): void {
    currentSoundConfig = { ...config };
    updateSoundscapeVolumes();
}

/**
 * Toggles global mute state.
 */
export function toggleGlobalMute(): boolean {
    currentSoundConfig.isMuted = !currentSoundConfig.isMuted;
    updateSoundscapeVolumes();
    return currentSoundConfig.isMuted;
}

/**
 * Returns whether ambient focus sound is currently enabled (unmuted and masterVolume > 0).
 */
export function isAmbientSoundEnabled(): boolean {
    return !currentSoundConfig.isMuted && currentSoundConfig.masterVolume > 0;
}

/**
 * Toggles ambient focus sound and updates any running session.
 */
export function setAmbientSoundEnabled(enabled: boolean): void {
    currentSoundConfig.isMuted = !enabled;
    updateSoundscapeVolumes();
}

/**
 * Updates gain nodes dynamically for all active sound layers based on current config.
 */
export function updateSoundscapeVolumes(): void {
    if (!activeSoundscape || activeSoundscape.isStopping) return;

    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const effectiveMaster = currentSoundConfig.isMuted ? 0.0001 : Math.max(0.0001, currentSoundConfig.masterVolume);
        activeSoundscape.masterGain.gain.cancelScheduledValues(now);
        activeSoundscape.masterGain.gain.linearRampToValueAtTime(effectiveMaster, now + 0.15);

        // Update layer gains
        (Object.keys(activeSoundscape.layerGains) as SoundLayerId[]).forEach(layer => {
            const gainNode = activeSoundscape!.layerGains[layer];
            const targetVol = Math.max(0.0001, currentSoundConfig.layers[layer] ?? 0.5);
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.linearRampToValueAtTime(targetVol, now + 0.15);
        });
    } catch {
        // Audio parameter automation safety
    }
}

/**
 * Schedules stochastic dynamic wind gusts.
 */
function scheduleWindGusts(
    session: ActiveSoundscapeSession,
    ctx: AudioContext,
    gustBandpass: BiquadFilterNode,
    gustLowpass: BiquadFilterNode,
    gustGain: GainNode,
    panner: StereoPannerNode | null
): void {
    if (session.isStopping) return;

    const nextInterval = 2500 + Math.random() * 5000;
    const timerId = window.setTimeout(() => {
        if (session.isStopping || !activeSoundscape) return;

        try {
            const now = ctx.currentTime;
            const gustDuration = 2.5 + Math.random() * 3.7;
            const attackRatio = 0.28 + Math.random() * 0.25;
            const peakTime = now + gustDuration * attackRatio;
            const endTime = now + gustDuration;

            const baseFreq = 160 + Math.random() * 90;
            const peakFreq = 380 + Math.random() * 420;
            const baseLp = 320 + Math.random() * 120;
            const peakLp = 750 + Math.random() * 650;
            const peakVol = 0.15 + Math.random() * 0.22;
            const qVal = 2.2 + Math.random() * 2.6;

            if (panner) {
                const targetPan = (Math.random() * 2 - 1) * 0.45;
                panner.pan.cancelScheduledValues(now);
                panner.pan.setValueAtTime(panner.pan.value, now);
                panner.pan.linearRampToValueAtTime(targetPan, peakTime);
                panner.pan.linearRampToValueAtTime(0, endTime);
            }

            gustBandpass.Q.setValueAtTime(qVal, now);
            gustBandpass.frequency.cancelScheduledValues(now);
            gustBandpass.frequency.setValueAtTime(gustBandpass.frequency.value || baseFreq, now);
            gustBandpass.frequency.exponentialRampToValueAtTime(Math.max(20, peakFreq), peakTime);
            gustBandpass.frequency.exponentialRampToValueAtTime(Math.max(20, baseFreq), endTime);

            gustLowpass.frequency.cancelScheduledValues(now);
            gustLowpass.frequency.setValueAtTime(gustLowpass.frequency.value || baseLp, now);
            gustLowpass.frequency.linearRampToValueAtTime(peakLp, peakTime);
            gustLowpass.frequency.linearRampToValueAtTime(baseLp, endTime);

            gustGain.gain.cancelScheduledValues(now);
            gustGain.gain.setValueAtTime(Math.max(0.0001, gustGain.gain.value), now);
            gustGain.gain.exponentialRampToValueAtTime(peakVol, peakTime);
            gustGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

            scheduleWindGusts(session, ctx, gustBandpass, gustLowpass, gustGain, panner);
        } catch {
            // Automation safety
        }
    }, nextInterval);

    session.timerIds.push(timerId);
}

/**
 * Schedules dynamic procedural raindrop impacts.
 */
function scheduleRaindrops(
    session: ActiveSoundscapeSession,
    ctx: AudioContext,
    rainMasterGain: GainNode
): void {
    if (session.isStopping) return;

    const nextInterval = 80 + Math.random() * 220;
    const timerId = window.setTimeout(() => {
        if (session.isStopping || !activeSoundscape) return;

        try {
            const now = ctx.currentTime;
            // High frequency resonance click for raindrop on glass
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            const freq = 1200 + Math.random() * 3200;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.04);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(freq, now);
            filter.Q.setValueAtTime(4.0, now);

            const dropVol = (0.01 + Math.random() * 0.035) * (currentSoundConfig.layers.rain || 0.5);
            gain.gain.setValueAtTime(dropVol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(rainMasterGain);

            osc.start(now);
            osc.stop(now + 0.05);

            osc.onended = () => {
                osc.disconnect();
                filter.disconnect();
                gain.disconnect();
            };

            scheduleRaindrops(session, ctx, rainMasterGain);
        } catch {
            // Drop error safety
        }
    }, nextInterval);

    session.timerIds.push(timerId);
}

/**
 * Schedules stochastic micro-crackles for campfire audio.
 */
function scheduleCampfireCrackles(
    session: ActiveSoundscapeSession,
    ctx: AudioContext,
    fireMasterGain: GainNode
): void {
    if (session.isStopping) return;

    const nextInterval = 120 + Math.random() * 380;
    const timerId = window.setTimeout(() => {
        if (session.isStopping || !activeSoundscape) return;

        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            const freq = 600 + Math.random() * 2400;
            osc.type = Math.random() > 0.5 ? 'triangle' : 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.2, now + 0.025);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(freq, now);
            filter.Q.setValueAtTime(6.0, now);

            const crackleVol = (0.015 + Math.random() * 0.04) * (currentSoundConfig.layers.campfire || 0.5);
            gain.gain.setValueAtTime(crackleVol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(fireMasterGain);

            osc.start(now);
            osc.stop(now + 0.035);

            osc.onended = () => {
                osc.disconnect();
                filter.disconnect();
                gain.disconnect();
            };

            scheduleCampfireCrackles(session, ctx, fireMasterGain);
        } catch {
            // Crackle error safety
        }
    }, nextInterval);

    session.timerIds.push(timerId);
}

/**
 * Starts multi-layer generative soundscape engine.
 */
export function startLiveWindSound(): void {
    startSoundscape();
}

export function startSoundscape(config?: SoundscapeConfig): void {
    if (config) {
        currentSoundConfig = { ...config };
    }

    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        if (activeSoundscape && !activeSoundscape.isStopping) {
            updateSoundscapeVolumes();
            return;
        }

        if (activeSoundscape) {
            stopSoundscape(0.2);
        }

        const now = ctx.currentTime;
        const pinkBuffer = createPinkNoiseBuffer(ctx, 8);
        const brownBuffer = createBrownNoiseBuffer(ctx, 8);

        // Master Gain
        const masterGain = ctx.createGain();
        const effectiveMaster = currentSoundConfig.isMuted
            ? 0.0001
            : Math.max(0.0001, currentSoundConfig.masterVolume);
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(effectiveMaster, now + 1.2);

        // Analyser node for Zen visualizer halo
        let analyserNode: AnalyserNode | null = null;
        try {
            analyserNode = ctx.createAnalyser();
            analyserNode.fftSize = 256;
            analyserNode.smoothingTimeConstant = 0.75;
            masterGain.connect(analyserNode);
            analyserNode.connect(ctx.destination);
        } catch {
            masterGain.connect(ctx.destination);
        }

        const layerGains: Record<SoundLayerId, GainNode> = {
            wind: ctx.createGain(),
            rain: ctx.createGain(),
            waves: ctx.createGain(),
            campfire: ctx.createGain(),
        };

        const noiseSources: AudioBufferSourceNode[] = [];
        const oscillators: OscillatorNode[] = [];

        // Set initial layer gains
        (Object.keys(layerGains) as SoundLayerId[]).forEach(layer => {
            const gainNode = layerGains[layer];
            gainNode.gain.setValueAtTime(Math.max(0.0001, currentSoundConfig.layers[layer] ?? 0.5), now);
            gainNode.connect(masterGain);
        });

        // ==========================================
        // 1. WIND LAYER
        // ==========================================
        const windNoise = ctx.createBufferSource();
        windNoise.buffer = pinkBuffer;
        windNoise.loop = true;
        noiseSources.push(windNoise);

        const baseAirflowFilter = ctx.createBiquadFilter();
        baseAirflowFilter.type = 'lowpass';
        baseAirflowFilter.frequency.setValueAtTime(260, now);

        const baseAirflowGain = ctx.createGain();
        baseAirflowGain.gain.setValueAtTime(0.12, now);

        windNoise.connect(baseAirflowFilter);
        baseAirflowFilter.connect(baseAirflowGain);
        baseAirflowGain.connect(layerGains.wind);

        const gustBandpass = ctx.createBiquadFilter();
        gustBandpass.type = 'bandpass';
        gustBandpass.Q.setValueAtTime(2.8, now);
        gustBandpass.frequency.setValueAtTime(220, now);

        const gustLowpass = ctx.createBiquadFilter();
        gustLowpass.type = 'lowpass';
        gustLowpass.frequency.setValueAtTime(450, now);

        const gustGain = ctx.createGain();
        gustGain.gain.setValueAtTime(0.0001, now);

        let windPanner: StereoPannerNode | null = null;
        if (typeof ctx.createStereoPanner === 'function') {
            try {
                windPanner = ctx.createStereoPanner();
            } catch {
                windPanner = null;
            }
        }

        windNoise.connect(gustBandpass);
        gustBandpass.connect(gustLowpass);
        gustLowpass.connect(gustGain);

        if (windPanner) {
            gustGain.connect(windPanner);
            windPanner.connect(layerGains.wind);
        } else {
            gustGain.connect(layerGains.wind);
        }

        windNoise.start(now);

        // ==========================================
        // 2. RAIN LAYER
        // ==========================================
        const rainNoise = ctx.createBufferSource();
        rainNoise.buffer = pinkBuffer;
        rainNoise.loop = true;
        noiseSources.push(rainNoise);

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.setValueAtTime(800, now);
        rainFilter.Q.setValueAtTime(0.8, now);

        const rainBedGain = ctx.createGain();
        rainBedGain.gain.setValueAtTime(0.15, now);

        rainNoise.connect(rainFilter);
        rainFilter.connect(rainBedGain);
        rainBedGain.connect(layerGains.rain);

        rainNoise.start(now);

        // ==========================================
        // 3. ALPHA WAVE BINAURAL HUM (FLOW STATE)
        // ==========================================
        // Left channel: 216 Hz, Right channel: 226 Hz (10 Hz binaural beat)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const oscSub = ctx.createOscillator();

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(216, now);

        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(226, now); // 10Hz Alpha difference

        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(108, now); // Warm 108Hz harmonic sub-octave

        const alphaGainL = ctx.createGain();
        alphaGainL.gain.setValueAtTime(0.06, now);
        const alphaGainR = ctx.createGain();
        alphaGainR.gain.setValueAtTime(0.06, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.04, now);

        let pannerL: StereoPannerNode | null = null;
        let pannerR: StereoPannerNode | null = null;
        if (typeof ctx.createStereoPanner === 'function') {
            try {
                pannerL = ctx.createStereoPanner();
                pannerL.pan.setValueAtTime(-0.85, now);
                pannerR = ctx.createStereoPanner();
                pannerR.pan.setValueAtTime(0.85, now);
            } catch {
                pannerL = null;
                pannerR = null;
            }
        }

        if (pannerL && pannerR) {
            oscL.connect(alphaGainL);
            alphaGainL.connect(pannerL);
            pannerL.connect(layerGains.waves);

            oscR.connect(alphaGainR);
            alphaGainR.connect(pannerR);
            pannerR.connect(layerGains.waves);
        } else {
            oscL.connect(alphaGainL);
            alphaGainL.connect(layerGains.waves);
            oscR.connect(alphaGainR);
            alphaGainR.connect(layerGains.waves);
        }

        oscSub.connect(subGain);
        subGain.connect(layerGains.waves);

        oscL.start(now);
        oscR.start(now);
        oscSub.start(now);
        oscillators.push(oscL, oscR, oscSub);

        // ==========================================
        // 4. CAMPFIRE LAYER (WARM RUMBLE + CRACKLES)
        // ==========================================
        const fireNoise = ctx.createBufferSource();
        fireNoise.buffer = brownBuffer;
        fireNoise.loop = true;
        noiseSources.push(fireNoise);

        const fireFilter = ctx.createBiquadFilter();
        fireFilter.type = 'lowpass';
        fireFilter.frequency.setValueAtTime(180, now);

        const fireBedGain = ctx.createGain();
        fireBedGain.gain.setValueAtTime(0.18, now);

        fireNoise.connect(fireFilter);
        fireFilter.connect(fireBedGain);
        fireBedGain.connect(layerGains.campfire);

        fireNoise.start(now);

        const session: ActiveSoundscapeSession = {
            masterGain,
            analyserNode,
            layerGains,
            noiseSources,
            oscillators,
            timerIds: [],
            isStopping: false,
        };

        activeSoundscape = session;

        // Schedule organic dynamic events
        scheduleWindGusts(session, ctx, gustBandpass, gustLowpass, gustGain, windPanner);
        scheduleRaindrops(session, ctx, layerGains.rain);
        scheduleCampfireCrackles(session, ctx, layerGains.campfire);
    } catch {
        // Audio engine initialization safety
    }
}

/**
 * Smoothly stops running soundscape session.
 */
export function stopLiveWindSound(fadeTimeSeconds = 1.0): void {
    stopSoundscape(fadeTimeSeconds);
}

export function stopSoundscape(fadeTimeSeconds = 1.0): void {
    if (!activeSoundscape) return;

    const session = activeSoundscape;
    activeSoundscape = null;
    session.isStopping = true;

    session.timerIds.forEach(id => clearTimeout(id));
    session.timerIds = [];

    try {
        const ctx = getAudioContext();
        if (ctx) {
            const now = ctx.currentTime;
            session.masterGain.gain.cancelScheduledValues(now);
            session.masterGain.gain.setValueAtTime(Math.max(0.0001, session.masterGain.gain.value), now);
            session.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + fadeTimeSeconds);

            setTimeout(() => {
                try {
                    session.noiseSources.forEach(src => {
                        src.stop();
                        src.disconnect();
                    });
                    session.oscillators.forEach(osc => {
                        osc.stop();
                        osc.disconnect();
                    });
                    session.masterGain.disconnect();
                } catch {
                    // Cleanup safety
                }
            }, fadeTimeSeconds * 1000 + 100);
        }
    } catch {
        // Safety
    }
}

/**
 * Synthesizes a resonant Tibetan Singing Bowl / Focus Completion Chime.
 * Rings with warm fundamental tone and lush shimmering harmonic overtones.
 */
export function playCompletionChime(): void {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const fundamentalFreq = 432; // Calming 432Hz natural pitch
        const harmonics = [
            { mult: 1.0, gain: 0.28, decay: 4.8 },
            { mult: 2.01, gain: 0.18, decay: 3.9 },
            { mult: 3.02, gain: 0.11, decay: 2.8 },
            { mult: 4.25, gain: 0.06, decay: 1.8 },
        ];

        const chimeMaster = ctx.createGain();
        chimeMaster.gain.setValueAtTime(0.85, now);
        chimeMaster.connect(ctx.destination);

        harmonics.forEach(({ mult, gain: baseGain, decay }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(fundamentalFreq * mult, now);
            // Slight pitch shimmer vibrato
            osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * mult * 0.998, now + decay);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(baseGain, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

            osc.connect(gain);
            gain.connect(chimeMaster);

            osc.start(now);
            osc.stop(now + decay + 0.1);

            osc.onended = () => {
                osc.disconnect();
                gain.disconnect();
            };
        });
    } catch {
        // Chime audio safety
    }
}

/**
 * Helper to test the chime in UI.
 */
export function playTestChime(): void {
    playCompletionChime();
}

/**
 * Legacy alias for one-shot wind sound.
 */
export function playWindSound(): void {
    startSoundscape();
}

/**
 * Returns instantaneous live audio visualizer energy data for rendering the Zen Halo ring.
 */
export function getLiveAudioVisualizationData(): number[] {
    if (!activeSoundscape || !activeSoundscape.analyserNode) {
        return [0.2, 0.35, 0.5, 0.35, 0.2, 0.4, 0.25, 0.15];
    }

    try {
        const bufferLength = activeSoundscape.analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        activeSoundscape.analyserNode.getByteFrequencyData(dataArray);

        // Extract 8 sample energy bins normalized between 0.1 and 1.0
        const result: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 8));
        for (let i = 0; i < 8; i++) {
            const val = (dataArray[i * step] || 0) / 255;
            result.push(Math.max(0.1, val));
        }
        return result;
    } catch {
        return [0.2, 0.35, 0.5, 0.35, 0.2, 0.4, 0.25, 0.15];
    }
}

/**
 * Returns instantaneous live time-domain oscilloscope waveform data.
 * Values are normalized centered at 0.5 (range approx 0.0 to 1.0, where 0.5 is baseline zero).
 */
export function getLiveAudioWaveformData(samplesCount = 64): number[] {
    const result: number[] = [];
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;

    if (!activeSoundscape || !activeSoundscape.analyserNode) {
        // Idle gentle breathing harmonic wave
        for (let i = 0; i < samplesCount; i++) {
            const phase = (i / samplesCount) * Math.PI * 4;
            const idleOffset =
                Math.sin(phase + now * 1.5) * 0.04 +
                Math.sin(phase * 2 + now * 2.8) * 0.02 +
                Math.cos(phase * 0.5 - now * 0.7) * 0.015;
            result.push(0.5 + idleOffset);
        }
        return result;
    }

    try {
        const analyser = activeSoundscape.analyserNode;
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Check if there is actual audio activity (non-silent variance from 128)
        let hasActivity = false;
        for (let i = 0; i < bufferLength; i += 4) {
            if (Math.abs(dataArray[i] - 128) > 2) {
                hasActivity = true;
                break;
            }
        }

        if (!hasActivity) {
            // Idle gentle wave
            for (let i = 0; i < samplesCount; i++) {
                const phase = (i / samplesCount) * Math.PI * 4;
                const idleOffset =
                    Math.sin(phase + now * 1.5) * 0.04 +
                    Math.sin(phase * 2 + now * 2.8) * 0.02;
                result.push(0.5 + idleOffset);
            }
            return result;
        }

        const step = Math.max(1, Math.floor(bufferLength / samplesCount));
        for (let i = 0; i < samplesCount; i++) {
            const idx = Math.min(bufferLength - 1, i * step);
            const rawVal = dataArray[idx] ?? 128;
            // Normalize byte [0..255] to [0..1] centered at 0.5
            result.push(rawVal / 255);
        }
        return result;
    } catch {
        for (let i = 0; i < samplesCount; i++) {
            result.push(0.5);
        }
        return result;
    }
}

/**
 * Returns instantaneous live frequency spectrum data across discrete bands (bass -> treble).
 * Values are normalized between 0.0 and 1.0.
 */
export function getLiveAudioFrequencyData(bandsCount = 32): number[] {
    const result: number[] = [];
    const now = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;

    if (!activeSoundscape || !activeSoundscape.analyserNode) {
        // Idle gentle frequency spectrum floor
        for (let i = 0; i < bandsCount; i++) {
            const normIndex = i / bandsCount;
            const decay = Math.exp(-normIndex * 2.2);
            const oscillation = Math.sin(now * 2 + i * 0.3) * 0.04 + 0.08;
            result.push(Math.max(0.02, Math.min(0.8, decay * oscillation + 0.03)));
        }
        return result;
    }

    try {
        const analyser = activeSoundscape.analyserNode;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Group frequency bins with logarithmic spacing (more bins for bass/mid, fewer for high treble)
        const step = Math.max(1, Math.floor(bufferLength / bandsCount));
        for (let i = 0; i < bandsCount; i++) {
            const startIdx = i * step;
            const endIdx = Math.min(bufferLength, startIdx + step);
            let sum = 0;
            let count = 0;
            for (let j = startIdx; j < endIdx; j++) {
                sum += dataArray[j] ?? 0;
                count++;
            }
            const avg = count > 0 ? sum / count : 0;
            const normalized = avg / 255;
            result.push(Math.max(0.02, normalized));
        }
        return result;
    } catch {
        for (let i = 0; i < bandsCount; i++) {
            result.push(0.05);
        }
        return result;
    }
}
