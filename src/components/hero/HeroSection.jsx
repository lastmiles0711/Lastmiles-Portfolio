import { useLanguage } from '../../contexts/LanguageContext';
import { PERSONAL } from '../../config/personal';
import AboutCard from './AboutCard';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div id="home" className="hero-text">
          <h1 className="hero-heading-slab">
            {t('hero.greeting')} <span className="name-highlight">{PERSONAL.name}</span>, {t('hero.aka')}{' '}
            <span className="discord-text">@{PERSONAL.displayName}</span>
          </h1>
          <p className="hero-desc-card glass-card">
            {t('hero.description_start')}{' '}
            <span className="text-highlight-subtle">
              <span className="gradient-text">{t('hero.apprenticeship')}</span>
            </span>{' '}
            {t('hero.where_i_can')}{' '}
            {t('hero.grow') && (
              <>
                {t('hero.grow')}{' '}
              </>
            )}
            {t('hero.into')}{' '}
            <span className="text-highlight-subtle">
              <span className="gradient-text">{t('hero.software_engineer')}</span>
            </span>
            .
          </p>
        </div>

        <AboutCard />
      </div>
    </section>
  );
};

export default HeroSection;
