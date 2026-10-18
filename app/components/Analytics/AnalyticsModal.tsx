import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    SimpleGrid,
} from "@chakra-ui/react";
import {
    LuChartPie,
    LuX,
    LuClock,
    LuFlame,
    LuActivity,
    LuCheck,
    LuTarget,
} from "react-icons/lu";
import type { AnalyticsMetrics, FocusSession } from "../../types";
import { MetricStatCard } from "./MetricStatCard";
import { WeeklyFocusChart } from "./WeeklyFocusChart";
import { QuadrantBreakdownCard } from "./QuadrantBreakdownCard";
import { CircadianAlignmentCard } from "./CircadianAlignmentCard";
import { RecentSessionsTable } from "./RecentSessionsTable";

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    metrics: AnalyticsMetrics;
    sessions: FocusSession[];
    dailyTarget: number;
    onSetDailyTarget: (minutes: number) => void;
    onClearSessions: () => void;
    onResetSampleData: () => void;
}

export function AnalyticsModal({
    isOpen,
    onClose,
    metrics,
    sessions,
    dailyTarget,
    onSetDailyTarget,
    onClearSessions,
    onResetSampleData,
}: AnalyticsModalProps) {
    if (!isOpen) return null;

    const totalHoursFormatted = (metrics.totalFocusMinutes / 60).toFixed(1);
    const todayTargetProgress = Math.round(
        (metrics.todayFocusMinutes / (metrics.todayTargetMinutes || 1)) * 100
    );

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="rgba(4, 7, 18, 0.82)"
            backdropFilter="blur(8px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
            p={{ base: 2, sm: 4, md: 6 }}
        >
            <Box
                bg="#060913"
                border="1px solid #1e293b"
                rounded="2xl"
                w="full"
                maxW="960px"
                maxH="90vh"
                display="flex"
                flexDirection="column"
                shadow="0 25px 60px rgba(0, 0, 0, 0.85)"
                overflow="hidden"
            >
                {/* Modal Header */}
                <Flex
                    justify="space-between"
                    align="center"
                    p={5}
                    borderBottom="1px solid #1e293b"
                    bg="#0a0f1d"
                >
                    <HStack gap={3}>
                        <Box
                            w="36px"
                            h="36px"
                            rounded="xl"
                            bg="linear-gradient(135deg, #4f46e5, #06b6d4)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            shadow="0 0 12px rgba(79, 70, 229, 0.4)"
                        >
                            <LuChartPie size={20} color="#ffffff" />
                        </Box>
                        <Box>
                            <HStack gap={2}>
                                <Text fontSize="md" fontWeight="bold" color="#ffffff">
                                    Productivity & Circadian Analytics
                                </Text>
                                <Box
                                    bg="#022c22"
                                    color="#34d399"
                                    border="1px solid #059669"
                                    rounded="full"
                                    px={2}
                                    py={0.2}
                                    fontSize="10px"
                                    fontWeight="bold"
                                >
                                    Live Engine
                                </Box>
                            </HStack>
                            <Text fontSize="xs" color="#64748b">
                                Empirical focus telemetry, quadrant balance & biorhythm alignment
                            </Text>
                        </Box>
                    </HStack>

                    <Box
                        as="button"
                        onClick={onClose}
                        p={2}
                        rounded="lg"
                        bg="#0f172a"
                        border="1px solid #1e293b"
                        color="#94a3b8"
                        _hover={{ bg: "#1e293b", color: "#ffffff" }}
                        cursor="pointer"
                        transition="all 0.15s ease"
                    >
                        <LuX size={18} />
                    </Box>
                </Flex>

                {/* Modal Scrollable Body */}
                <Box p={{ base: 4, md: 6 }} overflowY="auto" flex="1">
                    <VStack gap={6} align="stretch">
                        {/* High-Level Stat Cards Grid */}
                        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
                            <MetricStatCard
                                title="TOTAL FOCUS TIME"
                                value={`${metrics.totalFocusMinutes}m`}
                                subtitle={`${totalHoursFormatted} total hours logged`}
                                icon={<LuClock size={16} />}
                                accentColor="#818cf8"
                                badgeText={`${metrics.completedSessionsCount} blocks`}
                                badgeBg="#1e1b4b"
                                badgeColor="#818cf8"
                            />

                            <MetricStatCard
                                title="TODAY'S VOLUME"
                                value={`${metrics.todayFocusMinutes}m`}
                                subtitle={`Goal: ${dailyTarget} min / day`}
                                icon={<LuTarget size={16} />}
                                accentColor="#38bdf8"
                                badgeText={`${todayTargetProgress}% goal`}
                                badgeBg={todayTargetProgress >= 100 ? "#064e3b" : "#172554"}
                                badgeColor={todayTargetProgress >= 100 ? "#34d399" : "#38bdf8"}
                            />

                            <MetricStatCard
                                title="CIRCADIAN ALIGNMENT"
                                value={`${metrics.circadianAlignmentScore}%`}
                                subtitle={`${metrics.peakEnergyFocusMinutes}m in peak alertness`}
                                icon={<LuActivity size={16} />}
                                accentColor="#c084fc"
                                badgeText={metrics.circadianAlignmentScore >= 80 ? "Optimal" : "Fair"}
                                badgeBg="#3b0764"
                                badgeColor="#c084fc"
                            />

                            <MetricStatCard
                                title="STREAK & VELOCITY"
                                value={`${metrics.currentStreakDays} Days`}
                                subtitle={`${metrics.taskCompletionRate}% task completion rate`}
                                icon={<LuFlame size={16} />}
                                accentColor="#f59e0b"
                                badgeText={`${metrics.tasksCompletedCount}/${metrics.tasksTotalCount} Done`}
                                badgeBg="#451a03"
                                badgeColor="#fbbf24"
                            />
                        </SimpleGrid>

                        {/* Middle Visuals: 7-Day Trend & Eisenhower Distribution */}
                        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                            <WeeklyFocusChart
                                dailyStats={metrics.dailyFocusHistory}
                                dailyTargetMinutes={dailyTarget}
                            />

                            <QuadrantBreakdownCard
                                breakdown={metrics.quadrantBreakdown}
                                totalMinutes={metrics.totalFocusMinutes}
                                tasksTotalCount={metrics.tasksTotalCount}
                                tasksCompletedCount={metrics.tasksCompletedCount}
                                taskCompletionRate={metrics.taskCompletionRate}
                            />
                        </SimpleGrid>

                        {/* Circadian Insights & Daily Target Control */}
                        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4}>
                            <Box gridColumn={{ base: "span 1", lg: "span 2" }}>
                                <CircadianAlignmentCard
                                    alignmentScore={metrics.circadianAlignmentScore}
                                    peakEnergyFocusMinutes={metrics.peakEnergyFocusMinutes}
                                    totalFocusMinutes={metrics.totalFocusMinutes}
                                />
                            </Box>

                            {/* Target Customizer Card */}
                            <Flex
                                bg="#0d1424"
                                border="1px solid #1e293b"
                                rounded="xl"
                                p={5}
                                direction="column"
                                justify="space-between"
                            >
                                <Box>
                                    <HStack gap={2} mb={1}>
                                        <LuTarget size={16} color="#f59e0b" />
                                        <Text fontSize="sm" fontWeight="bold" color="#f8fafc">
                                            Daily Target
                                        </Text>
                                    </HStack>
                                    <Text fontSize="11px" color="#64748b" mb={3}>
                                        Configure your daily focus goal
                                    </Text>

                                    <HStack gap={2} mb={3}>
                                        {[90, 120, 180, 240].map(mins => (
                                            <Box
                                                key={mins}
                                                as="button"
                                                onClick={() => onSetDailyTarget(mins)}
                                                flex="1"
                                                py={1.5}
                                                rounded="lg"
                                                fontSize="xs"
                                                fontWeight="bold"
                                                bg={dailyTarget === mins ? "#1e1b4b" : "#060913"}
                                                border="1px solid"
                                                borderColor={dailyTarget === mins ? "#818cf8" : "#1e293b"}
                                                color={dailyTarget === mins ? "#818cf8" : "#94a3b8"}
                                                cursor="pointer"
                                                transition="all 0.15s ease"
                                                _hover={{ bg: "#1e293b" }}
                                            >
                                                {mins}m
                                            </Box>
                                        ))}
                                    </HStack>
                                </Box>

                                <Box bg="#060913" p={2.5} rounded="lg" border="1px solid #1e293b">
                                    <HStack justify="space-between">
                                        <Text fontSize="11px" color="#94a3b8">
                                            Today's Progress:
                                        </Text>
                                        <Text fontSize="11px" fontWeight="bold" color="#38bdf8">
                                            {metrics.todayFocusMinutes} / {dailyTarget} min
                                        </Text>
                                    </HStack>
                                </Box>
                            </Flex>
                        </SimpleGrid>

                        {/* Recent Completed Sessions Log */}
                        <RecentSessionsTable
                            sessions={sessions}
                            onClearSessions={onClearSessions}
                            onResetSampleData={onResetSampleData}
                        />
                    </VStack>
                </Box>

                {/* Modal Footer */}
                <Flex
                    justify="space-between"
                    align="center"
                    px={6}
                    py={3.5}
                    borderTop="1px solid #1e293b"
                    bg="#0a0f1d"
                >
                    <HStack gap={2} fontSize="11px" color="#64748b">
                        <LuCheck size={14} color="#10b981" />
                        <Text>All metrics computed locally in real time</Text>
                    </HStack>

                    <Button
                        onClick={onClose}
                        bg="#1e1b4b"
                        _hover={{ bg: "#312e81" }}
                        color="#c7d2fe"
                        border="1px solid #4338ca"
                        rounded="xl"
                        px={5}
                        h="34px"
                        fontSize="xs"
                        fontWeight="semibold"
                    >
                        Close Dashboard
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
}
