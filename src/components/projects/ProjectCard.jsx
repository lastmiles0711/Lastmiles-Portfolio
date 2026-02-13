import PropTypes from 'prop-types';
import { Github, ExternalLink, Star, GitFork } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dockerfile: '#384d54',
};

function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || 'var(--text-tertiary)';
}

function computeLanguagePercentages(languages) {
  if (!languages || typeof languages !== 'object') return [];
  const entries = Object.entries(languages);
  if (entries.length === 0) return [];

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (total === 0) return [];

  return entries
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / total) * 1000) / 10,
    }))
    .sort((a, b) => b.percent - a.percent);
}

const LanguageBar = ({ languages }) => {
  const langs = computeLanguagePercentages(languages);
  if (langs.length === 0) return null;

  return (
    <div className="language-bar-wrapper">
      <div className="language-bar">
        {langs.map(({ name, percent }) => (
          <div
            key={name}
            className="language-bar-segment"
            style={{
              width: `${Math.max(percent, 0.5)}%`,
              backgroundColor: getLanguageColor(name),
            }}
            title={`${name} ${percent}%`}
          />
        ))}
      </div>
      <div className="language-bar-labels">
        {langs.map(({ name, percent }) => (
          <span key={name} className="language-bar-label">
            <span
              className="language-dot"
              style={{ backgroundColor: getLanguageColor(name) }}
            />
            <span className="language-bar-name">{name}</span>
            <span className="language-bar-pct">{percent}%</span>
          </span>
        ))}
      </div>
    </div>
  );
};

LanguageBar.propTypes = {
  languages: PropTypes.object,
};

const ProjectCard = ({ project }) => {
  const { t } = useLanguage();
  const name = project.name;
  const description = project.description;
  const hasStats = project.stars > 0 || project.forks > 0;

  const cardContent = (
    <>
      <div className="project-card-header">
        <div className="project-title-row">
          <h3 className="project-title">{name}</h3>
          {project.archived && (
            <span className="project-badge project-badge--archived">Archived</span>
          )}
          {project.isFork && (
            <span className="project-badge project-badge--fork">Fork</span>
          )}
        </div>
        <div className="project-icons">
          {project.github && (
            <span className="project-icon project-icon--github tooltip-wrapper">
              <Github size={16} />
              <span className="tooltip tooltip--bottom">GitHub</span>
            </span>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-icon project-icon--live tooltip-wrapper"
              aria-label={t('projects.view_live', { name })}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={14} />
              <span className="tooltip tooltip--bottom">Live</span>
            </a>
          )}
        </div>
      </div>

      {description && <p className="project-desc">{description}</p>}

      <div className="project-card-footer">
        <LanguageBar languages={project.languages} />

        <div className="project-bottom-row">
          {hasStats && (
            <div className="project-stats">
              {project.stars > 0 && (
                <span className="project-stat">
                  <Star size={13} />
                  {project.stars}
                </span>
              )}
              {project.forks > 0 && (
                <span className="project-stat">
                  <GitFork size={13} />
                  {project.forks}
                </span>
              )}
            </div>
          )}
          {project.updatedAtRelative && (
            <span className="project-updated">
              {t('projects.updated', { time: project.updatedAtRelative })}
            </span>
          )}
        </div>
      </div>
    </>
  );

  return project.github ? (
    <a
      className="project-card"
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('projects.view_github', { name })}
    >
      {cardContent}
    </a>
  ) : (
    <div className="project-card">
      {cardContent}
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    github: PropTypes.string,
    live: PropTypes.string,
    stars: PropTypes.number,
    forks: PropTypes.number,
    languages: PropTypes.object,
    updatedAtRelative: PropTypes.string,
    archived: PropTypes.bool,
    license: PropTypes.string,
    isFork: PropTypes.bool,
  }).isRequired,
};

export default ProjectCard;
