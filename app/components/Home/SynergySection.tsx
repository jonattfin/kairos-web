import { Box, VStack, HStack, Text, SimpleGrid, Button, Badge } from "@chakra-ui/react";
import {
    LuSparkles,
    LuArrowRight,
} from "react-icons/lu";

interface SynergySectionProps {
    onLaunchApp: () => void;
}

export function SynergySection({ onLaunchApp }: SynergySectionProps) {
    return (
        <Box
            id="synergy"
            py={{ base: 12, md: 20 }}
            px={{ base: 4, md: 8 }}
            maxW="1300px"
            mx="auto"
            position="relative"
        >
            <Box
                bg="linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)"
                border="1px solid rgba(99, 102, 241, 0.3)"
                rounded="3xl"
                p={{ base: 6, sm: 8, md: 12 }}
                shadow="0 25px 50px rgba(0, 0, 0, 0.5)"
                position="relative"
                overflow="hidden"
            >
                <VStack textAlign="center" gap={4} maxW="850px" mx="auto" mb={10}>
                    <Badge
                        bg="linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(99, 102, 241, 0.2))"
                        color="#ffffff"
                        border="1px solid rgba(6, 182, 212, 0.4)"
                        rounded="full"
                        px={4}
                        py={1}
                        fontSize="xs"
                        fontWeight="bold"
                    >
                        THE TRIAD SYNERGY
                    </Badge>
                    <Text
                        fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                        fontWeight="extrabold"
                        color="#ffffff"
                        letterSpacing="tight"
                    >
                        The Power of Combining the Three Strategies
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="#cbd5e1" lineHeight="relaxed">
                        Most tools focus on only one dimension — either a simple todo list or a basic timer. Kairos creates an uninterrupted loop that turns time from an enemy into your greatest strategic advantage.
                    </Text>
                </VStack>

                {/* 3 Steps Synergy Cards */}
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={10}>
                    {/* Step 1 */}
                    <Box
                        bg="rgba(10, 15, 29, 0.85)"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={6}
                        position="relative"
                    >
                        <HStack gap={3} mb={3}>
                            <Box
                                w="36px"
                                h="36px"
                                rounded="lg"
                                bg="rgba(6, 182, 212, 0.15)"
                                color="#22d3ee"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontWeight="bold"
                                fontSize="sm"
                            >
                                01
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" color="#ffffff">
                                Filter What Matters
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="#94a3b8" lineHeight="relaxed">
                            Use the Eisenhower Matrix to triage tasks into high-leverage Deep Work versus tactical Quick Wins, eliminating low-value busywork.
                        </Text>
                    </Box>

                    {/* Step 2 */}
                    <Box
                        bg="rgba(10, 15, 29, 0.85)"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={6}
                        position="relative"
                    >
                        <HStack gap={3} mb={3}>
                            <Box
                                w="36px"
                                h="36px"
                                rounded="lg"
                                bg="rgba(234, 179, 8, 0.15)"
                                color="#facc15"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontWeight="bold"
                                fontSize="sm"
                            >
                                02
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" color="#ffffff">
                                Match Biological Energy
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="#94a3b8" lineHeight="relaxed">
                            Consult your 24-hour biorhythm curve. Schedule your Quadrant 2 creative challenges during peak alertness windows and routine items during slumps.
                        </Text>
                    </Box>

                    {/* Step 3 */}
                    <Box
                        bg="rgba(10, 15, 29, 0.85)"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={6}
                        position="relative"
                    >
                        <HStack gap={3} mb={3}>
                            <Box
                                w="36px"
                                h="36px"
                                rounded="lg"
                                bg="rgba(244, 63, 94, 0.15)"
                                color="#fb7185"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontWeight="bold"
                                fontSize="sm"
                            >
                                03
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" color="#ffffff">
                                Lock In Pure Flow
                            </Text>
                        </HStack>
                        <Text fontSize="sm" color="#94a3b8" lineHeight="relaxed">
                            Lock in a single Active Target, trigger the countdown timer with live generative soundscapes, and enter distraction-free Zen mode.
                        </Text>
                    </Box>
                </SimpleGrid>

                {/* Bottom CTA Banner */}
                <VStack
                    bg="rgba(15, 23, 42, 0.9)"
                    border="1px solid rgba(99, 102, 241, 0.3)"
                    rounded="2xl"
                    p={{ base: 6, md: 8 }}
                    textAlign="center"
                    gap={4}
                >
                    <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="#ffffff">
                        Ready to experience circadian focus?
                    </Text>
                    <Text fontSize="sm" color="#94a3b8" maxW="600px">
                        No accounts required, no trackers, completely private and stored directly in your browser.
                    </Text>
                    <Button
                        onClick={onLaunchApp}
                        size="lg"
                        h="52px"
                        px={8}
                        rounded="xl"
                        bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                        color="#ffffff"
                        fontWeight="bold"
                        shadow="0 0 25px rgba(6, 182, 212, 0.45)"
                        _hover={{
                            bg: "linear-gradient(135deg, #0891b2, #2563eb)",
                            shadow: "0 0 35px rgba(6, 182, 212, 0.65)",
                            transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                    >
                        <HStack gap={2}>
                            <LuSparkles size={18} />
                            <Text>Launch Kairos Focus Engine Now</Text>
                            <LuArrowRight size={18} />
                        </HStack>
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
