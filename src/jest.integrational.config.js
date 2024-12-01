// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    setupFilesAfterEnv: ['./ormconfig.test.ts'],
    workerIdleMemoryLimit: '1512MB',
    testPathIgnorePatterns: ['./node_modules/'],
    collectCoverageFrom: [
        '**/*controller.ts',
        '**/controller-tests/**',
        '**/controller/**',
        '**/repositories/**/*.ts',
        '**/repository/**/*.ts',
        '**/*int.spec*',
        '!**/repositories/**/*.spec.ts',
        '!**/repository/**/*.spec.ts',
    ],
    testMatch: [
        '*/**/controller-tests/**/*.spec.*',
        '*/**/repositories/**/*.spec.*',
        '*/**/repository/**/*.spec.*',
        '*/**/int.spec/**',
        '*/**/*.int.spec.*',
    ],
};
