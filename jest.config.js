module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './',
  testRegex: '.spec.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  collectCoverage: false,
  verbose: true,
  moduleNameMapper: { 'src/(.*)': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  displayName: { name: 'Notification Service', color: 'blue' }
};
