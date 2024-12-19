// EducationApp/jest.config.js
module.exports = {
  preset: 'react-native',
  setupFiles: ['./jestSetup.js'],  // setupFilesAfterEnv 대신 setupFiles 사용
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native|@react-native|react-navigation|react-native-gesture-handler|@stripe|@react-native-async-storage))'
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^@stripe/stripe-react-native$': '<rootDir>/__mocks__/@stripe/stripe-react-native.js'
  }
};
