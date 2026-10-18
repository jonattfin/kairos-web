import { Box, HStack, Text, Badge } from "@chakra-ui/react";
import { LuCrosshair } from "react-icons/lu";
import type { Task } from "../../types";

interface ActiveTargetCardProps {
    activeTask: Task | null;
}

export function ActiveTargetCard({ activeTask }: ActiveTargetCardProps) {
    return (
        <Box
            bg="#0a0f1d"
            border="1px solid #1e293b"
            rounded="2xl"
            p={4}
            mb={4}
        >
            <HStack justify="space-between" mb={1.5}>
                <HStack gap={2}>
                    <LuCrosshair size={14} color="#60a5fa" />
                    <Text fontSize="10px" fontWeight="bold" color="#60a5fa" letterSpacing="widest">
                        ACTIVE TARGET
                    </Text>
                </HStack>
                {activeTask && (
                    <Badge
                        bg="#172554"
                        color="#60a5fa"
                        border="1px solid #1e40af"
                        fontSize="9px"
                        rounded="full"
                        px={2}
                    >
                        {activeTask.quadrant.toUpperCase()}
                    </Badge>
                )}
            </HStack>
            <Text fontSize="md" fontWeight="bold" color="#ffffff" mb={1}>
                {activeTask ? activeTask.title : 'No active target selected'}
            </Text>
            <Text fontSize="xs" color="#94a3b8">
                {activeTask
                    ? activeTask.completed
                        ? 'Target completed! Select a new task to continue.'
                        : 'Focus during peak energy window.'
                    : 'Click the crosshair icon on any task to set as target.'}
            </Text>
        </Box>
    );
}
