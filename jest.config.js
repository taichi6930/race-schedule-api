/* eslint-disable */
// Ensure TZ is set when jest process starts (fallback if env not propagated)
process.env.TZ = process.env.TZ || 'Asia/Tokyo';

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'src/utility/env.ts',
        'src/gateway/mock/mockPlaceDataHtmlGateway.ts',
        'src/gateway/mock/mockRaceDataHtmlGateway.ts',
        'src/repository/entity/placeEntity.ts',
        'src/repository/entity/raceEntity.ts',
        'src/repository/implement/mechanicalRacingRaceRepositoryFromStorage.ts',
        'src/repository/implement/raceRepositoryFromStorage.ts',
        'src/repository/implement/placeRepositoryFromStorage.ts',
        'src/repository/implement/raceRepositoryFromStorage.ts',
        'src/domain/playerData.ts',
        'src/utility/sqlite.ts',
        'src/utility/raceType.ts',
        'src/utility/constants.ts',
        'src/utility/validateAndType/raceCourse.ts',
        'src/utility/googleCalendar.ts',
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
                includeFailureMsg: false,
                includeConsoleLog: false,
            },
        ],
    ],
};
