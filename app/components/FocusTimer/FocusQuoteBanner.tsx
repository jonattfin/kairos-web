import { Box, HStack, VStack, Text, Badge } from "@chakra-ui/react";
import { LuQuote, LuRefreshCw, LuSparkles } from "react-icons/lu";
import type { FocusQuote } from "../../types";

interface FocusQuoteBannerProps {
    quote: FocusQuote;
    isFading?: boolean;
    isRunning?: boolean;
    accentColor?: string;
    onNextQuote?: () => void;
    variant?: 'card' | 'zen';
}

export function FocusQuoteBanner({
    quote,
    isFading = false,
    isRunning = false,
    accentColor = "#818cf8",
    onNextQuote,
    variant = 'card',
}: FocusQuoteBannerProps) {
    if (variant === 'zen') {
        return (
            <Box
                w="full"
                maxW="540px"
                bg="rgba(10, 15, 29, 0.65)"
                border="1px solid"
                borderColor={isRunning ? "rgba(99, 102, 241, 0.35)" : "rgba(30, 41, 59, 0.7)"}
                backdropFilter="blur(12px)"
                rounded="2xl"
                px={5}
                py={3.5}
                shadow={isRunning ? `0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px ${accentColor}15` : "0 10px 30px rgba(0, 0, 0, 0.4)"}
                position="relative"
                style={{
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                <HStack justify="space-between" align="flex-start" gap={3}>
                    <Box
                        color={accentColor}
                        opacity={isRunning ? 0.9 : 0.6}
                        mt={0.5}
                        flexShrink={0}
                    >
                        <LuQuote size={18} />
                    </Box>

                    <VStack
                        align="center"
                        flex="1"
                        gap={1.5}
                        textAlign="center"
                        style={{
                            opacity: isFading ? 0 : 1,
                            transform: isFading ? 'translateY(4px)' : 'translateY(0)',
                            transition: 'opacity 0.22s ease-in-out, transform 0.22s ease-in-out',
                        }}
                    >
                        <Text
                            fontSize={{ base: "13px", md: "14px" }}
                            fontWeight="medium"
                            fontStyle="italic"
                            color="#f1f5f9"
                            lineHeight="tall"
                            letterSpacing="wide"
                        >
                            "{quote.text}"
                        </Text>

                        <HStack gap={2} mt={0.5} justify="center">
                            <Text fontSize="11px" fontWeight="semibold" color="#94a3b8" letterSpacing="wider">
                                — {quote.author}
                            </Text>
                            {isRunning && (
                                <Badge
                                    bg="rgba(99, 102, 241, 0.18)"
                                    color="#a5b4fc"
                                    border="1px solid rgba(99, 102, 241, 0.3)"
                                    rounded="full"
                                    px={2}
                                    py={0.2}
                                    fontSize="9px"
                                >
                                    <HStack gap={1}>
                                        <LuSparkles size={10} color="#818cf8" />
                                        <Text>Focus Wisdom</Text>
                                    </HStack>
                                </Badge>
                            )}
                        </HStack>
                    </VStack>

                    {onNextQuote && (
                        <Box
                            as="button"
                            onClick={onNextQuote}
                            p={1.5}
                            rounded="lg"
                            color="#64748b"
                            _hover={{ color: "#ffffff", bg: "rgba(30, 41, 59, 0.6)" }}
                            cursor="pointer"
                            title="Cycle next focus quote"
                            flexShrink={0}
                            style={{
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <LuRefreshCw size={14} />
                        </Box>
                    )}
                </HStack>
            </Box>
        );
    }

    // Default 'card' variant for FocusTimerCard
    return (
        <Box
            w="full"
            bg="rgba(15, 23, 42, 0.55)"
            border="1px solid"
            borderColor={isRunning ? "rgba(99, 102, 241, 0.25)" : "#1e293b"}
            rounded="xl"
            p={3.5}
            my={2}
            shadow="0 4px 14px rgba(0, 0, 0, 0.25)"
            position="relative"
            style={{
                transition: 'all 0.3s ease-in-out',
            }}
        >
            <HStack justify="space-between" align="flex-start" gap={2.5}>
                <Box
                    color={accentColor}
                    opacity={isRunning ? 0.9 : 0.5}
                    mt={0.5}
                    flexShrink={0}
                >
                    <LuQuote size={15} />
                </Box>

                <VStack
                    align="flex-start"
                    flex="1"
                    gap={1}
                    style={{
                        opacity: isFading ? 0 : 1,
                        transform: isFading ? 'translateY(3px)' : 'translateY(0)',
                        transition: 'opacity 0.22s ease-in-out, transform 0.22s ease-in-out',
                    }}
                >
                    <Text
                        fontSize="xs"
                        fontWeight="normal"
                        fontStyle="italic"
                        color="#e2e8f0"
                        lineHeight="base"
                    >
                        "{quote.text}"
                    </Text>

                    <HStack justify="space-between" w="full" mt={0.5}>
                        <Text fontSize="10px" fontWeight="medium" color="#94a3b8">
                            — {quote.author}
                        </Text>
                        {isRunning && (
                            <Text fontSize="9px" color="#818cf8" fontWeight="medium">
                                Auto-cycles during focus
                            </Text>
                        )}
                    </HStack>
                </VStack>

                {onNextQuote && (
                    <Box
                        as="button"
                        onClick={onNextQuote}
                        p={1}
                        rounded="md"
                        color="#64748b"
                        _hover={{ color: "#f8fafc", bg: "#1e293b" }}
                        cursor="pointer"
                        title="Next inspirational quote"
                        flexShrink={0}
                        style={{
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <LuRefreshCw size={12} />
                    </Box>
                )}
            </HStack>
        </Box>
    );
}
