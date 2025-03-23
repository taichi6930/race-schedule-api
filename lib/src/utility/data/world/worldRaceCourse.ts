import { z } from 'zod';

/**
 * WorldRaceCourseのzod型定義
 */
export const WorldRaceCourseSchema = z.string().refine((value) => {
    return WorldRaceCourseList.has(value);
}, '海外競馬場ではありません');

/**
 * WorldRaceCourseの型定義
 */
export type WorldRaceCourse = z.infer<typeof WorldRaceCourseSchema>;

/**
 * 海外競馬場 リスト
 */
const WorldRaceCourseList = new Set([
    'ロンシャン',
    'パリロンシャン',
    'シャンティイ',
    'サンクルー',
    'ドーヴィル',
    'アスコット',
    'ニューマーケット',
    'ニューベリー',
    'エプソム',
    'グッドウッド',
    'サンダウン',
    'ヨーク',
    'ヘイドック',
    'ドンカスター',
    'レパーズタウン',
    'カラ',
    'ガルフストリームパーク',
    'サンタアニタパーク',
    'チャーチルダウンズ',
    'ピムリコ',
    'サラトガ',
    'アケダクト',
    'モンマスパーク',
    'ベルモントパーク',
    'コロニアルダウンズ',
    'デルマー',
    'パークスレーシング',
    'キーンランド',
    'オークローンパーク',
    'ミュンヘン',
    'ホッペガルテン',
    'バーデンバーデン',
    'シャティン',
    'キングアブドゥルアジーズ',
    'メイダン',
    'ランドウィック',
    'コーフィールド',
    'フレミントン',
    'メルボルン',
    'ムーニーバレー',
    'ローズヒルガーデンズ',
]);

/**
 * 海外の競馬場のレース場名とコードの対応表
 */
export const WorldPlaceCodeMap: Record<string, string> = {
    ロンシャン: 'longchamp',
    パリロンシャン: 'longchamp',
    シャンティイ: 'chantilly',
    サンクルー: 'saintcloud',
    ドーヴィル: 'deauville',
    アスコット: 'ascot',
    ニューマーケット: 'newmarket',
    ニューベリー: 'newbury',
    エプソム: 'epsom',
    グッドウッド: 'goodwood',
    サンダウン: 'sandown',
    ヨーク: 'york',
    ヘイドック: 'haydock',
    ドンカスター: 'doncaster',
    レパーズタウン: 'leopardstown',
    カラ: 'curragh',
    ガルフストリームパーク: 'gulfstreampark',
    サンタアニタパーク: 'santaanitapark',
    チャーチルダウンズ: 'churchill-downs',
    ピムリコ: 'pimlico',
    サラトガ: 'saratoga',
    アケダクト: 'aqueduct',
    モンマスパーク: 'monmouthpark',
    ベルモントパーク: 'belmontpark',
    コロニアルダウンズ: 'colonial-downs',
    デルマー: 'delmar',
    パークスレーシング: 'parxracing',
    キーンランド: 'keeneland',
    オークローンパーク: 'oaklawnpark',
    ミュンヘン: 'munich',
    ホッペガルテン: 'hoppegarten',
    バーデンバーデン: 'badenbaden',
    シャティン: 'shatin',
    キングアブドゥルアジーズ: 'king-abdulaziz',
    メイダン: 'meydan',
    ランドウィック: 'randwick',
    コーフィールド: 'caulfield',
    フレミントン: 'flemington',
    メルボルン: 'melbourne',
    ムーニーバレー: 'mooneevalley',
    ローズヒルガーデンズ: 'rosehill-gardens',
};

/**
 * 開催海外競馬場のバリデーション
 */
export const validateWorldRaceCourse = (course: string): WorldRaceCourse =>
    WorldRaceCourseSchema.parse(course);
