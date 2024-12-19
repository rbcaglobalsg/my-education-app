// EducationApp/jestSetup.js

import 'react-native-gesture-handler/jestSetup';

// 먼저 react-native 전체를 mock
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  // NativeModules.NativeAnimatedModule 정의
  RN.NativeModules = {
    ...RN.NativeModules,
    NativeAnimatedModule: {
      createAnimatedNode: jest.fn(),
      connectAnimatedNodes: jest.fn(),
      disconnectAnimatedNodes: jest.fn(),
      startListeningToAnimatedNodeValue: jest.fn(),
      stopListeningToAnimatedNodeValue: jest.fn(),
      setAnimatedNodeValue: jest.fn(),
      setAnimatedNodeOffset: jest.fn(),
      flattenAnimatedNodeOffset: jest.fn(),
      extractAnimatedNodeOffset: jest.fn(),
      connectAnimatedNodeToView: jest.fn(),
      disconnectAnimatedNodeFromView: jest.fn(),
      restoreDefaultValues: jest.fn(),
      dropAnimatedNode: jest.fn(),
      startAnimatingNode: jest.fn(),
      stopAnimation: jest.fn(),
      event: jest.fn(),
      getValue: jest.fn(),
      addAnimatedEventToView: jest.fn(),
      removeAnimatedEventFromView: jest.fn(),
    }
  };
  return RN;
});

import { NativeModules } from 'react-native';

// PushNotificationIOS 네이티브 모듈 mock
NativeModules.PushNotificationIOS = {
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn(cb => cb({ alert: true, badge: true, sound: true })),
  removeEventListener: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(cb => cb([])),
  removeAllDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
};

// @react-native-community/push-notification-ios mock
jest.mock('@react-native-community/push-notification-ios', () => ({
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn(cb => cb({ alert: true, badge: true, sound: true })),
  removeEventListener: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn(cb => cb([])),
  removeAllDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
}));

// react-native-push-notification 모듈 mock
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  localNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  createChannel: jest.fn((_, cb) => cb && cb()),
  localNotificationSchedule: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn((cb) => cb({ alert: true, badge: true, sound: true })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// react-native-reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// NativeAnimatedHelper mock (경로 불필요시 제거 가능)
// jest.mock('react-native/src/private/animated/NativeAnimatedHelper.js', () => ({
//   now: jest.fn(),
// }));

// 위 mock들로 인해 애니메이션 관련 비동기 처리나 undefined 에러 없애기 기대
