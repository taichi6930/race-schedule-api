/**
 * CloudFlare Workers 環境変数のインターフェース
 */
export interface CloudFlareEnv {
    JRA_CALENDAR_ID: string;
    NAR_CALENDAR_ID: string;
    WORLD_CALENDAR_ID: string;
    KEIRIN_CALENDAR_ID: string;
    AUTORACE_CALENDAR_ID: string;
    BOATRACE_CALENDAR_ID: string;
    TEST_CALENDAR_ID: string;
    GOOGLE_CLIENT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
}
