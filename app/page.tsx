'use client';

import {useState, useEffect, useCallback} from 'react';
// import './App.css';
import {Box, Flex} from "@chakra-ui/react";
import {HomePage} from "./components/Home/HomePage";
import {Header} from "./components/Header/Header";
import {EnergyCurveCard} from "./components/EnergyCurve/EnergyCurveCard";
import {PriorityMatrix} from "./components/Matrix/PriorityMatrix";
import {AddTaskModal} from "./components/Matrix/AddTaskModal";
import {ActiveTargetCard} from "./components/FocusTimer/ActiveTargetCard";
import {FocusTimerCard} from "./components/FocusTimer/FocusTimerCard";
import {ZenModeModal} from "./components/ZenMode/ZenModeModal";
import {SoundscapeMixerModal} from "./components/AudioMixer/SoundscapeMixerModal";
import {AnalyticsModal} from "./components/Analytics/AnalyticsModal";
import {useTasks} from "./hooks/useTasks";
import {useTimer} from "./hooks/useTimer";
import {useCircadian} from "./hooks/useCircadian";
import {useAnalytics} from "./hooks/useAnalytics";
import {useSoundscape} from "./hooks/useSoundscape";
import {Provider} from "@/components/ui/provider";

function App() {
	const [currentView, setCurrentView] = useState<'home' | 'app'>("home");

	const handleLaunchApp = useCallback(() => {
		setCurrentView('app');
		if (typeof window !== 'undefined') {
			window.location.hash = '#app';
			window.scrollTo({top: 0, behavior: 'smooth'});
		}
	}, []);

	const handleNavigateHome = useCallback(() => {
		setCurrentView('home');
		if (typeof window !== 'undefined') {
			window.location.hash = '#home';
			window.scrollTo({top: 0, behavior: 'smooth'});
		}
	}, []);

	useEffect(() => {
		const handleHashChange = () => {
			if (window.location.hash === '#app') {
				setCurrentView('app');
			} else if (window.location.hash === '#home' || !window.location.hash) {
				setCurrentView('home');
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const {
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
	} = useTasks();

	const {
		chronotype,
		isScheduleMenuOpen,
		isLiveClock,
		manualOverrideLevel,
		effectiveEnergy,
		computedEvaluation,
		svgCurveData,
		setManualOverrideLevel,
		toggleScheduleMenu,
		handleSelectChronotype,
		handleScrubTime,
		handleMouseMoveGraph,
		handleMouseLeaveGraph,
		handleSyncLiveClock,
	} = useCircadian();

	const {
		soundConfig,
		isMixerOpen,
		openMixer,
		closeMixer,
		setMasterVolume,
		toggleMute,
		setLayerVolume,
		selectPreset,
		playTestChime,
	} = useSoundscape();

	const [isZenModeOpen, setIsZenModeOpen] = useState(false);

	const handleTimerSessionComplete = useCallback((durationMinutes: number) => {
	}, [activeTask, effectiveEnergy.level]);

	const {
		preset,
		timeLeft,
		isRunning,
		soundEnabled,
		formattedTime,
		circumference,
		strokeDashoffset,
		handleSelectPreset,
		handleToggleTimer,
		handleResetTimer,
		handleSkipTimer,
		handleToggleSound,
	} = useTimer(handleTimerSessionComplete);

	// Global Hotkeys: 'F'/'Z' -> Zen Mode, 'M' -> Soundscape Mixer, Space -> Timer Toggle
	useEffect(() => {
		if (currentView !== 'app') return;

		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			const activeElem = document.activeElement;
			const isInputFocused =
				activeElem &&
				(['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElem.tagName) ||
					(activeElem as HTMLElement).isContentEditable);

			if (isInputFocused) return;

			if (e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'Z') {
				if (!isAddModalOpen && !isMixerOpen) {
					e.preventDefault();
					setIsZenModeOpen(prev => !prev);
				}
			} else if (e.key === 'm' || e.key === 'M') {
				if (!isAddModalOpen) {
					e.preventDefault();
					if (!isMixerOpen) {
						openMixer();
					} else {
						closeMixer();
					}
				}
			}
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => window.removeEventListener('keydown', handleGlobalKeyDown);
	}, [currentView, isAddModalOpen, isMixerOpen,openMixer, closeMixer]);

	return (
		<Provider>
			{currentView === 'home' ? (
				<HomePage onLaunchApp={handleLaunchApp}/>
			) : (
				<Box
					bg="#060913"
					color="#f8fafc"
					minH="100vh"
					p={{base: 4, md: 6, lg: 8}}
					fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
					position="relative"
				>
					{/* Header Navbar */}
					<Header
						effectiveEnergy={effectiveEnergy}
						chronotype={chronotype}
						isScheduleMenuOpen={isScheduleMenuOpen}
						soundConfig={soundConfig}
						onToggleScheduleMenu={toggleScheduleMenu}
						onSelectChronotype={handleSelectChronotype}
						onNavigateHome={handleNavigateHome}
						onOpenAnalytics={() => {}}
						onOpenZenMode={() => setIsZenModeOpen(true)}
						onOpenSoundMixer={openMixer}
					/>

					{/* 24-Hour Biorhythm Energy Curve */}
					<EnergyCurveCard
						chronotype={chronotype}
						effectiveEnergy={effectiveEnergy}
						computedEvaluation={computedEvaluation}
						svgCurveData={svgCurveData}
						isLiveClock={isLiveClock}
						isTimerRunning={isRunning}
						onScrubTime={handleScrubTime}
						onMouseMoveGraph={handleMouseMoveGraph}
						onMouseLeaveGraph={handleMouseLeaveGraph}
						onSyncLiveClock={handleSyncLiveClock}
					/>

					{/* Main Content Layout */}
					<Flex direction={{base: "column", lg: "row"}} gap={6} align="flex-start">
						{/* Left Column: Eisenhower Priority Matrix */}
						<PriorityMatrix
							tasks={tasks}
							activeTaskId={activeTaskId}
							effectiveEnergy={effectiveEnergy}
							onToggleTask={handleToggleTask}
							onDeleteTask={handleDeleteTask}
							onSetActiveTarget={handleSetActiveTarget}
							onOpenAddModal={openAddModal}
							getTasksByQuadrant={getTasksByQuadrant}
						/>

						{/* Right Column: Active Target & Focus Timer */}
						<Box flex={{base: "1", lg: "4"}} w="full">
							<ActiveTargetCard activeTask={activeTask}/>

							<FocusTimerCard
								preset={preset}
								timeLeft={timeLeft}
								isRunning={isRunning}
								soundEnabled={soundEnabled}
								formattedTime={formattedTime}
								circumference={circumference}
								strokeDashoffset={strokeDashoffset}
								effectiveEnergy={effectiveEnergy}
								manualOverrideLevel={manualOverrideLevel}
								onSelectPreset={handleSelectPreset}
								onToggleTimer={handleToggleTimer}
								onResetTimer={handleResetTimer}
								onSkipTimer={handleSkipTimer}
								onToggleSound={handleToggleSound}
								onOpenSoundMixer={openMixer}
								onOpenZenMode={() => setIsZenModeOpen(true)}
								onSetManualOverrideLevel={setManualOverrideLevel}
							/>
						</Box>
					</Flex>

					{/* Task Creation Modal */}
					<AddTaskModal
						isOpen={isAddModalOpen}
						newTaskTitle={newTaskTitle}
						newTaskQuadrant={newTaskQuadrant}
						onTitleChange={setNewTaskTitle}
						onQuadrantChange={setNewTaskQuadrant}
						onSubmit={handleAddTask}
						onClose={closeAddModal}
					/>

					{/* Generative Soundscape Mixer Modal */}
					<SoundscapeMixerModal
						isOpen={isMixerOpen}
						onClose={closeMixer}
						soundConfig={soundConfig}
						onSetMasterVolume={setMasterVolume}
						onToggleMute={toggleMute}
						onSetLayerVolume={setLayerVolume}
						onSelectPreset={selectPreset}
						onPlayTestChime={playTestChime}
					/>

					{/* Minimalist Zen & Immersion Mode Modal */}
					<ZenModeModal
						isOpen={isZenModeOpen}
						onClose={() => setIsZenModeOpen(false)}
						activeTask={activeTask || undefined}
						onToggleTaskComplete={handleToggleTask}
						preset={preset}
						timeLeft={timeLeft}
						isRunning={isRunning}
						formattedTime={formattedTime}
						circumference={circumference}
						strokeDashoffset={strokeDashoffset}
						effectiveEnergy={effectiveEnergy}
						soundEnabled={soundEnabled}
						masterVolume={soundConfig.masterVolume}
						onSelectPreset={handleSelectPreset}
						onToggleTimer={handleToggleTimer}
						onResetTimer={handleResetTimer}
						onSkipTimer={handleSkipTimer}
						onToggleSound={handleToggleSound}
						onSetMasterVolume={setMasterVolume}
						onOpenSoundMixer={openMixer}
					/>
				</Box>
			)}
		</Provider>
	);
}

export default App;
