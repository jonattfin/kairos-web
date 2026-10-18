import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { LuClock, LuZap, LuCheck } from "react-icons/lu";
import type { FocusSession, QuadrantId } from "../../types";

interface RecentSessionsTableProps {
    sessions: FocusSession[];
    onClearSessions: () => void;
    onResetSampleData: () => void;
}

const QUADRANT_COLORS: Record<QuadrantId, { label: string; bg: string; text: string; border: string }> = {
    q1: { label: 'Q1 Do First', bg: '#450a0a', text: '#fca5a5', border: '#ef4444' },
    q2: { label: 'Q2 Deep Work', bg: '#1e1b4b', text: '#c7d2fe', border: '#6366f1' },
    q3: { label: 'Q3 Quick Wins', bg: '#064e3b', text: '#a7f3d0', border: '#10b981' },
    q4: { label: 'Q4 Minimize', bg: '#1e293b', text: '#cbd5e1', border: '#475569' },
};

function formatSessionTime(timestamp: number): string {
    const d = new Date(timestamp);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) {
        return `Today at ${timeStr}`;
    }
    const month = d.toLocaleString([], { month: 'short' });
    return `${month} ${d.getDate()}, ${timeStr}`;
}

export function RecentSessionsTable({
    sessions,
    onClearSessions,
    onResetSampleData,
}: RecentSessionsTableProps) {
    return (
        <Box
            bg="#0d1424"
            border="1px solid #1e293b"
            rounded="xl"
            p={5}
            position="relative"
        >
            <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
                <Box>
                    <HStack gap={2}>
                        <LuClock size={16} color="#38bdf8" />
                        <Text fontSize="sm" fontWeight="bold" color="#f8fafc">
                            Recent Focus Logs
                        </Text>
                        <Box
                            bg="#1e293b"
                            color="#94a3b8"
                            rounded="full"
                            px={2}
                            py={0.2}
                            fontSize="10px"
                            fontWeight="bold"
                        >
                            {sessions.length} sessions
                        </Box>
                    </HStack>
                    <Text fontSize="11px" color="#64748b" mt={0.5}>
                        Timeline of completed deep focus time-boxes
                    </Text>
                </Box>

                <HStack gap={2}>
                    <Box
                        as="button"
                        onClick={onResetSampleData}
                        px={2.5}
                        py={1}
                        rounded="lg"
                        bg="#0f172a"
                        border="1px solid #1e293b"
                        color="#94a3b8"
                        fontSize="10px"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{ bg: "#1e293b", color: "#cbd5e1" }}
                        title="Load rich sample session history"
                    >
                        Sample Data
                    </Box>
                    <Box
                        as="button"
                        onClick={onClearSessions}
                        px={2.5}
                        py={1}
                        rounded="lg"
                        bg="#0f172a"
                        border="1px solid #1e293b"
                        color="#f87171"
                        fontSize="10px"
                        fontWeight="semibold"
                        cursor="pointer"
                        _hover={{ bg: "#450a0a", borderColor: "#7f1d1d" }}
                    >
                        Clear History
                    </Box>
                </HStack>
            </Flex>

            {sessions.length === 0 ? (
                <Box
                    py={8}
                    textAlign="center"
                    border="1px dashed #1e293b"
                    rounded="lg"
                    bg="#060913"
                >
                    <Text fontSize="xs" color="#64748b">
                        No completed focus sessions recorded yet.
                    </Text>
                    <Text fontSize="10px" color="#475569" mt={1}>
                        Start the countdown focus timer or click "Sample Data" above to view metrics.
                    </Text>
                </Box>
            ) : (
                <VStack gap={2} align="stretch" maxH="220px" overflowY="auto" pr={1}>
                    {sessions.map(s => {
                        const qMeta = QUADRANT_COLORS[s.quadrant] || QUADRANT_COLORS.q2;
                        const energyColor =
                            s.energyLevelAtStart === 'peak'
                                ? '#c084fc'
                                : s.energyLevelAtStart === 'low'
                                ? '#34d399'
                                : '#38bdf8';

                        return (
                            <Flex
                                key={s.id}
                                align="center"
                                justify="space-between"
                                p={2.5}
                                bg="#060913"
                                border="1px solid #1e293b"
                                rounded="lg"
                                gap={3}
                                _hover={{ borderColor: "#334155" }}
                            >
                                <HStack gap={2.5} minW="0" flex="1">
                                    <Box
                                        w="18px"
                                        h="18px"
                                        rounded="full"
                                        bg="#064e3b"
                                        border="1px solid #10b981"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexShrink={0}
                                    >
                                        <LuCheck size={11} color="#34d399" />
                                    </Box>
                                    <Box minW="0" flex="1">
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color="#f8fafc"
                                            truncate
                                        >
                                            {s.taskTitle || 'Focus Session'}
                                        </Text>
                                        <Text fontSize="10px" color="#64748b">
                                            {formatSessionTime(s.timestamp)}
                                        </Text>
                                    </Box>
                                </HStack>

                                <HStack gap={2} flexShrink={0}>
                                    {/* Quadrant badge */}
                                    <Box
                                        bg={qMeta.bg}
                                        color={qMeta.text}
                                        border="1px solid"
                                        borderColor={qMeta.border}
                                        rounded="md"
                                        px={2}
                                        py={0.5}
                                        fontSize="10px"
                                        fontWeight="semibold"
                                    >
                                        {qMeta.label.split(' ')[0]}
                                    </Box>

                                    {/* Energy phase */}
                                    <HStack
                                        gap={1}
                                        bg="#0f172a"
                                        border="1px solid #1e293b"
                                        rounded="md"
                                        px={1.5}
                                        py={0.5}
                                        fontSize="10px"
                                        color={energyColor}
                                    >
                                        <LuZap size={10} />
                                        <Text textTransform="capitalize">
                                            {s.energyLevelAtStart}
                                        </Text>
                                    </HStack>

                                    {/* Duration */}
                                    <Box
                                        bg="#1e1b4b"
                                        color="#818cf8"
                                        rounded="md"
                                        px={2}
                                        py={0.5}
                                        fontSize="10px"
                                        fontWeight="bold"
                                    >
                                        {s.durationMinutes}m
                                    </Box>
                                </HStack>
                            </Flex>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
}
