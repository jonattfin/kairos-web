import { useEffect, useCallback, useState } from 'react';
import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    Badge,
} from "@chakra-ui/react";
import {
    LuMinimize2,
    LuMaximize,
    LuPlay,
    LuPause,
    LuRotateCcw,
    LuSkipForward,
    LuCheck,
    LuVolume2,
    LuVolumeX,
    LuSlidersHorizontal,
    LuTarget,
    LuSparkles,
    LuActivity,
} from "react-icons/lu";
import type { EnergyEvaluation, Task, TimerPreset, VisualizerMode } from "../../types";
import { VISUALIZER_MODES } from "../../constants";
import { loadStoredVisualizerMode, saveStoredVisualizerMode } from "../../utils/storage";
import { useFocusQuote } from "../../hooks/useFocusQuote";
import { FocusQuoteBanner } from "../FocusTimer/FocusQuoteBanner";
import { AudioVisualizerRing } from "./AudioVisualizerRing";

interface ZenModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTask?: Task;
    onToggleTaskComplete?: (id: string) => void;
    preset: TimerPreset;
    timeLeft: number;
    isRunning: boolean;
    formattedTime: string;
    circumference: number;
    strokeDashoffset: number;
    effectiveEnergy: EnergyEvaluation;
    soundEnabled: boolean;
    masterVolume: number;
    onSelectPreset: (preset: TimerPreset) => void;
    onToggleTimer: () => void;
    onResetTimer: () => void;
    onSkipTimer: () => void;
    onToggleSound: () => void;
    onSetMasterVolume: (vol: number) => void;
    onOpenSoundMixer: () => void;
}

