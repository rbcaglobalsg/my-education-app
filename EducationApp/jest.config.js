module.exports = {
  preset: 'react-native',
  setupFiles: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native|@react-native|react-navigation|react-native-gesture-handler|@stripe))'
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@stripe/stripe-react-native$': '<rootDir>/__mocks__/@stripe/stripe-react-native.js'
  },
  testEnvironment: 'jsdom', // 이 줄을 추가
};
