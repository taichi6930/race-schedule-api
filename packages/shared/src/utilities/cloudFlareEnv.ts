/**
 * CloudFlare Workers 環境変数の型定義
 */
export interface CloudFlareEnv {
    JRA_CALENDAR_ID: string; // 中央競馬
    NAR_CALENDAR_ID: string; // 地方競馬
    WORLD_CALENDAR_ID: string; // 海外競馬
    KEIRIN_CALENDAR_ID: string; // 競輪
    AUTORACE_CALENDAR_ID: string; // オートレース
    BOATRACE_CALENDAR_ID: string; // ボートレース
    GOOGLE_CLIENT_EMAIL: string; // Google サービスアカウントのクライアントメール
    GOOGLE_PRIVATE_KEY: string; // Google サービスアカウントの秘密鍵
}
