import { z } from 'zod';

import type { KeirinGradeType } from './keirinGradeType';

/**
 * 競輪の指定グレード・ステージリスト
 */
export const KeirinRaceGradeAndStageList: {
    grade: KeirinGradeType[];
    stage: KeirinRaceStage;
    stageByOddspark: string;
    priority: number;
    description: string;
}[] = [
    {
        grade: ['GP'],
        stage: 'S級グランプリ',
        stageByOddspark: 'Ｓ級ＧＰ',
        priority: 10,
        description:
            '競輪の最高峰レース。SS級選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GP'],
        stage: 'L級ガールズグランプリ',
        stageByOddspark: 'Ｌ級ＧＧＰ',
        priority: 10,
        description:
            '女子競輪の最高峰レース。L級ガールズ選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GⅡ'],
        stage: 'SA混合ヤンググランプリ',
        stageByOddspark: 'ＳＡ混合ＹＧＰ',
        priority: 8,
        description:
            'GⅡレースの若手のグランプリ。若手選手が集結し、将来を担う選手を発掘するレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級アルタイル賞',
        stageByOddspark: 'Ｓ級ＡＬＴ',
        priority: 8,
        description:
            'GⅡレース・サマーナイトフェスティバルの2日目に行われるレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級決勝',
        stageByOddspark: 'Ｓ級決勝',
        priority: 9,
        description:
            'GⅠの最終日に行われる決勝レース。優勝すると、その年のグランプリ出場権を得る。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級準決勝',
        stageByOddspark: 'Ｓ級準決勝',
        priority: 8,
        description: 'GⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    // { grade: ['GⅠ'], stage: 'S級特別選抜予選', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級初日特別選抜', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級ゴールデンレーサー賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級ダイヤモンドレース', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級ドリームレース', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級オリオン賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級シャイニングスター賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級スタールビー賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級白虎賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級青龍賞', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級西日本準決勝', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級東日本準決勝', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級西日本特別選抜予選', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級東日本特別選抜予選', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級日本競輪選手会理事長杯', priority: 8 },
    // { grade: ['GⅠ'], stage: 'S級ローズカップ', priority: 8 },
    // { grade: ['GⅠ'], stage: 'L級ティアラカップ', priority: 8 },
    // { grade: ['GⅠ'], stage: 'L級ガールズ決勝', priority: 8 },
    // { grade: ['GⅠ'], stage: 'L級ガールズ準決勝', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズ西日本準決勝', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズ東日本準決勝', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズドリームレース', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズアルテミス賞', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズコレクション', priority: 7 },
    // { grade: ['GⅠ'], stage: 'L級ガールズ予選', priority: 4 },
    // { grade: ['GⅠ'], stage: 'S級特別優秀', priority: 4 },
    // { grade: ['GⅠ'], stage: 'S級二次予選', priority: 4 },
    // { grade: ['GⅠ'], stage: 'S級一次予選', priority: 2 },
    {
        grade: ['GⅡ'],
        stage: 'S級決勝',
        stageByOddspark: 'Ｓ級決勝',
        priority: 8,
        description:
            'GⅡの最終日に行われる決勝レース。高額賞金が用意され、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級準決勝',
        stageByOddspark: 'Ｓ級準決勝',
        priority: 7,
        description: 'GⅡの準決勝レース。決勝進出を目指す重要なレース。',
    },
    // { grade: ['GⅡ'], stage: 'S級毘沙門天賞', priority: 8 },
    // { grade: ['GⅡ'], stage: 'S級二次予選', priority: 4 },
    // { grade: ['GⅡ'], stage: 'S級一次予選', priority: 2 },
    // { grade: ['GⅡ'], stage: 'S級特別選抜予選', priority: 7 },
    {
        grade: ['GⅢ'],
        stage: 'S級決勝',
        stageByOddspark: 'Ｓ級決勝',
        priority: 8,
        description:
            'GⅢの最終日に行われる決勝レース。そこそこ賞金が高く、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級準決勝',
        stageByOddspark: 'Ｓ級準決勝',
        priority: 5,
        description: 'GⅢの準決勝レース。決勝進出を目指す重要なレース。',
    },
    // { grade: ['GⅢ'], stage: 'S級二次予選', priority: 3 },
    // { grade: ['GⅢ'], stage: 'S級一次予選', priority: 1 },
    // { grade: ['GⅢ'], stage: 'S級初日特別選抜', priority: 6 },

    {
        grade: ['FⅠ'],
        stage: 'S級決勝',
        stageByOddspark: 'Ｓ級決勝',
        priority: 4,
        description:
            'FⅠの最終日に行われる決勝レース。ウィナーズカップの出場権に近づく。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級準決勝',
        stageByOddspark: 'Ｓ級準決勝',
        priority: 3,
        description: 'FⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    // { grade: ['FⅠ'], stage: 'S級予選', priority: 1 },
    // { grade: ['FⅠ'], stage: 'S級初日特別選抜', priority: 1 },

    // { grade: ['FⅡ'], stage: 'L級ガールズドリームレース', priority: 7 },
    // { grade: ['FⅡ'], stage: 'L級ガールズアルテミス賞', priority: 6 },
    // { grade: ['FⅡ'], stage: 'S級スーパープロピストレーサー賞', priority: 7 },
    // { grade: ['FⅡ'], stage: 'L級ガールズ決勝', priority: 2 },
    // { grade: ['FⅡ'], stage: 'L級ガールズ準決勝', priority: 1 },
    // { grade: ['FⅡ'], stage: 'L級ガールズ予選', priority: 0 },
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
    'S級一次予選',
    'S級二次予選',
    'S級特別選抜予選',
    'S級初日特別選抜',
    'S級特一般',
    'S級順位決定',
    'S級スタールビー賞',
    'S級ゴールデンレーサー賞',
    'S級ドリームレース',
    'S級オリオン賞',
    'S級ダイヤモンドレース',
    'S級シャイニングスター賞',
    'S級毘沙門天賞',
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
    'S級西日本二次予選',
    'S級西日本一次予選',
    'S級東日本二次予選',
    'S級東日本一次予選',
    'S級白虎賞',
    'S級青龍賞',
    'S級西日本準決勝',
    'S級東日本準決勝',
    'S級西日本特別選抜予選',
    'S級東日本特別選抜予選',
    'S級日本競輪選手会理事長杯',
    'S級ローズカップ',
    'S級予選',
    'A級初日特別選抜',
    'A級予選',
    'L級ガールズドリームレース',
    'L級ガールズアルテミス賞',
    'L級ガールズ決勝',
    'L級ガールズ準決勝',
    'L級ガールズ予選',
    'L級ガールズ特選',
    'L級ガールズ選抜',
    'L級ガールズ西日本準決勝',
    'L級ガールズ東日本準決勝',
    'L級ガールズ西日本予選',
    'L級ガールズ東日本予選',
    'L級ガールズコレクション',
    'L級ティアラカップ',
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
    stageByOddspark: string;
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
        KeirinRaceGradeAndStageList.map((item) => [
            item.stageByOddspark,
            item.stage,
        ]),
    );

