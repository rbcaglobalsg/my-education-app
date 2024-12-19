// EducationApp/jestSetup.js

import 'react-native-gesture-handler/jestSetup';

import { NativeModules } from 'react-native';

// RNGestureHandlerModule이 없는 경우 mock으로 제공
NativeModules.RNGestureHandlerModule = {
  State: {},
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
};

// 필요한 경우 다른 모듈들도 mock할 수 있음
// 예: reanimated, push-notification 등의 mock이 필요하다면 여기 추가
