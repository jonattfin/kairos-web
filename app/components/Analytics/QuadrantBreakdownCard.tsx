import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import type { QuadrantId, QuadrantMetric } from "../../types";

interface QuadrantBreakdownCardProps {
    breakdown: Record<QuadrantId, QuadrantMetric>;
    totalMinutes: number;
    tasksTotalCount: number;
    tasksCompletedCount: number;
    taskCompletionRate: number;
}

export function QuadrantBreakdownCard({
    breakdown,
    totalMinutes,
    tasksTotalCount,
    tasksCompletedCount,
    taskCompletionRate,
}: QuadrantBreakdownCardProps) {
    const quadrants: QuadrantId[] = ['q1', 'q2', 'q3', 'q4'];

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
                    <Text fontSize="sm" fontWeight="bold" color="#f8fafc">
                        Eisenhower Matrix Allocation
                    </Text>
                    <Text fontSize="11px" color="#64748b" mt={0.5}>
                        Time spent per quadrant & tactical efficiency
                    </Text>
                </Box>

                <HStack
                    bg="#060913"
                    border="1px solid #1e293b"
                    rounded="lg"
                    px={2.5}
                    py={1}
                    gap={1.5}
                >
                    <Text fontSize="11px" color="#94a3b8">
                        Tasks:
                    </Text>
                    <Text fontSize="11px" fontWeight="bold" color="#34d399">
                        {tasksCompletedCount}/{tasksTotalCount} ({taskCompletionRate}%)
                    </Text>
                </HStack>
            </Flex>

            {/* Combined Stacked Progress Bar */}
            {totalMinutes > 0 ? (
                <Flex
                    w="full"
                    h="10px"
                    rounded="full"
                    overflow="hidden"
                    bg="#1e293b"
                    mb={4}
                >
                    {quadrants.map(qKey => {
                        const q = breakdown[qKey];
                        if (q.percentage === 0) return null;
                        return (
                            <Box
                                key={qKey}
                                w={`${q.percentage}%`}
                                h="full"
                                bg={q.color}
                                title={`${q.label}: ${q.minutes}m (${q.percentage}%)`}
                                transition="width 0.3s ease"
                            />
                        );
                    })}
                </Flex>
            ) : (
                <Box w="full" h="10px" rounded="full" bg="#1e293b" mb={4} />
            )}

            {/* List of individual Quadrants */}
            <VStack gap={3} align="stretch">
                {quadrants.map(qKey => {
                    const q = breakdown[qKey];
                    return (
                        <Box key={qKey}>
                            <Flex justify="space-between" align="center" mb={1}>
                                <HStack gap={2}>
                                    <Box w="8px" h="8px" rounded="full" bg={q.color} />
                                    <Text fontSize="xs" fontWeight="semibold" color="#cbd5e1">
                                        {q.label}
                                    </Text>
                                </HStack>
                                <HStack gap={2} fontSize="xs">
                                    <Text color="#94a3b8">{q.minutes} min</Text>
                                    <Text fontWeight="bold" color={q.color}>
                                        {q.percentage}%
                                    </Text>
                                </HStack>
                            </Flex>

                            {/* Individual progress indicator */}
                            <Box w="full" h="4px" rounded="full" bg="#1e293b" overflow="hidden">
                                <Box
                                    w={`${q.percentage}%`}
                                    h="full"
                                    bg={q.color}
                                    rounded="full"
                                    transition="width 0.3s ease"
                                />
                            </Box>
                        </Box>
                    );
                })}
            </VStack>
        </Box>
    );
}
