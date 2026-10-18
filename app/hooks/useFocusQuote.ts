import { useState, useEffect, useCallback, useRef } from 'react';
import type { FocusQuote } from '../types';
import { FOCUS_QUOTES } from '../constants';

interface UseFocusQuoteOptions {
    isRunning?: boolean;
    autoRotateIntervalMs?: number;
    initialIndex?: number;
}

export function useFocusQuote(options: UseFocusQuoteOptions = {}) {
    const { isRunning = false, autoRotateIntervalMs = 30000, initialIndex = 0 } = options;

    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        if (initialIndex >= 0 && initialIndex < FOCUS_QUOTES.length) {
            return initialIndex;
        }
        return Math.floor(Math.random() * FOCUS_QUOTES.length);
    });

    const [isFading, setIsFading] = useState<boolean>(false);
    const fadeTimeoutRef = useRef<number | null>(null);

    const changeQuoteWithFade = useCallback((getNextIndex: (current: number) => number) => {
        setIsFading(true);
        if (fadeTimeoutRef.current !== null) {
            window.clearTimeout(fadeTimeoutRef.current);
        }

        fadeTimeoutRef.current = window.setTimeout(() => {
            setCurrentIndex(prev => getNextIndex(prev));
            setIsFading(false);
        }, 220);
    }, []);

    const handleNextQuote = useCallback(() => {
        changeQuoteWithFade(prev => (prev + 1) % FOCUS_QUOTES.length);
    }, [changeQuoteWithFade]);

    const handlePrevQuote = useCallback(() => {
        changeQuoteWithFade(prev => (prev - 1 + FOCUS_QUOTES.length) % FOCUS_QUOTES.length);
    }, [changeQuoteWithFade]);

    const handleRandomQuote = useCallback(() => {
        changeQuoteWithFade(prev => {
            if (FOCUS_QUOTES.length <= 1) return 0;
            let next = Math.floor(Math.random() * FOCUS_QUOTES.length);
            while (next === prev) {
                next = Math.floor(Math.random() * FOCUS_QUOTES.length);
            }
            return next;
        });
    }, [changeQuoteWithFade]);

    // Auto-rotate quote periodically while timer is actively running
    useEffect(() => {
        if (!isRunning || autoRotateIntervalMs <= 0) return;

        const intervalId = window.setInterval(() => {
            handleNextQuote();
        }, autoRotateIntervalMs);

        return () => window.clearInterval(intervalId);
    }, [isRunning, autoRotateIntervalMs, handleNextQuote]);

    useEffect(() => {
        return () => {
            if (fadeTimeoutRef.current !== null) {
                window.clearTimeout(fadeTimeoutRef.current);
            }
        };
    }, []);

    const currentQuote: FocusQuote = FOCUS_QUOTES[currentIndex] ?? FOCUS_QUOTES[0];

    return {
        currentQuote,
        currentIndex,
        totalQuotes: FOCUS_QUOTES.length,
        isFading,
        handleNextQuote,
        handlePrevQuote,
        handleRandomQuote,
    };
}