export function ZenModeModal({
    isOpen,
    onClose,
    activeTask,
    onToggleTaskComplete,
    preset,
    isRunning,
    formattedTime,
    effectiveEnergy,
    soundEnabled,
    masterVolume,
    onSelectPreset,
    onToggleTimer,
    onResetTimer,
    onSkipTimer,
    onToggleSound,
    onSetMasterVolume,
    onOpenSoundMixer,
}: ZenModeModalProps) {
    const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(loadStoredVisualizerMode);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { currentQuote, isFading, handleNextQuote } = useFocusQuote({ isRunning });

    const handleSelectVisualizer = useCallback((mode: VisualizerMode) => {
        setVisualizerMode(mode);
        saveStoredVisualizerMode(mode);
        const opt = VISUALIZER_MODES.find(m => m.id === mode);
        if (opt) {
            setToastMessage(`${opt.label}`);
            setTimeout(() => setToastMessage(null), 2200);
        }
    }, []);

    const handleCycleVisualizer = useCallback(() => {
        setVisualizerMode(prev => {
            const currentIndex = VISUALIZER_MODES.findIndex(m => m.id === prev);
            const nextIndex = (currentIndex + 1) % VISUALIZER_MODES.length;
            const nextMode = VISUALIZER_MODES[nextIndex].id;
            saveStoredVisualizerMode(nextMode);
            setToastMessage(`${VISUALIZER_MODES[nextIndex].label} (V)`);
            setTimeout(() => setToastMessage(null), 2200);
            return nextMode;
        });
    }, []);

    const handleToggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }, []);

    // Global Hotkeys for Zen Mode: Space = toggle, Esc/F/Z = exit, M = mute, V = cycle visualizer
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if active input/textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                onToggleTimer();
            } else if (e.code === 'Escape' || e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'Z') {
                e.preventDefault();
                onClose();
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                onToggleSound();
            } else if (e.key === 'v' || e.key === 'V') {
                e.preventDefault();
                handleCycleVisualizer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onToggleTimer, onClose, onToggleSound, handleCycleVisualizer]);

    if (!isOpen) return null;

    const currentVisualizerOption =
        VISUALIZER_MODES.find(m => m.id === visualizerMode) || VISUALIZER_MODES[0];

    // Zen oversized SVG geometry: radius = 110, diameter = 240
    const zenRadius = 110;
    const zenCircumference = 2 * Math.PI * zenRadius;
    const totalPresetSeconds = preset === 'deep' ? 3000 : preset === 'classic' ? 1500 : 900;
    const zenProgressFraction = (totalPresetSeconds - (totalPresetSeconds - (zenCircumference > 0 ? 0 : 0))) / totalPresetSeconds;
    // Calculate accurate stroke offset
    const activeOffset = zenCircumference - (zenCircumference * zenProgressFraction);

    return (
        <Box
            position="fixed"
            inset="0"
            zIndex="3000"
            bg="#030712"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p={{ base: 4, md: 8 }}
            userSelect="none"
            overflow="hidden"
            style={{
                backgroundImage: `radial-gradient(circle at 50% 45%, ${effectiveEnergy.accentColor}18 0%, rgba(3, 7, 18, 0.95) 70%)`,
            }}
        >
            {/* Visualizer Mode Switch Toast */}
            {toastMessage && (
                <Box
                    position="absolute"
                    top={{ base: "14px", md: "20px" }}
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={3100}
                    bg="rgba(15, 23, 42, 0.9)"
                    border="1px solid #0284c7"
                    backdropFilter="blur(12px)"
                    rounded="full"
                    px={4}
                    py={1.5}
                    shadow="0 0 25px rgba(56, 189, 248, 0.45)"
                    pointerEvents="none"
                >
                    <HStack gap={2}>
                        <LuActivity size={14} color="#38bdf8" />
                        <Text fontSize="xs" fontWeight="bold" color="#f8fafc">
                            Visualizer: {toastMessage}
                        </Text>
                    </HStack>
                </Box>
            )}

            {/* Top Navigation Bar */}
            <Flex justify="space-between" align="center" w="full" maxW="1100px" mx="auto">
                <HStack gap={2.5}>
                    <Box
                        w="32px"
                        h="32px"
                        rounded="xl"
                        bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        shadow="0 0 10px rgba(6, 182, 212, 0.4)"
                    >
                        <LuSparkles size={16} color="#ffffff" />
                    </Box>
                    <Box>
                        <HStack gap={2}>
                            <Text fontSize="sm" fontWeight="bold" letterSpacing="wide">
                                ZEN IMMERSION MODE
                            </Text>
                            <Badge
                                bg="rgba(56, 189, 248, 0.15)"
                                color="#38bdf8"
                                border="1px solid #0284c7"
                                rounded="full"
                                px={2}
                                py={0.2}
                                fontSize="10px"
                            >
                                Distraction-Free
                            </Badge>
                        </HStack>
                    </Box>
                </HStack>

                {/* Zen Header Controls */}
                <HStack gap={2}>
                    <Button
                        size="xs"
                        variant="ghost"
                        color="#94a3b8"
                        _hover={{ color: "#38bdf8", bg: "#1e293b" }}
                        rounded="lg"
                        px={2.5}
                        onClick={handleCycleVisualizer}
                        title={`Cycle Visualizer Mode (V) - Currently: ${currentVisualizerOption.label}`}
                    >
                        <HStack gap={1.5}>
                            <LuActivity size={14} color="#38bdf8" />
                            <Text display={{ base: "none", sm: "inline" }}>
                                {currentVisualizerOption.shortLabel}
                            </Text>
                            <Badge
                                bg="rgba(56, 189, 248, 0.15)"
                                color="#38bdf8"
                                rounded="md"
                                px={1}
                                py={0}
                                fontSize="9px"
                            >
                                V
                            </Badge>
                        </HStack>
                    </Button>

                    <Button
                        size="xs"
                        variant="ghost"
                        color="#94a3b8"
                        _hover={{ color: "#ffffff", bg: "#1e293b" }}
                        rounded="lg"
                        px={2.5}
                        onClick={onOpenSoundMixer}
                        title="Open Soundscape Mixer (M)"
                    >
                        <HStack gap={1.5}>
                            <LuSlidersHorizontal size={14} />
                            <Text display={{ base: "none", sm: "inline" }}>Soundscape</Text>
                        </HStack>
                    </Button>

                    <Button
                        size="xs"
                        variant="ghost"
                        color={soundEnabled ? "#38bdf8" : "#64748b"}
                        _hover={{ bg: "#1e293b" }}
                        rounded="lg"
                        p={2}
                        onClick={onToggleSound}
                        title={soundEnabled ? "Mute Ambient Audio (M)" : "Enable Ambient Audio (M)"}
                    >
                        {soundEnabled ? <LuVolume2 size={16} /> : <LuVolumeX size={16} />}
                    </Button>

                    <Button
                        size="xs"
                        variant="ghost"
                        color="#94a3b8"
                        _hover={{ color: "#ffffff", bg: "#1e293b" }}
                        rounded="lg"
                        p={2}
                        onClick={handleToggleFullscreen}
                        title="Toggle Fullscreen"
                    >
                        <LuMaximize size={16} />
                    </Button>

                    <Button
                        size="xs"
                        bg="#1e293b"
                        color="#f8fafc"
                        border="1px solid #334155"
                        _hover={{ bg: "#334155" }}
                        rounded="lg"
                        px={3}
                        onClick={onClose}
                        title="Exit Zen Mode (Esc / F)"
                    >
                        <HStack gap={1}>
                            <LuMinimize2 size={14} />
                            <Text>Exit Zen (Esc)</Text>
                        </HStack>
                    </Button>
                </HStack>
            </Flex>

            {/* Main Center Focus Section */}
            <VStack
                flex="1"
                justify="center"
                align="center"
                gap={6}
                maxW="600px"
                mx="auto"
                w="full"
                py={4}
            >
                {/* Active Target Banner */}
                {activeTask ? (
                    <Box
                        w="full"
                        bg="rgba(15, 23, 42, 0.7)"
                        border="1px solid rgba(51, 65, 85, 0.8)"
                        backdropFilter="blur(10px)"
                        rounded="2xl"
                        p={4}
                        shadow="0 10px 30px rgba(0, 0, 0, 0.5)"
                        textAlign="center"
                    >
                        <HStack justify="center" gap={2} mb={1}>
                            <LuTarget size={14} color="#38bdf8" />
                            <Text fontSize="xs" fontWeight="bold" color="#38bdf8" letterSpacing="wider" textTransform="uppercase">
                                Active Target Focus
                            </Text>
                            <Badge
                                bg="#1e1b4b"
                                color="#a5b4fc"
                                border="1px solid #3730a3"
                                rounded="full"
                                px={1.5}
                                py={0.2}
                                fontSize="10px"
                            >
                                {activeTask.quadrant.toUpperCase()}
                            </Badge>
                        </HStack>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="#f8fafc" mb={2}>
                            {activeTask.title}
                        </Text>

                        {onToggleTaskComplete && (
                            <Button
                                size="xs"
                                variant="outline"
                                borderColor={activeTask.completed ? "#10b981" : "#475569"}
                                color={activeTask.completed ? "#34d399" : "#94a3b8"}
                                bg={activeTask.completed ? "rgba(16, 185, 129, 0.15)" : "transparent"}
                                _hover={{ borderColor: "#10b981", color: "#34d399" }}
                                rounded="full"
                                px={3}
                                onClick={() => onToggleTaskComplete(activeTask.id)}
                            >
                                <HStack gap={1}>
                                    <LuCheck size={12} />
                                    <Text>{activeTask.completed ? "Marked as Completed" : "Mark as Complete"}</Text>
                                </HStack>
                            </Button>
                        )}
                    </Box>
                ) : (
                    <Box
                        bg="rgba(15, 23, 42, 0.4)"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        px={4}
                        py={2}
                        textAlign="center"
                    >
                        <Text fontSize="xs" color="#94a3b8">
                            Distraction-Free Deep Flow Canvas
                        </Text>
                    </Box>
                )}

                {/* Oversized Circular Timer & Audio Visualizer Ring */}
                <Box
                    position="relative"
                    w={{ base: "280px", sm: "340px", md: "360px" }}
                    h={{ base: "280px", sm: "340px", md: "360px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {/* Dynamic Soundwave Visualizer Ring */}
                    <AudioVisualizerRing
                        visualizerMode={visualizerMode}
                        isRunning={isRunning}
                        soundEnabled={soundEnabled}
                        accentColor={effectiveEnergy.accentColor}
                    />

                    {/* SVG Circular Progress Ring */}
                    <svg
                        viewBox="0 0 240 240"
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: 'rotate(-90deg)',
                            position: 'relative',
                            zIndex: 2,
                        }}
                    >
                        <defs>
                            <linearGradient id="zenTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor={effectiveEnergy.accentColor} />
                            </linearGradient>
                            <filter id="zenGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Background Track */}
                        <circle
                            cx="120"
                            cy="120"
                            r={zenRadius}
                            fill="transparent"
                            stroke="#111827"
                            strokeWidth="10"
                        />

                        {/* Animated Progress Circle */}
                        <circle
                            cx="120"
                            cy="120"
                            r={zenRadius}
                            fill="transparent"
                            stroke="url(#zenTimerGradient)"
                            strokeWidth="10"
                            strokeDasharray={zenCircumference}
                            strokeDashoffset={activeOffset}
                            strokeLinecap="round"
                            filter={isRunning ? "url(#zenGlow)" : undefined}
                            style={{
                                transition: 'stroke-dashoffset 0.8s ease-in-out',
                            }}
                        />
                    </svg>

                    {/* Central Digital Time Display */}
                    <VStack
                        position="absolute"
                        zIndex={3}
                        gap={1}
                        textAlign="center"
                        pointerEvents="none"
                    >
                        <Badge
                            bg={isRunning ? "rgba(16, 185, 129, 0.2)" : "rgba(100, 116, 139, 0.2)"}
                            color={isRunning ? "#34d399" : "#94a3b8"}
                            border="1px solid"
                            borderColor={isRunning ? "#10b981" : "#475569"}
                            rounded="full"
                            px={3}
                            py={0.5}
                            fontSize="11px"
                            fontWeight="bold"
                            letterSpacing="wider"
                        >
                            {isRunning ? "● FLOW ACTIVE" : "PAUSED"}
                        </Badge>

                        <Text
                            fontSize={{ base: "4xl", sm: "5xl", md: "6xl" }}
                            fontWeight="extrabold"
                            fontFamily="mono"
                            letterSpacing="tight"
                            color="#ffffff"
                            style={{
                                textShadow: isRunning ? `0 0 25px ${effectiveEnergy.accentColor}88` : undefined,
                            }}
                        >
                            {formattedTime}
                        </Text>

                        <Text fontSize="xs" color="#94a3b8" fontWeight="medium">
                            {effectiveEnergy.phaseName} ({effectiveEnergy.percentage}% Energy)
                        </Text>
                    </VStack>
                </Box>

                {/* Preset Selector Buttons */}
                <HStack gap={2} bg="#0f172a" p={1.5} rounded="xl" border="1px solid #1e293b">
                    {[
                        { id: 'deep', label: 'Deep 50m' },
                        { id: 'classic', label: 'Classic 25m' },
                        { id: 'micro', label: 'Micro 15m' },
                    ].map(p => {
                        const isSelected = preset === p.id;
                        return (
                            <Button
                                key={p.id}
                                size="xs"
                                variant={isSelected ? "solid" : "ghost"}
                                bg={isSelected ? "#1e293b" : "transparent"}
                                color={isSelected ? "#38bdf8" : "#94a3b8"}
                                border={isSelected ? "1px solid #0284c7" : "none"}
                                rounded="lg"
                                px={3}
                                py={1}
                                onClick={() => onSelectPreset(p.id as TimerPreset)}
                            >
                                {p.label}
                            </Button>
                        );
                    })}
                </HStack>

                {/* Multi-Mode Visualizer Switcher Pill Bar */}
                <HStack
                    gap={1}
                    bg="#0a0f1d"
                    p={1}
                    rounded="xl"
                    border="1px solid #1e293b"
                    flexWrap="wrap"
                    justify="center"
                    maxW="500px"
                    w="full"
                >
                    {VISUALIZER_MODES.map(vm => {
                        const isSelected = visualizerMode === vm.id;
                        return (
                            <Button
                                key={vm.id}
                                size="xs"
                                variant={isSelected ? "solid" : "ghost"}
                                bg={isSelected ? "rgba(56, 189, 248, 0.16)" : "transparent"}
                                color={isSelected ? "#38bdf8" : "#94a3b8"}
                                border={isSelected ? "1px solid #0284c7" : "1px solid transparent"}
                                _hover={{
                                    bg: isSelected ? "rgba(56, 189, 248, 0.24)" : "#1e293b",
                                    color: isSelected ? "#38bdf8" : "#f1f5f9",
                                }}
                                rounded="lg"
                                px={2.5}
                                py={1}
                                fontSize="11px"
                                onClick={() => handleSelectVisualizer(vm.id)}
                                title={`${vm.label} (Press V to cycle) - ${vm.description}`}
                            >
                                <HStack gap={1.5}>
                                    {vm.id === 'oscilloscope' && <LuActivity size={12} />}
                                    {vm.id === 'spectrum' && <LuSlidersHorizontal size={12} />}
                                    {vm.id === 'crt' && <LuMaximize size={12} />}
                                    {vm.id === 'halo' && <LuSparkles size={12} />}
                                    <Text>{vm.shortLabel}</Text>
                                </HStack>
                            </Button>
                        );
                    })}
                </HStack>

                {/* In-Focus Wisdom & Quotes */}
                <FocusQuoteBanner
                    quote={currentQuote}
                    isFading={isFading}
                    isRunning={isRunning}
                    accentColor={effectiveEnergy.accentColor}
                    onNextQuote={handleNextQuote}
                    variant="zen"
                />

                {/* Primary Timer Controls */}
                <HStack gap={4}>
                    <Button
                        size="md"
                        variant="outline"
                        borderColor="#334155"
                        color="#cbd5e1"
                        _hover={{ bg: "#1e293b", color: "#f8fafc" }}
                        rounded="2xl"
                        w="46px"
                        h="46px"
                        p={0}
                        onClick={onResetTimer}
                        title="Reset Timer"
                    >
                        <LuRotateCcw size={18} />
                    </Button>

                    <Button
                        size="lg"
                        bg={isRunning ? "#ef4444" : "linear-gradient(135deg, #0284c7, #3b82f6)"}
                        color="#ffffff"
                        _hover={{ opacity: 0.9 }}
                        rounded="2xl"
                        px={8}
                        h="52px"
                        shadow={isRunning ? "0 0 20px rgba(239, 68, 68, 0.4)" : "0 0 20px rgba(2, 132, 199, 0.4)"}
                        onClick={onToggleTimer}
                    >
                        <HStack gap={2}>
                            {isRunning ? <LuPause size={22} /> : <LuPlay size={22} />}
                            <Text fontSize="md" fontWeight="bold">
                                {isRunning ? "Pause" : "Start Focus"}
                            </Text>
                        </HStack>
                    </Button>

                    <Button
                        size="md"
                        variant="outline"
                        borderColor="#334155"
                        color="#cbd5e1"
                        _hover={{ bg: "#1e293b", color: "#f8fafc" }}
                        rounded="2xl"
                        w="46px"
                        h="46px"
                        p={0}
                        onClick={onSkipTimer}
                        title="Skip / Complete Interval"
                    >
                        <LuSkipForward size={18} />
                    </Button>
                </HStack>
            </VStack>

            {/* Bottom Ambient Sound Control Bar */}
            <Flex
                justify="center"
                align="center"
                gap={3}
                w="full"
                maxW="400px"
                mx="auto"
                bg="rgba(15, 23, 42, 0.6)"
                border="1px solid #1e293b"
                backdropFilter="blur(8px)"
                rounded="full"
                px={4}
                py={2}
            >
                <Button
                    size="xs"
                    variant="ghost"
                    color={soundEnabled ? "#38bdf8" : "#64748b"}
                    p={1}
                    onClick={onToggleSound}
                >
                    {soundEnabled ? <LuVolume2 size={16} /> : <LuVolumeX size={16} />}
                </Button>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={soundEnabled ? masterVolume : 0}
                    onChange={(e) => onSetMasterVolume(parseFloat(e.target.value))}
                    style={{
                        flex: 1,
                        accentColor: "#38bdf8",
                        cursor: "pointer",
                        height: "4px",
                    }}
                />

                <Text fontSize="xs" fontFamily="mono" color="#94a3b8" minW="32px">
                    {soundEnabled ? `${Math.round(masterVolume * 100)}%` : "0%"}
                </Text>
            </Flex>
        </Box>
    );
}
