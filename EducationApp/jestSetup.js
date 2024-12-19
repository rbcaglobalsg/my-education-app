// EducationApp/jestSetup.js
import 'react-native-gesture-handler/jestSetup';
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

// NativeAnimatedHelper mock (시도 1: .js 확장자)
jest.mock('react-native/src/private/animated/NativeAnimatedHelper.js', () => {
  return {
    now: jest.fn(),
  };
});

// NativeAnimatedModule mock
NativeModules.NativeAnimatedModule = {
    startListeningToAnimatedNodeValue: jest.fn(),
    stopListeningToAnimatedNodeValue: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
};
