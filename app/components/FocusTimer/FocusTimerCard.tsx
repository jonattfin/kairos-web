import {
    Box,
    HStack,
    VStack,
    Text,
    Button,
    Badge,
} from "@chakra-ui/react";
import {
    LuZap,
    LuRotateCcw,
    LuPlay,
    LuPause,
    LuSkipForward,
    LuSlidersHorizontal,
    LuVolume2,
    LuVolumeX,
    LuSparkles,
} from "react-icons/lu";
import type { EnergyEvaluation, EnergyLevel, TimerPreset } from "../../types";
import { useFocusQuote } from "../../hooks/useFocusQuote";
import { FocusQuoteBanner } from "./FocusQuoteBanner";

interface FocusTimerCardProps {
    preset: TimerPreset;
    timeLeft: number;
    isRunning: boolean;
    soundEnabled?: boolean;
    formattedTime: string;
    circumference: number;
    strokeDashoffset: number;
    effectiveEnergy: EnergyEvaluation;
    manualOverrideLevel: EnergyLevel | null;
    onSelectPreset: (preset: TimerPreset) => void;
    onToggleTimer: () => void;
    onResetTimer: () => void;
    onSkipTimer: () => void;
    onToggleSound?: () => void;
    onOpenSoundMixer?: () => void;
    onOpenZenMode?: () => void;
    onSetManualOverrideLevel: (level: EnergyLevel | null) => void;
}

