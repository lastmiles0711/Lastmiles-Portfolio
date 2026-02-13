import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { HEADER_OFFSET, BOTTOM_THRESHOLD, SCROLL_THROTTLE } from '../../utils/constants';
import { SITE } from '../../config/site';
import { NAV_SECTIONS, NAV_LINKS } from '../../config/navigation';

const STAR_SVG_IDS = [1, 2, 3, 4];
const STAR_PATH = 'M 10 0 C 10 5, 5 10, 0 10 C 5 10, 10 15, 10 20 C 10 15, 15 10, 20 10 C 15 10, 10 5, 10 0 Z';

const Header = ({ theme, toggleTheme, cycleBackground, backgroundType, isBackgroundEnabled }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { t, language, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      // Active section tracking
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - BOTTOM_THRESHOLD) {
        setActiveSection('contact');
        return;
      }

      let currentSection = NAV_SECTIONS[0];
      for (const id of NAV_SECTIONS) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= HEADER_OFFSET) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    let timeout;
    const throttledScroll = () => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleScroll();
          timeout = null;
        }, SCROLL_THROTTLE);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setExpanded(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [expanded]);

  const navLinks = NAV_LINKS.map((link) => ({
    ...link,
    label: t(link.translationKey),
  }));

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header-container">

        <div className="header-brand-wrapper">
          <a href="#home" className="header-brand-link">
            <span className="wave-text">
              {SITE.domain.split('').map((char, i) => (
                <span key={i} style={{ '--i': i }}>{char}</span>
              ))}
            </span>
          </a>
        </div>

        <div className="header-mobile-toggle">
          <input
            id="mobile-menu-toggle"
            type="checkbox"
            className="mobile-menu-checkbox"
            checked={expanded}
            onChange={() => setExpanded(!expanded)}
            aria-label={t('header.toggleMenu')}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="mobile-menu-label" htmlFor="mobile-menu-toggle">
            <div className="bar bar-1" />
            <div className="bar bar-2" />
            <div className="bar bar-3" />
          </label>
        </div>

        <nav className="header-nav-desktop">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`gradient-border-link nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => setActiveSection(link.id)}
            >
              <span>{link.label}</span>
            </a>
          ))}

          <span className="header-divider" />

          <div className="tooltip-wrapper">
            <button
              type="button"
              className={`control-btn ${isBackgroundEnabled ? 'control-btn--active' : ''}`}
              onClick={cycleBackground}
              aria-label={t('header.animation')}
            >
              <Sparkles size={16} />
            </button>
            <div className="tooltip tooltip--bottom">{t(`background.${backgroundType}`)}</div>
          </div>

          <div className="tooltip-wrapper">
            <label className="lang-switch">
              <input
                id="lang-toggle"
                type="checkbox"
                checked={language === 'de'}
                onChange={toggleLanguage}
                aria-label={t('header.switchLang')}
              />
              <div className="lang-slider round">
                <div className="lang-knob">
                  <div className="lang-knob-inner">
                    <div className="lang-face lang-face-en">
                      <span className="fi fi-gb" title="English" />
                    </div>
                    <div className="lang-face lang-face-de">
                      <span className="fi fi-de" title="Deutsch" />
                    </div>
                  </div>
                </div>
                <div className="lang-labels">
                  <span className="lang-label-text">EN</span>
                  <span className="lang-label-text">DE</span>
                </div>
              </div>
            </label>
            <div className="tooltip tooltip--bottom">{t('header.switchLang')}</div>
          </div>

          <div className="tooltip-wrapper">
            <label className="switch-labeled">
              <input
                id="theme-toggle"
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label={t('header.switchTheme')}
              />
              <div className="slider round">
                <div className="sun-moon">
                  <span className="toggle-icon toggle-icon--sun" aria-hidden="true">
                    <Sun size={18} />
                  </span>
                  <span className="toggle-icon toggle-icon--moon" aria-hidden="true">
                    <Moon size={18} />
                  </span>
                </div>
                <div className="stars">
                  {STAR_SVG_IDS.map((id) => (
                    <svg key={id} id={`star-${id}`} className="star" viewBox="0 0 20 20">
                      <path d={STAR_PATH} />
                    </svg>
                  ))}
                </div>
              </div>
            </label>
            <div className="tooltip tooltip--bottom">{t('header.switchTheme')}</div>
          </div>
        </nav>
      </div>

      <nav className={`header-nav-mobile ${expanded ? 'is-expanded' : ''}`}>
        <div className="mobile-nav-content">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`gradient-border-link mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={() => {
                setExpanded(false);
                setActiveSection(link.id);
              }}
            >
              <span>{link.label}</span>
            </a>
          ))}
          <div className="mobile-actions-row">
            <button className="mobile-action-btn mobile-action-btn--labeled" onClick={() => { toggleTheme(); setExpanded(false); }} title={t('header.switchTheme')}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? t('header.light') : t('header.dark')}</span>
            </button>
            <button className="mobile-action-btn mobile-action-btn--labeled" onClick={() => { cycleBackground(); setExpanded(false); }} title={t(`background.${backgroundType}`)}>
              <Sparkles size={18} className={isBackgroundEnabled ? 'active' : ''} />
              <span>{t(`background.${backgroundType}`)}</span>
            </button>
            <button className="mobile-action-btn" onClick={() => { toggleLanguage(); setExpanded(false); }} title={t('header.switchLang')}>
              <span className={`fi fi-${language === 'en' ? 'de' : 'gb'}`} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  toggleTheme: PropTypes.func.isRequired,
  cycleBackground: PropTypes.func.isRequired,
  backgroundType: PropTypes.string.isRequired,
  isBackgroundEnabled: PropTypes.bool.isRequired,
};

export default Header;
