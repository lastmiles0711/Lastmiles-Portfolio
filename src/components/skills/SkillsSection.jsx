import { useLanguage } from '../../contexts/LanguageContext';
import { SKILLS, ICON_CDN_BASE_URL } from '../../config/skills';

const SkillsSection = () => {
  const { t } = useLanguage();
  return (
    <section id="skills" className="section">
      <div className="section-header section-header-card glass-card">
        <h2>{t('skills.title')}</h2>
        <p className="section-desc">
          {t('skills.desc')}
        </p>
        <div className="section-header-line" />
      </div>
      <div className="skills-grid">
        {SKILLS.map((skill) => (
          <a
            key={skill.name}
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="skill-icon-card tooltip-wrapper"
          >
            <img
              src={`${ICON_CDN_BASE_URL}${skill.icon}.svg`}
              alt={skill.name}
              width={48}
              height={48}
            />
            <div className="tooltip tooltip--bottom">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{t(skill.level)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
