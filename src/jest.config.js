module.exports = {
    workerThreads: false,
    preset: 'ts-jest',
    testEnvironment: 'node',
    workerIdleMemoryLimit: 0.5,
    maxWorkers: 1,
    clearMocks: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: ['./node_modules/'],
    errorOnDeprecated: true,
    moduleFileExtensions: ['js', 'ts'],
    resetMocks: false,
    testLocationInResults: true,
    reporters: ['default', 'jest-junit'],
    testTimeout: 1500000,
    testMatch: ['**/?(*.)+(spec).[tj]s?(x)'],
    testPathIgnorePatterns: ['./node_modules/'],
    moduleNameMapper: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '^@app/(.*)$': '<rootDir>/$1',
    },
};
