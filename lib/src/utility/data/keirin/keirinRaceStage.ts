import { z } from 'zod';

import type { KeirinGradeType } from './keirinGradeType';

/**
 * 競輪の指定グレード・ステージリスト
 */
export const KeirinRaceGradeAndStageList: {
    grade: KeirinGradeType[];
    stage: KeirinRaceStage;
    stageByOddspark: string[];
    priority: number;
    description: string;
}[] = [
    {
        grade: ['GP'],
        stage: 'S級グランプリ',
        stageByOddspark: ['Ｓ級ＧＰ'],
        priority: 10,
        description:
            '競輪の最高峰レース。SS級選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GP'],
        stage: 'L級ガールズグランプリ',
        stageByOddspark: ['Ｌ級ＧＧＰ'],
        priority: 10,
        description:
            '女子競輪の最高峰レース。L級ガールズ選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GⅡ'],
        stage: 'SA混合ヤンググランプリ',
        stageByOddspark: ['ＳＡ混合ＹＧＰ'],
        priority: 8,
        description:
            'GⅡレースの若手のグランプリ。若手選手が集結し、将来を担う選手を発掘するレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級決勝',
        stageByOddspark: ['Ｓ級決勝'],
        priority: 9,
        description:
            'GⅠの最終日に行われる決勝レース。優勝すると、その年のグランプリ出場権を得る。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級準決勝',
        stageByOddspark: ['Ｓ級準決勝', 'Ｓ級西準決', 'Ｓ級東準決'],
        priority: 8,
        description: 'GⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級初日特別選抜',
        stageByOddspark: ['Ｓ級初特選'],
        priority: 8,
        description:
            'GⅠの初日特別選抜レース。2次予選のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級特別選抜予選',
        stageByOddspark: ['Ｓ級特選予', 'Ｓ級西特選', 'Ｓ級東特選'],
        priority: 8,
        description:
            'GⅠ初日の特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ゴールデンレーサー賞',
        stageByOddspark: ['Ｓ級ＧＤＲ'],
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ダイヤモンドレース',
        stageByOddspark: ['Ｓ級ＤＭＤ'],
        priority: 8,
        description:
            'GⅠ競輪祭の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ドリームレース',
        stageByOddspark: ['Ｓ級ＤＲＭ'],
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。ファン投票で選ばれたトップ9選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級オリオン賞',
        stageByOddspark: ['Ｓ級ＯＲＩ'],
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。ファン投票で選ばれたトップ選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級シャイニングスター賞',
        stageByOddspark: ['Ｓ級シャイ'],
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級スタールビー賞',
        stageByOddspark: ['Ｓ級ＳＴＲ'],
        priority: 8,
        description:
            'GⅠ全日本選抜競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級白虎賞',
        stageByOddspark: ['Ｓ級白虎賞'],
        priority: 8,
        description:
            'GⅠ高松宮記念杯競輪の西日本のシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級青龍賞',
        stageByOddspark: ['Ｓ級青龍賞'],
        priority: 8,
        description:
            'GⅠ高松宮記念杯競輪の東日本のシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級日本競輪選手会理事長杯',
        stageByOddspark: ['Ｓ級日競杯'],
        priority: 8,
        description:
            'GⅠ寬仁親王牌の初日特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ローズカップ',
        stageByOddspark: ['Ｓ級ローズ'],
        priority: 8,
        description:
            'GⅠ寬仁親王杯競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ティアラカップ',
        stageByOddspark: ['Ｌ級ティア'],
        priority: 8,
        description:
            'GⅠオールガールズクラシックの特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ決勝',
        stageByOddspark: ['Ｌ級ガ決勝'],
        priority: 8,
        description:
            'GⅠガールズ競輪の最終日に行われる決勝レース。優勝すると、その年のガールズグランプリ出場権を得る。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ準決勝',
        stageByOddspark: ['Ｌ級ガ準決', 'Ｌ級西ガ準', 'Ｌ級東ガ準'],
        priority: 7,
        description:
            'ガールズ競輪の準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズドリームレース',
        stageByOddspark: ['Ｌ級ＤＲＭ'],
        priority: 7,
        description:
            'オールスター女子競輪の特別なレース。ファン投票で選ばれたトップ選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズアルテミス賞',
        stageByOddspark: ['Ｌ級ＡＲＴ'],
        priority: 6,
        description: 'オールスター女子競輪の特別なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズコレクション',
        stageByOddspark: ['Ｌ級Ｇコレ'],
        priority: 6,
        description: 'ガールズ競輪の特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ予選',
        stageByOddspark: ['Ｌ級ガ予選'],
        priority: 4,
        description:
            'ガールズ競輪の予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級特別優秀',
        stageByOddspark: ['Ｓ級特秀'],
        priority: 4,
        description: 'GⅠの特別優秀レース。負け戦。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級二次予選',
        stageByOddspark: ['Ｓ級二予戦', 'Ｓ級二予', 'Ｓ級東二予', 'Ｓ級西二予'],
        priority: 4,
        description:
            'GⅠの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級一次予選',
        stageByOddspark: [
            'Ｓ級一予戦',
            'Ｓ級一予',
            'S級一予1',
            'Ｓ級一予2',
            'Ｓ級西予[１２]',
            'Ｓ級東予[１２]',
        ],
        priority: 2,
        description:
            'GⅠの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級決勝',
        stageByOddspark: ['Ｓ級決勝'],
        priority: 8,
        description:
            'GⅡの最終日に行われる決勝レース。高額賞金が用意され、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級準決勝',
        stageByOddspark: ['Ｓ級準決勝'],
        priority: 7,
        description: 'GⅡの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級毘沙門天賞',
        stageByOddspark: ['Ｓ級毘沙門'],
        priority: 8,
        description:
            'GⅡウィナーズカップのシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級アルタイル賞',
        stageByOddspark: ['Ｓ級ＡＬＴ'],
        priority: 8,
        description:
            'GⅡレース・サマーナイトフェスティバルの2日目に行われるレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級二次予選',
        stageByOddspark: ['Ｓ級二予戦', 'Ｓ級二予'],
        priority: 4,
        description:
            'GⅡの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級一次予選',
        stageByOddspark: ['Ｓ級一予戦', 'Ｓ級一予', 'S級一予1', 'Ｓ級一予2'],
        priority: 2,
        description:
            'GⅡの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級選抜',
        stageByOddspark: ['Ｓ級選抜'],
        priority: 0,
        description: 'GⅡの選抜レース。負け戦',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級一般',
        stageByOddspark: ['Ｓ級一般'],
        priority: 0,
        description: 'GⅡの一般レース。負け戦。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級特選',
        stageByOddspark: ['Ｓ級特選'],
        priority: 0,
        description: 'GⅡの特選レース。負け戦。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級特別選抜予選',
        stageByOddspark: ['Ｓ級特選予'],
        priority: 7,
        description:
            'GⅡ初日の特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級決勝',
        stageByOddspark: ['Ｓ級決勝'],
        priority: 8,
        description:
            'GⅢの最終日に行われる決勝レース。そこそこ賞金が高く、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級準決勝',
        stageByOddspark: ['Ｓ級準決勝'],
        priority: 5,
        description: 'GⅢの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級二次予選',
        stageByOddspark: ['Ｓ級二予戦', 'Ｓ級二予'],
        priority: 3,
        description:
            'GⅢの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級一次予選',
        stageByOddspark: ['Ｓ級一予戦', 'Ｓ級一予'],
        priority: 1,
        description:
            'GⅢの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級初日特別選抜',
        stageByOddspark: ['Ｓ級初特選'],
        priority: 6,
        description:
            'GⅢの初日特別選抜レース。2次予選のシード選手が出場する特別なレース。',
    },

    {
        grade: ['FⅠ'],
        stage: 'S級決勝',
        stageByOddspark: ['Ｓ級決勝'],
        priority: 4,
        description:
            'FⅠの最終日に行われる決勝レース。ウィナーズカップの出場権に近づく。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級準決勝',
        stageByOddspark: ['Ｓ級準決勝'],
        priority: 3,
        description: 'FⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級予選',
        stageByOddspark: ['Ｓ級予選'],
        priority: 1,
        description: 'FⅠの予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級初日特別選抜',
        stageByOddspark: ['Ｓ級初特選'],
        priority: 2,
        description:
            'FⅠの初日特別選抜レース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級スーパープロピストレーサー賞',
        stageByOddspark: ['ＳＰＲ'],
        priority: 7,
        description: '全プロ競輪の特別なレース。最終日のメインレース。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ決勝',
        stageByOddspark: ['Ｌ級ガ決勝'],
        priority: 2,
        description: 'ガールズ競輪の最終日に行われる決勝レース。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ準決勝',
        stageByOddspark: ['Ｌ級ガ準決'],
        priority: 1,
        description:
            'ガールズ競輪の準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ予選',
        stageByOddspark: ['Ｌ級ガ予選'],
        priority: 0,
        description:
            'ガールズ競輪の予選レース。選手たちが決勝進出を目指して競い合う。',
    },
];

