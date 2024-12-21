import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// 간단한 리소스 예시
// locales/en/common.json 와 locales/ko/common.json 파일을 준비했다고 가정
const resources = {
  en: {
    common: {
      appName: "bzla",
      searchPlaceholder: "What service are you looking for?",
      loginPrompt: "Log in to access more features",
      login: "Login",
      popularServices: "Popular Services",
      categories: {
        home: "Home",
        findTeacher: "Find a Teacher",
        study: "Study",
        music: "Music Lessons",
        driving: "Driving",
        health: "Health/Yoga",
        art: "Art/Design"
      }
    },
  },
  ko: {
    common: {
      appName: "bzla",
      searchPlaceholder: "어떤 서비스를 찾으시나요?",
      loginPrompt: "로그인하고 더 많은 기능을 이용해보세요",
      login: "로그인",
      popularServices: "인기 서비스",
      categories: {
        home: "홈",
        findTeacher: "강사찾기",
        study: "과외",
        music: "악기레슨",
        driving: "운전",
        health: "헬스/요가",
        art: "미술/디자인"
      }
    },
  },
};

const fallback = { languageTag: 'en', isRTL: false };

const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: languageTag,
    fallbackLng: 'en',
    resources,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
  });

export default i18n;
