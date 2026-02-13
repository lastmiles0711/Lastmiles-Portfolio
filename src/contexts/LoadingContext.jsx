import { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { SKILLS, ICON_CDN_BASE_URL } from '../config/skills';

const LoadingContext = createContext(null);

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ src, success: true });
        img.onerror = () => resolve({ src, success: false });
        img.src = src;
    });
};

const MIN_STEP_DISPLAY_TIME = 350;

const LOADING_STEPS = [
    { id: 'dom', weight: 10, label: 'dom' },
    { id: 'fonts', weight: 10, label: 'fonts' },
    { id: 'icons', weight: 20, label: 'icons' },
    { id: 'profiles', weight: 25, label: 'profiles' },
    { id: 'repos', weight: 25, label: 'repos' },
    { id: 'render', weight: 10, label: 'render' },
];

const TOTAL_WEIGHT = LOADING_STEPS.reduce((sum, s) => sum + s.weight, 0);

function useLoadingManagerInternal() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [completedSteps, setCompletedSteps] = useState([]);
    const completedRef = useRef(new Set());

    const calculateProgress = useCallback(() => {
        let total = 0;
        for (const step of LOADING_STEPS) {
            if (completedRef.current.has(step.id)) total += step.weight;
        }
        return Math.min(Math.round((total / TOTAL_WEIGHT) * 100), 100);
    }, []);

    const markStepActive = useCallback((stepId) => {
        setActiveStep(stepId);
    }, []);

    const markComplete = useCallback((stepId) => {
        if (completedRef.current.has(stepId)) return;
        completedRef.current.add(stepId);

        const newProgress = calculateProgress();
        setProgress(newProgress);
        setCompletedSteps(Array.from(completedRef.current));

        if (newProgress >= 100) {
            setActiveStep('done');
            setIsComplete(true);
        }
    }, [calculateProgress]);

    const beginLoading = useCallback(async () => {
        const loadStep = async (stepId, loadFn) => {
            markStepActive(stepId);
            const start = Date.now();
            await loadFn();
            const elapsed = Date.now() - start;
            if (elapsed < MIN_STEP_DISPLAY_TIME) {
                await new Promise(r => setTimeout(r, MIN_STEP_DISPLAY_TIME - elapsed));
            }
            markComplete(stepId);
        };

        // Step 1: Wait for DOM ready
        await loadStep('dom', async () => {
            if (document.readyState !== 'complete') {
                await new Promise(r => window.addEventListener('load', r, { once: true }));
            }
        });

        // Step 2: Wait for web fonts
        await loadStep('fonts', async () => {
            if (document.fonts?.ready) {
                await document.fonts.ready;
            }
        });

        // Step 3: Preload skill icons from CDN
        await loadStep('icons', async () => {
            const iconUrls = SKILLS.map(skill => `${ICON_CDN_BASE_URL}${skill.icon}.svg`);
            await Promise.all(iconUrls.map(preloadImage));
        });

        // Steps 4 & 5: profiles + repos are completed externally via callbacks
        markStepActive('profiles');
    }, [markComplete, markStepActive]);

    const completeExternalStep = useCallback((stepId) => {
        markComplete(stepId);

        // Show whichever step is still pending as active
        const other = stepId === 'profiles' ? 'repos' : 'profiles';
        if (!completedRef.current.has(other)) {
            markStepActive(other);
        }

        // When both external steps are done, auto-complete the render step
        if (completedRef.current.has('profiles') && completedRef.current.has('repos') && !completedRef.current.has('render')) {
            markStepActive('render');
            setTimeout(() => markComplete('render'), MIN_STEP_DISPLAY_TIME);
        }
    }, [markComplete, markStepActive]);

    useEffect(() => {
        beginLoading();
    }, [beginLoading]);

    return {
        progress,
        isComplete,
        activeStep,
        completedSteps,
        onApiComplete: () => completeExternalStep('profiles'),
        onReposComplete: () => completeExternalStep('repos'),
        markComplete,
    };
}

export function LoadingProvider({ children }) {
    const loadingManager = useLoadingManagerInternal();

    return (
        <LoadingContext.Provider value={loadingManager}>
            {children}
        </LoadingContext.Provider>
    );
}

LoadingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}
