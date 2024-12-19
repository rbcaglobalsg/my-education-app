// EducationApp/jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jestSetup.js'], // jestSetup.js 파일 로드
  transformIgnorePatterns: [
    'node_modules/(?!react-native|react-native-gesture-handler|@react-native|react-navigation)',
  ],
};
