import { useState, useEffect, useCallback } from 'react';

export const BACKGROUND_TYPES = {
  NONE: 'none',
  GALAXY: 'galaxy',
};

const STORAGE_KEY = 'portfolio-background';
const DEFAULT_TYPE = BACKGROUND_TYPES.GALAXY;

export const useBackground = () => {
  const [backgroundType, setBackgroundType] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_TYPE;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.values(BACKGROUND_TYPES).includes(stored)) return stored;
    return DEFAULT_TYPE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, backgroundType);
  }, [backgroundType]);


  const cycleBackground = useCallback(() => {
    setBackgroundType(current =>
      current === BACKGROUND_TYPES.NONE
        ? BACKGROUND_TYPES.GALAXY
        : BACKGROUND_TYPES.NONE
    );
  }, []);

  return {
    backgroundType,
    isEnabled: backgroundType !== BACKGROUND_TYPES.NONE,
    cycleBackground,
  };
};
