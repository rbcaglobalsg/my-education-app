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
  testEnvironment: 'jsdom', // 여기서 'jest-environment-jsdom' 대신 'jsdom' 으로 변경
};
