import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    Badge,
    Grid,
} from "@chakra-ui/react";
import {
    LuX,
    LuVolume2,
    LuVolumeX,
    LuWind,
    LuCloudRain,
    LuActivity,
    LuFlame,
    LuBell,
    LuCheck,
    LuSlidersHorizontal,
} from "react-icons/lu";
import type { SoundLayerId, SoundPresetId, SoundscapeConfig } from "../../types";
import { SOUND_PRESETS } from "../../constants";

interface SoundscapeMixerModalProps {
    isOpen: boolean;
    onClose: () => void;
    soundConfig: SoundscapeConfig;
    onSetMasterVolume: (vol: number) => void;
    onToggleMute: () => void;
    onSetLayerVolume: (layer: SoundLayerId, vol: number) => void;
    onSelectPreset: (preset: SoundPresetId) => void;
    onPlayTestChime: () => void;
}

export function SoundscapeMixerModal({
    isOpen,
    onClose,
    soundConfig,
    onSetMasterVolume,
    onToggleMute,
    onSetLayerVolume,
    onSelectPreset,
    onPlayTestChime,
}: SoundscapeMixerModalProps) {
    if (!isOpen) return null;

    const layersMeta: {
        id: SoundLayerId;
        label: string;
        desc: string;
        icon: React.ReactNode;
        color: string;
    }[] = [
        {
            id: 'wind',
            label: 'Atmospheric Wind',
            desc: 'Dynamic procedural gusts & soothing pink airflow',
            icon: <LuWind size={18} />,
            color: '#38bdf8',
        },
        {
            id: 'rain',
            label: 'Soft Rain on Glass',
            desc: 'Gentle raindrop impacts & ambient rain shower',
            icon: <LuCloudRain size={18} />,
            color: '#60a5fa',
        },
        {
            id: 'waves',
            label: 'Alpha Wave Drone (10Hz)',
            desc: 'Binaural flow-state oscillation with harmonic warmth',
            icon: <LuActivity size={18} />,
            color: '#c084fc',
        },
        {
            id: 'campfire',
            label: 'Cozy Hearth & Crackle',
            desc: 'Warm soothing low fire hum and micro-crackles',
            icon: <LuFlame size={18} />,
            color: '#fb923c',
        },
    ];

    const presetKeys = Object.keys(SOUND_PRESETS) as SoundPresetId[];

    return (
        <Box
            position="fixed"
            inset="0"
            zIndex="2000"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={4}
            bg="rgba(3, 7, 18, 0.85)"
            backdropFilter="blur(12px)"
            onClick={onClose}
        >
            <Box
                w="full"
                maxW="640px"
                bg="#0b0f19"
                border="1px solid #1e293b"
                rounded="2xl"
                p={6}
                shadow="0 25px 50px -12px rgba(0, 0, 0, 0.7)"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <Flex justify="space-between" align="center" mb={5}>
                    <HStack gap={3}>
                        <Box
                            w="40px"
                            h="40px"
                            rounded="xl"
                            bg="linear-gradient(135deg, #0284c7, #6366f1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            shadow="0 0 15px rgba(2, 132, 199, 0.4)"
                        >
                            <LuSlidersHorizontal size={20} color="#ffffff" />
                        </Box>
                        <Box>
                            <HStack gap={2}>
                                <Text fontSize="lg" fontWeight="bold">
                                    Generative Soundscape Mixer
                                </Text>
                                <Badge
                                    bg="#1e1b4b"
                                    color="#a5b4fc"
                                    border="1px solid #3730a3"
                                    rounded="full"
                                    px={2}
                                    py={0.5}
                                    fontSize="xs"
                                >
                                    Web Audio Synth
                                </Badge>
                            </HStack>
                            <Text fontSize="xs" color="#94a3b8">
                                Multi-track procedural audio engineered for deep focus induction
                            </Text>
                        </Box>
                    </HStack>

                    <Button
                        size="sm"
                        variant="ghost"
                        color="#94a3b8"
                        _hover={{ color: "#ffffff", bg: "#1e293b" }}
                        p={2}
                        rounded="lg"
                        onClick={onClose}
                        aria-label="Close Mixer"
                    >
                        <LuX size={18} />
                    </Button>
                </Flex>

                {/* Master Volume Bar */}
                <Box
                    bg="#0f172a"
                    border="1px solid #1e293b"
                    rounded="xl"
                    p={4}
                    mb={5}
                >
                    <Flex justify="space-between" align="center" mb={2}>
                        <HStack gap={2}>
                            <Button
                                size="xs"
                                variant="ghost"
                                color={soundConfig.isMuted ? "#ef4444" : "#38bdf8"}
                                bg={soundConfig.isMuted ? "rgba(239, 68, 68, 0.15)" : "rgba(56, 189, 248, 0.1)"}
                                border="1px solid"
                                borderColor={soundConfig.isMuted ? "#ef4444" : "#0284c7"}
                                rounded="lg"
                                px={2.5}
                                py={1}
                                onClick={onToggleMute}
                            >
                                <HStack gap={1.5}>
                                    {soundConfig.isMuted ? <LuVolumeX size={14} /> : <LuVolume2 size={14} />}
                                    <Text fontSize="xs" fontWeight="bold">
                                        {soundConfig.isMuted ? "MUTED" : "MASTER"}
                                    </Text>
                                </HStack>
                            </Button>
                            <Text fontSize="xs" color="#94a3b8">
                                Master Immersion Volume
                            </Text>
                        </HStack>
                        <Text fontSize="xs" fontWeight="mono" color="#38bdf8">
                            {soundConfig.isMuted ? "0%" : `${Math.round(soundConfig.masterVolume * 100)}%`}
                        </Text>
                    </Flex>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={soundConfig.isMuted ? 0 : soundConfig.masterVolume}
                        onChange={(e) => {
                            if (soundConfig.isMuted) onToggleMute();
                            onSetMasterVolume(parseFloat(e.target.value));
                        }}
                        style={{
                            width: "100%",
                            accentColor: "#38bdf8",
                            cursor: "pointer",
                            height: "6px",
                            borderRadius: "4px",
                        }}
                    />
                </Box>

                {/* Sound Presets Carousel */}
                <Box mb={5}>
                    <Text fontSize="xs" fontWeight="semibold" color="#94a3b8" textTransform="uppercase" letterSpacing="wider" mb={2}>
                        Soundscape Presets
                    </Text>
                    <Grid templateColumns={{ base: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" }} gap={2}>
                        {presetKeys.map(presetId => {
                            const preset = SOUND_PRESETS[presetId];
                            const isSelected = soundConfig.activePreset === presetId;
                            return (
                                <Box
                                    key={presetId}
                                    as="button"
                                    textAlign="left"
                                    bg={isSelected ? "rgba(14, 165, 233, 0.15)" : "#0f172a"}
                                    border="1px solid"
                                    borderColor={isSelected ? "#0ea5e9" : "#1e293b"}
                                    rounded="lg"
                                    p={2.5}
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    _hover={{ borderColor: "#38bdf8", bg: "rgba(14, 165, 233, 0.1)" }}
                                    onClick={() => onSelectPreset(presetId)}
                                >
                                    <HStack justify="space-between" mb={1}>
                                        <Text fontSize="xs" fontWeight="bold" color={isSelected ? "#38bdf8" : "#f1f5f9"}>
                                            {preset.name}
                                        </Text>
                                        {isSelected && <LuCheck size={12} color="#38bdf8" />}
                                    </HStack>
                                    <Text fontSize="10px" color="#64748b" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {preset.description}
                                    </Text>
                                </Box>
                            );
                        })}
                    </Grid>
                </Box>

                {/* Multi-Track Sound Layers */}
                <Box mb={5}>
                    <Text fontSize="xs" fontWeight="semibold" color="#94a3b8" textTransform="uppercase" letterSpacing="wider" mb={3}>
                        Multi-Track Sound Layers
                    </Text>
                    <VStack gap={3} align="stretch">
                        {layersMeta.map(layer => {
                            const currentVal = soundConfig.layers[layer.id] ?? 0.5;
                            return (
                                <Box
                                    key={layer.id}
                                    bg="#0f172a"
                                    border="1px solid #1e293b"
                                    rounded="xl"
                                    p={3}
                                >
                                    <Flex justify="space-between" align="center" mb={1.5}>
                                        <HStack gap={2.5}>
                                            <Box color={layer.color}>
                                                {layer.icon}
                                            </Box>
                                            <Box>
                                                <Text fontSize="xs" fontWeight="bold" color="#f8fafc">
                                                    {layer.label}
                                                </Text>
                                                <Text fontSize="10px" color="#64748b">
                                                    {layer.desc}
                                                </Text>
                                            </Box>
                                        </HStack>
                                        <Text fontSize="xs" fontWeight="mono" color={layer.color}>
                                            {Math.round(currentVal * 100)}%
                                        </Text>
                                    </Flex>

                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={currentVal}
                                        onChange={(e) => onSetLayerVolume(layer.id, parseFloat(e.target.value))}
                                        style={{
                                            width: "100%",
                                            accentColor: layer.color,
                                            cursor: "pointer",
                                            height: "5px",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </VStack>
                </Box>

                {/* Footer Controls & Tibetan Singing Bowl Chime */}
                <Flex justify="space-between" align="center" pt={3} borderTop="1px solid #1e293b" wrap="wrap" gap={3}>
                    <Button
                        size="sm"
                        variant="outline"
                        borderColor="#334155"
                        color="#cbd5e1"
                        _hover={{ bg: "#1e293b", borderColor: "#a855f7", color: "#c084fc" }}
                        rounded="xl"
                        px={3}
                        onClick={onPlayTestChime}
                    >
                        <HStack gap={2}>
                            <LuBell size={14} color="#c084fc" />
                            <Text fontSize="xs">Preview Tibetan Singing Bowl Chime</Text>
                        </HStack>
                    </Button>

                    <Button
                        size="sm"
                        bg="#0284c7"
                        color="#ffffff"
                        _hover={{ bg: "#0369a1" }}
                        rounded="xl"
                        px={5}
                        onClick={onClose}
                    >
                        Done
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}
