import type { D1Database } from '@cloudflare/workers-types';

export interface CommonParameter {
    env: CloudFlareEnv;
}
export interface CloudFlareEnv {
    DB: D1Database;
    JRA_CALENDAR_ID: string;
    NAR_CALENDAR_ID: string;
    WORLD_CALENDAR_ID: string;
    KEIRIN_CALENDAR_ID: string;
    AUTORACE_CALENDAR_ID: string;
    BOATRACE_CALENDAR_ID: string;
    TEST_CALENDAR_ID: string;
    GOOGLE_CLIENT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
    IS_HTML_FETCH_ENABLED: string;
    HTML_FETCH_DELAY_MS: string;
}
