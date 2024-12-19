// EducationApp/jestSetup.js

import 'react-native-gesture-handler/jestSetup';

// 먼저 react-native 전체를 mock하고 NativeAnimatedModule를 정의
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

// 이제 react-native mock 후에 require로 NativeModules 가져오기
const { NativeModules } = require('react-native');

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

// mockedRequestAnimationFrame mock
jest.mock('react-native-reanimated/src/mockedRequestAnimationFrame', () => ({
  requestAnimationFrame: jest.fn(cb => cb && cb()),
  cancelAnimationFrame: jest.fn(),
}));

// Easing 모듈 mock
jest.mock('react-native/Libraries/Animated/Easing', () => ({
  bezier: jest.fn(() => () => 0),
  in: jest.fn(),
  out: jest.fn(),
  inOut: jest.fn(),
  linear: jest.fn(),
  ease: jest.fn(),
  elastic: jest.fn(),
  bounce: jest.fn(),
}));
