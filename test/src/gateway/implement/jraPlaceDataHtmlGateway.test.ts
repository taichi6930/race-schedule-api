import { PlaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/placeDataHtmlGateway';
import type { IPlaceDataHtmlGateway } from '../../../../lib/src/gateway/interface/iPlaceDataHtmlGateway';
import { RaceType } from '../../../../lib/src/utility/raceType';

describe('JraPlaceDataHtmlGateway', () => {
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
        const expectedUrl = `https://prc.jp/jraracingviewer/contents/seiseki/2024/`;
        const expectedHtml = '<html>Test HTML</html>';

        fetchMock.mockResolvedValue({
            text: jest.fn().mockResolvedValue(expectedHtml),
        });

        const html = await gateway.getPlaceDataHtml(RaceType.JRA, testDate);

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-11-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(
            gateway.getPlaceDataHtml(RaceType.JRA, testDate),
        ).rejects.toThrow('HTMLの取得に失敗しました');
    });
});
