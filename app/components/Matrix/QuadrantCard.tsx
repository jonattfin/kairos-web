import { Box, Flex, HStack, VStack, Text, Badge, Button } from "@chakra-ui/react";
import { LuPlus, LuCheck, LuCrosshair, LuTrash2 } from "react-icons/lu";
import type { QuadrantId, Task } from "../../types";

interface QuadrantCardProps {
    quadrantId: QuadrantId;
    title: string;
    badgeText: string;
    icon: React.ReactNode;
    borderColor: string;
    titleColor: string;
    badgeBg: string;
    badgeBorder: string;
    highlighted?: boolean;
    tasks: Task[];
    activeTaskId: string;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onSetActiveTarget: (id: string) => void;
    onOpenAdd: () => void;
}

export function QuadrantCard({
    title,
    badgeText,
    icon,
    borderColor,
    titleColor,
    badgeBg,
    badgeBorder,
    highlighted,
    tasks,
    activeTaskId,
    onToggleTask,
    onDeleteTask,
    onSetActiveTarget,
    onOpenAdd,
}: QuadrantCardProps) {
    return (
        <Box
            bg="#0a0f1d"
            border={highlighted ? "2px solid #14b8a6" : `1px solid ${borderColor}`}
            boxShadow={highlighted ? "0 0 18px rgba(20, 184, 166, 0.35)" : "none"}
            rounded="2xl"
            p={4}
            minH="220px"
            display="flex"
            flexDirection="column"
            transition="all 0.2s ease"
        >
            <Flex justify="space-between" align="center" mb={3}>
                <HStack gap={2}>
                    {icon}
                    <Text fontSize="xs" fontWeight="bold" color={titleColor} letterSpacing="wide">
                        {title}
                    </Text>
                </HStack>
                <HStack gap={2}>
                    <Badge
                        bg={badgeBg}
                        color={titleColor}
                        border={`1px solid ${badgeBorder}`}
                        rounded="full"
                        px={2.5}
                        py={0.5}
                        fontSize="10px"
                        fontWeight="semibold"
                    >
                        {badgeText}
                    </Badge>
                    <Box
                        as="button"
                        aria-label={`Add task to ${title}`}
                        onClick={onOpenAdd}
                        p={1}
                        rounded="md"
                        color="#64748b"
                        _hover={{ bg: "#1e293b", color: "#ffffff" }}
                        cursor="pointer"
                    >
                        <LuPlus size={14} />
                    </Box>
                </HStack>
            </Flex>

            {tasks.length === 0 ? (
                <Flex flex="1" align="center" justify="center" direction="column" gap={2} py={4}>
                    <Text fontSize="xs" color="#475569" fontStyle="italic">
                        No tasks in this quadrant
                    </Text>
                    <Button
                        size="xs"
                        variant="ghost"
                        color="#818cf8"
                        _hover={{ bg: "#1e1b4b" }}
                        onClick={onOpenAdd}
                    >
                        + Add a task
                    </Button>
                </Flex>
            ) : (
                <VStack gap={2} align="stretch" flex="1">
                    {tasks.map(task => {
                        const isActiveTarget = task.id === activeTaskId;
                        return (
                            <Box
                                key={task.id}
                                bg={isActiveTarget ? "#0f172a" : "#060913"}
                                border="1px solid"
                                borderColor={isActiveTarget ? "#3b82f6" : "#1e293b"}
                                rounded="xl"
                                p={3}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                transition="all 0.15s ease"
                            >
                                <HStack gap={3} flex="1" overflow="hidden">
                                    <Box
                                        as="button"
                                        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                                        w="18px"
                                        h="18px"
                                        rounded="md"
                                        border={task.completed ? "1px solid #10b981" : "2px solid #64748b"}
                                        bg={task.completed ? "#047857" : "transparent"}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        cursor="pointer"
                                        onClick={() => onToggleTask(task.id)}
                                        flexShrink={0}
                                        _hover={{ borderColor: "#ffffff" }}
                                    >
                                        {task.completed && <LuCheck size={12} color="#ffffff" />}
                                    </Box>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color={task.completed ? "#64748b" : "#ffffff"}
                                        textDecoration={task.completed ? "line-through" : "none"}
                                        truncate
                                    >
                                        {task.title}
                                    </Text>
                                </HStack>

                                <HStack gap={1.5} ml={2} flexShrink={0}>
                                    <Box
                                        as="button"
                                        aria-label="Set as Active Target"
                                        onClick={() => onSetActiveTarget(task.id)}
                                        color={isActiveTarget ? "#60a5fa" : "#475569"}
                                        _hover={{ color: "#60a5fa" }}
                                        cursor="pointer"
                                        title={isActiveTarget ? "Current active target" : "Set as active target"}
                                        p={1}
                                        rounded="md"
                                    >
                                        <LuCrosshair size={14} />
                                    </Box>
                                    <Box
                                        as="button"
                                        aria-label="Delete task"
                                        onClick={() => onDeleteTask(task.id)}
                                        color="#475569"
                                        _hover={{ color: "#ef4444" }}
                                        cursor="pointer"
                                        p={1}
                                        rounded="md"
                                    >
                                        <LuTrash2 size={14} />
                                    </Box>
                                </HStack>
                            </Box>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
}
