# Lastmiles Portfolio

A personal portfolio website built with React and Vite. Clean, fast, and easy to customize.

*Special thanks to [Yuki](https://github.com/yuki6942) for all the help outside and inside this project, ilysm ❤️*

## Features

- Dark / Light theme with smooth transitions
- Toggleable galaxy background animation
- English and German language support (auto-detected)
- Auto-discovers your GitHub repos and displays language breakdowns
- Feature Friends
- Docker + Traefik deployment with automatic HTTPS
Built with React 18, Vite, CSS Variables, Lucide Icons, and OGL.

## Getting Started

Node.js 18+ and npm 9+ required.

### Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. The `dev` script automatically fetches your latest GitHub repo data before starting Vite.

### Production Build

```bash
npm run build
```

Static output goes to `dist/`.

### Docker Deployment

1. Create a `.env` file:

```env
DOMAIN=yourdomain.com
ACME_EMAIL=you@example.com
GITHUB_TOKEN=ghp_...          # optional, raises GitHub API rate limits
```

2. Start the stack:

```bash
docker compose up -d --build
```

This runs Traefik as a reverse proxy with automatic Let's Encrypt HTTPS. Make sure your domain points to the server and ports 80/443 are open.

The container re-fetches GitHub data every 12 hours via cron.

## Project Structure

```
src/
  core/           App shell, entry point
  components/     UI components (Hero, Projects, Skills, Socials, etc.)
  data/           Config files — personal info, projects, skills, socials, friends
  hooks/          Custom hooks — theme, language, background, GitHub profiles
  locales/        Translations (en.js, de.js)
  styles/         CSS with variables for easy theming
scripts/
  fetch-repos.js  Fetches repo metadata + language stats from GitHub API
  entrypoint.sh   Docker entrypoint — initial fetch, cron setup, nginx start
public/data/      Generated JSON consumed by the frontend at runtime
```

## Customization

All configuration lives in `src/data/` — no need to touch components:

| File | What it controls |
|------|-----------------|
| `personal.js` | Name, pronouns, location, timezone, birthday, GitHub username, email |
| `site.js` | Site name, domain, description, theme/background colors |
| `projects.js` | Auto-discovery settings (username, filters, limits) and manual overrides |
| `skills.js` | Skills list with icons and proficiency levels |
| `socials.js` | Social media links |
| `friends.js` | GitHub profile URLs to feature on the site |
| `locales/` | All UI text in English and German |

### Project Auto-Discovery

In `projects.js`, the `AUTO_DISCOVERY` config controls which repos appear:

```js
export const AUTO_DISCOVERY = {
  enabled: true,
  username: 'your-github-username',
  includeForks: false,
  includeArchived: false,
  topics: [],          // filter by topic, or empty for all
  exclude: [],         // repo names to skip
  limit: 20,
};
```

Manual entries in the `PROJECTS` array can override auto-discovered repos (matched by GitHub URL) or add non-GitHub projects.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token for higher API rate limits |
| `DOMAIN` | Docker only | Your domain for Traefik routing |
| `ACME_EMAIL` | Docker only | Email for Let's Encrypt certificate registration |

