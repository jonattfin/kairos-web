import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import type { DailyFocusStat } from "../../types";

interface WeeklyFocusChartProps {
    dailyStats: DailyFocusStat[];
    dailyTargetMinutes: number;
}

export function WeeklyFocusChart({
    dailyStats,
    dailyTargetMinutes,
}: WeeklyFocusChartProps) {
    const [hoveredDay, setHoveredDay] = useState<DailyFocusStat | null>(null);

    const maxMinutes = Math.max(
        ...dailyStats.map(d => d.minutes),
        dailyTargetMinutes,
        120
    );

    return (
        <Box
            bg="#0d1424"
            border="1px solid #1e293b"
            rounded="xl"
            p={5}
            position="relative"
        >
            <Flex justify="space-between" align="center" mb={4}>
                <Box>
                    <HStack gap={2}>
                        <Text fontSize="sm" fontWeight="bold" color="#f8fafc">
                            7-Day Focus Volume
                        </Text>
                        <Box
                            bg="#1e1b4b"
                            color="#818cf8"
                            border="1px solid #3730a3"
                            rounded="full"
                            px={2}
                            py={0.2}
                            fontSize="10px"
                            fontWeight="bold"
                        >
                            Target: {dailyTargetMinutes}m/day
                        </Box>
                    </HStack>
                    <Text fontSize="11px" color="#64748b" mt={0.5}>
                        Daily deep focus distribution vs target threshold
                    </Text>
                </Box>

                {hoveredDay ? (
                    <HStack
                        bg="#060913"
                        border="1px solid #334155"
                        rounded="lg"
                        px={2.5}
                        py={1}
                        gap={2}
                    >
                        <Text fontSize="xs" fontWeight="bold" color="#38bdf8">
                            {hoveredDay.dayLabel} ({hoveredDay.dateStr}):
                        </Text>
                        <Text fontSize="xs" fontWeight="bold" color="#f8fafc">
                            {hoveredDay.minutes} min ({hoveredDay.sessionsCount} sessions)
                        </Text>
                    </HStack>
                ) : (
                    <HStack gap={3} fontSize="11px" color="#64748b">
                        <HStack gap={1}>
                            <Box w="8px" h="8px" rounded="sm" bg="#6366f1" />
                            <Text>Completed</Text>
                        </HStack>
                        <HStack gap={1}>
                            <Box w="8px" h="1px" bg="#f59e0b" />
                            <Text>Goal ({dailyTargetMinutes}m)</Text>
                        </HStack>
                    </HStack>
                )}
            </Flex>

            {/* Chart Area */}
            <Box position="relative" h="160px" w="full" pt={4} pb={2}>
                {/* Target line */}
                {dailyTargetMinutes > 0 && (
                    <Box
                        position="absolute"
                        left="0"
                        right="0"
                        bottom={`${(dailyTargetMinutes / maxMinutes) * 120 + 24}px`}
                        borderTop="1px dashed rgba(245, 158, 11, 0.5)"
                        zIndex={2}
                        pointerEvents="none"
                    >
                        <Text
                            position="absolute"
                            right="0"
                            top="-14px"
                            fontSize="9px"
                            fontWeight="bold"
                            color="#f59e0b"
                            bg="#0d1424"
                            px={1}
                            rounded="sm"
                        >
                            Target {dailyTargetMinutes}m
                        </Text>
                    </Box>
                )}

                {/* Bars flex */}
                <Flex
                    h="120px"
                    align="flex-end"
                    justify="space-between"
                    gap={2}
                    px={2}
                    borderBottom="1px solid #1e293b"
                >
                    {dailyStats.map((stat, idx) => {
                        const heightPct = Math.min(100, (stat.minutes / maxMinutes) * 100);
                        const isGoalMet = stat.minutes >= dailyTargetMinutes;
                        const isHovered = hoveredDay?.dateStr === stat.dateStr;

                        return (
                            <VStack
                                key={idx}
                                flex="1"
                                h="full"
                                justify="flex-end"
                                gap={1.5}
                                onMouseEnter={() => setHoveredDay(stat)}
                                onMouseLeave={() => setHoveredDay(null)}
                                cursor="pointer"
                            >
                                <Box
                                    w="full"
                                    maxW="36px"
                                    h={`${Math.max(4, heightPct)}%`}
                                    bg={
                                        isGoalMet
                                            ? "linear-gradient(180deg, #10b981 0%, #059669 100%)"
                                            : stat.minutes > 0
                                            ? "linear-gradient(180deg, #818cf8 0%, #4f46e5 100%)"
                                            : "#1e293b"
                                    }
                                    roundedTop="md"
                                    position="relative"
                                    transition="all 0.2s ease"
                                    transform={isHovered ? "scaleY(1.05)" : "none"}
                                    shadow={
                                        isHovered
                                            ? isGoalMet
                                                ? "0 0 12px rgba(16, 185, 129, 0.6)"
                                                : "0 0 12px rgba(99, 102, 241, 0.6)"
                                            : "none"
                                    }
                                />
                            </VStack>
                        );
                    })}
                </Flex>

                {/* Day Labels */}
                <Flex justify="space-between" px={2} mt={2}>
                    {dailyStats.map((stat, idx) => (
                        <Box key={idx} flex="1" textAlign="center">
                            <Text
                                fontSize="11px"
                                fontWeight={stat.dayLabel === 'Today' ? 'bold' : 'medium'}
                                color={stat.dayLabel === 'Today' ? '#38bdf8' : '#64748b'}
                            >
                                {stat.dayLabel}
                            </Text>
                            <Text fontSize="9px" color="#475569">
                                {stat.minutes}m
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Box>
    );
}
