import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../../contexts/LanguageContext';
import { SITE } from '../../config/site';

const LoadingScreen = ({ progress = 0, isComplete = false, activeStep = null, completedSteps = [], onLoadingComplete }) => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const animationRef = useRef(null);
  const logEndRef = useRef(null);

  const renderLogText = (text) => {
    const match = text.match(/^(\[[^\]]+\])\s*(.*)$/);
    if (!match) return text;
    return (
      <>
        <span className="log-tag">{match[1]}</span> {match[2]}
      </>
    );
  };

  useEffect(() => {
    const animate = () => {
      setDisplayProgress(prev => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.12;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [progress]);

  // Auto-scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [completedSteps, activeStep]);

  useEffect(() => {
    if (isComplete && progress >= 100) {
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 400);

      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isComplete, progress, onLoadingComplete]);

  if (!isVisible) return null;

  const brandText = SITE.domain;

  return (
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <h1 className="brand-text">
          {brandText.split('').map((char, i) => (
            <span key={i} style={{ '--i': i }}>
              {char}
            </span>
          ))}
        </h1>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(displayProgress)}%</span>
        </div>

        <div className="loading-log">
          {completedSteps.map((stepId) => (
            <p key={stepId} className="log-entry log-done">
              <span className="log-check">✓</span> {t(`loading.${stepId}_done`)}
            </p>
          ))}
          {activeStep && activeStep !== 'done' && (
            <p className="log-entry log-active">
              <span className="log-spinner" />
              {renderLogText(t(`loading.${activeStep}`))}
            </p>
          )}
          {activeStep === 'done' && (
            <p className="log-entry log-complete">
              {renderLogText(t('loading.done'))}
            </p>
          )}
          <span ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  progress: PropTypes.number,
  isComplete: PropTypes.bool,
  activeStep: PropTypes.string,
  completedSteps: PropTypes.arrayOf(PropTypes.string),
  onLoadingComplete: PropTypes.func,
};

export default LoadingScreen;
