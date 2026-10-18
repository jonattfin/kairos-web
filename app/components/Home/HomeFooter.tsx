import { Box, Flex, VStack, HStack, Text, SimpleGrid } from "@chakra-ui/react";
import { LuActivity } from "react-icons/lu";

interface HomeFooterProps {
    onLaunchApp: () => void;
}

export function HomeFooter({ onLaunchApp }: HomeFooterProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box
            id="about-company"
            as="footer"
            bg="#030712"
            borderTop="1px solid #1e293b"
            pt={{ base: 14, md: 20 }}
            pb={10}
            px={{ base: 4, md: 8 }}
            color="#94a3b8"
        >
            <Box maxW="1300px" mx="auto">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} gap={8} mb={12}>
                    {/* Brand Column */}
                    <VStack align="flex-start" gap={4} gridColumn={{ base: "auto", lg: "span 2" }}>
                        <HStack gap={3}>
                            <Box
                                w="38px"
                                h="38px"
                                rounded="xl"
                                bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                shadow="0 0 15px rgba(6, 182, 212, 0.4)"
                            >
                                <LuActivity size={20} color="#ffffff" />
                            </Box>
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" color="#ffffff">
                                    Kairos Focus Engine
                                </Text>
                                <Text fontSize="xs" color="#818cf8" fontWeight="medium">
                                    by PeaksAndValleys
                                </Text>
                            </Box>
                        </HStack>

                        <Text fontSize="sm" color="#94a3b8" maxW="380px" lineHeight="relaxed">
                            Built by <strong>PeaksAndValleys</strong>. We craft cognitive enhancement tools that align human biology, deep work principles, and elegant interface design for peak mental clarity.
                        </Text>

                        <HStack gap={3} pt={2}>
                            <Box
                                as="button"
                                onClick={onLaunchApp}
                                px={3.5}
                                py={1.5}
                                bg="rgba(99, 102, 241, 0.15)"
                                border="1px solid rgba(99, 102, 241, 0.3)"
                                rounded="lg"
                                color="#a5b4fc"
                                fontSize="xs"
                                fontWeight="semibold"
                                _hover={{ bg: "rgba(99, 102, 241, 0.25)", color: "#ffffff" }}
                                cursor="pointer"
                                transition="all 0.2s ease"
                            >
                                Open App
                            </Box>
                            <Text fontSize="xs" color="#64748b">
                                Pure client-side · Zero tracking
                            </Text>
                        </HStack>
                    </VStack>

                    {/* Column 1: Core Engine */}
                    <VStack align="flex-start" gap={2.5}>
                        <Text fontSize="xs" fontWeight="bold" color="#ffffff" letterSpacing="wider" textTransform="uppercase">
                            Focus Engine
                        </Text>
                        <Box
                            as="button"
                            onClick={onLaunchApp}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Eisenhower Matrix
                        </Box>
                        <Box
                            as="button"
                            onClick={onLaunchApp}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            24h Biorhythm Curve
                        </Box>
                        <Box
                            as="button"
                            onClick={onLaunchApp}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Pomodoro Countdown
                        </Box>
                        <Box
                            as="button"
                            onClick={onLaunchApp}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Ambient Soundscape Mixer
                        </Box>
                        <Box
                            as="button"
                            onClick={onLaunchApp}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Zen Immersion Mode
                        </Box>
                    </VStack>

                    {/* Column 2: Science & Philosophy */}
                    <VStack align="flex-start" gap={2.5}>
                        <Text fontSize="xs" fontWeight="bold" color="#ffffff" letterSpacing="wider" textTransform="uppercase">
                            Philosophy
                        </Text>
                        <Box
                            as="button"
                            onClick={() => scrollToSection("philosophy")}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            The Modern Dilemma
                        </Box>
                        <Box
                            as="button"
                            onClick={() => scrollToSection("three-strategies")}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Eisenhower Priority
                        </Box>
                        <Box
                            as="button"
                            onClick={() => scrollToSection("three-strategies")}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Pomodoro Interval Science
                        </Box>
                        <Box
                            as="button"
                            onClick={() => scrollToSection("three-strategies")}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Circadian Chronotypes
                        </Box>
                        <Box
                            as="button"
                            onClick={() => scrollToSection("synergy")}
                            fontSize="sm"
                            color="#94a3b8"
                            _hover={{ color: "#38bdf8" }}
                            cursor="pointer"
                            textAlign="left"
                        >
                            Triad Synergy
                        </Box>
                    </VStack>

                    {/* Column 3: Company & Legal */}
                    <VStack align="flex-start" gap={2.5}>
                        <Text fontSize="xs" fontWeight="bold" color="#ffffff" letterSpacing="wider" textTransform="uppercase">
                            PeaksAndValleys
                        </Text>
                        <Text fontSize="sm" color="#94a3b8">
                            About PeaksAndValleys
                        </Text>
                        <Text fontSize="sm" color="#94a3b8">
                            Circadian Research Lab
                        </Text>
                        <Text fontSize="sm" color="#94a3b8">
                            Privacy Policy
                        </Text>
                        <Text fontSize="sm" color="#94a3b8">
                            Terms of Service
                        </Text>
                        <Text fontSize="sm" color="#94a3b8">
                            Contact & Feedback
                        </Text>
                    </VStack>
                </SimpleGrid>

                {/* Bottom Border & Copyright */}
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={4}
                    pt={8}
                    borderTop="1px solid #1e293b"
                    fontSize="xs"
                    color="#64748b"
                >
                    <HStack gap={2}>
                        <Text>© {2006} PeaksAndValleys. All rights reserved.</Text>
                    </HStack>

                    <HStack gap={4}>
                        <Text>Privacy First</Text>
                        <Text>•</Text>
                        <Text>Local Storage</Text>
                        <Text>•</Text>
                        <Text>Zero Distractions</Text>
                    </HStack>
                </Flex>
            </Box>
        </Box>
    );
}
