export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverage: true,
    coverageReporters: ['text', 'html'],
    coverageDirectory: '<rootDir>/coverage/',
    maxWorkers: 1, // Run tests in a single worker
  };