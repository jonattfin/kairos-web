import { Box, VStack, HStack, Text, SimpleGrid, Badge, Flex } from "@chakra-ui/react";
import {
    LuLayoutGrid,
    LuTimer,
    LuActivity,
    LuCircleCheck,
    LuFlame,
    LuBrain,
    LuSun,
    LuMoon,
    LuWaves,
    LuEye,
} from "react-icons/lu";

export function PrinciplesSection() {
    return (
        <Box
            id="three-strategies"
            py={{ base: 12, md: 20 }}
            px={{ base: 4, md: 8 }}
            maxW="1300px"
            mx="auto"
            position="relative"
        >
            {/* Section Header */}
            <VStack textAlign="center" gap={3} mb={{ base: 12, md: 16 }}>
                <Badge
                    bg="rgba(99, 102, 241, 0.15)"
                    color="#a5b4fc"
                    border="1px solid rgba(99, 102, 241, 0.3)"
                    rounded="full"
                    px={3.5}
                    py={1}
                    fontSize="xs"
                    fontWeight="bold"
                    letterSpacing="wider"
                >
                    THE THREE COGNITIVE PILLARS
                </Badge>
                <Text
                    fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                    fontWeight="extrabold"
                    color="#ffffff"
                    letterSpacing="tight"
                >
                    Three Scientific Frameworks. One Unified Focus Engine.
                </Text>
                <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color="#94a3b8"
                    maxW="720px"
                    lineHeight="relaxed"
                >
                    Individually, each strategy has transformed productivity. When synchronized in Kairos, they form an unbreakable system for peak cognitive performance and sustainable daily momentum.
                </Text>
            </VStack>

            {/* Pillar 1: Eisenhower Matrix */}
            <Box
                bg="linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 15, 29, 0.85) 100%)"
                border="1px solid #1e293b"
                rounded="3xl"
                p={{ base: 6, md: 10 }}
                mb={12}
                shadow="0 20px 40px rgba(0, 0, 0, 0.4)"
                position="relative"
                overflow="hidden"
            >
                {/* Accent glow corner */}
                <Box
                    position="absolute"
                    top="-60px"
                    right="-60px"
                    w="240px"
                    h="240px"
                    bg="radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)"
                    pointerEvents="none"
                />

                <Flex direction={{ base: "column", lg: "row" }} gap={8} align={{ base: "flex-start", lg: "center" }}>
                    <VStack align="flex-start" gap={4} flex="1">
                        <HStack gap={3}>
                            <Box
                                p={3}
                                rounded="2xl"
                                bg="rgba(6, 182, 212, 0.15)"
                                border="1px solid rgba(6, 182, 212, 0.4)"
                                color="#22d3ee"
                            >
                                <LuLayoutGrid size={26} />
                            </Box>
                            <Box>
                                <Badge
                                    bg="rgba(6, 182, 212, 0.1)"
                                    color="#22d3ee"
                                    px={2.5}
                                    py={0.5}
                                    rounded="md"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    STRATEGY 1 · WHAT TO DO
                                </Badge>
                                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="#ffffff">
                                    The Eisenhower Matrix
                                </Text>
                            </Box>
                        </HStack>

                        <Text fontSize="md" color="#cbd5e1" lineHeight="tall">
                            Named after President Dwight D. Eisenhower, this framework solves the <strong>"Urgency Trap"</strong> — the psychological tendency to prioritize immediate demands over important long-term goals. It organizes all human effort into four distinct quadrants based on <em>Urgency</em> and <em>Importance</em>.
                        </Text>

                        <VStack align="flex-start" gap={2.5} w="full" pt={1}>
                            <HStack gap={2.5} align="flex-start">
                                <LuCircleCheck size={18} color="#22d3ee" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Do First (Urgent & Important):</strong> Critical emergencies and deadline-driven milestones that demand swift decisive action.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuCircleCheck size={18} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Deep Work (Important, Not Urgent):</strong> Strategic planning, skill acquisition, and creative depth where compounding life value is created.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuCircleCheck size={18} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Quick Wins (Urgent, Not Important):</strong> Tactical tasks and administrative items ideal for clearing during lower-energy intervals.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuCircleCheck size={18} color="#64748b" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Minimize (Neither):</strong> Low-value distractions, busywork, and friction that drains cognitive reserve.
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>

                    {/* Matrix Quadrant Visual Card */}
                    <Box
                        flex="1"
                        w="full"
                        bg="#050a15"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={5}
                        shadow="inner"
                    >
                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                            <Box bg="rgba(244, 63, 94, 0.08)" border="1px solid rgba(244, 63, 94, 0.25)" rounded="xl" p={4}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" fontWeight="bold" color="#fb7185">Q1 · DO FIRST</Text>
                                    <Badge bg="rgba(244, 63, 94, 0.2)" color="#fecdd3" fontSize="9px">Urgent & Key</Badge>
                                </HStack>
                                <Text fontSize="xs" color="#94a3b8">High-impact crises and strict deadlines.</Text>
                            </Box>

                            <Box bg="rgba(99, 102, 241, 0.08)" border="1px solid rgba(99, 102, 241, 0.25)" rounded="xl" p={4}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" fontWeight="bold" color="#a5b4fc">Q2 · DEEP WORK</Text>
                                    <Badge bg="rgba(99, 102, 241, 0.2)" color="#e0e7ff" fontSize="9px">High Leverage</Badge>
                                </HStack>
                                <Text fontSize="xs" color="#94a3b8">Creative flow, architecture & mastery.</Text>
                            </Box>

                            <Box bg="rgba(6, 182, 212, 0.08)" border="1px solid rgba(6, 182, 212, 0.25)" rounded="xl" p={4}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" fontWeight="bold" color="#22d3ee">Q3 · QUICK WINS</Text>
                                    <Badge bg="rgba(6, 182, 212, 0.2)" color="#cffafe" fontSize="9px">Low Friction</Badge>
                                </HStack>
                                <Text fontSize="xs" color="#94a3b8">Fast tasks, emails & tactical chores.</Text>
                            </Box>

                            <Box bg="rgba(51, 65, 85, 0.15)" border="1px solid rgba(51, 65, 85, 0.4)" rounded="xl" p={4}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontSize="xs" fontWeight="bold" color="#94a3b8">Q4 · MINIMIZE</Text>
                                    <Badge bg="rgba(51, 65, 85, 0.3)" color="#cbd5e1" fontSize="9px">Eliminate</Badge>
                                </HStack>
                                <Text fontSize="xs" color="#64748b">Trivial noise and cognitive drains.</Text>
                            </Box>
                        </SimpleGrid>
                    </Box>
                </Flex>
            </Box>

            {/* Pillar 2: Pomodoro Principle */}
            <Box
                bg="linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 15, 29, 0.85) 100%)"
                border="1px solid #1e293b"
                rounded="3xl"
                p={{ base: 6, md: 10 }}
                mb={12}
                shadow="0 20px 40px rgba(0, 0, 0, 0.4)"
                position="relative"
                overflow="hidden"
            >
                {/* Accent glow corner */}
                <Box
                    position="absolute"
                    top="-60px"
                    left="-60px"
                    w="240px"
                    h="240px"
                    bg="radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, transparent 70%)"
                    pointerEvents="none"
                />

                <Flex direction={{ base: "column", lg: "row-reverse" }} gap={8} align={{ base: "flex-start", lg: "center" }}>
                    <VStack align="flex-start" gap={4} flex="1">
                        <HStack gap={3}>
                            <Box
                                p={3}
                                rounded="2xl"
                                bg="rgba(244, 63, 94, 0.15)"
                                border="1px solid rgba(244, 63, 94, 0.4)"
                                color="#fb7185"
                            >
                                <LuTimer size={26} />
                            </Box>
                            <Box>
                                <Badge
                                    bg="rgba(244, 63, 94, 0.1)"
                                    color="#fb7185"
                                    px={2.5}
                                    py={0.5}
                                    rounded="md"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    STRATEGY 2 · HOW TO EXECUTE
                                </Badge>
                                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="#ffffff">
                                    The Pomodoro Principle & Time-Boxing
                                </Text>
                            </Box>
                        </HStack>

                        <Text fontSize="md" color="#cbd5e1" lineHeight="tall">
                            Developed by Francesco Cirillo, the Pomodoro Technique uses structured, time-delimited sprints to eliminate resistance, eliminate multitasking, and induce deep neurological flow. Kairos elevates this with generative procedural acoustics and immersion modes.
                        </Text>

                        <VStack align="flex-start" gap={2.5} w="full" pt={1}>
                            <HStack gap={2.5} align="flex-start">
                                <LuBrain size={18} color="#fb7185" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Preset Sprint Durations:</strong> Switch seamlessly between 50m Deep Focus blocks, 25m Classic sprints, and 15m Micro bursts.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuWaves size={18} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Generative Ambient Soundscapes:</strong> Live Web Audio synthesis for soothing wind gusts, rain on glass, 10Hz alpha binaural waves, and crackling campfire.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuEye size={18} color="#22d3ee" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Zen Immersion & Audio Visualizers:</strong> Fullscreen distraction-free canvas with Winamp-inspired live oscilloscope and spectrum analyzers.
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>

                    {/* Timer Visual Feature Card */}
                    <Box
                        flex="1"
                        w="full"
                        bg="#050a15"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={6}
                        shadow="inner"
                    >
                        <VStack gap={4} align="stretch">
                            <HStack justify="space-between" borderBottom="1px solid #1e293b" pb={3}>
                                <Text fontSize="sm" fontWeight="bold" color="#ffffff">Focus Interval Engine</Text>
                                <Badge bg="rgba(244, 63, 94, 0.2)" color="#fb7185" rounded="full" px={2.5}>Live Synthesis</Badge>
                            </HStack>

                            <SimpleGrid columns={3} gap={2}>
                                <Box bg="#0a0f1d" p={3} rounded="xl" textAlign="center" border="1px solid #1e293b">
                                    <Text fontSize="lg" fontWeight="bold" color="#fb7185">50m</Text>
                                    <Text fontSize="10px" color="#94a3b8">Deep Work</Text>
                                </Box>
                                <Box bg="#0a0f1d" p={3} rounded="xl" textAlign="center" border="1px solid #1e293b">
                                    <Text fontSize="lg" fontWeight="bold" color="#38bdf8">25m</Text>
                                    <Text fontSize="10px" color="#94a3b8">Classic</Text>
                                </Box>
                                <Box bg="#0a0f1d" p={3} rounded="xl" textAlign="center" border="1px solid #1e293b">
                                    <Text fontSize="lg" fontWeight="bold" color="#a78bfa">15m</Text>
                                    <Text fontSize="10px" color="#94a3b8">Micro Reset</Text>
                                </Box>
                            </SimpleGrid>

                            <Box bg="rgba(15, 23, 42, 0.8)" p={3.5} rounded="xl" border="1px solid #1e293b">
                                <HStack justify="space-between" mb={1}>
                                    <HStack gap={2}>
                                        <LuWaves size={14} color="#818cf8" />
                                        <Text fontSize="xs" fontWeight="semibold" color="#cbd5e1">Atmospheric Flow Audio</Text>
                                    </HStack>
                                    <Text fontSize="10px" color="#818cf8">4 Layers Procedural</Text>
                                </HStack>
                                <Text fontSize="11px" color="#64748b">Zero external audio dependencies, infinite unique modulations.</Text>
                            </Box>
                        </VStack>
                    </Box>
                </Flex>
            </Box>

            {/* Pillar 3: Biorhythm & Circadian Alignment */}
            <Box
                bg="linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 15, 29, 0.85) 100%)"
                border="1px solid #1e293b"
                rounded="3xl"
                p={{ base: 6, md: 10 }}
                shadow="0 20px 40px rgba(0, 0, 0, 0.4)"
                position="relative"
                overflow="hidden"
            >
                {/* Accent glow corner */}
                <Box
                    position="absolute"
                    bottom="-60px"
                    right="-60px"
                    w="240px"
                    h="240px"
                    bg="radial-gradient(circle, rgba(234, 179, 8, 0.18) 0%, transparent 70%)"
                    pointerEvents="none"
                />

                <Flex direction={{ base: "column", lg: "row" }} gap={8} align={{ base: "flex-start", lg: "center" }}>
                    <VStack align="flex-start" gap={4} flex="1">
                        <HStack gap={3}>
                            <Box
                                p={3}
                                rounded="2xl"
                                bg="rgba(234, 179, 8, 0.15)"
                                border="1px solid rgba(234, 179, 8, 0.4)"
                                color="#facc15"
                            >
                                <LuActivity size={26} />
                            </Box>
                            <Box>
                                <Badge
                                    bg="rgba(234, 179, 8, 0.1)"
                                    color="#facc15"
                                    px={2.5}
                                    py={0.5}
                                    rounded="md"
                                    fontSize="xs"
                                    fontWeight="bold"
                                >
                                    STRATEGY 3 · WHEN TO DO IT
                                </Badge>
                                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="#ffffff">
                                    The Circadian Biorhythm
                                </Text>
                            </Box>
                        </HStack>

                        <Text fontSize="md" color="#cbd5e1" lineHeight="tall">
                            Human cognitive capability is not static across the day. Governed by 24-hour suprachiasmatic biological rhythms, your focus, vigilance, and executive function rise and dip in predictable waves. Aligning difficult tasks with peak energy triples output while eliminating burnout.
                        </Text>

                        <VStack align="flex-start" gap={2.5} w="full" pt={1}>
                            <HStack gap={2.5} align="flex-start">
                                <LuSun size={18} color="#facc15" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Chronotype Customization:</strong> Fine-tuned for Standard schedules, Early Larks (morning peak), and Night Owls (afternoon/evening peak).
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuFlame size={18} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Real-Time Energy Scrubbing:</strong> Interactive SVG curve lets you scrub 24 hours to preview optimal focus windows and phase transitions.
                                </Text>
                            </HStack>
                            <HStack gap={2.5} align="flex-start">
                                <LuMoon size={18} color="#a5b4fc" style={{ marginTop: '2px', flexShrink: 0 }} />
                                <Text fontSize="sm" color="#94a3b8">
                                    <strong style={{ color: '#f1f5f9' }}>Slump Navigation:</strong> Smart alerts during the post-lunch dip to shift into low-cognitive friction tasks or renewal breaks.
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>

                    {/* Biorhythm Visual Feature Card */}
                    <Box
                        flex="1"
                        w="full"
                        bg="#050a15"
                        border="1px solid #1e293b"
                        rounded="2xl"
                        p={6}
                        shadow="inner"
                    >
                        <VStack gap={4} align="stretch">
                            <HStack justify="space-between" borderBottom="1px solid #1e293b" pb={3}>
                                <Text fontSize="sm" fontWeight="bold" color="#ffffff">Circadian Rhythm Phase Model</Text>
                                <Badge bg="rgba(234, 179, 8, 0.2)" color="#facc15" rounded="full" px={2.5}>24-Hour Telemetry</Badge>
                            </HStack>

                            <VStack gap={2} align="stretch">
                                <HStack justify="space-between" bg="#0a0f1d" p={3} rounded="xl" border="1px solid #1e293b">
                                    <HStack gap={2}>
                                        <Badge bg="rgba(6, 182, 212, 0.2)" color="#22d3ee" rounded="md">08:00 - 13:00</Badge>
                                        <Text fontSize="xs" fontWeight="semibold" color="#f1f5f9">Deep Focus Peak</Text>
                                    </HStack>
                                    <Text fontSize="11px" color="#22d3ee" fontWeight="bold">95% Energy</Text>
                                </HStack>

                                <HStack justify="space-between" bg="#0a0f1d" p={3} rounded="xl" border="1px solid #1e293b">
                                    <HStack gap={2}>
                                        <Badge bg="rgba(244, 63, 94, 0.2)" color="#fb7185" rounded="md">13:30 - 15:30</Badge>
                                        <Text fontSize="xs" fontWeight="semibold" color="#f1f5f9">Afternoon Slump</Text>
                                    </HStack>
                                    <Text fontSize="11px" color="#fb7185" fontWeight="bold">38% Energy</Text>
                                </HStack>

                                <HStack justify="space-between" bg="#0a0f1d" p={3} rounded="xl" border="1px solid #1e293b">
                                    <HStack gap={2}>
                                        <Badge bg="rgba(99, 102, 241, 0.2)" color="#a5b4fc" rounded="md">16:00 - 18:30</Badge>
                                        <Text fontSize="xs" fontWeight="semibold" color="#f1f5f9">Secondary Rebound</Text>
                                    </HStack>
                                    <Text fontSize="11px" color="#a5b4fc" fontWeight="bold">72% Energy</Text>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}
