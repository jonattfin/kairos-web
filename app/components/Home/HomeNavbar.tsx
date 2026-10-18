import { Box, Flex, HStack, Text, Button } from "@chakra-ui/react";
import { LuActivity, LuSparkles, LuArrowRight } from "react-icons/lu";

interface HomeNavbarProps {
    onLaunchApp: () => void;
}

export function HomeNavbar({ onLaunchApp }: HomeNavbarProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box
            as="nav"
            position="sticky"
            top="0"
            zIndex="50"
            bg="rgba(3, 7, 18, 0.85)"
            backdropFilter="blur(16px)"
            borderBottom="1px solid"
            borderColor="rgba(30, 41, 59, 0.8)"
            px={{ base: 4, md: 8 }}
            py={3.5}
            w="full"
        >
            <Flex
                maxW="1400px"
                mx="auto"
                justify="space-between"
                align="center"
            >
                {/* Brand Logo & Name */}
                <HStack
                    gap={3}
                    cursor="pointer"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <Box
                        w="40px"
                        h="40px"
                        rounded="xl"
                        bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        shadow="0 0 16px rgba(6, 182, 212, 0.45)"
                    >
                        <LuActivity size={22} color="#ffffff" />
                    </Box>
                    <Box>
                        <HStack gap={2}>
                            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" letterSpacing="tight" color="#ffffff">
                                Kairos
                            </Text>
                            <Text fontSize="xs" fontWeight="semibold" color="#818cf8" bg="rgba(99, 102, 241, 0.15)" px={2} py={0.5} rounded="md" border="1px solid rgba(99, 102, 241, 0.3)">
                                by PeaksAndValleys
                            </Text>
                        </HStack>
                    </Box>
                </HStack>

                {/* Navigation Links (Desktop) */}
                <HStack gap={6} display={{ base: "none", md: "flex" }}>
                    <Box
                        as="button"
                        onClick={() => scrollToSection("philosophy")}
                        color="#94a3b8"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ color: "#ffffff" }}
                        cursor="pointer"
                        transition="color 0.2s ease"
                    >
                        Philosophy
                    </Box>
                    <Box
                        as="button"
                        onClick={() => scrollToSection("three-strategies")}
                        color="#94a3b8"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ color: "#ffffff" }}
                        cursor="pointer"
                        transition="color 0.2s ease"
                    >
                        The 3 Strategies
                    </Box>
                    <Box
                        as="button"
                        onClick={() => scrollToSection("synergy")}
                        color="#94a3b8"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ color: "#ffffff" }}
                        cursor="pointer"
                        transition="color 0.2s ease"
                    >
                        How It Works
                    </Box>
                    <Box
                        as="button"
                        onClick={() => scrollToSection("about-company")}
                        color="#94a3b8"
                        fontSize="sm"
                        fontWeight="medium"
                        _hover={{ color: "#ffffff" }}
                        cursor="pointer"
                        transition="color 0.2s ease"
                    >
                        PeaksAndValleys
                    </Box>
                </HStack>

                {/* Action Buttons */}
                <HStack gap={3}>
                    <Button
                        onClick={onLaunchApp}
                        size={{ base: "sm", md: "md" }}
                        bg="linear-gradient(135deg, #06b6d4, #3b82f6)"
                        color="#ffffff"
                        fontWeight="bold"
                        rounded="xl"
                        px={{ base: 4, md: 5 }}
                        shadow="0 0 20px rgba(6, 182, 212, 0.4)"
                        _hover={{
                            bg: "linear-gradient(135deg, #0891b2, #2563eb)",
                            shadow: "0 0 25px rgba(6, 182, 212, 0.6)",
                            transform: "translateY(-1px)",
                        }}
                        transition="all 0.2s ease"
                    >
                        <HStack gap={2}>
                            <LuSparkles size={16} />
                            <Text>Launch App</Text>
                            <LuArrowRight size={16} />
                        </HStack>
                    </Button>
                </HStack>
            </Flex>
        </Box>
    );
}
