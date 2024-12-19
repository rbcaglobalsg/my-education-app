// EducationApp/jestSetup.js

import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

// 이미 추가한 mock들 그대로 유지하고, Stripe 관련 mock 추가

// Stripe 네이티브 모듈 mock
NativeModules.StripeSdk = {
  initialise: jest.fn(),
  presentPaymentSheet: jest.fn().mockResolvedValue({}),
  createPaymentMethod: jest.fn().mockResolvedValue({}),
  retrievePaymentIntent: jest.fn().mockResolvedValue({}),
  confirmPaymentIntent: jest.fn().mockResolvedValue({}),
  confirmSetupIntent: jest.fn().mockResolvedValue({}),
  // 필요한 메서드는 상황에 맞춰 추가
};

// @stripe/stripe-react-native 모듈 mock
jest.mock('@stripe/stripe-react-native', () => {
  return {
    StripeProvider: ({ children }) => children,  // 실제 네이티브 동작 없이 children만 렌더링
    useStripe: () => ({
      confirmPayment: jest.fn().mockResolvedValue({}),
      confirmSetupIntent: jest.fn().mockResolvedValue({}),
      createPaymentMethod: jest.fn().mockResolvedValue({}),
    }),
  };
});
