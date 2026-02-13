import PropTypes from 'prop-types';
import Galaxy from './Galaxy';
import { BACKGROUND_TYPES } from '../../hooks/useBackground';

const GALAXY_SETTINGS = {
  light: { hueShift: 190, saturation: 0.3, glowIntensity: 0.2, density: 0.7 },
  dark: { hueShift: 190, saturation: 0.4, glowIntensity: 0.4, density: 0.85 },
};

const BackgroundManager = ({ backgroundType, theme }) => {
  if (backgroundType === BACKGROUND_TYPES.NONE) {
    return null;
  }

  const config = GALAXY_SETTINGS[theme] || GALAXY_SETTINGS.dark;

  return (
    <div className="background-container background-container--visible">
      <div className="background-galaxy">
        <Galaxy
          hueShift={config.hueShift}
          saturation={config.saturation}
          glowIntensity={config.glowIntensity}
          density={config.density}
          transparent={true}
        />
      </div>
    </div>
  );
};

BackgroundManager.propTypes = {
  backgroundType: PropTypes.oneOf(Object.values(BACKGROUND_TYPES)).isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
};

export default BackgroundManager;
