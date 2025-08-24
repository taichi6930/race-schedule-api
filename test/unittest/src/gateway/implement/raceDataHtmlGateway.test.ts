import { RaceDataHtmlGateway } from '../../../../../lib/src/gateway/implement/raceDataHtmlGateway';
import type { IRaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iRaceDataHtmlGateway';
import { RaceType } from '../../../../../lib/src/utility/raceType';
import { clearMocks } from '../../../../utility/testSetupHelper';

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
        clearMocks();
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
            raceType: RaceType.OVERSEAS,
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
            fetchMock.mockRejectedValue(new Error('HTMLの取得に失敗しました'));

            await expect(
                gateway.getRaceDataHtml(raceType, testDate, place, number),
            ).rejects.toThrow('HTMLの取得に失敗しました');
        });
    }

    for (const { descriptions, raceType, place, number, expectedMessage } of [
        {
            descriptions: 'NARの開催レースデータでplaceが足りない',
            raceType: RaceType.NAR,
            place: undefined,
            expectedMessage: 'NARレースの開催場が指定されていません',
        },
        {
            descriptions: '競輪の開催レースデータでplaceが足りない',
            raceType: RaceType.KEIRIN,
            place: undefined,
            expectedMessage: '競輪レースの開催場が指定されていません',
        },
        {
            descriptions: 'オートレースの開催レースデータでplaceが足りない',
            raceType: RaceType.AUTORACE,
            place: undefined,
            expectedMessage: 'オートレースの開催場が指定されていません',
        },
        {
            descriptions: 'ボートレースの開催レースデータでplaceが足りない',
            raceType: RaceType.BOATRACE,
            place: undefined,
            number: 1,
            expectedMessage: 'ボートレースの開催場が指定されていません',
        },
        {
            descriptions: 'ボートレースの開催レースデータでnumberが足りない',
            raceType: RaceType.BOATRACE,
            place: '浜名湖',
            number: undefined,
            expectedMessage: 'ボートレースのレース番号が指定されていません',
        },
    ]) {
        it(`値が不足している時、エラーメッセージがスローされること（${descriptions}）`, async () => {
            const testDate = new Date('2024-10-01');
            await expect(
                gateway.getRaceDataHtml(raceType, testDate, place, number),
            ).rejects.toThrow(new TypeError(expectedMessage));
        });
    }
});
