import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Github } from 'lucide-react';
import { useLocalTime } from '../../hooks/useLocalTime';
import { useLanguage } from '../../contexts/LanguageContext';
import FriendsCard from './FriendsCard';
import { PERSONAL } from '../../config/personal';
import { API } from '../../config/site';
import { getAge, getDaysUntilBirthday } from '../../utils/dates';
import logo from '../../assets/logo.jpeg';

const Tooltip = ({ children, text }) => (
  <div className="tooltip-wrapper">
    {children}
    <div className="tooltip">{text}</div>
  </div>
);

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

const AboutCard = () => {
  const { t } = useLanguage();
  const timeData = useLocalTime(PERSONAL.timezone);
  const age = useMemo(() => getAge(PERSONAL.birthday), []);
  const daysUntilBirthday = useMemo(() => getDaysUntilBirthday(PERSONAL.birthday), []);
  const [profileImg, setProfileImg] = useState(API.github.avatarUrl(PERSONAL.github.username));

  return (
    <div id="about" className="hero-visual">
      <div className="glow-effect" />
      <div className="hero-card-wrapper">
        <div className="about-card glass-card">
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <img
            src={profileImg}
            alt={PERSONAL.name}
            className="profile-img"
            onError={() => setProfileImg(logo)}
          />
          <div className="about-info-grid">
            <div className="about-column">
              <div className="info-row">
                <span className="info-label">{t('about.name')}</span>
                <span>{PERSONAL.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t('about.location')}</span>
                <span>{PERSONAL.location}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t('about.local_time')}</span>
                <Tooltip text={t('about.germany_tooltip')}>
                  <span>{timeData.time}</span>
                </Tooltip>
              </div>
            </div>

            <div className="about-column">
              <div className="info-row">
                <span className="info-label">{t('about.pronouns')}</span>
                <span>{PERSONAL.pronouns}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t('about.age')}</span>
                <Tooltip text={t('about.birthday_tooltip')}>
                  <span className="age-info">
                    {age} <small>({daysUntilBirthday}{t('about.days_short')} {t('about.until_bday')})</small>
                  </span>
                </Tooltip>
              </div>
              <div className="info-row">
                <span className="info-label">{t('about.languages')}</span>
                <span className="languages">
                  {PERSONAL.languages.map((lang) => (
                    <Tooltip key={lang.code} text={t(lang.labelKey)}>
                      <span role="img" aria-label={t(lang.labelKey)}>{lang.flag}</span>
                    </Tooltip>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <a
            href={PERSONAL.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="about-github-btn"
          >
            <Github size={20} />
            {t('about.github_link')}
          </a>
        </div>
      </div>
      <FriendsCard />
    </div>
  );
};

export default AboutCard;
