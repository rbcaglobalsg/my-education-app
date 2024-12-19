const { NativeModules } = require('react-native');

// NativeModules.StripeSdk를 미리 정의
NativeModules.StripeSdk = {
  initialise: jest.fn(),
  presentPaymentSheet: jest.fn().mockResolvedValue({}),
  createPaymentMethod: jest.fn().mockResolvedValue({}),
  retrievePaymentIntent: jest.fn().mockResolvedValue({}),
  confirmPaymentIntent: jest.fn().mockResolvedValue({}),
  confirmSetupIntent: jest.fn().mockResolvedValue({}),
};

module.exports = {
  StripeProvider: ({ children }) => children,
  useStripe: () => ({
    confirmPayment: jest.fn().mockResolvedValue({}),
    confirmSetupIntent: jest.fn().mockResolvedValue({}),
    createPaymentMethod: jest.fn().mockResolvedValue({}),
  }),
};