/**
 * KeirinRaceStageのzod型定義
 */
export const KeirinRaceStageSchema = z.string().refine((value) => {
    return KeirinRaceStageList.has(value);
}, '競輪のステージではありません');

/**
 * KeirinRaceStageの型定義
 */
export type KeirinRaceStage = z.infer<typeof KeirinRaceStageSchema>;

/**
 * 競輪のステージ リスト
 */
const KeirinRaceStageList = new Set([
    'S級初日特別選抜',
    'S級特一般',
    'S級順位決定',
    'S級準決勝',
    'S級特選',
    'A級特選',
    'S級選抜',
    'S級一般',
    'S級優秀',
    'S級特別優秀',
    'S級決勝',
    'A級決勝',
    'A級準決勝',
    'S級西日本特別選抜予選',
    'S級東日本特別選抜予選',
    'S級日本競輪選手会理事長杯',
    'S級ローズカップ',
    'S級予選',
    'A級初日特別選抜',
    'A級予選',
    'L級ガールズ決勝',
    'L級ガールズ準決勝',
    'L級ガールズ予選',
    'L級ガールズ特選',
    'L級ガールズ選抜',
    'L級ガールズ西日本予選',
    'L級ガールズ東日本予選',
    'L級ガールズコレクション',
    'S級ダイナミックステージ',
    'S級ワンダーステージ',
    'S級スーパープロピストレーサー賞',
    '',
    ...KeirinRaceGradeAndStageList.map((item) => item.stage),
]);

