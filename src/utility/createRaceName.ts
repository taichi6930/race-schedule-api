import type { RaceDateTime } from '../../packages/shared/src/types/raceDateTime';
import type { RaceDistance } from '../../packages/shared/src/types/raceDistance';
import type { RaceName } from '../../packages/shared/src/types/raceName';
import type { RaceSurfaceType } from '../../packages/shared/src/types/surfaceType';
import { replaceFromCodePoint } from '../../packages/shared/src/utilities/format';
import type { GradeType } from '../../packages/shared/src/utilities/gradeType';
import type { RaceCourse } from '../../packages/shared/src/utilities/raceCourse';

interface JraRaceDataForRaceName {
    name: RaceName;
    place: RaceCourse;
    grade: GradeType;
    date: RaceDateTime;
    surfaceType: RaceSurfaceType;
    distance: RaceDistance;
}

/**
 * レース情報から、このレースは阪神JFかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースが阪神JFである場合はtrue、そうでない場合はfalse
 */
const isHanshinJuvenileFillies = (raceInfo: JraRaceDataForRaceName): boolean =>
    raceInfo.place === '阪神' &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1, 12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('阪神') &&
    raceInfo.name.includes('ジュベナイル');

/**
 * レース情報から、このレース朝日杯FSかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースが朝日杯FSである場合はtrue、そうでない場合はfalse
 */
const isAsahiHaiFuturityStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '阪神'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('朝日') &&
    raceInfo.name.includes('フュー');

/**
 * レース情報から、このレースはマイルCSかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースがマイルCSである場合はtrue、そうでない場合はfalse
 */
