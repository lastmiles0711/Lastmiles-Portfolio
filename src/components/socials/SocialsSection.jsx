import { Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { SOCIALS } from '../../config/socials';
import { DiscordIcon, TwitterIcon, TwitchIcon, InstagramIcon, SteamIcon } from './SocialIcons';

const SOCIAL_ICONS = {
  discord: DiscordIcon,
  twitter: TwitterIcon,
  twitch: TwitchIcon,
  instagram: InstagramIcon,
  steam: SteamIcon,
};

const SocialsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="section">
      <div className="section-header section-header-card glass-card">
        <h2>{t('socials.title')}</h2>
        <p className="section-desc">{t('socials.desc')}</p>
        <div className="section-header-line" />
      </div>
      <div className="social-links-grid">
        {SOCIALS.map((social) => {
          const IconComponent = SOCIAL_ICONS[social.id];
          return (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-card ${social.color}`}
              aria-label={t('socials.visit_profile', { name: social.name })}
            >
              <div className="social-card-icon">
                {IconComponent && <IconComponent size={18} />}
              </div>
              <span className="social-card-name">{social.name}</span>
            </a>
          );
        })}
      </div>

      <div className="contact-card glass-card">
        <h3 className="contact-title">{t('socials.contact_text')}</h3>
        <a href={`mailto:${t('socials.email')}`} className="contact-email">
          <div className="email-icon-wrapper">
            <Mail size={18} />
          </div>
          <span className="email-text">{t('socials.email')}</span>
        </a>
        <p className="contact-reply-hint">{t('socials.reply_hint')}</p>
      </div>
    </section>
  );
};

export default SocialsSection;
