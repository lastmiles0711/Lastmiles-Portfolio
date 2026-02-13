import { API } from './site';

export const SKILLS = [
    {
        id: 'javascript',
        name: 'JavaScript',
        icon: 'javascript/javascript-original',
        level: 'skills.levels.comfortable',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        icon: 'typescript/typescript-original',
        level: 'skills.levels.learning',
        url: 'https://www.typescriptlang.org/'
    },
    {
        id: 'react',
        name: 'React',
        icon: 'react/react-original',
        level: 'skills.levels.building_projects',
        url: 'https://react.dev/'
    },
    {
        id: 'express',
        name: 'Express',
        icon: 'express/express-original',
        level: 'skills.levels.api_basics',
        url: 'https://expressjs.com/'
    },
    {
        id: 'tailwind',
        name: 'Tailwind',
        icon: 'tailwindcss/tailwindcss-original',
        level: 'skills.levels.daily_use',
        url: 'https://tailwindcss.com/'
    },
    {
        id: 'python',
        name: 'Python',
        icon: 'python/python-original',
        level: 'skills.levels.scripts_bots',
        url: 'https://www.python.org/'
    },
    {
        id: 'sql',
        name: 'SQL',
        icon: 'postgresql/postgresql-original',
        level: 'skills.levels.queries',
        url: 'https://www.postgresql.org/'
    },
    {
        id: 'git',
        name: 'Git',
        icon: 'git/git-original',
        level: 'skills.levels.version_control',
        url: 'https://git-scm.com/'
    },
    {
        id: 'docker',
        name: 'Docker',
        icon: 'docker/docker-original',
        level: 'skills.levels.containers',
        url: 'https://www.docker.com/'
    },
];

export const ICON_CDN_BASE_URL = API.cdn.devicons;
