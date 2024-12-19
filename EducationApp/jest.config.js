// EducationApp/jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|react-native-gesture-handler|@react-native|@react-navigation)',
  ],
  moduleNameMapper: {
    '\\.(png|jpe?g|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  }
};
