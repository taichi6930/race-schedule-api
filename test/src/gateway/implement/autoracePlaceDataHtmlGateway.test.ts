import { PlaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/placeDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { RaceType } from '../../../../lib/src/utility/raceType';

describe('AutoRacePlaceDataHtmlGateway', () => {
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

    it('正しいURLでfetchを呼び出し、HTMLが取得されること', async () => {
        const testDate = new Date('2024-10-01');
        const expectedUrl = `https://www.oddspark.com/autorace/KaisaiCalendar.do?target=202410`;
        const expectedHtml = '<html>Test HTML</html>';

        fetchMock.mockResolvedValue({
            text: jest.fn().mockResolvedValue(expectedHtml),
        });

        const html = await gateway.getPlaceDataHtml(
            RaceType.AUTORACE,
            testDate,
        );

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-11-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(
            gateway.getPlaceDataHtml(RaceType.AUTORACE, testDate),
        ).rejects.toThrow('HTMLの取得に失敗しました');
    });
});
