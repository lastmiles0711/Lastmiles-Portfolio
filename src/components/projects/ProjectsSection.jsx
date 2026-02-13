import { useRef, useEffect, useState } from 'react';
import { Folder } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLoading } from '../../contexts/LoadingContext';
import ProjectCard from './ProjectCard';
import { formatRelativeTime } from '../../utils/dates';

const ProjectsSection = () => {
  const { onReposComplete } = useLoading();
  const hasNotifiedRef = useRef(false);
  const { t } = useLanguage();

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/data/repoData.json')
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        setRepos(
          data.map((repo) => ({
            ...repo,
            updatedAtRelative: formatRelativeTime(repo.updatedAt),
          }))
        );
      })
      .catch(() => setError(true))
      .finally(() => {
        if (!hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          onReposComplete();
        }
      });
  }, [onReposComplete]);

  return (
    <section id="projects" className="section">
      <div className="section-header section-header-card glass-card">
        <h2>{t('projects.title')}</h2>
        <p className="section-desc">{t('projects.desc')}</p>
        <div className="section-header-line" />
      </div>

      {repos.length > 0 && !error ? (
        <div className="projects-grid">
          {repos.map((repo) => (
            <ProjectCard key={repo.id} project={repo} />
          ))}
        </div>
      ) : (
        <div className="projects-empty-state">
          <div className="coming-soon">
            <div className="coming-soon-icon">
              <Folder size={48} />
            </div>
            <h3 className="coming-soon-title">{t('projects.coming_soon')}</h3>
            <p className="coming-soon-text">
              {t('projects.coming_soon_desc')}
            </p>
            <div className="coming-soon-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
