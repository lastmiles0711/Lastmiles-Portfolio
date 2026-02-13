import { useRef } from 'react';
import useGitHubProfiles from '../../hooks/useGitHubProfiles';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLoading } from '../../contexts/LoadingContext';

const FriendsCard = () => {
  const { t } = useLanguage();
  const { onApiComplete } = useLoading();
  const hasNotifiedRef = useRef(false);

  const profiles = useGitHubProfiles({
    onComplete: () => {
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        onApiComplete();
      }
    }
  });

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <div className="friends-card glass-card">
      <div className="friends-header">
        <h3 className="friends-title">{t('about.friends_title')}</h3>
        <p className="friends-desc">{t('about.friends_desc')}</p>
      </div>
      <div className="friends-grid">
        {profiles.map((p) => (
          <a
            key={p.id}
            href={p.url}
            className="friend-card"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('about.visit_github', { name: p.name })}
          >
            <div className="friend-top">
              <div className="friend-avatar-wrapper">
                <img
                  src={p.avatar || `https://github.com/${p.username}.png`}
                  alt={p.name}
                  className="friend-avatar"
                />
                <span className="friend-status" />
              </div>
              <div className="friend-info">
                <span className="friend-name">{p.name}</span>
                <span className="friend-username">@{p.username}</span>
              </div>
            </div>
            {p.bio && <span className="friend-bio">{p.bio}</span>}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FriendsCard;
