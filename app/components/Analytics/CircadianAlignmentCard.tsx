import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { LuZap, LuSparkles, LuActivity, LuShieldCheck } from "react-icons/lu";

interface CircadianAlignmentCardProps {
    alignmentScore: number;
    peakEnergyFocusMinutes: number;
    totalFocusMinutes: number;
}

export function CircadianAlignmentCard({
    alignmentScore,
    peakEnergyFocusMinutes,
    totalFocusMinutes,
}: CircadianAlignmentCardProps) {
    const peakPercentage = totalFocusMinutes > 0
        ? Math.round((peakEnergyFocusMinutes / totalFocusMinutes) * 100)
        : 0;

    let grade = 'Optimal';
    let gradeColor = '#10b981';
    let gradeBg = '#064e3b';
    let message = 'You are consistently executing high-cognitive load tasks during biological peak energy windows.';

    if (alignmentScore < 60) {
        grade = 'Mismatched';
        gradeColor = '#f87171';
        gradeBg = '#450a0a';
        message = 'Significant high-friction work scheduled in circadian dips. Shift Q1/Q2 blocks into morning and evening peaks.';
    } else if (alignmentScore < 80) {
        grade = 'Moderate';
        gradeColor = '#f59e0b';
        gradeBg = '#451a03';
        message = 'Good energy alignment. Try reserving afternoon slumps exclusively for Q3 quick wins and administrative processing.';
    }

    return (
        <Box
            bg="#0d1424"
            border="1px solid #1e293b"
            rounded="xl"
            p={5}
            position="relative"
            overflow="hidden"
        >
            <Flex justify="space-between" align="center" mb={4}>
                <HStack gap={2}>
                    <LuActivity size={16} color="#c084fc" />
                    <Text fontSize="sm" fontWeight="bold" color="#f8fafc">
                        Circadian Flow Index
                    </Text>
                </HStack>

                <HStack
                    bg={gradeBg}
                    border="1px solid"
                    borderColor={gradeColor}
                    color={gradeColor}
                    rounded="full"
                    px={2.5}
                    py={0.5}
                    fontSize="11px"
                    fontWeight="bold"
                >
                    <LuShieldCheck size={12} />
                    <Text>{grade} ({alignmentScore}%)</Text>
                </HStack>
            </Flex>

            {/* Score Display and Breakdown */}
            <Flex
                direction={{ base: "column", sm: "row" }}
                gap={4}
                align={{ base: "flex-start", sm: "center" }}
                mb={4}
            >
                {/* Circular / Badge score indicator */}
                <Box
                    w="72px"
                    h="72px"
                    rounded="2xl"
                    bg="linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)"
                    border="1px solid #7e22ce"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    shadow="0 0 15px rgba(168, 85, 247, 0.25)"
                    flexShrink={0}
                >
                    <LuZap size={18} color="#facc15" />
                    <Text fontSize="lg" fontWeight="black" color="#f8fafc" lineHeight="1" mt={1}>
                        {alignmentScore}%
                    </Text>
                </Box>

                <VStack align="flex-start" gap={1}>
                    <Text fontSize="xs" fontWeight="semibold" color="#cbd5e1">
                        Peak Chronotype Synchronization
                    </Text>
                    <Text fontSize="11px" color="#94a3b8">
                        {peakEnergyFocusMinutes} min ({peakPercentage}%) of deep work was spent precisely inside high-frequency alertness windows.
                    </Text>
                </VStack>
            </Flex>

            {/* Feedback & Recommendation Banner */}
            <Box
                bg="#060913"
                border="1px solid #1e293b"
                rounded="lg"
                p={3}
            >
                <HStack gap={2} align="flex-start">
                    <LuSparkles size={14} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <Text fontSize="11px" color="#cbd5e1" lineHeight="1.4">
                        {message}
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
}
