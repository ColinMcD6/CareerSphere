export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverage: true,
    coverageReporters: ['text', 'html'],
    coverageDirectory: '<rootDir>/coverage/',
    setupFiles: ['./src/tests/jest.setup.ts'],
  };