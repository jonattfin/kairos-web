import { Box, Flex, VStack, HStack, Text, Button, Badge, SimpleGrid } from "@chakra-ui/react";
import {
    LuSparkles,
    LuArrowRight,
    LuLayoutGrid,
    LuTimer,
    LuActivity,
    LuCompass,
    LuZap,
    LuShieldCheck,
} from "react-icons/lu";

interface HeroSectionProps {
    onLaunchApp: () => void;
    onExplorePrinciples: () => void;
}

export function HeroSection({ onLaunchApp, onExplorePrinciples }: HeroSectionProps) {
    return (
        <Box
            id="philosophy"
            position="relative"
            pt={{ base: 12, md: 20 }}
            pb={{ base: 16, md: 24 }}
            px={{ base: 4, md: 8 }}
            overflow="hidden"
        >
            {/* Ambient Background Glow Orbs */}
            <Box
                position="absolute"
                top="10%"
                left="50%"
                transform="translateX(-50%)"
                w={{ base: "300px", md: "700px" }}
                h={{ base: "300px", md: "500px" }}
                bg="radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(3, 7, 18, 0) 80%)"
                filter="blur(60px)"
                pointerEvents="none"
                zIndex="0"
            />

            <VStack
                maxW="1100px"
                mx="auto"
                textAlign="center"
                gap={8}
                position="relative"
                zIndex="1"
            >
                {/* Release & Creator Badge */}
                <HStack
                    bg="rgba(15, 23, 42, 0.8)"
                    border="1px solid"
                    borderColor="rgba(99, 102, 241, 0.35)"
                    rounded="full"
                    px={4}
                    py={1.5}
                    shadow="0 0 20px rgba(99, 102, 241, 0.2)"
                    gap={2}
                >
                    <LuSparkles size={14} color="#818cf8" />
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="#cbd5e1">
                        Crafted by <Text as="span" fontWeight="bold" color="#38bdf8">PeaksAndValleys</Text> — The Circadian Focus System
                    </Text>
                </HStack>

                {/* Hero Main Heading */}
                <VStack gap={4} maxW="950px">
                    <Text
                        fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
                        fontWeight="extrabold"
                        letterSpacing="tight"
                        lineHeight={{ base: "1.15", md: "1.1" }}
                        color="#ffffff"
                    >
                        Master Attention in an Era of{" "}
                        <Text
                            as="span"
                            bgGradient="linear(to-r, #06b6d4, #818cf8, #c084fc)"
                            bgClip="text"
                        >
                            Infinite Distraction.
                        </Text>
                    </Text>

                    {/* Core Philosophy Statement from Prompt */}
                    <Box
                        bg="rgba(15, 23, 42, 0.6)"
                        border="1px solid rgba(51, 65, 85, 0.6)"
                        backdropFilter="blur(12px)"
                        rounded="2xl"
                        p={{ base: 5, md: 7 }}
                        mt={3}
                        shadow="0 10px 30px rgba(0, 0, 0, 0.5)"
                    >
                        <Text
                            fontSize={{ base: "md", md: "lg", lg: "xl" }}
                            color="#e2e8f0"
                            fontWeight="medium"
                            lineHeight="tall"
                            letterSpacing="wide"
                        >
                            "We are living in one of the best periods of humanity. As users we have the power at our fingertips, but with so many choices, it's getting easy to be distracted. Let's maximize the usage of our time by combining three powerful strategies."
                        </Text>

                        {/* Three Pillars Pill Strip */}
                        <Flex
                            wrap="wrap"
                            justify="center"
                            gap={3}
                            mt={5}
                            pt={4}
                            borderTop="1px solid rgba(51, 65, 85, 0.4)"
                        >
                            <Badge
                                bg="rgba(6, 182, 212, 0.15)"
                                color="#22d3ee"
                                border="1px solid rgba(6, 182, 212, 0.4)"
                                rounded="lg"
                                px={3.5}
                                py={1.5}
                                fontSize="sm"
                                fontWeight="semibold"
                            >
                                <HStack gap={2}>
                                    <LuLayoutGrid size={15} />
                                    <Text>1. The Eisenhower Matrix</Text>
                                </HStack>
                            </Badge>

                            <Badge
                                bg="rgba(244, 63, 94, 0.15)"
                                color="#fb7185"
                                border="1px solid rgba(244, 63, 94, 0.4)"
                                rounded="lg"
                                px={3.5}
                                py={1.5}
                                fontSize="sm"
                                fontWeight="semibold"
                            >
                                <HStack gap={2}>
                                    <LuTimer size={15} />
                                    <Text>2. The Pomodoro Principle</Text>
                                </HStack>
                            </Badge>

                            <Badge
                                bg="rgba(234, 179, 8, 0.15)"
                                color="#facc15"
                                border="1px solid rgba(234, 179, 8, 0.4)"
                                rounded="lg"
                                px={3.5}
                                py={1.5}
                                fontSize="sm"
                                fontWeight="semibold"
                            >
                                <HStack gap={2}>
                                    <LuActivity size={15} />
                                    <Text>3. The Biorhythm Curve</Text>
                                </HStack>
                            </Badge>
                        </Flex>
                    </Box>
                </VStack>

                {/* Primary CTA Buttons */}
                <HStack gap={4} wrap="wrap" justify="center" pt={2}>
                    <Button
                        onClick={onLaunchApp}
                        size="lg"
                        h="56px"
                        px={8}
                        rounded="2xl"
                        bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                        color="#ffffff"
                        fontWeight="bold"
                        fontSize="md"
                        shadow="0 0 30px rgba(6, 182, 212, 0.45)"
                        _hover={{
                            bg: "linear-gradient(135deg, #0891b2, #2563eb)",
                            shadow: "0 0 40px rgba(6, 182, 212, 0.7)",
                            transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s ease"
                    >
                        <HStack gap={3}>
                            <LuSparkles size={20} />
                            <Text>Launch Kairos Focus App</Text>
                            <LuArrowRight size={20} />
                        </HStack>
                    </Button>

                    <Button
                        onClick={onExplorePrinciples}
                        variant="outline"
                        size="lg"
                        h="56px"
                        px={7}
                        rounded="2xl"
                        borderColor="rgba(100, 116, 139, 0.6)"
                        color="#cbd5e1"
                        bg="rgba(15, 23, 42, 0.5)"
                        fontWeight="medium"
                        fontSize="md"
                        _hover={{
                            bg: "rgba(30, 41, 59, 0.8)",
                            borderColor: "#94a3b8",
                            color: "#ffffff",
                        }}
                        transition="all 0.2s ease"
                    >
                        <HStack gap={2}>
                            <LuCompass size={18} />
                            <Text>Explore The 3 Strategies</Text>
                        </HStack>
                    </Button>
                </HStack>

                {/* Feature Metric Highlights */}
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} w="full" pt={6}>
                    <Box
                        bg="rgba(10, 15, 29, 0.7)"
                        border="1px solid #1e293b"
                        rounded="xl"
                        p={4}
                        textAlign="center"
                    >
                        <HStack justify="center" gap={1.5} color="#06b6d4" mb={1}>
                            <LuZap size={16} />
                            <Text fontSize="xl" fontWeight="bold" color="#ffffff">
                                3-in-1
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="#94a3b8">
                            Unified Cognitive Framework
                        </Text>
                    </Box>

                    <Box
                        bg="rgba(10, 15, 29, 0.7)"
                        border="1px solid #1e293b"
                        rounded="xl"
                        p={4}
                        textAlign="center"
                    >
                        <HStack justify="center" gap={1.5} color="#818cf8" mb={1}>
                            <LuActivity size={16} />
                            <Text fontSize="xl" fontWeight="bold" color="#ffffff">
                                24-Hour
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="#94a3b8">
                            Circadian Rhythm Alignment
                        </Text>
                    </Box>

                    <Box
                        bg="rgba(10, 15, 29, 0.7)"
                        border="1px solid #1e293b"
                        rounded="xl"
                        p={4}
                        textAlign="center"
                    >
                        <HStack justify="center" gap={1.5} color="#f43f5e" mb={1}>
                            <LuTimer size={16} />
                            <Text fontSize="xl" fontWeight="bold" color="#ffffff">
                                4 Levels
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="#94a3b8">
                            Eisenhower Priority Matrix
                        </Text>
                    </Box>

                    <Box
                        bg="rgba(10, 15, 29, 0.7)"
                        border="1px solid #1e293b"
                        rounded="xl"
                        p={4}
                        textAlign="center"
                    >
                        <HStack justify="center" gap={1.5} color="#10b981" mb={1}>
                            <LuShieldCheck size={16} />
                            <Text fontSize="xl" fontWeight="bold" color="#ffffff">
                                100% Local
                            </Text>
                        </HStack>
                        <Text fontSize="xs" color="#94a3b8">
                            Private, Browser-First Storage
                        </Text>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Box>
    );
}
