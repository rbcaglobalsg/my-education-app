module.exports = {
  preset: 'react-native',
  // setupFiles나 setupFilesAfterEnv는 이전과 동일하게 유지
  setupFiles: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native|@react-native|react-navigation|react-native-gesture-handler|@stripe))'
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@stripe/stripe-react-native$': '<rootDir>/__mocks__/@stripe/stripe-react-native.js'
  }
};
