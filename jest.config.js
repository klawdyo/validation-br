module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { /* ts-jest config goes here in Jest */ }],
  },
  testRegex: '(/test/.*\\.(test|spec))\\.(jsx?|tsx?)$',
  testEnvironment: 'node',
  // coverageDirectory: './coverage/',
  // collectCoverage: true,
  coverageProvider: 'v8',
}
