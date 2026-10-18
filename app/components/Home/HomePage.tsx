import { Box } from "@chakra-ui/react";
import { HomeNavbar } from "./HomeNavbar";
import { HeroSection } from "./HeroSection";
import { PrinciplesSection } from "./PrinciplesSection";
import { SynergySection } from "./SynergySection";
import { HomeFooter } from "./HomeFooter";

interface HomePageProps {
    onLaunchApp: () => void;
}

export function HomePage({ onLaunchApp }: HomePageProps) {
    const handleExplorePrinciples = () => {
        const el = document.getElementById("three-strategies");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Box
            minH="100vh"
            bg="#030712"
            color="#f8fafc"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            position="relative"
            overflowX="hidden"
        >
            {/* Top Navigation */}
            <HomeNavbar onLaunchApp={onLaunchApp} />

            {/* Hero Banner with Philosophy & Pillars */}
            <HeroSection
                onLaunchApp={onLaunchApp}
                onExplorePrinciples={handleExplorePrinciples}
            />

            {/* Deep-dive into Eisenhower Matrix, Pomodoro, and Biorhythm */}
            <PrinciplesSection />

            {/* Synergy & Workflow Walkthrough */}
            <SynergySection onLaunchApp={onLaunchApp} />

            {/* Footer with Links, Company Info & Copyright */}
            <HomeFooter onLaunchApp={onLaunchApp} />
        </Box>
    );
}
