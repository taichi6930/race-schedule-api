import { KeirinRaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/keirinRaceDataHtmlGateway';

describe('KeirinRaceDataHtmlGateway', () => {
    let gateway: KeirinRaceDataHtmlGateway;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        gateway = new KeirinRaceDataHtmlGateway();

        // fetch をモックし、型定義を追加
        fetchMock = jest.fn();
        globalThis.fetch = fetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('正しいURLでfetchを呼び出し、HTMLが取得されること', async () => {
        const testDate = new Date('2024-10-01');
        const expectedUrl = `https://www.oddspark.com/keirin/AllRaceList.do?joCode=21&kaisaiBi=20241001`;
        const expectedHtml = '<html>Test HTML</html>';

        fetchMock.mockResolvedValue({
            text: jest.fn().mockResolvedValue(expectedHtml),
        });

        const html = await gateway.getRaceDataHtml(testDate, '弥彦');

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-10-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(
            gateway.getRaceDataHtml(testDate, 'いわき平'),
        ).rejects.toThrow('htmlを取得できませんでした');
    });
});
