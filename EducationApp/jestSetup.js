// EducationApp/jestSetup.js
import 'react-native-gesture-handler/jestSetup';

// 여기에서 추가적으로 필요하다면 다른 네이티브 모듈 mock 설정 가능
// 예: Reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // 재정의하거나 필요한 mock 동작 추가
  Reanimated.default.call = () => {};
  return Reanimated;
});

// 필요하다면 react-native-safe-area-context, react-navigation 관련 mock도 추가 가능
