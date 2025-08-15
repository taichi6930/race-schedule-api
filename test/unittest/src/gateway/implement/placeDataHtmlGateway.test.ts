import { PlaceDataHtmlGateway } from '../../../../../lib/src/gateway/implement/placeDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { RaceType } from '../../../../../lib/src/utility/raceType';

describe('PlaceDataHtmlGateway', () => {
    let gateway: IPlaceDataHtmlGateway;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        gateway = new PlaceDataHtmlGateway();

        // fetch をモックし、型定義を追加
        fetchMock = jest.fn();
        globalThis.fetch = fetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    for (const { descriptions, raceType, expectedUrl } of [
        {
            descriptions: 'JRAの開催場データ',
            raceType: RaceType.JRA,
            expectedUrl: `https://prc.jp/jraracingviewer/contents/seiseki/2024/`,
        },
        {
            descriptions: 'NARの開催場データ',
            raceType: RaceType.NAR,
            expectedUrl: `https://www.keiba.go.jp/KeibaWeb/MonthlyConveneInfo/MonthlyConveneInfoTop?k_year=2024&k_month=10`,
        },
        {
            descriptions: '競輪の開催場データ',
            raceType: RaceType.KEIRIN,
            expectedUrl: `https://www.oddspark.com/keirin/KaisaiCalendar.do?target=202410`,
        },
        {
            descriptions: 'オートレースの開催場データ',
            raceType: RaceType.AUTORACE,
            expectedUrl: `https://www.oddspark.com/autorace/KaisaiCalendar.do?target=202410`,
        },
        {
            descriptions: 'ボートレースの開催場データ',
            raceType: RaceType.BOATRACE,
            expectedUrl: `https://sports.yahoo.co.jp/boatrace/schedule/?quarter=4`,
        },
    ]) {
        it(`正しいURLでfetchを呼び出し、${descriptions}のHTMLが取得されること`, async () => {
            const testDate = new Date('2024-10-01');
            const expectedHtml = '<html>Test HTML</html>';

            fetchMock.mockResolvedValue({
                text: jest.fn().mockResolvedValue(expectedHtml),
            });

            const html = await gateway.getPlaceDataHtml(raceType, testDate);

            expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
            expect(html).toBe(expectedHtml);
        });

        it(`未対応のraceTypeの場合、エラーがスローされること`, async () => {
            const testDate = new Date('2024-10-01');
            await expect(
                gateway.getPlaceDataHtml(RaceType.OVERSEAS, testDate),
            ).rejects.toThrow('未対応のraceTypeです');
        });

        it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
            const testDate = new Date('2024-11-01');
            fetchMock.mockRejectedValue(new Error('Fetch error'));

            await expect(
                gateway.getPlaceDataHtml(RaceType.AUTORACE, testDate),
            ).rejects.toThrow('HTMLの取得に失敗しました');
        });
    }
});
