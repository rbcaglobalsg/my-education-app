module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|react-native|@react-native|react-navigation|react-native-gesture-handler|@stripe))'
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
