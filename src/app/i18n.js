export const locales = ['en', 'es', 'fr'];
export const defaultLocale = 'en';

// Define all available languages for the language selector
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

// Dictionary for translations
const dictionaries = {
  en: () => import('../public/locales/en/common.json').then(module => module.default),
  es: () => import('../public/locales/es/common.json').then(module => module.default),
  fr: () => import('../public/locales/fr/common.json').then(module => module.default),
};

export const getDictionary = async (locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};