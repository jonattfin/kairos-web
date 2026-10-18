import { useState, useEffect, useCallback } from 'react';
import type { QuadrantId, Task } from '../types';
import { loadStoredTasks, saveStoredTasks } from '../utils/storage';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
    const [activeTaskId, setActiveTaskId] = useState<string>(() => {
        const initial = loadStoredTasks();
        const active = initial.find(t => !t.completed) || initial[0];
        return active ? active.id : '';
    });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskQuadrant, setNewTaskQuadrant] = useState<QuadrantId>('q1');

    useEffect(() => {
        saveStoredTasks(tasks);
    }, [tasks]);

    const activeTask = tasks.find(t => t.id === activeTaskId) || tasks.find(t => !t.completed) || null;

    const handleAddTask = useCallback((e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle.trim(),
            quadrant: newTaskQuadrant,
            completed: false,
            createdAt: Date.now(),
        };

        setTasks(prev => [newTask, ...prev]);
        if (!activeTask) {
            setActiveTaskId(newTask.id);
        }
        setNewTaskTitle('');
        setIsAddModalOpen(false);
    }, [newTaskTitle, newTaskQuadrant, activeTask]);

    const handleToggleTask = useCallback((id: string) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    }, []);

    const handleDeleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
        setActiveTaskId(prevActiveId => {
            if (prevActiveId === id) {
                const remaining = tasks.filter(task => task.id !== id && !task.completed);
                return remaining.length > 0 ? remaining[0].id : '';
            }
            return prevActiveId;
        });
    }, [tasks]);

    const handleSetActiveTarget = useCallback((id: string) => {
        setActiveTaskId(id);
    }, []);

    const openAddModal = useCallback((quadrant: QuadrantId = 'q1') => {
        setNewTaskQuadrant(quadrant);
        setIsAddModalOpen(true);
    }, []);

    const closeAddModal = useCallback(() => {
        setIsAddModalOpen(false);
    }, []);

    const getTasksByQuadrant = useCallback((q: QuadrantId) => {
        return tasks.filter(t => t.quadrant === q);
    }, [tasks]);

    return {
        tasks,
        activeTask,
        activeTaskId,
        isAddModalOpen,
        newTaskTitle,
        newTaskQuadrant,
        setNewTaskTitle,
        setNewTaskQuadrant,
        openAddModal,
        closeAddModal,
        handleAddTask,
        handleToggleTask,
        handleDeleteTask,
        handleSetActiveTarget,
        getTasksByQuadrant,
    };
}
