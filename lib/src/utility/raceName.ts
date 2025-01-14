/* eslint-disable */

import { JraGradeType } from './data/jra/jraGradeType';
import { JraRaceCourse } from './data/jra/jraRaceCourse';
import { JraRaceCourseType } from './data/jra/jraRaceCourseType';
import { JraRaceDistance } from './data/jra/jraRaceDistance';
import { NarGradeType } from './data/nar/narGradeType';
import { NarRaceCourse } from './data/nar/narRaceCourse';
import { NarRaceCourseType } from './data/nar/narRaceCourseType';
import { NarRaceDateTime } from './data/nar/narRaceDateTime';
import { NarRaceDistance } from './data/nar/narRaceDistance';
import { NarRaceName } from './data/nar/narRaceName';
import { WorldGradeType } from './data/world/worldGradeType';
import { WorldRaceCourse } from './data/world/worldRaceCourse';
import { WorldRaceCourseType } from './data/world/worldRaceCourseType';
import { WorldRaceDistance } from './data/world/worldRaceDistance';

type JraRaceDataForRaceName = {
    name: string;
    place: JraRaceCourse;
    grade: JraGradeType;
    date: Date;
    surfaceType: JraRaceCourseType;
    distance: JraRaceDistance;
};

export const processJraRaceName = (
    raceInfo: JraRaceDataForRaceName,
): string => {
    if (isHanshinJuvenileFillies(raceInfo)) {
        return '阪神JF';
    }
    if (isAsahiHaiFuturityStakes(raceInfo)) {
        return '朝日杯FS';
    }
    if (isMileChampionship(raceInfo)) {
        return 'マイルCS';
    }
    if (isAmericanJockeyClubCup(raceInfo)) {
        return 'AJCC';
    }
    if (isFuchuHimbaStakes(raceInfo)) {
        return '府中牝馬S';
    }
    if (isIbisSummerDash(raceInfo)) {
        return 'アイビスサマーD';
    }
    if (isKeiseiHaiAutumnHandicap(raceInfo)) {
        return '京成杯オータムH';
    }
    if (isSaudiArabiaRoyalCup(raceInfo)) {
        return 'サウジアラビアRC';
    }
    if (isLumiereAutumnDash(raceInfo)) {
        return 'ルミエールオータムD';
    }
    return raceInfo.name;
};

/**
 * レース情報から、このレースは阪神JFかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isHanshinJuvenileFillies = (raceInfo: JraRaceDataForRaceName): boolean =>
    raceInfo.place === '阪神' &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1, 12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('阪神') &&
    raceInfo.name.includes('ジュベナイル');

/**
 * レース情報このレース朝日杯FSかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isAsahiHaiFuturityStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '阪神'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('朝日') &&
    raceInfo.name.includes('フュー');

/**
 * レース情報から、このレースはマイルCSかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isMileChampionship = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['阪神', '京都'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('マイル');

/**
 * レース情報から、このレースはAJCCかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isAmericanJockeyClubCup = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '東京'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅡ' &&
    [1 - 1, 2 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('アメリカ') &&
    (raceInfo.name.includes('J') || raceInfo.name.includes('ジョッキー')) &&
    (raceInfo.name.includes('C') || raceInfo.name.includes('クラブ'));

/**
 * レース情報から、このレースは府中牝馬Sかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isFuchuHimbaStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '東京'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅡ' &&
    [10 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('府中牝馬');

/**
 * レース情報から、このレースはアイビスサマーDかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isIbisSummerDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('アイビス') &&
    raceInfo.distance === 1000;

/**
 * レース情報から、このレースは京成杯オータムHかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isKeiseiHaiAutumnHandicap = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    [9 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('京成杯') &&
    raceInfo.distance === 1600;

/**
 * レース情報から、このレースはサウジアラビアRCかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isSaudiArabiaRoyalCup = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['東京'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    [10 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('サウジ') &&
    raceInfo.distance === 1600;

/**
 * レース情報から、このレースはルミエールオータムDかどうかを判定する
 *
 * @param JraWebRaceInfoEntity raceInfo
 * @returns {boolean}
 */
const isLumiereAutumnDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'Listed' &&
    [10 - 1, 11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('ルミエール') &&
    raceInfo.distance === 1000;

type NarRaceDataForRaceName = {
    name: NarRaceName;
    place: NarRaceCourse;
    grade: NarGradeType;
    date: NarRaceDateTime;
    surfaceType: NarRaceCourseType;
    distance: NarRaceDistance;
};
export const processNarRaceName = (
    raceInfo: NarRaceDataForRaceName,
): string => {
    // 共通系
    let newRaceName = raceInfo.name
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/[！-～]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/J(認|交|指) /g, '')
        .replace(/　/g, ' ');
    // 帯広競馬
    if (['帯広ば'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-5])?(?:・)?(?:[3-5])?(?:歳)?(?:以上)?(?:牡馬|牝馬)?(オープ(?:ン)?|選抜).*/,
                '',
            )
            .replace(
                /.*ヤングチャンピオンシップ.*/,
                'ヤングチャンピオンシップ',
            );
    }
    // 門別競馬
    if (['門別'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳)?(?:一般)?(?:牝馬)?(オー(?:プ(?:ン)?)?)$/,
                '',
            )
            .replace(
                /.*ブリーダーズゴールドジュニア.*/,
                'ブリーダーズゴールドジュニアC',
            )
            .replace(/〔準重賞〕.*/, '');
    }
    // 岩手競馬
    if (['水沢', '盛岡'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/(オープン|([2-3])歳)(?:牝馬)?.*/, '')
            .replace(/.*岩手県知事杯ORO.*/, '岩手県知事杯OROカップ')
            .replace(/.*南部杯.*/, 'MCS南部杯')
            .replace(/.*スプリング.*/, 'スプリングC（岩手）');
    }
    // 浦和、船橋競馬
    if (['浦和', '船橋'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/3歳未格選抜馬/, '')
            .replace(/([2-4])(?:歳|上)?(?:牝馬)?(オープン).*/, '')
            .replace(/(A2|B1).*/, '')
            .replace(/オープン4上$/, 'オープン');
    }
    // 川崎競馬
    if (['川崎'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/【地方交流3歳/, '')
            .replace(/([2-4])(?:歳|上)?(?:牝馬)?(?:1)?(オープン).*/, '')
            .replace(/\【(国際|指定|地方|JRA・地方)交(?:流\】).*/g, '')
            .replace(/ホクト.*/g, '')
            .replace(/(A2|2歳1).*/, '')
            .replace(/4歳上*/g, '');
    }
    // 大井競馬
    if (['大井'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳|上)?(選定馬|(?:牝馬)?(オー(?:プ(?:ン)?)?)).*/,
                '',
            )
            .replace(/.*ゴールドジュニア.*/, 'ゴールドジュニア（大井）')
            .replace(/メイカA2B1/, 'メイC');
    }
    // 金沢競馬
    if (['金沢'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                '/(移転50周年記念金沢ファ).*/',
                '移転50周年記念金沢ファンセレクトC',
            )
            .replace(
                /(\【|((?:[2-4])?歳(?:以上)?(?:牝馬)?(?:オープン)?)).*/,
                '',
            )
            .replace(/((A|B1)級|A1二A2)$/, '');
    }
    // 名古屋競馬
    if (['名古屋'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/(?:[2-3])?(?:歳)?(?:牝馬)?(オープン).*/, '')
            .replace(/.*スプリング.*/, 'スプリングC（名古屋）')
            .replace(/.*尾張名古屋杯.*/, '尾張名古屋杯')
            .replace(/.*あすなろ杯.*/, 'あすなろ杯')
            .replace(/.*ネクストスター.*/, 'ネクストスター名古屋')
            .replace(/(B(?:C)?)$/, '');
    }
    // 笠松競馬
    if (['笠松'].includes(raceInfo.place)) {
        if (newRaceName.includes('ゴールドジュニア')) {
            newRaceName = 'ゴールドジュニア（笠松）';
        }
        if (newRaceName.includes('東海ゴールド')) {
            newRaceName = '東海ゴールドC';
        }
        // それ以外の場合は不要な部分を削除
        newRaceName = newRaceName.replace(
            /(オープン|([2-4])歳)(?:以上)?(?:牡馬|牝馬|牡牝)?(?:・)?(オープン).*/,
            '',
        );
    }
    // 園田、姫路競馬
    if (['園田', '姫路'].includes(raceInfo.place)) {
        newRaceName = newRaceName.replace(/([2-4])歳(?:以上)?(?:牝馬)?.*/, '');
    }
    // 高知競馬
    if (['高知'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(/([2-4])(?:歳)?(?:以上)?(?:牝馬)?.*/, '')
            .replace(/((B|C)級以下)$/, '');
    }
    // 佐賀競馬
    if (['佐賀'].includes(raceInfo.place)) {
        newRaceName = newRaceName
            .replace(
                /(?:[2-4])?(?:歳)?(?:牝馬)?(九州産|オー(?:プ(?:ン)?)?)$/,
                '',
            )
            .replace(/(A1・B)$/, '')
            .replace(/(A1(?:・A2)?|B|3歳|2歳)$/, '');
    }
    return newRaceName;
};

type WorldRaceDataForRaceName = {
    name: string;
    place: WorldRaceCourse;
    grade: WorldGradeType;
    date: Date;
    surfaceType: WorldRaceCourseType;
    distance: WorldRaceDistance;
};

export const processWorldRaceName = (
    raceInfo: WorldRaceDataForRaceName,
): string => {
    return raceInfo.name
        .replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
        })
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/サラ系/, '')
        .replace('（L）', '')
        .replace('(L)', '')
        .replace('()', '')
        .replace(/ブリーダーズC/, 'BC')
        .replace(/ハンデキャップ/, 'H');
};
