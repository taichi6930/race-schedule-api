import type { OldCloudFlareEnv } from '../../../../../src/utility/oldCloudFlareEnv';

/**
 * CloudFlareEnvのモックを作成する
 * @returns モック化されたCloudFlareEnvインターフェースのインスタンス
 */
export const cloudFlareEnvMock = (): OldCloudFlareEnv => {
    return {
        DB: {
            exec: jest.fn(),
            prepare: jest.fn(),
            batch: jest.fn(),
            withSession: jest.fn(),
            dump: jest.fn(),
        },
        JRA_CALENDAR_ID: 'JRA_CALENDAR_ID_dummy',
        NAR_CALENDAR_ID: 'NAR_CALENDAR_ID_dummy',
        WORLD_CALENDAR_ID: 'WORLD_CALENDAR_ID_dummy',
        KEIRIN_CALENDAR_ID: 'KEIRIN_CALENDAR_ID_dummy',
        AUTORACE_CALENDAR_ID: 'AUTORACE_CALENDAR_ID_dummy',
        BOATRACE_CALENDAR_ID: 'BOATRACE_CALENDAR_ID_dummy',
        TEST_CALENDAR_ID: 'TEST_CALENDAR_ID_dummy',
        GOOGLE_CLIENT_EMAIL: 'GOOGLE_CLIENT_EMAIL_dummy',
        GOOGLE_PRIVATE_KEY: 'GOOGLE_PRIVATE_KEY_dummy',
        IS_HTML_FETCH_ENABLED: 'false',
        HTML_FETCH_DELAY_MS: '0',
        SCRAPING_API_BASE_URL: 'http://localhost:8787',
    };
};
