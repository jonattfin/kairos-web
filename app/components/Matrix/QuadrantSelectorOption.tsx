import { Box, Text } from "@chakra-ui/react";

interface QuadrantSelectorOptionProps {
    selected: boolean;
    onClick: () => void;
    label: string;
    desc: string;
    color: string;
}

export function QuadrantSelectorOption({
    selected,
    onClick,
    label,
    desc,
    color,
}: QuadrantSelectorOptionProps) {
    return (
        <Box
            as="button"
            onClick={onClick}
            p={2.5}
            rounded="xl"
            bg={selected ? "#1e1b4b" : "#060913"}
            border="1px solid"
            borderColor={selected ? color : "#1e293b"}
            textAlign="left"
            cursor="pointer"
            transition="all 0.15s ease"
        >
            <Text fontSize="xs" fontWeight="bold" color={selected ? color : "#cbd5e1"}>
                {label}
            </Text>
            <Text fontSize="10px" color="#64748b">
                {desc}
            </Text>
        </Box>
    );
}