export function FocusTimerCard({
    preset,
    timeLeft,
    isRunning,
    soundEnabled = true,
    formattedTime,
    circumference,
    strokeDashoffset,
    effectiveEnergy,
    manualOverrideLevel,
    onSelectPreset,
    onToggleTimer,
    onResetTimer,
    onSkipTimer,
    onToggleSound,
    onOpenSoundMixer,
    onOpenZenMode,
    onSetManualOverrideLevel,
}: FocusTimerCardProps) {
    const { currentQuote, isFading, handleNextQuote } = useFocusQuote({ isRunning });

    return (
        <Box
            bg="#0a0f1d"
            border="1px solid #1e293b"
            rounded="2xl"
            p={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <Text fontSize="xs" color="#94a3b8" mb={3}>
                Biorhythm Focus Durations:
            </Text>

            {/* Duration Mode Selectors */}
            <HStack gap={2} w="full" justify="center" mb={6}>
                <Box
                    as="button"
                    flex="1"
                    textAlign="center"
                    bg={preset === 'deep' ? '#4f46e5' : '#0f172a'}
                    border="1px solid"
                    borderColor={preset === 'deep' ? '#6366f1' : '#1e293b'}
                    color={preset === 'deep' ? '#ffffff' : '#94a3b8'}
                    rounded="xl"
                    py={2}
                    fontSize="xs"
                    fontWeight={preset === 'deep' ? 'semibold' : 'medium'}
                    cursor="pointer"
                    shadow={preset === 'deep' ? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none'}
                    _hover={{ bg: preset === 'deep' ? '#4338ca' : '#1e293b' }}
                    onClick={() => onSelectPreset('deep')}
                >
                    Deep (50m)
                </Box>
                <Box
                    as="button"
                    flex="1"
                    textAlign="center"
                    bg={preset === 'classic' ? '#4f46e5' : '#0f172a'}
                    border="1px solid"
                    borderColor={preset === 'classic' ? '#6366f1' : '#1e293b'}
                    color={preset === 'classic' ? '#ffffff' : '#94a3b8'}
                    rounded="xl"
                    py={2}
                    fontSize="xs"
                    fontWeight={preset === 'classic' ? 'semibold' : 'medium'}
                    shadow={preset === 'classic' ? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none'}
                    cursor="pointer"
                    _hover={{ bg: preset === 'classic' ? '#4338ca' : '#1e293b' }}
                    onClick={() => onSelectPreset('classic')}
                >
                    Classic (25m)
                </Box>
                <Box
                    as="button"
                    flex="1"
                    textAlign="center"
                    bg={preset === 'micro' ? '#4f46e5' : '#0f172a'}
                    border="1px solid"
                    borderColor={preset === 'micro' ? '#6366f1' : '#1e293b'}
                    color={preset === 'micro' ? '#ffffff' : '#94a3b8'}
                    rounded="xl"
                    py={2}
                    fontSize="xs"
                    fontWeight={preset === 'micro' ? 'semibold' : 'medium'}
                    cursor="pointer"
                    shadow={preset === 'micro' ? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none'}
                    _hover={{ bg: preset === 'micro' ? '#4338ca' : '#1e293b' }}
                    onClick={() => onSelectPreset('micro')}
                >
                    Micro (15m)
                </Box>
            </HStack>

            {/* Circular Timer Gauge */}
            <Box position="relative" w="180px" h="180px" my={1}>
                <svg width="100%" height="100%" viewBox="0 0 180 180">
                    {/* Background track circle */}
                    <circle
                        cx="90"
                        cy="90"
                        r="76"
                        fill="#0a0f1d"
                        stroke="#1e1b4b"
                        strokeWidth="8"
                    />
                    {/* Active glowing progress arc */}
                    <circle
                        cx="90"
                        cy="90"
                        r="76"
                        fill="none"
                        stroke={timeLeft === 0 ? "#10b981" : isRunning ? "#6366f1" : "#4338ca"}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 90 90)"
                        style={{
                            transition: "stroke-dashoffset 0.5s ease",
                            filter: isRunning
                                ? "drop-shadow(0 0 10px rgba(99, 102, 241, 0.8))"
                                : "drop-shadow(0 0 5px rgba(99, 102, 241, 0.4))",
                        }}
                    />
                </svg>
                {/* Center time display */}
                <VStack
                    position="absolute"
                    top="0"
                    left="0"
                    w="full"
                    h="full"
                    justify="center"
                    align="center"
                    gap={0}
                >
                    <Text fontSize="3xl" fontWeight="bold" color="#ffffff" letterSpacing="tight">
                        {formattedTime}
                    </Text>
                    <Text
                        fontSize="9px"
                        fontWeight="bold"
                        color={timeLeft === 0 ? "#34d399" : isRunning ? "#818cf8" : "#94a3b8"}
                        letterSpacing="widest"
                    >
                        {timeLeft === 0 ? "SESSION FINISHED" : isRunning ? "FOCUS ACTIVE" : "PAUSED"}
                    </Text>
                </VStack>
            </Box>

            {/* In-Focus Wisdom & Quotes */}
            <FocusQuoteBanner
                quote={currentQuote}
                isFading={isFading}
                isRunning={isRunning}
                accentColor={effectiveEnergy.accentColor}
                onNextQuote={handleNextQuote}
                variant="card"
            />

            {/* Timer Action Buttons */}
            <HStack gap={3} mt={5} w="full" justify="center">
                <Box
                    as="button"
                    aria-label="Reset Timer"
                    w="38px"
                    h="38px"
                    rounded="xl"
                    bg="#0f172a"
                    border="1px solid #1e293b"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ bg: "#1e293b", color: "#ffffff" }}
                    color="#94a3b8"
                    onClick={onResetTimer}
                >
                    <LuRotateCcw size={16} />
                </Box>
                <Button
                    bg={isRunning ? "linear-gradient(135deg, #e11d48, #f43f5e)" : "linear-gradient(135deg, #4f46e5, #6366f1)"}
                    _hover={{ bg: isRunning ? "#be123c" : "#4338ca" }}
                    color="white"
                    rounded="xl"
                    px={6}
                    h="38px"
                    fontSize="xs"
                    fontWeight="semibold"
                    shadow={isRunning ? "0 0 16px rgba(244, 63, 94, 0.4)" : "0 0 16px rgba(99, 102, 241, 0.4)"}
                    onClick={onToggleTimer}
                >
                    {isRunning ? (
                        <>
                            <LuPause size={14} fill="currentColor" />
                            Pause Focus
                        </>
                    ) : (
                        <>
                            <LuPlay size={14} fill="currentColor" />
                            {timeLeft === 0 ? "Restart Session" : "Start Focus"}
                        </>
                    )}
                </Button>
                <Box
                    as="button"
                    aria-label="Skip / Complete Session"
                    w="38px"
                    h="38px"
                    rounded="xl"
                    bg="#0f172a"
                    border="1px solid #1e293b"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ bg: "#1e293b", color: "#ffffff" }}
                    color="#94a3b8"
                    onClick={onSkipTimer}
                >
                    <LuSkipForward size={16} />
                </Box>
            </HStack>

            {/* Quick Zen Mode & Soundscape Toolbar */}
            <HStack gap={2} mt={4} wrap="wrap" justify="center">
                {onOpenZenMode && (
                    <Button
                        size="xs"
                        bg="linear-gradient(135deg, #0284c7, #3b82f6)"
                        color="#ffffff"
                        _hover={{ opacity: 0.9 }}
                        rounded="full"
                        px={3.5}
                        py={1}
                        onClick={onOpenZenMode}
                        shadow="0 0 10px rgba(2, 132, 199, 0.3)"
                        title="Enter Fullscreen Zen Immersion Mode (F / Z)"
                    >
                        <HStack gap={1.5}>
                            <LuSparkles size={13} />
                            <Text>Zen Focus View</Text>
                            <Badge bg="rgba(255,255,255,0.2)" color="#fff" rounded="full" px={1} fontSize="8px">
                                F
                            </Badge>
                        </HStack>
                    </Button>
                )}

                {onOpenSoundMixer && (
                    <Button
                        size="xs"
                        variant="outline"
                        borderColor="#334155"
                        color="#cbd5e1"
                        bg="#0f172a"
                        _hover={{ bg: "#1e293b", borderColor: "#0284c7", color: "#38bdf8" }}
                        rounded="full"
                        px={3}
                        py={1}
                        onClick={onOpenSoundMixer}
                        title="Configure Soundscape Audio Layers (M)"
                    >
                        <HStack gap={1.5}>
                            <LuSlidersHorizontal size={13} color="#38bdf8" />
                            <Text>Mixer</Text>
                        </HStack>
                    </Button>
                )}

                {onToggleSound && (
                    <Button
                        size="xs"
                        variant="ghost"
                        color={soundEnabled ? "#38bdf8" : "#64748b"}
                        bg={soundEnabled ? "rgba(56, 189, 248, 0.1)" : "transparent"}
                        border="1px solid"
                        borderColor={soundEnabled ? "rgba(56, 189, 248, 0.3)" : "#1e293b"}
                        rounded="full"
                        px={2.5}
                        py={1}
                        onClick={onToggleSound}
                        title={soundEnabled ? "Mute Ambient Sound" : "Enable Ambient Sound"}
                    >
                        <HStack gap={1}>
                            {soundEnabled ? <LuVolume2 size={13} /> : <LuVolumeX size={13} />}
                            <Text fontSize="11px">{soundEnabled ? "Audio On" : "Muted"}</Text>
                        </HStack>
                    </Button>
                )}
            </HStack>

            {/* Energy Calibration Override */}
            <VStack gap={2} mt={5} w="full" align="center">
                <HStack justify="space-between" w="full" px={1}>
                    <Text fontSize="xs" color="#64748b">
                        Energy Check-In Calibration Override:
                    </Text>
                    {manualOverrideLevel && (
                        <Text
                            as="button"
                            fontSize="10px"
                            color="#818cf8"
                            cursor="pointer"
                            _hover={{ textDecoration: "underline" }}
                            onClick={() => onSetManualOverrideLevel(null)}
                        >
                            Reset to Auto
                        </Text>
                    )}
                </HStack>
                <HStack gap={2}>
                    <HStack
                        as="button"
                        bg={effectiveEnergy.level === 'low' && manualOverrideLevel === 'low' ? "#032e27" : "#0f172a"}
                        border="1px solid"
                        borderColor={effectiveEnergy.level === 'low' && manualOverrideLevel === 'low' ? "#059669" : "#1e293b"}
                        color={effectiveEnergy.level === 'low' && manualOverrideLevel === 'low' ? "#34d399" : "#cbd5e1"}
                        rounded="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        cursor="pointer"
                        _hover={{ bg: "#1e293b" }}
                        gap={1}
                        onClick={() => onSetManualOverrideLevel('low')}
                    >
                        <LuZap size={13} color="#facc15" />
                        <Text>Low</Text>
                    </HStack>
                    <HStack
                        as="button"
                        bg={effectiveEnergy.level === 'normal' && manualOverrideLevel === 'normal' ? "#1e1b4b" : "#0f172a"}
                        border="1px solid"
                        borderColor={effectiveEnergy.level === 'normal' && manualOverrideLevel === 'normal' ? "#6366f1" : "#1e293b"}
                        color={effectiveEnergy.level === 'normal' && manualOverrideLevel === 'normal' ? "#818cf8" : "#cbd5e1"}
                        rounded="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        cursor="pointer"
                        _hover={{ bg: "#1e293b" }}
                        gap={1}
                        onClick={() => onSetManualOverrideLevel('normal')}
                    >
                        <HStack gap={0.5}>
                            <LuZap size={13} color="#facc15" />
                            <LuZap size={13} color="#facc15" />
                        </HStack>
                        <Text>Normal</Text>
                    </HStack>
                    <HStack
                        as="button"
                        bg={effectiveEnergy.level === 'peak' && manualOverrideLevel === 'peak' ? "#3b0764" : "#0f172a"}
                        border="1px solid"
                        borderColor={effectiveEnergy.level === 'peak' && manualOverrideLevel === 'peak' ? "#a855f7" : "#1e293b"}
                        color={effectiveEnergy.level === 'peak' && manualOverrideLevel === 'peak' ? "#c084fc" : "#cbd5e1"}
                        rounded="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        cursor="pointer"
                        _hover={{ bg: "#1e293b" }}
                        gap={1}
                        onClick={() => onSetManualOverrideLevel('peak')}
                    >
                        <HStack gap={0.5}>
                            <LuZap size={13} color="#facc15" />
                            <LuZap size={13} color="#facc15" />
                            <LuZap size={13} color="#facc15" />
                        </HStack>
                        <Text>Peak</Text>
                    </HStack>
                </HStack>
            </VStack>
        </Box>
    );
}
