import {
    processJraRaceName,
    processNarRaceName,
} from '../../../lib/src/utility/createRaceName';
describe('processJraRaceName', () => {
    it('should return 阪神JF for Hanshin Juvenile Fillies', () => {
        const raceInfo = {
            name: '阪神ジュベナイルフィリーズ',
            place: '阪神',
            grade: 'GⅠ',
            date: new Date('2023-12-10'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('阪神JF');
    });

    it('should return 朝日杯FS for Asahi Hai Futurity Stakes', () => {
        const raceInfo = {
            name: '朝日杯フューチュリティステークス',
            place: '阪神',
            grade: 'GⅠ',
            date: new Date('2023-12-17'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('朝日杯FS');
    });

    it('should return マイルCS for Mile Championship', () => {
        const raceInfo = {
            name: 'マイルチャンピオンシップ',
            place: '京都',
            grade: 'GⅠ',
            date: new Date('2023-11-19'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('マイルCS');
    });

    it('should return AJCC for American Jockey Club Cup', () => {
        const raceInfo = {
            name: 'アメリカジョッキークラブカップ',
            place: '中山',
            grade: 'GⅡ',
            date: new Date('2023-01-22'),
            surfaceType: '芝',
            distance: 2200,
        };
        expect(processJraRaceName(raceInfo)).toBe('AJCC');
    });

    it('should return 府中牝馬S for Fuchu Himba Stakes', () => {
        const raceInfo = {
            name: '府中牝馬ステークス',
            place: '東京',
            grade: 'GⅡ',
            date: new Date('2023-10-14'),
            surfaceType: '芝',
            distance: 1800,
        };
        expect(processJraRaceName(raceInfo)).toBe('府中牝馬S');
    });

    it('should return アイビスサマーD for Ibis Summer Dash', () => {
        const raceInfo = {
            name: 'アイビスサマーダッシュ',
            place: '新潟',
            grade: 'GⅢ',
            date: new Date('2023-07-30'),
            surfaceType: '芝',
            distance: 1000,
        };
        expect(processJraRaceName(raceInfo)).toBe('アイビスサマーD');
    });

    it('should return 京成杯オータムH for Keisei Hai Autumn Handicap', () => {
        const raceInfo = {
            name: '京成杯オータムハンデキャップ',
            place: '中山',
            grade: 'GⅢ',
            date: new Date('2023-09-10'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('京成杯オータムH');
    });

    it('should return サウジアラビアRC for Saudi Arabia Royal Cup', () => {
        const raceInfo = {
            name: 'サウジアラビアロイヤルカップ',
            place: '東京',
            grade: 'GⅢ',
            date: new Date('2023-10-07'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('サウジアラビアRC');
    });

    it('should return ルミエールオータムD for Lumiere Autumn Dash', () => {
        const raceInfo = {
            name: 'ルミエールオータムダッシュ',
            place: '新潟',
            grade: 'Listed',
            date: new Date('2023-10-29'),
            surfaceType: '芝',
            distance: 1000,
        };
        expect(processJraRaceName(raceInfo)).toBe('ルミエールオータムD');
    });

    it('should return the original name if no match is found', () => {
        const raceInfo = {
            name: 'その他のレース',
            place: '東京',
            grade: 'GⅢ',
            date: new Date('2023-10-07'),
            surfaceType: '芝',
            distance: 1600,
        };
        expect(processJraRaceName(raceInfo)).toBe('その他のレース');
    });
});

describe('processNarRaceName', () => {
    it('should process race name for 帯広ば', () => {
        const raceInfo = {
            name: '3歳以上オープン',
            place: '帯広ば',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('');
    });

    it('should process race name for 門別', () => {
        const raceInfo = {
            name: '2歳オープン',
            place: '門別',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('');
    });

    it('should process race name for 水沢', () => {
        const raceInfo = {
            name: '岩手県知事杯ＯＲＯカップ',
            place: '水沢',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('岩手県知事杯OROカップ');
    });

    it('should process race name for 浦和', () => {
        const raceInfo = {
            name: '3歳未格選抜馬',
            place: '浦和',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('');
    });

    it('should process race name for 川崎', () => {
        const raceInfo = {
            name: '川崎記念【地方交流】',
            place: '川崎',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('川崎記念');
    });

    it('should process race name for 大井', () => {
        const raceInfo = {
            name: 'ゴールドジュニア',
            place: '大井',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('ゴールドジュニア（大井）');
    });

    it('should process race name for 金沢', () => {
        const raceInfo = {
            name: '移転50周年記念金沢ファンセレクトC',
            place: '金沢',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe(
            '移転50周年記念金沢ファンセレクトC',
        );
    });

    it('should process race name for 名古屋', () => {
        const raceInfo = {
            name: 'スプリングC（名古屋）',
            place: '名古屋',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('スプリングC（名古屋）');
    });

    it('should process race name for 笠松', () => {
        const raceInfo = {
            name: 'ゴールドジュニア（笠松）',
            place: '笠松',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('ゴールドジュニア（笠松）');
    });

    it('should process race name for 笠松', () => {
        const raceInfo = {
            name: '東海ゴールドオープン',
            place: '笠松',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('東海ゴールドC');
    });

    it('should process race name for 園田', () => {
        const raceInfo = {
            name: '3歳以上牝馬',
            place: '園田',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('');
    });

    it('should process race name for 高知', () => {
        const raceInfo = {
            name: '3歳以上牝馬',
            place: '高知',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('');
    });

    it('should process race name for 佐賀', () => {
        const raceInfo = {
            name: '九州産グランプリオープン',
            place: '佐賀',
            grade: '地方重賞',
            date: new Date('2023-07-30'),
            surfaceType: 'ダート',
            distance: 2000,
        };
        expect(processNarRaceName(raceInfo)).toBe('九州産グランプリ');
    });
});
