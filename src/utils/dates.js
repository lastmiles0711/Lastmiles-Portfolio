const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getAge = (birthday) => {
    const birthDate = birthday instanceof Date ? birthday : new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const getDaysUntilBirthday = (birthday) => {
    const birthDate = birthday instanceof Date ? birthday : new Date(birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday <= today) {
        nextBday.setFullYear(nextBday.getFullYear() + 1);
    }
    const diffTime = nextBday - today;
    return Math.ceil(diffTime / MS_PER_DAY);
};

export const formatRelativeTime = (isoDate) => {
    if (!isoDate) return null;
    const now = new Date();
    const then = new Date(isoDate);
    const diffMs = now - then;
    const diffDays = Math.floor(diffMs / MS_PER_DAY);

    if (diffDays < 1) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 month ago';
    if (diffMonths < 12) return `${diffMonths} months ago`;
    const diffYears = Math.floor(diffDays / 365);
    if (diffYears === 1) return '1 year ago';
    return `${diffYears} years ago`;
};
