import {
    Box,
    Flex,
    HStack,
    Text,
    Button,
    SimpleGrid,
} from "@chakra-ui/react";
import { LuLayoutGrid, LuPlus, LuTarget, LuActivity, LuZap, LuArchive } from "react-icons/lu";
import type { EnergyEvaluation, QuadrantId, Task } from "../../types";
import { QuadrantCard } from "./QuadrantCard";

interface PriorityMatrixProps {
    tasks: Task[];
    activeTaskId: string;
    effectiveEnergy: EnergyEvaluation;
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    onSetActiveTarget: (id: string) => void;
    onOpenAddModal: (quadrant?: QuadrantId) => void;
    getTasksByQuadrant: (q: QuadrantId) => Task[];
}

export function PriorityMatrix({
    tasks,
    activeTaskId,
    effectiveEnergy,
    onToggleTask,
    onDeleteTask,
    onSetActiveTarget,
    onOpenAddModal,
    getTasksByQuadrant,
}: PriorityMatrixProps) {
    const activeTasksCount = tasks.filter(t => !t.completed).length;

    return (
        <Box flex={{ base: "1", lg: "7" }} w="full">
            {/* Matrix Header */}
            <Flex justify="space-between" align="center" mb={4}>
                <HStack gap={3}>
                    <Box
                        w="32px"
                        h="32px"
                        rounded="lg"
                        bg="#1e1b4b"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <LuLayoutGrid size={18} color="#818cf8" />
                    </Box>
                    <Box>
                        <Text fontSize="md" fontWeight="bold">
                            Eisenhower Priority Matrix
                        </Text>
                        <Text fontSize="xs" color="#64748b">
                            Organize tasks by urgency and cognitive importance ({activeTasksCount} active).
                        </Text>
                    </Box>
                </HStack>
                <Button
                    bg="#4f46e5"
                    _hover={{ bg: "#4338ca" }}
                    color="white"
                    rounded="xl"
                    px={4}
                    h="36px"
                    fontSize="xs"
                    fontWeight="semibold"
                    shadow="0 0 12px rgba(79, 70, 229, 0.4)"
                    onClick={() => onOpenAddModal('q1')}
                >
                    <LuPlus size={16} />
                    Add Task
                </Button>
            </Flex>

            {/* 4 Quadrants Grid */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {/* Q1: DO FIRST */}
                <QuadrantCard
                    quadrantId="q1"
                    title="Q1: DO FIRST"
                    badgeText="Urgent & Important"
                    icon={<LuTarget size={16} color="#fb7185" />}
                    borderColor="#be123c"
                    titleColor="#fb7185"
                    badgeBg="#4c0519"
                    badgeBorder="#881337"
                    highlighted={effectiveEnergy.recommendedQuadrant === 'q1'}
                    tasks={getTasksByQuadrant('q1')}
                    activeTaskId={activeTaskId}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onSetActiveTarget={onSetActiveTarget}
                    onOpenAdd={() => onOpenAddModal('q1')}
                />

                {/* Q2: DEEP WORK */}
                <QuadrantCard
                    quadrantId="q2"
                    title="Q2: DEEP WORK"
                    badgeText="Strategic Focus"
                    icon={<LuActivity size={16} color="#34d399" />}
                    borderColor="#047857"
                    titleColor="#34d399"
                    badgeBg="#064e3b"
                    badgeBorder="#065f46"
                    highlighted={effectiveEnergy.recommendedQuadrant === 'q2'}
                    tasks={getTasksByQuadrant('q2')}
                    activeTaskId={activeTaskId}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onSetActiveTarget={onSetActiveTarget}
                    onOpenAdd={() => onOpenAddModal('q2')}
                />

                {/* Q3: QUICK WINS */}
                <QuadrantCard
                    quadrantId="q3"
                    title="Q3: QUICK WINS"
                    badgeText="Urgent, Low Cognition"
                    icon={<LuZap size={16} color="#fbbf24" />}
                    borderColor="#14b8a6"
                    titleColor="#fbbf24"
                    badgeBg="#451a03"
                    badgeBorder="#78350f"
                    highlighted={effectiveEnergy.recommendedQuadrant === 'q3'}
                    tasks={getTasksByQuadrant('q3')}
                    activeTaskId={activeTaskId}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onSetActiveTarget={onSetActiveTarget}
                    onOpenAdd={() => onOpenAddModal('q3')}
                />

                {/* Q4: MINIMIZE */}
                <QuadrantCard
                    quadrantId="q4"
                    title="Q4: MINIMIZE"
                    badgeText="Low Priority"
                    icon={<LuArchive size={16} color="#64748b" />}
                    borderColor="#1e293b"
                    titleColor="#94a3b8"
                    badgeBg="#0f172a"
                    badgeBorder="#1e293b"
                    highlighted={effectiveEnergy.recommendedQuadrant === 'q4'}
                    tasks={getTasksByQuadrant('q4')}
                    activeTaskId={activeTaskId}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onSetActiveTarget={onSetActiveTarget}
                    onOpenAdd={() => onOpenAddModal('q4')}
                />
            </SimpleGrid>
        </Box>
    );
}