const isMileChampionship = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['阪神', '京都'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('マイル');

/**
 * レース情報から、このレースはAJCCかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースがAJCCである場合はtrue、そうでない場合はfalse
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
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースが府中牝馬Sである場合はtrue、そうでない場合はfalse
 */
const isFuchuHimbaStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '東京'].includes(raceInfo.place) &&
    ['GⅡ', 'GⅢ'].includes(raceInfo.grade) &&
    [6 - 1, 10 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('府中牝馬');

/**
 * レース情報から、このレースはアイビスサマーDかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースがアイビスサマーDである場合はtrue、そうでない場合はfalse
 */
const isIbisSummerDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('アイビス') &&
    raceInfo.distance === 1000;

/**
 * レース情報から、このレースは京成杯オータムHかどうかを判定する
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースが京成杯オータムHである場合はtrue、そうでない場合はfalse
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
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースがサウジアラビアRCである場合はtrue、そうでない場合はfalse
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
 * @param JraWebRaceInfoEntity - raceInfo
 * @param raceInfo - レース情報
 * @returns {boolean} このレースがルミエールオータムDである場合はtrue、そうでない場合はfalse
 */
const isLumiereAutumnDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'Listed' &&
    [10 - 1, 11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('ルミエール') &&
    raceInfo.distance === 1000;

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

interface NarRaceDataForRaceName {
    name: RaceName;
    place: RaceCourse;
    grade: GradeType;
    date: RaceDateTime;
    surfaceType: RaceSurfaceType;
    distance: RaceDistance;
}

export const processNarRaceName = (
    raceInfo: NarRaceDataForRaceName,
): string => {
    // 共通系
    let tempRaceName = replaceFromCodePoint(
        replaceFromCodePoint(raceInfo.name, /[０-９Ａ-Ｚａ-ｚ]/g),
        /[！-～]/g,
    )
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/J([交指認]) /g, '')
        .replace(/\u3000/g, ' ');

    if (tempRaceName.includes('西日本3歳優駿')) {
        return '西日本3歳優駿';
    }
    if (tempRaceName.includes('西日本ダービー')) {
        return '西日本ダービー';
    }

    // 帯広競馬
    if (['帯広ば'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(
                /[2-5]?・?[3-5]?歳?(?:以上)?(?:牡馬|牝馬)?(オープン?|選抜).*/,
                '',
            )
            .replace(
                /.*ヤングチャンピオンシップ.*/,
                'ヤングチャンピオンシップ',
            );
    }
    // 門別競馬
    if (['門別'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[2-4]?歳?(?:一般)?(?:牝馬)?(オー(?:プン?)?)$/, '')
            .replace(
                /.*ブリーダーズゴールドジュニア.*/,
                'ブリーダーズゴールドジュニアC',
            )
            .replace(/〔準重賞〕.*/, '');
    }
    // 岩手競馬
    if (['水沢', '盛岡'].includes(raceInfo.place)) {
        if (tempRaceName == '2歳') {
            return `2歳`;
        }
        tempRaceName = tempRaceName
            .replace(/(オープン|([23])歳)(?:牝馬)?.*/, '')
            .replace(/.*岩手県知事杯ORO.*/, '岩手県知事杯OROカップ')
            .replace(/.*南部杯.*/, 'MCS南部杯')
            .replace(/.*スプリング.*/, 'スプリングC（岩手）');
    }
    // 浦和、船橋競馬
    if (['浦和', '船橋'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/3歳未格選抜馬/, '')
            .replace(/([2-4])[上歳]?(?:牝馬)?(オープン).*/, '')
            .replace(/(A2|B1).*/, '')
            .replace(/オープン4上$/, 'オープン');
    }
    // 川崎競馬
    if (['川崎'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/【地方交流3歳/, '')
            .replace(/([2-4])[上歳]?(?:牝馬)?1?(オープン).*/, '')
            .replace(/【(国際|指定|地方|JRA・地方)交流】.*/g, '')
            .replace(/ホクト.*/g, '')
            .replace(/(A2|2歳1).*/, '')
            .replace(/4歳上*/g, '');
    }
    // 大井競馬
    if (['大井'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[2-4]?[上歳]?(選定馬|(?:牝馬)?(オー(?:プン?)?)).*/, '')
            .replace(/.*ゴールドジュニア.*/, 'ゴールドジュニア（大井）')
            .replace(/メイカA2B1/, 'メイC');
    }
    // 金沢競馬
    if (['金沢'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(
                '/(移転50周年記念金沢ファ).*/',
                '移転50周年記念金沢ファンセレクトC',
            )
            .replace(/(【|([2-4]?歳(?:以上)?(?:牝馬)?(?:オープン)?)).*/, '')
            .replace(/((A|B1)級|A1二A2)$/, '');
    }
    // 名古屋競馬
    if (['名古屋'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[23]?歳?(?:牝馬)?(オープン).*/, '')
            .replace(/.*スプリング.*/, 'スプリングC（名古屋）')
            .replace(/.*尾張名古屋杯.*/, '尾張名古屋杯')
            .replace(/.*あすなろ杯.*/, 'あすなろ杯')
            .replace(/.*ネクストスター.*/, 'ネクストスター名古屋')
            .replace(/(BC?)$/, '');
    }
    // 笠松競馬
    if (['笠松'].includes(raceInfo.place)) {
        if (tempRaceName.includes('ゴールドジュニア')) {
            tempRaceName = 'ゴールドジュニア（笠松）';
        }
        if (tempRaceName.includes('東海ゴールド')) {
            tempRaceName = '東海ゴールドC';
        }
        // それ以外の場合は不要な部分を削除
        tempRaceName = tempRaceName.replace(
            /(オープン|([2-4])歳)(?:以上)?(?:牡馬|牝馬|牡牝)?・?(オープン).*/,
            '',
        );
    }
    // 園田、姫路競馬
    if (['園田', '姫路'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName.replace(
            /([2-4])歳(?:以上)?(?:牝馬)?.*/,
            '',
        );
    }
    // 高知競馬
    if (['高知'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/([2-4])歳?(?:以上)?(?:牝馬)?.*/, '')
            .replace(/((B|C)級以下)$/, '');
    }
    // 佐賀競馬
    if (['佐賀'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[2-4]?歳?(?:牝馬)?(九州産|オー(?:プン?)?)$/, '')
            .replace(/(A1・B)$/, '')
            .replace(/(A1(?:・A2)?|B|3歳|2歳)$/, '');
    }
    return tempRaceName;
};

interface OverseasRaceDataForRaceName {
    name: RaceName;
    location: RaceCourse;
    grade: GradeType;
    date: RaceDateTime;
    surfaceType: RaceSurfaceType;
    distance: RaceDistance;
}

export const processOverseasRaceName = (
    raceInfo: OverseasRaceDataForRaceName,
): string => {
    return replaceFromCodePoint(
        raceInfo.name,
        /[！-＃＄％＆（）＊＋，－．／０-９：；＜＝＞？＠Ａ-Ｚ［＼］＾＿｀ａ-ｚ｛｜｝～]/g,
    )
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/サラ系/, '')
        .replace('（L）', '')
        .replace('(L)', '')
        .replace('()', '')
        .replace(/ブリーダーズC/, 'BC')
        .replace(/ハンデキャップ/, 'H');
};
