import {
    Box,
    Flex,
    HStack,
    Text,
    Badge,
} from "@chakra-ui/react";
import {
    LuTrendingUp,
    LuMoon,
    LuClock,
    LuRefreshCw,
    LuSparkles,
} from "react-icons/lu";
import type { ChronotypeId, EnergyEvaluation, SvgCurveData } from "../../types";
import { CHRONOTYPES } from "../../constants";

interface EnergyCurveCardProps {
    chronotype: ChronotypeId;
    effectiveEnergy: EnergyEvaluation;
    computedEvaluation: EnergyEvaluation;
    svgCurveData: SvgCurveData;
    isLiveClock: boolean;
    isTimerRunning?: boolean;
    onScrubTime: (e: React.MouseEvent<SVGSVGElement>) => void;
    onMouseMoveGraph: (e: React.MouseEvent<SVGSVGElement>) => void;
    onMouseLeaveGraph: () => void;
    onSyncLiveClock: () => void;
}

export function EnergyCurveCard({
    chronotype,
    effectiveEnergy,
    computedEvaluation,
    svgCurveData,
    isLiveClock,
    isTimerRunning = false,
    onScrubTime,
    onMouseMoveGraph,
    onMouseLeaveGraph,
    onSyncLiveClock,
}: EnergyCurveCardProps) {
    return (
        <Box
            bg="#0a0f1d"
            border="1px solid"
            borderColor={isTimerRunning ? "rgba(99, 102, 241, 0.4)" : "#1e293b"}
            rounded="2xl"
            p={4}
            mb={6}
            shadow={isTimerRunning ? "0 4px 25px rgba(99, 102, 241, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.4)"}
            transition="all 0.3s ease"
        >
            <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                gap={2}
                mb={3}
            >
                <HStack gap={2} wrap="wrap">
                    <LuTrendingUp size={16} color="#818cf8" />
                    <Text fontSize="xs" fontWeight="semibold" color="#cbd5e1">
                        24–Hour Biorhythm Energy Curve
                    </Text>
                    <Badge
                        bg="#1e1b4b"
                        color="#818cf8"
                        border="1px solid #3730a3"
                        rounded="full"
                        px={2}
                        py={0.2}
                        fontSize="10px"
                    >
                        {CHRONOTYPES[chronotype].name.split(' ')[0]}
                    </Badge>
                    {isTimerRunning && (
                        <HStack
                            bg="rgba(99, 102, 241, 0.15)"
                            border="1px solid #6366f1"
                            rounded="full"
                            px={2.5}
                            py={0.5}
                            gap={1.5}
                            style={{ animation: "focus-badge-pulse 2s infinite" }}
                        >
                            <Box
                                w="6px"
                                h="6px"
                                rounded="full"
                                bg="#818cf8"
                                style={{ animation: "pulse-ring 1s infinite" }}
                            />
                            <Text fontSize="10px" fontWeight="bold" color="#818cf8" letterSpacing="wider">
                                FOCUS ACTIVE
                            </Text>
                        </HStack>
                    )}
                </HStack>

                <HStack gap={2}>
                    <HStack gap={1.5}>
                        <LuMoon size={14} color="#f59e0b" />
                        <Text fontSize="xs" fontWeight="medium" color="#fbbf24">
                            {effectiveEnergy.recommendation}
                        </Text>
                    </HStack>

                    {/* Sync to Live Time button when manually scrubbed */}
                    {!isLiveClock && (
                        <HStack
                            as="button"
                            bg="#0f172a"
                            border="1px solid #334155"
                            color="#94a3b8"
                            _hover={{ bg: "#1e293b", color: "#ffffff" }}
                            rounded="full"
                            px={2}
                            py={0.5}
                            fontSize="10px"
                            cursor="pointer"
                            gap={1}
                            onClick={onSyncLiveClock}
                            title="Reset curve to current live time"
                        >
                            <LuRefreshCw size={10} />
                            <Text>Live Sync</Text>
                        </HStack>
                    )}
                </HStack>
            </Flex>

            {/* Timeline & Interactive Energy Graph */}
            <Box
                position="relative"
                w="full"
                h="72px"
                cursor="crosshair"
                userSelect="none"
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1000 72"
                    preserveAspectRatio="none"
                    style={{ overflow: "visible" }}
                    onClick={onScrubTime}
                    onMouseMove={onMouseMoveGraph}
                    onMouseLeave={onMouseLeaveGraph}
                >
                    <defs>
                        {/* Gradient for curve stroke */}
                        <linearGradient id="energyCurveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4338ca" />
                            <stop offset="35%" stopColor="#06b6d4" />
                            <stop offset="45%" stopColor="#a855f7" />
                            <stop offset="60%" stopColor="#f43f5e" />
                            <stop offset="78%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#312e81" />
                        </linearGradient>

                        {/* Gradient for area fill under curve */}
                        <linearGradient id="energyCurveArea" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#060913" stopOpacity="0" />
                        </linearGradient>

                        {/* Marker glow filter */}
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Zone Background Highlights */}
                    {/* Night / Rest Zone 00:00 - 06:00 */}
                    <rect x="0" y="0" width="250" height="46" fill="#0f172a" fillOpacity="0.25" />
                    {/* Morning Deep Work Window ~08:30 - 12:30 */}
                    <rect x="350" y="0" width="170" height="46" fill="#1e1b4b" fillOpacity="0.3" />
                    {/* Energy Slump Dip ~13:30 - 15:30 */}
                    <rect x="560" y="0" width="90" height="46" fill="#4c0519" fillOpacity="0.25" />
                    {/* Rebound Peak ~17:00 - 19:30 */}
                    <rect x="700" y="0" width="110" height="46" fill="#1e1b4b" fillOpacity="0.25" />

                    {/* Baseline subtle track */}
                    <line
                        x1="0"
                        y1="46"
                        x2="1000"
                        y2="46"
                        stroke="#1e293b"
                        strokeWidth="1"
                    />

                    {/* Area fill */}
                    <path
                        d={svgCurveData.areaD}
                        fill="url(#energyCurveArea)"
                    />

                    {/* Main Energy Curve Stroke */}
                    <path
                        d={svgCurveData.pathD}
                        fill="none"
                        stroke="url(#energyCurveStroke)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />

                    {/* Current / Hovered Time Indicator Line */}
                    <line
                        x1={svgCurveData.cursorX}
                        y1="2"
                        x2={svgCurveData.cursorX}
                        y2="48"
                        stroke={effectiveEnergy.accentColor}
                        strokeWidth={isTimerRunning ? "2" : "1.5"}
                        strokeDasharray={isTimerRunning ? "4 2" : "3 3"}
                        style={isTimerRunning ? { animation: "line-dash 1.2s linear infinite" } : undefined}
                    >
                        {isTimerRunning && (
                            <animate
                                attributeName="stroke-opacity"
                                values="0.6;1;0.6"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        )}
                    </line>

                    {/* Concentric Pulsing Radar Rings when Focus Timer is Running */}
                    {isTimerRunning && (
                        <>
                            {/* Primary expanding beacon wave */}
                            <circle
                                cx={svgCurveData.cursorX}
                                cy={svgCurveData.cursorY}
                                r="6"
                                fill="none"
                                stroke={effectiveEnergy.accentColor}
                                strokeWidth="2.5"
                                opacity="0.9"
                            >
                                <animate
                                    attributeName="r"
                                    values="6;24;36"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.9;0.35;0"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-width"
                                    values="2.5;1.5;0.2"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                            </circle>

                            {/* Secondary delayed expanding beacon wave */}
                            <circle
                                cx={svgCurveData.cursorX}
                                cy={svgCurveData.cursorY}
                                r="6"
                                fill="none"
                                stroke={effectiveEnergy.accentColor}
                                strokeWidth="2"
                                opacity="0.9"
                            >
                                <animate
                                    attributeName="r"
                                    values="6;24;36"
                                    dur="2s"
                                    begin="0.9s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="opacity"
                                    values="0.9;0.35;0"
                                    dur="2s"
                                    begin="0.9s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-width"
                                    values="2;1.2;0.1"
                                    dur="2s"
                                    begin="0.9s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </>
                    )}

                    {/* Outer glowing pulsing halo */}
                    <circle
                        cx={svgCurveData.cursorX}
                        cy={svgCurveData.cursorY}
                        r={isTimerRunning ? "11" : "8"}
                        fill={effectiveEnergy.accentColor}
                        fillOpacity={isTimerRunning ? "0.4" : "0.25"}
                        filter="url(#glow)"
                    >
                        {isTimerRunning && (
                            <>
                                <animate
                                    attributeName="r"
                                    values="8;16;8"
                                    dur="1.6s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="fill-opacity"
                                    values="0.25;0.6;0.25"
                                    dur="1.6s"
                                    repeatCount="indefinite"
                                />
                            </>
                        )}
                    </circle>

                    {/* Interactive Marker Dot */}
                    <circle
                        cx={svgCurveData.cursorX}
                        cy={svgCurveData.cursorY}
                        r={isTimerRunning ? "6.5" : "5.5"}
                        fill={effectiveEnergy.accentColor}
                        stroke="#ffffff"
                        strokeWidth={isTimerRunning ? "2" : "1.5"}
                    >
                        {isTimerRunning && (
                            <animate
                                attributeName="r"
                                values="5.5;7.5;5.5"
                                dur="1.6s"
                                repeatCount="indefinite"
                            />
                        )}
                    </circle>

                    {/* Inner white dot */}
                    <circle
                        cx={svgCurveData.cursorX}
                        cy={svgCurveData.cursorY}
                        r={isTimerRunning ? "2.5" : "2"}
                        fill="#ffffff"
                    >
                        {isTimerRunning && (
                            <animate
                                attributeName="r"
                                values="2;3.2;2"
                                dur="1.6s"
                                repeatCount="indefinite"
                            />
                        )}
                    </circle>

                    {/* Time Axis Markers along the bottom */}
                    {[
                        { h: 0, label: "00:00" },
                        { h: 3, label: "03:00" },
                        { h: 6, label: "06:00" },
                        { h: 9, label: "09:00" },
                        { h: 12, label: "12:00" },
                        { h: 15, label: "15:00" },
                        { h: 18, label: "18:00" },
                        { h: 21, label: "21:00" },
                        { h: 24, label: "24:00" },
                    ].map((tick) => {
                        const tickX = (tick.h / 24) * 1000;
                        return (
                            <g key={tick.h}>
                                <line
                                    x1={tickX}
                                    y1="46"
                                    x2={tickX}
                                    y2="50"
                                    stroke="#334155"
                                    strokeWidth="1"
                                />
                                <text
                                    x={tickX}
                                    y="62"
                                    textAnchor={tick.h === 0 ? "start" : tick.h === 24 ? "end" : "middle"}
                                    fill="#64748b"
                                    fontSize="9"
                                    fontFamily="system-ui"
                                >
                                    {tick.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Interactive Scrubber Tooltip Badge */}
                <Box
                    position="absolute"
                    top="-4px"
                    left={`calc(${(svgCurveData.cursorX / 1000) * 100}% - 40px)`}
                    transform="translateY(-100%)"
                    pointerEvents="none"
                    bg="#0f172a"
                    border="1px solid"
                    borderColor={effectiveEnergy.accentColor}
                    rounded="lg"
                    px={2}
                    py={0.5}
                    shadow={isTimerRunning ? `0 0 14px ${effectiveEnergy.accentColor}66` : "0 4px 12px rgba(0,0,0,0.8)"}
                    zIndex={10}
                    style={isTimerRunning ? { animation: "focus-badge-pulse 2s infinite" } : undefined}
                >
                    <HStack gap={1}>
                        {isTimerRunning ? (
                            <Box
                                w="6px"
                                h="6px"
                                rounded="full"
                                bg={effectiveEnergy.accentColor}
                                style={{ animation: "pulse-ring 1s infinite" }}
                            />
                        ) : (
                            <LuClock size={10} color={effectiveEnergy.accentColor} />
                        )}
                        <Text fontSize="10px" fontWeight="bold" color="#ffffff">
                            {computedEvaluation.formattedTime}
                        </Text>
                        <Text fontSize="9px" color={effectiveEnergy.accentColor} fontWeight="semibold">
                            ({effectiveEnergy.percentage}%)
                        </Text>
                    </HStack>
                </Box>
            </Box>

            {/* Timeline Zone Indicators Bar */}
            <Flex
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={2}
                mt={2}
                pt={2}
                borderTop="1px solid #1e293b"
                fontSize="10px"
                color="#64748b"
            >
                <HStack gap={3} wrap="wrap">
                    <HStack gap={1}>
                        <Box w="8px" h="8px" rounded="full" bg="#4338ca" />
                        <Text>Sleep / Rest (23:00 - 06:30)</Text>
                    </HStack>
                    <HStack gap={1}>
                        <Box w="8px" h="8px" rounded="full" bg="#06b6d4" />
                        <Text>Peak Deep Focus ({CHRONOTYPES[chronotype].peakHours})</Text>
                    </HStack>
                    <HStack gap={1}>
                        <Box w="8px" h="8px" rounded="full" bg="#f43f5e" />
                        <Text>Energy Slump ({CHRONOTYPES[chronotype].slumpHours})</Text>
                    </HStack>
                </HStack>

                <HStack gap={1} color="#94a3b8">
                    <LuSparkles size={11} color="#a855f7" />
                    <Text>Click or drag on curve to inspect biorhythm</Text>
                </HStack>
            </Flex>
        </Box>
    );
}
