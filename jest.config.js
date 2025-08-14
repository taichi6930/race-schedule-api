/* eslint-disable */
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'lib/src/utility/env.ts',
        // TODO: データ用意が大変なので一旦除外、どこかでテストしたい
        'lib/src/repository/implement/autoraceRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/boatraceRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/keirinRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/worldRaceRepositoryFromHtmlImpl.ts',
        'lib/src/repository/implement/jraRaceRepositoryFromHtmlImpl.ts',
        'lib/src/utility/sqlite.ts',
        'lib/src/gateway/mock/mockPlaceDataHtmlGateway.ts',
        'lib/src/gateway/mock/mockRaceDataHtmlGateway.ts',
    ],
    coverageReporters: ['text', 'lcov'],
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['@swc/jest'],
    },
    reporters: [
        'default',
        [
            'jest-html-reporters',
            {
                darkTheme: true,
            },
        ],
    ],
};