/**
 * 競輪の指定グレード・ステージリスト
 * KeirinRaceGradeAndStageListの内容も追加されています。
 */
export const KeirinSpecifiedGradeAndStageList: {
    grade: KeirinGradeType[];
    stage: KeirinRaceStage;
    stageByOddspark: string[];
    priority: number;
    description: string;
}[] =
    // KeirinRaceGradeAndStageListから追加（grade配列の全要素を展開）
    KeirinRaceGradeAndStageList.flatMap((item) => ({
        grade: item.grade,
        stage: item.stage,
        stageByOddspark: item.stageByOddspark,
        priority: item.priority,
        description: item.description,
    }));

/**
 * 競輪のステージ リスト
 * @param stage - ステージ
 * @returns - バリデーション済みのステージ
 */
export const validateKeirinRaceStage = (stage: string): KeirinRaceStage =>
    KeirinRaceStageSchema.parse(stage);

/**
 * KeirinRaceGradeAndStageListのstageByOddsparkとstageのマッピング
 * stageByOddsparkをキー、stageを値とするマップ
 */
const KeirinStageByOddsparkMap: Record<string, KeirinRaceStage> =
    Object.fromEntries(
        KeirinRaceGradeAndStageList.flatMap((item) =>
            item.stageByOddspark.map((stageByOddspark) => [
                stageByOddspark,
                item.stage,
            ]),
        ),
    );

/**
 * HTML表記・oddspark表記の両方をカバーする競輪ステージ名マップ
 */
export const KeirinStageMap: Record<string, KeirinRaceStage> = {
    ...KeirinStageByOddsparkMap,
    Ｓ級特一般: 'S級特一般',
    Ａ級準決勝: 'A級準決勝',
    Ｓ級特選: 'S級特選',
    Ａ級特選: 'A級特選',
    Ｓ級選抜: 'S級選抜',
    Ｓ級一般: 'S級一般',
    Ａ級一般: 'A級一般',
    Ｓ級特秀: 'S級特別優秀',
    Ｓ級優秀: 'S級優秀',
    Ｓ級初特選: 'S級初日特別選抜',
    Ａ級初特選: 'A級初日特別選抜',
    Ｓ級西準決: 'S級西日本準決勝',
    Ｓ級東準決: 'S級東日本準決勝',
    Ｓ級西特選: 'S級西日本特別選抜予選',
    Ｓ級東特選: 'S級東日本特別選抜予選',
    Ｓ級予選: 'S級予選',
    Ａ級予選: 'A級予選',
    Ｓ級順位決: 'S級順位決定',
    Ｌ級ガ決勝: 'L級ガールズ決勝',
    Ｌ級ガ準決: 'L級ガールズ準決勝',
    Ｌ級ガ予: 'L級ガールズ予選',
    Ｌ級ガ特選: 'L級ガールズ特選',
    Ｌ級ガ選抜: 'L級ガールズ選抜',
    Ｌ級西ガ予: 'L級ガールズ西日本予選',
    Ｌ級東ガ予: 'L級ガールズ東日本予選',
    Ｌ級Ｇコレ: 'L級ガールズコレクション',
    ＤＳ: 'S級ダイナミックステージ',
    ＷＳ: 'S級ワンダーステージ',
    ＳＰＲ: 'S級スーパープロピストレーサー賞',
};
