import { PERSONAL } from '../config/personal';

export const de = {
  header: {
    home: 'Start',
    about: 'Über mich',
    skills: 'Skills',
    projects: 'Projekte',
    socials: 'Socials',
    switchTheme: 'Theme wechseln',
    animation: 'Hintergrund wechseln',
    switchLang: 'Sprache wechseln',
    toggleMenu: 'Menü umschalten',
    light: 'Hell',
    dark: 'Dunkel',
  },
  hero: {
    greeting: "Hey, ich bin",
    aka: "auch bekannt als",
    description_start: "Ich bin ein Hobby-Dev und suche eine",
    apprenticeship: "IT-Ausbildung",
    where_i_can: "in der ich mich",
    grow: "weiterentwickeln",
    into: "kann zu einem professionellen",
    software_engineer: "Softwareentwickler",
  },
  about: {
    name: "Name",
    location: "Standort",
    local_time: "Ortszeit",
    pronouns: "Pronomen",
    age: "Alter",
    birthday_tooltip: "Geboren am 11. Februar 2005",
    until_bday: "bis Geb.",
    days_short: "T",
    languages: "Sprachen",
    germany_tooltip: "Berlin, Deutschland",
    german_lang: "Deutsch (Muttersprache)",
    english_lang: "Englisch",
    lithuanian_lang: "Litauisch",
    friends_title: "Freunde",
    friends_desc: "Freunde, die mir in der Vergangenheit bei Dingen geholfen haben.",
    github_link: "GitHub",
    visit_github: "{{name}}s GitHub besuchen",
  },
  projects: {
    title: "Projekte",
    desc: "Dinge, die ich gebaut habe oder an denen ich arbeite",
    coming_soon: "Projekte kommen bald",
    coming_soon_desc: "Ich arbeite an einigen spannenden Projekten. Schau später wieder vorbei!",
    view_live: "{{name}} Live-Demo ansehen",
    view_github: "{{name}} auf GitHub ansehen",
    updated: "Aktualisiert {{time}}",
  },
  skills: {
    title: "Was ich erlerne",
    desc: "Kein Experte in irgendetwas davon – nur Werkzeuge, die ich benutze und mit denen ich versuche besser zu werden, dank YouTube und ChatGPT.",
    levels: {
      comfortable: "Sicher",
      learning: "Lernend",
      building_projects: "Baue Projekte",
      api_basics: "API Grundlagen",
      daily_use: "Täglicher Gebrauch",
      scripts_bots: "Skripte & Bots",
      queries: "Abfragen",
      version_control: "Versionskontrolle",
      containers: "Container"
    }
  },
  socials: {
    title: "Socials",
    desc: "Finde mich hier.",
    contact_text: "Möchtest du mich direkt kontaktieren? Schreib mir eine E-Mail!",
    visit_profile: "Mein {{name}}-Profil besuchen",
    email: PERSONAL.email,
    reply_hint: "Ich antworte garantiert auf jede Nachricht."
  },
  loading: {
    dom: "[dom] Warte auf Document Ready...",
    fonts: "[fonts] Lade Webfonts...",
    icons: "[cdn] Lade Skill-Icons vom CDN...",
    profiles: "[api] Lade GitHub-Profile...",
    repos: "[api] Lade GitHub-Repositories...",
    render: "[ui] Rendere Komponenten...",
    done: "[done] Bereit!",
    dom_done: "DOM geladen",
    fonts_done: "Fonts geladen",
    icons_done: "Skill-Icons gecacht",
    profiles_done: "GitHub-Profile geladen",
    repos_done: "Repositories geladen",
    render_done: "Komponenten gerendert"
  },
  background: {
    none: "Aus",
    galaxy: "Galaxie"
  }
};
