// EducationApp/jestSetup.js

import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

// PushNotificationIOS 네이티브 모듈 Mock
NativeModules.PushNotificationIOS = {
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn((cb) => cb({ alert: true, badge: true, sound: true })),
  removeEventListener: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn((cb) => cb([])),
  removeAllDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
};

// @react-native-community/push-notification-ios Mock
jest.mock('@react-native-community/push-notification-ios', () => ({
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn((cb) => cb({ alert: true, badge: true, sound: true })),
  removeEventListener: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn((cb) => cb([])),
  removeAllDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
}));

// react-native-push-notification Mock
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
