// C:\Users\marcu\education_app\EducationApp\src\i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';

const resources = {
  en: { /* ... */ },
  ko: { /* ... */ },
};

function detectLanguageTag() {
  // getLocales()는 [{ languageCode: 'ko', countryCode: 'KR', ... }, ... ] 형태 배열
  // 맨 앞이 사용자 우선순위 1위
  const locales = getLocales();
  if (!locales || locales.length === 0) {
    return 'en';
  }
  // languageCode(예:'ko') + countryCode(예:'KR') 조합으로 세부 locale을 만들 수도 있음.
  // 여기서는 간단히 languageCode만 사용
  return locales[0].languageCode || 'en';
}

const languageTag = detectLanguageTag();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: languageTag,
  fallbackLng: 'en',
  resources,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