/**
 * HTML表記・oddspark表記の両方をカバーする競輪ステージ名マップ
 */
export const KeirinStageMap: Record<string, KeirinRaceStage> = {
    ...KeirinStageByOddsparkMap,

    'Ｓ級ＳＴＲ': 'S級スタールビー賞',
    'Ｓ級ＤＭＤ': 'S級ダイヤモンドレース',
    'Ｓ級シャイ': 'S級シャイニングスター賞',
    'Ｓ級毘沙門': 'S級毘沙門天賞',
    'Ｓ級一予': 'S級一次予選',
    'Ｓ級一予1': 'S級一次予選',
    'Ｓ級一予2': 'S級一次予選',
    'Ｓ級特選予': 'S級特別選抜予選',
    'Ｓ級特一般': 'S級特一般',
    'Ｓ級二予': 'S級二次予選',
    'Ａ級準決勝': 'A級準決勝',
    'Ｓ級特選': 'S級特選',
    'Ａ級特選': 'A級特選',
    'Ｓ級選抜': 'S級選抜',
    'Ｓ級一般': 'S級一般',
    'Ａ級一般': 'A級一般',
    'Ｓ級特秀': 'S級特別優秀',
    'Ｓ級優秀': 'S級優秀',
    'Ｓ級初特選': 'S級初日特別選抜',
    'Ａ級初特選': 'A級初日特別選抜',
    'Ｓ級西予二予': 'S級西日本二次予選',
    'Ｓ級西予[１２]': 'S級西日本一次予選',
    'Ｓ級東二予': 'S級東日本二次予選',
    'Ｓ級東予[１２]': 'S級東日本一次予選',
    'Ｓ級白虎賞': 'S級白虎賞',
    'Ｓ級青龍賞': 'S級青龍賞',
    'Ｓ級西準決': 'S級西日本準決勝',
    'Ｓ級東準決': 'S級東日本準決勝',
    'Ｓ級西特選': 'S級西日本特別選抜予選',
    'Ｓ級東特選': 'S級東日本特別選抜予選',
    'Ｓ級ＧＤＲ': 'S級ゴールデンレーサー賞',
    'Ｓ級ＤＲＭ': 'S級ドリームレース',
    'Ｓ級ＯＲＩ': 'S級オリオン賞',
    'Ｓ級日競杯': 'S級日本競輪選手会理事長杯',
    'Ｓ級ローズ': 'S級ローズカップ',
    'Ｓ級予選': 'S級予選',
    'Ａ級予選': 'A級予選',
    'Ｓ級順位決': 'S級順位決定',
    'Ｌ級ＤＲＭ': 'L級ガールズドリームレース',
    'Ｌ級ＡＲＴ': 'L級ガールズアルテミス賞',
    'Ｌ級ガ決勝': 'L級ガールズ決勝',
    'Ｌ級ティア': 'L級ティアラカップ',
    'Ｌ級ガ準決': 'L級ガールズ準決勝',
    'Ｌ級ガ予': 'L級ガールズ予選',
    'Ｌ級ガ特選': 'L級ガールズ特選',
    'Ｌ級ガ選抜': 'L級ガールズ選抜',
    'Ｌ級西ガ準': 'L級ガールズ西日本準決勝',
    'Ｌ級東ガ準': 'L級ガールズ東日本準決勝',
    'Ｌ級西ガ予': 'L級ガールズ西日本予選',
    'Ｌ級東ガ予': 'L級ガールズ東日本予選',
    'Ｌ級Ｇコレ': 'L級ガールズコレクション',
    'ＤＳ': 'S級ダイナミックステージ',
    'ＷＳ': 'S級ワンダーステージ',
    'ＳＰＲ': 'S級スーパープロピストレーサー賞',
};
