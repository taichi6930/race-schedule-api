import type { D1Database } from '@cloudflare/workers-types';

/**
 * CloudFlare Workers 環境変数の型定義
 */
export interface CloudFlareEnv {
    DB: D1Database; // D1 データベース
    JRA_CALENDAR_ID: string; // 中央競馬
    NAR_CALENDAR_ID: string; // 地方競馬
    WORLD_CALENDAR_ID: string; // 海外競馬
    KEIRIN_CALENDAR_ID: string; // 競輪
    AUTORACE_CALENDAR_ID: string; // オートレース
    BOATRACE_CALENDAR_ID: string; // ボートレース
    GOOGLE_CLIENT_EMAIL: string; // Google サービスアカウントのクライアントメール
    GOOGLE_PRIVATE_KEY: string; // Google サービスアカウントの秘密鍵
    R2_ACCESS_KEY_ID: string; // R2用アクセスキーID
    R2_SECRET_ACCESS_KEY: string; // R2用シークレットアクセスキー
    R2_ENDPOINT: string; // R2用エンドポイント
    R2_BUCKET_NAME: string; // R2用バケット名
}
