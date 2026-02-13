import { PERSONAL } from '../config/personal';

export const en = {
  header: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    socials: 'Socials',
    switchTheme: 'Switch Theme',
    animation: 'Cycle Background',
    switchLang: 'Switch Language',
    toggleMenu: 'Toggle menu',
    light: 'Light',
    dark: 'Dark',
  },
  hero: {
    greeting: "Hey, I'm",
    aka: "also known as",
    description_start: "I'm a hobby dev and looking for an",
    apprenticeship: "IT apprenticeship",
    where_i_can: "where I can",
    grow: "grow",
    into: "into a professional",
    software_engineer: "Software Engineer",
  },
  about: {
    name: "Name",
    location: "Location",
    local_time: "Local time",
    pronouns: "Pronouns",
    age: "Age",
    birthday_tooltip: "Born February 11, 2005",
    until_bday: "until Bday",
    days_short: "d",
    languages: "Languages",
    germany_tooltip: "Berlin, Germany",
    german_lang: "German (Native)",
    english_lang: "English",
    lithuanian_lang: "Lithuanian",
    friends_title: "Friends",
    friends_desc: "Friends who helped me with things in the past.",
    github_link: "GitHub",
    visit_github: "Visit {{name}}'s GitHub",
  },
  projects: {
    title: "Projects",
    desc: "Things I've built or am currently working on",
    coming_soon: "Projects Coming Soon",
    coming_soon_desc: "I'm working on some exciting projects. Check back later!",
    view_live: "View {{name}} live demo",
    view_github: "View {{name}} on GitHub",
    updated: "Updated {{time}}",
  },
  skills: {
    title: "What I'm learning",
    desc: "Not an expert in any of these — just tools I use and try to get better at, thank you YouTube and ChatGPT.",
    levels: {
      comfortable: "Comfortable",
      learning: "Learning",
      building_projects: "Building projects",
      api_basics: "API basics",
      daily_use: "Daily use",
      scripts_bots: "Scripts & bots",
      queries: "Queries",
      version_control: "Version control",
      containers: "Containers"
    }
  },
  socials: {
    title: "Socials",
    desc: "Find me here.",
    contact_text: "Want to get in contact with me directly? Write me an email!",
    visit_profile: "Visit my {{name}} profile",
    email: PERSONAL.email,
    reply_hint: "I make sure to respond to every message."
  },
  loading: {
    dom: "[dom] Waiting for document ready...",
    fonts: "[fonts] Loading web fonts...",
    icons: "[cdn] Fetching skill icons from CDN...",
    profiles: "[api] Fetching GitHub profiles...",
    repos: "[api] Fetching GitHub repositories...",
    render: "[ui] Rendering components...",
    done: "[done] Ready!",
    dom_done: "DOM loaded",
    fonts_done: "Fonts loaded",
    icons_done: "Skill icons cached",
    profiles_done: "GitHub profiles fetched",
    repos_done: "Repositories fetched",
    render_done: "Components rendered"
  },
  background: {
    none: "Off",
    galaxy: "Galaxy"
  }
};
