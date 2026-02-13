import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './hooks/useTheme';
import { useBackground } from './hooks/useBackground';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import {
    Header,
    HeroSection,
    LoadingScreen,
    SkillsSection,
    ProjectsSection,
    SocialsSection,
    BackgroundManager
} from './components';
import './styles/global.css';

function AppContent({ theme, toggleTheme, backgroundType, cycleBackground, isBackgroundEnabled }) {
    const [isLoading, setIsLoading] = useState(true);
    const { progress, isComplete, activeStep, completedSteps } = useLoading();

    return (
        <>
            {isLoading && (
                <LoadingScreen
                    progress={progress}
                    isComplete={isComplete}
                    activeStep={activeStep}
                    completedSteps={completedSteps}
                    onLoadingComplete={() => setIsLoading(false)}
                />
            )}
            <div className="App">
                <BackgroundManager backgroundType={backgroundType} theme={theme} />
                <Header
                    theme={theme}
                    toggleTheme={toggleTheme}
                    cycleBackground={cycleBackground}
                    backgroundType={backgroundType}
                    isBackgroundEnabled={isBackgroundEnabled}
                />

                <main id="main-content" className="App-main">
                    <HeroSection />
                    <SkillsSection />
                    <ProjectsSection />
                    <SocialsSection />
                </main>
            </div>
        </>
    );
}

AppContent.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    toggleTheme: PropTypes.func.isRequired,
    backgroundType: PropTypes.string.isRequired,
    cycleBackground: PropTypes.func.isRequired,
    isBackgroundEnabled: PropTypes.bool.isRequired,
};

function App() {
    const { theme, toggleTheme } = useTheme();
    const { backgroundType, cycleBackground, isEnabled: isBackgroundEnabled } = useBackground();

    return (
        <LanguageProvider>
            <LoadingProvider>
                <AppContent
                    theme={theme}
                    toggleTheme={toggleTheme}
                    backgroundType={backgroundType}
                    cycleBackground={cycleBackground}
                    isBackgroundEnabled={isBackgroundEnabled}
                />
            </LoadingProvider>
        </LanguageProvider>
    );
}

export default App;
