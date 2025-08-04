import { z } from 'zod';

import { RaceType } from '../../raceType';
import { BoatraceRaceStageSchema } from '../boatrace/boatraceRaceStage';
import type { GradeType } from './gradeType';

/**
 * 指定グレード・ステージリスト
 */
export const RaceGradeAndStageList: {
    grade: GradeType[];
    stage: RaceStage;
    stageByWebSite: string[];
    raceType: RaceType;
    priority: number;
    description: string;
}[] = [
    {
        grade: ['GP'],
        stage: 'S級グランプリ',
        stageByWebSite: ['Ｓ級ＧＰ'],
        raceType: RaceType.KEIRIN,
        priority: 10,
        description:
            '競輪の最高峰レース。SS級選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GP'],
        stage: 'L級ガールズグランプリ',
        stageByWebSite: ['Ｌ級ＧＧＰ'],
        raceType: RaceType.KEIRIN,
        priority: 10,
        description:
            '女子競輪の最高峰レース。L級ガールズ選手が集結し、年間の頂点を決める。',
    },
    {
        grade: ['GⅡ'],
        stage: 'SA混合ヤンググランプリ',
        stageByWebSite: ['ＳＡ混合ＹＧＰ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅡレースの若手のグランプリ。若手選手が集結し、将来を担う選手を発掘するレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級決勝',
        stageByWebSite: ['Ｓ級決勝'],
        raceType: RaceType.KEIRIN,
        priority: 9,
        description:
            'GⅠの最終日に行われる決勝レース。優勝すると、その年のグランプリ出場権を得る。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級準決勝',
        stageByWebSite: ['Ｓ級準決勝', 'Ｓ級西準決', 'Ｓ級東準決'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description: 'GⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級準々決勝',
        stageByWebSite: ['Ｓ級準々決', 'Ｓ級準々Ａ', 'Ｓ級準々Ｂ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description: 'GⅠの準々決勝レース。準決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級初日特別選抜',
        stageByWebSite: ['Ｓ級初特選'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠの初日特別選抜レース。2次予選のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級特別選抜予選',
        stageByWebSite: ['Ｓ級特選予', 'Ｓ級西特選', 'Ｓ級東特選'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ初日の特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ゴールデンレーサー賞',
        stageByWebSite: ['Ｓ級ＧＤＲ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ダイヤモンドレース',
        stageByWebSite: ['Ｓ級ＤＭＤ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ競輪祭の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ドリームレース',
        stageByWebSite: ['Ｓ級ＤＲＭ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。ファン投票で選ばれたトップ9選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級オリオン賞',
        stageByWebSite: ['Ｓ級ＯＲＩ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。ファン投票で選ばれたトップ選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級シャイニングスター賞',
        stageByWebSite: ['Ｓ級シャイ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠオールスター競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級スタールビー賞',
        stageByWebSite: ['Ｓ級ＳＴＲ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ全日本選抜競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級白虎賞',
        stageByWebSite: ['Ｓ級白虎賞'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ高松宮記念杯競輪の西日本のシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級青龍賞',
        stageByWebSite: ['Ｓ級青龍賞'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ高松宮記念杯競輪の東日本のシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級日本競輪選手会理事長杯',
        stageByWebSite: ['Ｓ級日競杯'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ寬仁親王牌の初日特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級ローズカップ',
        stageByWebSite: ['Ｓ級ローズ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠ寬仁親王杯競輪の特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ティアラカップ',
        stageByWebSite: ['Ｌ級ティア'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠオールガールズクラシックの特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ決勝',
        stageByWebSite: ['Ｌ級ガ決勝'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅠガールズ競輪の最終日に行われる決勝レース。優勝すると、その年のガールズグランプリ出場権を得る。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ準決勝',
        stageByWebSite: ['Ｌ級ガ準決', 'Ｌ級西ガ準', 'Ｌ級東ガ準'],
        raceType: RaceType.KEIRIN,
        priority: 7,
        description:
            'ガールズ競輪の準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズドリームレース',
        stageByWebSite: ['Ｌ級ＤＲＭ'],
        raceType: RaceType.KEIRIN,
        priority: 7,
        description:
            'オールスター女子競輪の特別なレース。ファン投票で選ばれたトップ選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズアルテミス賞',
        stageByWebSite: ['Ｌ級ＡＲＴ'],
        raceType: RaceType.KEIRIN,
        priority: 6,
        description: 'オールスター女子競輪の特別なレース。',
    },
    {
        grade: ['GⅠ', 'FⅡ'],
        stage: 'L級ガールズコレクション',
        stageByWebSite: ['Ｌ級Ｇコレ'],
        raceType: RaceType.KEIRIN,
        priority: 6,
        description: 'ガールズ競輪の特別なレース。',
    },
    {
        grade: ['GⅠ'],
        stage: 'L級ガールズ予選',
        stageByWebSite: ['Ｌ級ガ予選'],
        raceType: RaceType.KEIRIN,
        priority: 4,
        description:
            'ガールズ競輪の予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級二次予選',
        stageByWebSite: ['Ｓ級二予戦', 'Ｓ級二予', 'Ｓ級東二予', 'Ｓ級西二予'],
        raceType: RaceType.KEIRIN,
        priority: 4,
        description:
            'GⅠの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅠ'],
        stage: 'S級一次予選',
        stageByWebSite: [
            'Ｓ級一予戦',
            'Ｓ級一予',
            'S級一予1',
            'Ｓ級一予2',
            'Ｓ級西予[１２]',
            'Ｓ級東予[１２]',
        ],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description:
            'GⅠの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級決勝',
        stageByWebSite: ['Ｓ級決勝'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅡの最終日に行われる決勝レース。高額賞金が用意され、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級準決勝',
        stageByWebSite: ['Ｓ級準決勝'],
        raceType: RaceType.KEIRIN,
        priority: 7,
        description: 'GⅡの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級毘沙門天賞',
        stageByWebSite: ['Ｓ級毘沙門'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅡウィナーズカップのシードレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級アルタイル賞',
        stageByWebSite: ['Ｓ級ＡＬＴ'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅡレース・サマーナイトフェスティバルの2日目に行われるレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級二次予選',
        stageByWebSite: ['Ｓ級二予戦', 'Ｓ級二予'],
        raceType: RaceType.KEIRIN,
        priority: 4,
        description:
            'GⅡの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級一次予選',
        stageByWebSite: ['Ｓ級一予戦', 'Ｓ級一予', 'S級一予1', 'Ｓ級一予2'],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description:
            'GⅡの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅡ'],
        stage: 'S級特別選抜予選',
        stageByWebSite: ['Ｓ級特選予'],
        raceType: RaceType.KEIRIN,
        priority: 7,
        description:
            'GⅡ初日の特別選抜予選レース。特別な選手たちが出場し、2日目のシードレースを決定する重要なレース。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級決勝',
        stageByWebSite: ['Ｓ級決勝'],
        raceType: RaceType.KEIRIN,
        priority: 8,
        description:
            'GⅢの最終日に行われる決勝レース。そこそこ賞金が高く、競輪の中でも重要なレースの一つ。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級準決勝',
        stageByWebSite: ['Ｓ級準決勝'],
        raceType: RaceType.KEIRIN,
        priority: 5,
        description: 'GⅢの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級二次予選',
        stageByWebSite: ['Ｓ級二予戦', 'Ｓ級二予'],
        raceType: RaceType.KEIRIN,
        priority: 3,
        description:
            'GⅢの二次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級一次予選',
        stageByWebSite: ['Ｓ級一予戦', 'Ｓ級一予'],
        raceType: RaceType.KEIRIN,
        priority: 1,
        description:
            'GⅢの一次予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅢ'],
        stage: 'S級初日特別選抜',
        stageByWebSite: ['Ｓ級初特選'],
        raceType: RaceType.KEIRIN,
        priority: 6,
        description:
            'GⅢの初日特別選抜レース。2次予選のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級順位決定',
        stageByWebSite: ['Ｓ級順位決'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '順位決定レース。負け戦。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級特別優秀',
        stageByWebSite: ['Ｓ級特秀'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '特別優秀レース。負け戦。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級優秀',
        stageByWebSite: ['Ｓ級優秀'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '優秀レース。負け戦。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級特選',
        stageByWebSite: ['Ｓ級特選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '特選レース。負け戦。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級選抜',
        stageByWebSite: ['Ｓ級選抜'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '選抜レース。負け戦',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級特一般',
        stageByWebSite: ['Ｓ級特一般'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '特一般レース。負け戦。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級特一般',
        stageByWebSite: ['Ｓ級特一般'],
        raceType: RaceType.KEIRIN,
        priority: 5,
        description:
            'FⅠの特別なレース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級優秀',
        stageByWebSite: ['Ｓ級優秀'],
        raceType: RaceType.KEIRIN,
        priority: 6,
        description:
            'FⅠの優秀レース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['GⅠ', 'GⅡ', 'GⅢ', 'FⅠ'],
        stage: 'S級一般',
        stageByWebSite: ['Ｓ級一般'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '一般レース。負け戦。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級決勝',
        stageByWebSite: ['Ｓ級決勝'],
        raceType: RaceType.KEIRIN,
        priority: 4,
        description:
            'FⅠの最終日に行われる決勝レース。ウィナーズカップの出場権に近づく。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級準決勝',
        stageByWebSite: ['Ｓ級準決勝'],
        raceType: RaceType.KEIRIN,
        priority: 3,
        description: 'FⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級予選',
        stageByWebSite: ['Ｓ級予選'],
        raceType: RaceType.KEIRIN,
        priority: 1,
        description: 'FⅠの予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['FⅠ'],
        stage: 'S級初日特別選抜',
        stageByWebSite: ['Ｓ級初特選'],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description:
            'FⅠの初日特別選抜レース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級スーパープロピストレーサー賞',
        stageByWebSite: ['ＳＰＲ'],
        raceType: RaceType.KEIRIN,
        priority: 7,
        description: '全プロ競輪の特別なレース。最終日のメインレース。',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級ダイナミックステージ',
        stageByWebSite: ['ＤＳ'],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description: '全プロ競輪の特別なレース。',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級ワンダーステージ',
        stageByWebSite: ['ＷＳ'],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description: '全プロ競輪の特別なレース。',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級特別優秀',
        stageByWebSite: ['Ｓ級特秀'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '全プロ競輪の特別優秀レース',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級特選',
        stageByWebSite: ['Ｓ級特選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '全プロ競輪の特選レース',
    },
    {
        grade: ['FⅡ'],
        stage: 'S級選抜',
        stageByWebSite: ['Ｓ級選抜'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '全プロ競輪の選抜レース',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ決勝',
        stageByWebSite: ['Ｌ級ガ決勝'],
        raceType: RaceType.KEIRIN,
        priority: 2,
        description: 'ガールズ競輪の最終日に行われる決勝レース。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ準決勝',
        stageByWebSite: ['Ｌ級ガ準決'],
        raceType: RaceType.KEIRIN,
        priority: 1,
        description:
            'ガールズ競輪の準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ予選',
        stageByWebSite: ['Ｌ級ガ予選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description:
            'ガールズ競輪の予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ選抜',
        stageByWebSite: ['Ｌ級ガ選抜'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'ガールズ競輪の選抜レース。負け戦。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ特選',
        stageByWebSite: ['Ｌ級ガ特選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'ガールズ競輪の特選レース。負け戦。',
    },
    {
        grade: ['GⅢ', 'FⅠ', 'FⅡ'],
        stage: 'L級ガールズ一般',
        stageByWebSite: ['Ｌ級ガ一般'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'ガールズ競輪の一般レース。負け戦。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級特選',
        stageByWebSite: ['Ａ級特選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '特選レース。負け戦。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級選抜',
        stageByWebSite: ['Ａ級選抜'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '選抜レース。負け戦',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級一般',
        stageByWebSite: ['Ｓ級一般'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: '一般レース。負け戦。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級決勝',
        stageByWebSite: ['Ａ級決勝'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'FⅠの最終日に行われる決勝レース。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級準決勝',
        stageByWebSite: ['Ａ級準決勝'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'FⅠの準決勝レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級予選',
        stageByWebSite: ['Ａ級予選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description: 'FⅠの予選レース。選手たちが決勝進出を目指して競い合う。',
    },
    {
        grade: ['FⅠ', 'FⅡ'],
        stage: 'A級初日特別選抜',
        stageByWebSite: ['Ａ級初特選'],
        raceType: RaceType.KEIRIN,
        priority: 0,
        description:
            'FⅠの初日特別選抜レース。準決勝のシード選手が出場する特別なレース。',
    },
    {
        grade: ['SG'],
        stage: '優勝戦',
        stageByWebSite: ['優勝戦'],
        raceType: RaceType.AUTORACE,
        priority: 9,
        description: 'SGの最終日に行われる決勝レース。',
    },
    {
        grade: ['SG'],
        stage: '特別選抜戦',
        stageByWebSite: ['特別選抜戦'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの特別選抜レース。決勝進出を目指す重要なレース。',
    },
    {
        grade: ['SG'],
        stage: '選抜戦',
        stageByWebSite: ['選抜戦'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの選抜レース。',
    },
    {
        grade: ['SG'],
        stage: '特別一般戦',
        stageByWebSite: ['特別一般戦', '特別一般戦Ａ', '特別一般戦Ｂ'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの特別一般戦。',
    },
    {
        grade: ['SG'],
        stage: '一般戦',
        stageByWebSite: ['Ｇレース７一般戦', '一般戦'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの一般戦。',
    },
    {
        grade: ['SG'],
        stage: 'オーバル特別',
        stageByWebSite: ['オーバル特別'],
        raceType: RaceType.AUTORACE,
        priority: 9,
        description: 'SGのオーバル特別レース。',
    },
    {
        grade: ['SG'],
        stage: '予選',
        stageByWebSite: ['予選'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの予選レース。',
    },
    {
        grade: ['SG'],
        stage: '選抜予選',
        stageByWebSite: ['選抜予選'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの選抜予選レース。',
    },
    {
        grade: ['SG'],
        stage: '準決勝戦',
        stageByWebSite: ['準決勝戦', '準決勝戦Ａ', '準決勝戦Ｂ'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの準決勝戦。',
    },
    {
        grade: ['SG'],
        stage: '最終予選',
        stageByWebSite: ['最終予選'],
        raceType: RaceType.AUTORACE,
        priority: 0,
        description: 'SGの最終予選。',
    },
];

/**
 * ステージ のバリデーション
 * @param raceType
 * @param stage - ステージ
 * @returns - バリデーション済みのステージ
 */
export const validateRaceStage = (
    raceType: RaceType,
    stage: string,
): RaceStage => {
    switch (raceType) {
        case RaceType.KEIRIN: {
            return KeirinRaceStageSchema.parse(stage);
        }
        case RaceType.AUTORACE: {
            return AutoraceRaceStageSchema.parse(stage);
        }
        case RaceType.BOATRACE: {
            return BoatraceRaceStageSchema.parse(stage);
        }
        case RaceType.JRA:
        case RaceType.NAR:
        case RaceType.WORLD: {
            throw new Error(`Unsupported race type: ${raceType}`);
        }
        default: {
            throw new Error(`Unknown race type`);
        }
    }
};

/**
 * ステージ リスト
 * @param raceType
 */
const RaceStageList: (raceType: RaceType) => Set<string> = (raceType) =>
    new Set(
        RaceGradeAndStageList.filter((item) => item.raceType === raceType).map(
            (item) => item.stage,
        ),
    );

/**
 * HTML表記・oddspark表記の両方をカバーするステージ名マップ
 * @param raceType
 */
export const StageMap: (raceType: RaceType) => Record<string, RaceStage> = (
    raceType,
) =>
    Object.fromEntries(
        RaceGradeAndStageList.filter(
            (item) => item.raceType === raceType,
        ).flatMap((item) =>
            item.stageByWebSite.map((stageByOddspark) => [
                stageByOddspark,
                item.stage,
            ]),
        ),
    );

/**
 * KeirinRaceStageのzod型定義
 */
export const KeirinRaceStageSchema = z.string().refine((value) => {
    return RaceStageList(RaceType.KEIRIN).has(value);
}, '競輪のステージではありません');

/**
 * HTML表記・oddspark表記の両方をカバーする競輪ステージ名マップ
 */
export const KeirinStageMap: Record<string, RaceStage> = StageMap(
    RaceType.KEIRIN,
);

/**
 * AutoraceRaceStageのzod型定義
 */
export const AutoraceRaceStageSchema = z.string().refine((value) => {
    return RaceStageList(RaceType.AUTORACE).has(value);
}, 'オートレースのステージではありません');

/**
 * HTMLのステージ名を正式名称に変換するためのマップ
 */
export const AutoraceStageMap: Record<string, RaceStage> = StageMap(
    RaceType.AUTORACE,
);

/**
 * RaceStageのzod型定義
 */

export const RaceStageSchema = z.union([
    KeirinRaceStageSchema,
    AutoraceRaceStageSchema,
    BoatraceRaceStageSchema,
]);
/**
 * RaceStageの型定義
 */

export type RaceStage = z.infer<typeof RaceStageSchema>;
