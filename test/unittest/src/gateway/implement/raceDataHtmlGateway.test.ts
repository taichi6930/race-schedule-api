import { RaceDataHtmlGateway } from '../../../../../lib/src/gateway/implement/raceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { RaceType } from '../../../../../lib/src/utility/raceType';

describe('RaceDataHtmlGateway', () => {
    let gateway: IRaceDataHtmlGateway;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        gateway = new RaceDataHtmlGateway();

        // fetch をモックし、型定義を追加
        fetchMock = jest.fn();
        globalThis.fetch = fetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    for (const { descriptions, raceType, place, number, expectedUrl } of [
        {
            descriptions: 'JRAの開催レースデータ',
            raceType: RaceType.JRA,
            expectedUrl: `https://www.keibalab.jp/db/race/20241001/`,
        },
        {
            descriptions: 'NARの開催レースデータ',
            raceType: RaceType.NAR,
            place: '大井',
            expectedUrl: `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2024%2f10%2f01&k_babaCode=20`,
        },
        {
            descriptions: '海外競馬の開催レースデータ',
            raceType: RaceType.WORLD,
            expectedUrl: `https://world.jra-van.jp/schedule/?year=2024&month=10`,
        },
        {
            descriptions: '競輪の開催レースデータ',
            raceType: RaceType.KEIRIN,
            place: '弥彦',
            expectedUrl: `https://www.oddspark.com/keirin/AllRaceList.do?joCode=21&kaisaiBi=20241001`,
        },
        {
            descriptions: 'オートレースの開催レースデータ',
            raceType: RaceType.AUTORACE,
            place: '川口',
            expectedUrl: `https://www.oddspark.com/autorace/OneDayRaceList.do?raceDy=20241001&placeCd=02`,
        },
        {
            descriptions: 'ボートレースの開催レースデータ',
            raceType: RaceType.BOATRACE,
            place: '浜名湖',
            number: 1,
            expectedUrl: `https://www.boatrace.jp/owpc/pc/race/racelist?rno=1&hd=20241001&jcd=06`,
        },
    ]) {
        it(`正しいURLでfetchを呼び出し、${descriptions}のHTMLが取得されること`, async () => {
            const testDate = new Date('2024-10-01');
            const expectedHtml = '<html>Test HTML</html>';

            fetchMock.mockResolvedValue({
                text: jest.fn().mockResolvedValue(expectedHtml),
            });

            const html = await gateway.getRaceDataHtml(
                raceType,
                testDate,
                place,
                number,
            );

            expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
            expect(html).toBe(expectedHtml);
        });

        it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
            const testDate = new Date('2024-11-01');
            fetchMock.mockRejectedValue(new Error('Fetch error'));

            await expect(
                gateway.getRaceDataHtml(raceType, testDate, place, number),
            ).rejects.toThrow('HTMLの取得に失敗しました');
        });
    }
});
