// __mocks__/react-native-localize.js
module.exports = {
    // 실제 react-native-localize가 제공하는 함수들 중 자주 쓰이는 함수 Mock
    getLocales() {
      return [
        { languageTag: 'en', isRTL: false },
        // 필요하면 ko, fr 등 추가
      ];
    },
    findBestAvailableLanguage() {
      return { languageTag: 'en', isRTL: false };
    },
    // 기타 필요한 함수가 있다면 mock으로 추가
    getNumberFormatSettings() {
      return {
        decimalSeparator: '.',
        groupingSeparator: ',',
      };
    },
    getCalendar() {
      return 'gregorian';
    },
    // ...
  };
  