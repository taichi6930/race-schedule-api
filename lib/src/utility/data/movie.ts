import type { RaceCourse } from './base';

/**
 * YoutubeのライブURLを取得する
 * @param userId - YoutubeのユーザーアカウントのユーザーID
 * @returns 指定したYoutubeユーザーのライブ配信URL
 */
export const getYoutubeLiveUrl = (userId: string): string =>
    `https://www.youtube.com/@${userId}/stream`;

/**
 * 地方競馬のYoutubeのユーザーID
 */
export const ChihoKeibaYoutubeUserIdMap: Record<string, string> = {
    門別: 'live2820',
    帯広ば: 'ばんえい十勝公式',
    水沢: 'IwateKeibaITV',
    盛岡: 'IwateKeibaITV',
    浦和: '浦和競馬公式',
    大井: 'tckkeiba',
    船橋: 'funabashi-keiba',
    川崎: '公式川崎競馬',
    金沢: '金沢競馬公式チャンネル',
    笠松: '笠松けいばレース映像配信チャ',
    名古屋: '金シャチけいば情報',
    園田: 'sonodahimejiweb',
    姫路: 'sonodahimejiweb',
    高知: 'KeibaOrJp',
    佐賀: 'sagakeibaofficial',
};

/**
 * 競輪のYoutubeのユーザーIDを取得する
 * @param placeName
 * @returns YoutubeのライブURL
 */
export const KeirinYoutubeUserIdMap: Record<RaceCourse, string> = {
    函館: 'rinrin-hakodate-Keirin',
    青森: 'もりんちゃんねる葵萌輪',
    いわき平: 'iwakitairakeirin',
    弥彦: 'yahiko0256',
    前橋: '前橋競輪場',
    取手: 'torideBank',
    宇都宮: 'UTSUNOMIYA500KEIRIN',
    大宮: 'omiyakeirin',
    西武園: 'seibuenkeirin',
    京王閣: 'tokyokeiokaku',
    立川: '立川ライブ中継',
    松戸: '松戸けいりん',
    千葉: 'pist6shorts430',
    川崎: '川崎競輪場公式',
    平塚: 'shonanbank400',
    小田原: '小田原競輪解説チャンネル',
    伊東: 'itokeirin',
    静岡: 'shizuokakeirin',
    名古屋: '758keirin',
    岐阜: '岐阜けいりん',
    大垣: 'ogakikeirin',
    豊橋: '競輪場豊橋',
    富山: 'toyamakeirin',
    松阪: 'matsusaka_keirin_LIVE',
    四日市: 'keirinyokkaichi104',
    福井: 'fukuikeirin',
    奈良: 'narakeirin',
    向日町: 'tube6082',
    和歌山: 'wakayamakeirin',
    岸和田: 'chalionkun',
    玉野: 'LIVE-zr9mi',
    広島: 'ひろしまけいりんぴーすけチャンネル-n8u',
    防府: '防府けいりん',
    高松: 'takamatsu-keirin',
    小松島: 'ponstarkomatsushima',
    高知: '高知競輪ちゃんねる公式',
    松山: '松山競輪',
    小倉: 'kokurakeirin',
    久留米: '久留米けいりんチャンネル公式',
    武雄: '武雄競輪-t9x',
    佐世保: '公式_佐世保競輪',
    別府: 'beppukeirin136',
    熊本: 'kumamotokeirin87',
};
