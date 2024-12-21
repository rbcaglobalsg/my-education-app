// C:\Users\marcu\education_app\EducationApp\src\i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// 번역 리소스 예시
const resources = {
  en: {
    translation: {
      welcome: "Welcome to bzla!",
      searchPlaceholder: "What service are you looking for?",
      popularServices: "Popular Services",
      loginPrompt: "Log in to access more features",
      login: "Log In",
      categories: {
        home: "Home",
        tutor: "Find Tutor",
        lesson: "Lessons",
        drive: "Driving",
        health: "Health/Yoga",
      }
    }
  },
  ko: {
    translation: {
      welcome: "bzla에 오신 것을 환영합니다!",
      searchPlaceholder: "어떤 서비스를 찾으시나요?",
      popularServices: "인기 서비스",
      loginPrompt: "로그인하고 더 많은 기능을 이용해보세요",
      login: "로그인",
      categories: {
        home: "홈",
        tutor: "강사찾기",
        lesson: "레슨",
        drive: "운전",
        health: "헬스/요가",
      }
    }
  }
};

// 기기 언어 자동 감지
const fallback = { languageTag: 'en', isRTL: false };
const { languageTag } =
  RNLocalize.findBestAvailableLanguage(Object.keys(resources)) || fallback;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: languageTag,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
