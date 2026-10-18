import { Box, HStack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface MetricStatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    accentColor: string;
    badgeText?: string;
    badgeBg?: string;
    badgeColor?: string;
}

export function MetricStatCard({
    title,
    value,
    subtitle,
    icon,
    accentColor,
    badgeText,
    badgeBg,
    badgeColor,
}: MetricStatCardProps) {
    return (
        <Box
            bg="#0d1424"
            border="1px solid #1e293b"
            rounded="xl"
            p={4}
            position="relative"
            overflow="hidden"
            transition="all 0.2s ease"
            _hover={{
                borderColor: "#334155",
                transform: "translateY(-1px)",
                shadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
        >
            {/* Ambient subtle glow */}
            <Box
                position="absolute"
                top="-20px"
                right="-20px"
                w="60px"
                h="60px"
                rounded="full"
                bg={accentColor}
                opacity={0.08}
                filter="blur(16px)"
                pointerEvents="none"
            />

            <HStack justify="space-between" align="flex-start" mb={2}>
                <Text fontSize="xs" fontWeight="semibold" color="#94a3b8" letterSpacing="wide">
                    {title}
                </Text>
                <Box
                    p={2}
                    rounded="lg"
                    bg="#060913"
                    border="1px solid #1e293b"
                    color={accentColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {icon}
                </Box>
            </HStack>

            <HStack align="baseline" gap={2}>
                <Text fontSize="2xl" fontWeight="black" color="#f8fafc" letterSpacing="tight">
                    {value}
                </Text>
                {badgeText && (
                    <Box
                        bg={badgeBg || "#1e1b4b"}
                        color={badgeColor || "#818cf8"}
                        border="1px solid"
                        borderColor={badgeColor ? `${badgeColor}40` : "#3730a3"}
                        rounded="full"
                        px={2}
                        py={0.5}
                        fontSize="10px"
                        fontWeight="bold"
                    >
                        {badgeText}
                    </Box>
                )}
            </HStack>

            {subtitle && (
                <Text fontSize="11px" color="#64748b" mt={1}>
                    {subtitle}
                </Text>
            )}
        </Box>
    );
}
