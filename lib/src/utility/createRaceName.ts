import './format';

import type { GradeType } from './data/common/gradeType';
import type { RaceCourse } from './data/common/raceCourse';
import type { RaceCourseType } from './data/common/raceCourseType';
import type { RaceDateTime } from './data/common/raceDateTime';
import type { RaceDistance } from './data/common/raceDistance';
import type { RaceName } from './data/common/raceName';

interface JraRaceDataForRaceName {
    name: RaceName;
    place: RaceCourse;
    grade: GradeType;
    date: RaceDateTime;
    surfaceType: RaceCourseType;
    distance: RaceDistance;
}

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


const isHanshinJuvenileFillies = (raceInfo: JraRaceDataForRaceName): boolean =>
    raceInfo.place === '阪神' &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1, 12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('阪神') &&
    raceInfo.name.includes('ジュベナイル');


const isAsahiHaiFuturityStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '阪神'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [12 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.name.includes('朝日') &&
    raceInfo.name.includes('フュー');


const isMileChampionship = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['阪神', '京都'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅠ' &&
    [11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('マイル');


const isAmericanJockeyClubCup = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '東京'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅡ' &&
    [1 - 1, 2 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('アメリカ') &&
    (raceInfo.name.includes('J') || raceInfo.name.includes('ジョッキー')) &&
    (raceInfo.name.includes('C') || raceInfo.name.includes('クラブ'));


const isFuchuHimbaStakes = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山', '東京'].includes(raceInfo.place) &&
    ['GⅡ', 'GⅢ'].includes(raceInfo.grade) &&
    [6 - 1, 10 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('府中牝馬');


const isIbisSummerDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('アイビス') &&
    raceInfo.distance === 1000;


const isKeiseiHaiAutumnHandicap = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['中山'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    [9 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('京成杯') &&
    raceInfo.distance === 1600;


const isSaudiArabiaRoyalCup = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['東京'].includes(raceInfo.place) &&
    raceInfo.grade === 'GⅢ' &&
    [10 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('サウジ') &&
    raceInfo.distance === 1600;


const isLumiereAutumnDash = (raceInfo: JraRaceDataForRaceName): boolean =>
    ['新潟'].includes(raceInfo.place) &&
    raceInfo.grade === 'Listed' &&
    [10 - 1, 11 - 1].includes(raceInfo.date.getMonth()) &&
    raceInfo.surfaceType === '芝' &&
    raceInfo.name.includes('ルミエール') &&
    raceInfo.distance === 1000;

interface NarRaceDataForRaceName {
    name: RaceName;
    place: RaceCourse;
    grade: GradeType;
    date: RaceDateTime;
    surfaceType: RaceCourseType;
    distance: RaceDistance;
}
export const processNarRaceName = (
    raceInfo: NarRaceDataForRaceName,
): string => {
    
    let tempRaceName = raceInfo.name
        .replaceFromCodePoint(/[０-９Ａ-Ｚａ-ｚ]/g)
        .replaceFromCodePoint(/[！-～]/g)
        .replace(/ステークス/, 'S')
        .replace(/カップ/, 'C')
        .replace(/J([交指認]) /g, '')
        .replace(/\u3000/g, ' ');
    
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
    
    if (['門別'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[2-4]?歳?(?:一般)?(?:牝馬)?(オー(?:プン?)?)$/, '')
            .replace(
                /.*ブリーダーズゴールドジュニア.*/,
                'ブリーダーズゴールドジュニアC',
            )
            .replace(/〔準重賞〕.*/, '');
    }
    
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
    
    if (['浦和', '船橋'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/3歳未格選抜馬/, '')
            .replace(/([2-4])[上歳]?(?:牝馬)?(オープン).*/, '')
            .replace(/(A2|B1).*/, '')
            .replace(/オープン4上$/, 'オープン');
    }
    
    if (['川崎'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/【地方交流3歳/, '')
            .replace(/([2-4])[上歳]?(?:牝馬)?1?(オープン).*/, '')
            .replace(/【(国際|指定|地方|JRA・地方)交流】.*/g, '')
            .replace(/ホクト.*/g, '')
            .replace(/(A2|2歳1).*/, '')
            .replace(/4歳上*/g, '');
    }
    
    if (['大井'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[2-4]?[上歳]?(選定馬|(?:牝馬)?(オー(?:プン?)?)).*/, '')
            .replace(/.*ゴールドジュニア.*/, 'ゴールドジュニア（大井）')
            .replace(/メイカA2B1/, 'メイC');
    }
    
    if (['金沢'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(
                '/(移転50周年記念金沢ファ).*/',
                '移転50周年記念金沢ファンセレクトC',
            )
            .replace(/(【|([2-4]?歳(?:以上)?(?:牝馬)?(?:オープン)?)).*/, '')
            .replace(/((A|B1)級|A1二A2)$/, '');
    }
    
    if (['名古屋'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/[23]?歳?(?:牝馬)?(オープン).*/, '')
            .replace(/.*スプリング.*/, 'スプリングC（名古屋）')
            .replace(/.*尾張名古屋杯.*/, '尾張名古屋杯')
            .replace(/.*あすなろ杯.*/, 'あすなろ杯')
            .replace(/.*ネクストスター.*/, 'ネクストスター名古屋')
            .replace(/(BC?)$/, '');
    }
    
    if (['笠松'].includes(raceInfo.place)) {
        if (tempRaceName.includes('ゴールドジュニア')) {
            tempRaceName = 'ゴールドジュニア（笠松）';
        }
        if (tempRaceName.includes('東海ゴールド')) {
            tempRaceName = '東海ゴールドC';
        }
        
        tempRaceName = tempRaceName.replace(
            /(オープン|([2-4])歳)(?:以上)?(?:牡馬|牝馬|牡牝)?・?(オープン).*/,
            '',
        );
    }
    
    if (['園田', '姫路'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName.replace(
            /([2-4])歳(?:以上)?(?:牝馬)?.*/,
            '',
        );
    }
    
    if (['高知'].includes(raceInfo.place)) {
        tempRaceName = tempRaceName
            .replace(/([2-4])歳?(?:以上)?(?:牝馬)?.*/, '')
            .replace(/((B|C)級以下)$/, '');
    }
    
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
    surfaceType: RaceCourseType;
    distance: RaceDistance;
}

export const processOverseasRaceName = (
    raceInfo: OverseasRaceDataForRaceName,
): string => {
    return raceInfo.name
        .replaceFromCodePoint(
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
