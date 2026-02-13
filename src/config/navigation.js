export const NAV_SECTIONS = ['home', 'about', 'skills', 'projects', 'contact'];

export const NAV_LINKS = NAV_SECTIONS.map((id) => ({
    id,
    translationKey: `header.${id === 'contact' ? 'socials' : id}`,
}));
