// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*spec.ts',
        '!**/dao/**',
        '!**/constants/**',
        '!**/interfaces/**',
        '!**/interface/**',
        '!**/mock/**',
        '!**/enums/**',
        '!**/index.ts',
        '!**/*module.ts',
        '!main.ts',
        '!env.ts',
        '!cli.ts',
        '!**/controller-tests/**',
        '!**/controller/**',
        '!**/*controller.ts',
        '!**/repositories/**',
        '!**/repository/**',
        '!**/*int.spec*',
    ],
    testPathIgnorePatterns: [
        './node_modules/',
        '(.*).controller-tests(.*)',
        '(.*).controller(.*)',
        '(.*).repositories(.*)',
        '(.*).repository(.*)',
        '(.*).int.spec(.*)',
    ],
};
