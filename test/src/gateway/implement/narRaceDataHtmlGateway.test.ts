import { RaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/raceDataHtmlGateway';
import { RaceType } from '../../../../lib/src/utility/raceType';

describe('NarRaceDataHtmlGateway', () => {
    let gateway: RaceDataHtmlGateway;
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

    it('正しいURLでfetchを呼び出し、HTMLが取得されること', async () => {
        const testDate = new Date('2024-10-02');
        const expectedUrl = `https://www2.keiba.go.jp/KeibaWeb/TodayRaceInfo/RaceList?k_raceDate=2024%2f10%2f02&k_babaCode=20`;
        const expectedHtml = '<html>Test HTML</html>';

        fetchMock.mockResolvedValue({
            text: jest.fn().mockResolvedValue(expectedHtml),
        });

        const html = await gateway.getRaceDataHtml(
            RaceType.NAR,
            testDate,
            '大井',
        );

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-10-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(
            gateway.getRaceDataHtml(RaceType.NAR, testDate, '佐賀'),
        ).rejects.toThrow('htmlを取得できませんでした');
    });
});
