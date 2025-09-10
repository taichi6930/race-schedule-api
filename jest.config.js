/* eslint-disable */
// Ensure TZ is set when jest process starts (fallback if env not propagated)
process.env.TZ = process.env.TZ || 'Asia/Tokyo';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['lib/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        'logger.ts',
        'lib/src/utility/envForAws.ts',
        'lib/src/gateway/mock/mockPlaceDataHtmlGateway.ts',
        'lib/src/gateway/mock/mockRaceDataHtmlGateway.ts',
        'lib/src/gateway/record/placeGradeRecord.ts',
        'lib/src/repository/*/narRaceRepositoryFromHtml.ts',
        'lib/src/repository/*/autoraceRaceRepositoryFromHtml.ts',
        'lib/src/repository/*/boatraceRaceRepositoryFromHtml.ts',
        'lib/src/repository/*/keirinRaceRepositoryFromHtml.ts',
        'lib/src/repository/*/overseasRaceRepositoryFromHtml.ts',
        'lib/src/repository/*/jraRaceRepositoryFromHtml.ts',
        'lib/src/repository/entity/placeEntity.ts',
        'lib/src/repository/entity/raceEntity.ts',
        'lib/src/repository/implement/mechanicalRacingRaceRepositoryFromStorage.ts',
        'lib/src/repository/implement/raceRepositoryFromStorage.ts',
        'lib/src/repository/implement/placeRepositoryFromStorage.ts',
        'lib/src/repository/implement/raceRepositoryFromStorage.ts',
        'lib/src/service/implement/raceService.ts',
        'lib/src/usecase/implement/calendarUseCase.ts',
        'lib/src/domain/playerData.ts',
        'lib/src/utility/sqlite.ts',
        'lib/src/utility/raceType.ts',
        'lib/src/utility/constants.ts',
        'lib/src/utility/validateAndType/raceCourse.ts',
        'lib/src/utility/googleCalendar.ts',
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
