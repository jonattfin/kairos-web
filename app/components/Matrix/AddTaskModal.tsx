import {
    Box,
    Flex,
    HStack,
    VStack,
    Text,
    Button,
    SimpleGrid,
} from "@chakra-ui/react";
import { LuPlus, LuX } from "react-icons/lu";
import type { QuadrantId } from "../../types";
import { QuadrantSelectorOption } from "./QuadrantSelectorOption";

interface AddTaskModalProps {
    isOpen: boolean;
    newTaskTitle: string;
    newTaskQuadrant: QuadrantId;
    onTitleChange: (title: string) => void;
    onQuadrantChange: (quadrant: QuadrantId) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
}

export function AddTaskModal({
    isOpen,
    newTaskTitle,
    newTaskQuadrant,
    onTitleChange,
    onQuadrantChange,
    onSubmit,
    onClose,
}: AddTaskModalProps) {
    if (!isOpen) return null;

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            w="100vw"
            h="100vh"
            bg="rgba(0, 0, 0, 0.75)"
            backdropFilter="blur(4px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={9999}
            p={4}
        >
            <Box
                bg="#0a0f1d"
                border="1px solid #1e293b"
                rounded="2xl"
                p={6}
                w="full"
                maxW="480px"
                shadow="0 20px 40px rgba(0, 0, 0, 0.6)"
            >
                <Flex justify="space-between" align="center" mb={4}>
                    <HStack gap={2}>
                        <LuPlus size={20} color="#818cf8" />
                        <Text fontSize="lg" fontWeight="bold" color="#ffffff">
                            Add New Task
                        </Text>
                    </HStack>
                    <Box
                        as="button"
                        onClick={onClose}
                        color="#94a3b8"
                        _hover={{ color: "#ffffff" }}
                        cursor="pointer"
                    >
                        <LuX size={18} />
                    </Box>
                </Flex>

                <form onSubmit={onSubmit}>
                    <VStack gap={4} align="stretch">
                        <Box>
                            <Text fontSize="xs" fontWeight="medium" color="#94a3b8" mb={1.5}>
                                Task Title
                            </Text>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={e => onTitleChange(e.target.value)}
                                placeholder="e.g. Prepare Quarter Architecture Review"
                                autoFocus
                                style={{
                                    width: "100%",
                                    backgroundColor: "#060913",
                                    border: "1px solid #1e293b",
                                    borderRadius: "12px",
                                    padding: "10px 14px",
                                    color: "#f8fafc",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                        </Box>

                        <Box>
                            <Text fontSize="xs" fontWeight="medium" color="#94a3b8" mb={1.5}>
                                Priority Quadrant
                            </Text>
                            <SimpleGrid columns={2} gap={2}>
                                <QuadrantSelectorOption
                                    selected={newTaskQuadrant === 'q1'}
                                    onClick={() => onQuadrantChange('q1')}
                                    label="Q1: Do First"
                                    desc="Urgent & Important"
                                    color="#fb7185"
                                />
                                <QuadrantSelectorOption
                                    selected={newTaskQuadrant === 'q2'}
                                    onClick={() => onQuadrantChange('q2')}
                                    label="Q2: Deep Work"
                                    desc="Strategic Focus"
                                    color="#34d399"
                                />
                                <QuadrantSelectorOption
                                    selected={newTaskQuadrant === 'q3'}
                                    onClick={() => onQuadrantChange('q3')}
                                    label="Q3: Quick Wins"
                                    desc="Low Cognition"
                                    color="#fbbf24"
                                />
                                <QuadrantSelectorOption
                                    selected={newTaskQuadrant === 'q4'}
                                    onClick={() => onQuadrantChange('q4')}
                                    label="Q4: Minimize"
                                    desc="Low Priority"
                                    color="#94a3b8"
                                />
                            </SimpleGrid>
                        </Box>

                        <HStack justify="flex-end" gap={3} mt={4}>
                            <Button
                                type="button"
                                bg="#0f172a"
                                _hover={{ bg: "#1e293b" }}
                                color="#cbd5e1"
                                rounded="xl"
                                px={4}
                                h="38px"
                                fontSize="xs"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                bg="#4f46e5"
                                _hover={{ bg: "#4338ca" }}
                                color="white"
                                rounded="xl"
                                px={6}
                                h="38px"
                                fontSize="xs"
                                fontWeight="semibold"
                                disabled={!newTaskTitle.trim()}
                            >
                                Add Task
                            </Button>
                        </HStack>
                    </VStack>
                </form>
            </Box>
        </Box>
    );
}
