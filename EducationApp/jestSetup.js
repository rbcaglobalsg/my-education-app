// EducationApp/jestSetup.js

import { NativeModules } from 'react-native';

// 기본적으로 PushNotificationIOS 네이티브 모듈 mocking
NativeModules.PushNotificationIOS = {
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  removeEventListener: jest.fn(),
  presentLocalNotification: jest.fn(),
  scheduleLocalNotification: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  getDeliveredNotifications: jest.fn((callback) => callback([])),
  removeAllDeliveredNotifications: jest.fn(),
  removeDeliveredNotifications: jest.fn(),
};

// react-native-push-notification 모듈도 모킹
jest.mock('react-native-push-notification', () => {
  return {
    configure: jest.fn(),
    localNotification: jest.fn(),
    cancelAllLocalNotifications: jest.fn(),
    createChannel: jest.fn((_, cb) => cb && cb()),
    localNotificationSchedule: jest.fn(),
    requestPermissions: jest.fn(),
    checkPermissions: jest.fn((cb) => cb({ alert: true, badge: true, sound: true })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
});
