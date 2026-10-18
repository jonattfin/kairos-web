import {
    Box,
    Flex,
    HStack,
    Text,
    Badge,
    Button,
} from "@chakra-ui/react";
import {
    LuActivity,
    LuUser,
    LuChevronDown,
    LuSparkles,
    LuChartPie,
    LuSlidersHorizontal,
    LuZap,
    LuCheck,
    LuVolume2,
    LuVolumeX,
    LuHouse,
} from "react-icons/lu";
import type { ChronotypeId, EnergyEvaluation, SoundscapeConfig } from "../../types";
import { CHRONOTYPES } from "../../constants";

interface HeaderProps {
    effectiveEnergy: EnergyEvaluation;
    chronotype: ChronotypeId;
    isScheduleMenuOpen: boolean;
    soundConfig?: SoundscapeConfig;
    onToggleScheduleMenu: () => void;
    onSelectChronotype: (type: ChronotypeId) => void;
    onNavigateHome?: () => void;
    onOpenAnalytics?: () => void;
    onOpenZenMode?: () => void;
    onOpenSoundMixer?: () => void;
}

export function Header({
    effectiveEnergy,
    chronotype,
    isScheduleMenuOpen,
    soundConfig,
    onToggleScheduleMenu,
    onSelectChronotype,
    onNavigateHome,
    onOpenAnalytics,
    onOpenZenMode,
    onOpenSoundMixer,
}: HeaderProps) {
    return (
        <Flex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align={{ base: "flex-start", lg: "center" }}
            gap={4}
            mb={6}
        >
            {/* Brand */}
            <HStack
                gap={3}
                cursor={onNavigateHome ? "pointer" : "default"}
                onClick={onNavigateHome}
                title={onNavigateHome ? "Return to Home Page & Philosophy" : undefined}
            >
                <Box
                    w="42px"
                    h="42px"
                    rounded="xl"
                    bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    shadow="0 0 15px rgba(6, 182, 212, 0.4)"
                >
                    <LuActivity size={24} color="#ffffff" />
                </Box>
                <Box>
                    <HStack gap={2}>
                        <Text fontSize="xl" fontWeight="bold" letterSpacing="tight">
                            Kairos Focus Engine
                        </Text>
                        <Badge
                            bg="#1e1b4b"
                            color="#818cf8"
                            border="1px solid #3730a3"
                            rounded="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                            fontWeight="bold"
                        >
                            by PeaksAndValleys
                        </Badge>
                    </HStack>
                    <Text fontSize="xs" color="#64748b">
                        Circadian Prioritization & Time-Boxing Matrix
                    </Text>
                </Box>
            </HStack>

            {/* Quick Controls */}
            <Flex wrap="wrap" align="center" gap={2}>
                {/* Home / Philosophy Button */}
                {onNavigateHome && (
                    <Button
                        onClick={onNavigateHome}
                        bg="#0f172a"
                        border="1px solid #1e293b"
                        _hover={{ bg: "#1e293b", borderColor: "#38bdf8", color: "#ffffff" }}
                        color="#cbd5e1"
                        rounded="full"
                        px={3.5}
                        h="32px"
                        fontSize="xs"
                        fontWeight="semibold"
                        cursor="pointer"
                        title="Return to Home Landing Page"
                    >
                        <HStack gap={1.5}>
                            <LuHouse size={14} color="#38bdf8" />
                            <Text>Home</Text>
                        </HStack>
                    </Button>
                )}
                {/* Energy Status Pill */}
                <HStack
                    bg={effectiveEnergy.badgeBg}
                    border="1px solid"
                    borderColor={effectiveEnergy.badgeBorder}
                    color={effectiveEnergy.badgeColor}
                    rounded="full"
                    px={3.5}
                    py={1.5}
                    fontSize="xs"
                    fontWeight="medium"
                    gap={1.5}
                    shadow="0 0 10px rgba(0,0,0,0.3)"
                >
                    <LuZap size={14} color="#facc15" />
                    <Text>
                        Energy: {effectiveEnergy.percentage}%{" "}
                        <Text as="span" color={effectiveEnergy.accentColor}>
                            ({effectiveEnergy.phaseName})
                        </Text>
                    </Text>
                </HStack>

                {/* Standard Schedule Dropdown Container */}
                <Box position="relative">
                    <HStack
                        as="button"
                        bg="#0f172a"
                        border="1px solid #1e293b"
                        color="#cbd5e1"
                        rounded="full"
                        px={3.5}
                        py={1.5}
                        fontSize="xs"
                        cursor="pointer"
                        gap={2}
                        _hover={{ bg: "#1e293b", borderColor: "#334155" }}
                        onClick={onToggleScheduleMenu}
                    >
                        <LuUser size={14} color="#94a3b8" />
                        <Text>{CHRONOTYPES[chronotype].name}</Text>
                        <LuChevronDown size={14} color="#94a3b8" />
                    </HStack>

                    {/* Dropdown Menu */}
                    {isScheduleMenuOpen && (
                        <Box
                            position="absolute"
                            top="calc(100% + 6px)"
                            right="0"
                            bg="#0a0f1d"
                            border="1px solid #1e293b"
                            rounded="xl"
                            p={2}
                            w="260px"
                            shadow="0 10px 25px rgba(0,0,0,0.6)"
                            zIndex={100}
                        >
                            <Text fontSize="10px" color="#64748b" px={2} py={1} fontWeight="bold" letterSpacing="wider">
                                CIRCADIAN CHRONOTYPE
                            </Text>
                            {(Object.keys(CHRONOTYPES) as ChronotypeId[]).map(key => {
                                const c = CHRONOTYPES[key];
                                const isSelected = chronotype === key;
                                return (
                                    <Box
                                        key={key}
                                        as="button"
                                        w="full"
                                        textAlign="left"
                                        p={2}
                                        rounded="lg"
                                        bg={isSelected ? "#1e1b4b" : "transparent"}
                                        color={isSelected ? "#818cf8" : "#cbd5e1"}
                                        _hover={{ bg: "#1e293b" }}
                                        onClick={() => onSelectChronotype(key)}
                                        cursor="pointer"
                                    >
                                        <HStack justify="space-between">
                                            <Text fontSize="xs" fontWeight="semibold">
                                                {c.name}
                                            </Text>
                                            {isSelected && <LuCheck size={14} color="#818cf8" />}
                                        </HStack>
                                        <Text fontSize="10px" color="#64748b" mt={0.5}>
                                            {c.description}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {/* Soundscape Mixer Button */}
                <HStack
                    as="button"
                    bg="#0f172a"
                    border="1px solid #1e293b"
                    color="#cbd5e1"
                    rounded="full"
                    px={3.5}
                    py={1.5}
                    fontSize="xs"
                    cursor="pointer"
                    gap={2}
                    _hover={{ bg: "#1e293b", borderColor: "#0284c7" }}
                    onClick={onOpenSoundMixer}
                    title="Open Generative Soundscape Mixer (M)"
                >
                    {soundConfig?.isMuted ? (
                        <LuVolumeX size={14} color="#ef4444" />
                    ) : (
                        <LuVolume2 size={14} color="#38bdf8" />
                    )}
                    <Text display={{ base: "none", sm: "inline" }}>Soundscape</Text>
                    <LuSlidersHorizontal size={13} color="#94a3b8" />
                </HStack>

                {/* Zen Immersion Mode Button */}
                <Button
                    onClick={onOpenZenMode}
                    bg="linear-gradient(135deg, #0284c7, #3b82f6)"
                    _hover={{ opacity: 0.9 }}
                    color="white"
                    rounded="full"
                    px={3.5}
                    h="32px"
                    fontSize="xs"
                    fontWeight="semibold"
                    shadow="0 0 15px rgba(2, 132, 199, 0.4)"
                    cursor="pointer"
                    title="Enter Distraction-Free Zen Mode (F / Z)"
                >
                    <HStack gap={1.5}>
                        <LuSparkles size={14} />
                        <Text>Zen Mode</Text>
                        <Badge
                            bg="rgba(255, 255, 255, 0.2)"
                            color="#ffffff"
                            rounded="full"
                            px={1.5}
                            fontSize="9px"
                        >
                            F
                        </Badge>
                    </HStack>
                </Button>

                {/* Analytics Button */}
                <Button
                    onClick={onOpenAnalytics}
                    bg="#4f46e5"
                    _hover={{ bg: "#4338ca" }}
                    color="white"
                    rounded="full"
                    px={3.5}
                    h="32px"
                    fontSize="xs"
                    fontWeight="semibold"
                    shadow="0 0 12px rgba(79, 70, 229, 0.4)"
                    cursor="pointer"
                >
                    <HStack gap={1.5}>
                        <LuChartPie size={14} />
                        <Text>Analytics</Text>
                    </HStack>
                </Button>
            </Flex>
        </Flex>
    );
}
