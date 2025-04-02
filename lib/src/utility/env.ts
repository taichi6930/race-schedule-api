import dotenv from 'dotenv';

dotenv.config();
export const allowedEnvs = {
    production: 'PRODUCTION', // 本番環境 html:webと接続, s3:webと接続
    test: 'TEST', // テスト環境 html:mockRepositoryと接続, s3:webと接続
    local: 'LOCAL', // ローカル環境 html:localと接続, s3:mockと接続（初期データあり・実際）
    localNoInitData: 'LOCAL_NO_INIT_DATA', // ローカル（初期データなし）環境 html:mockRepositoryと接続, s3:mockと接続（初期データなし）
    localInitMadeData: 'LOCAL_INIT_MADE_DATA', // ローカル（正規化データ）環境 html:mockRepositoryと接続, s3:mockと接続（初期データあり・架空）
    githubActionsCi: 'GITHUB_ACTIONS_CI', // GitHub Actions CI環境 HTML取得のテストをスキップするため
} as const;

type EnvType = (typeof allowedEnvs)[keyof typeof allowedEnvs];

const getEnv = (env: string | undefined): EnvType => {
    if (!Object.values(allowedEnvs).includes(env as EnvType)) {
        throw new Error(
            `Invalid ENV value: ${env ?? 'undefined'}. Allowed values are: ${Object.values(allowedEnvs).join(', ')}`,
        );
    }
    return env as EnvType;
};

export const ENV = getEnv(process.env.ENV);
