import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { en } from '../locales/en';
import { de } from '../locales/de';

const LanguageContext = createContext();

const translations = { en, de };

const getNestedTranslation = (obj, path) => {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        if (saved) return saved;

        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('de')) return 'de';
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'de' : 'en'));
    };

    const t = (key, params) => {
        const text = getNestedTranslation(translations[language], key);
        if (text == null) return key;
        if (params && typeof text === 'string') {
            return text.replace(/\{\{(\w+)\}\}/g, (_, k) => params[k] ?? '');
        }
        return text;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
