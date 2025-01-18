/**
 * 地方競馬ライブのURL
 */
export const CHIHO_KEIBA_LIVE_URL = 'http://keiba-lv-st.jp/';

/**
 * YoutubeのライブURLを取得する
 * @param userId
 * @returns
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
