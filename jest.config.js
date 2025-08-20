/* eslint-disable */
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'lib/src/utility/env.ts',
        'lib/src/gateway/mock/mockPlaceDataHtmlGateway.ts',
        'lib/src/gateway/mock/mockRaceDataHtmlGateway.ts',
        // TODO: データ用意が大変なので一旦除外、どこかでテストしたい
        'lib/src/repository/implement/autoraceRaceRepositoryFromHtml.ts',
        'lib/src/repository/implement/boatraceRaceRepositoryFromHtml.ts',
        'lib/src/repository/implement/keirinRaceRepositoryFromHtml.ts',
        'lib/src/repository/implement/overseasRaceRepositoryFromHtml.ts',
        'lib/src/repository/implement/jraRaceRepositoryFromHtml.ts',
        'lib/src/utility/sqlite.ts',
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
