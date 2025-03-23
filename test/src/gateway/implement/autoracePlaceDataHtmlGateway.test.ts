import { AutoracePlaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/autoracePlaceDataHtmlGateway';

describe('AutoPlaceDataHtmlGateway', () => {
    let gateway: AutoracePlaceDataHtmlGateway;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        gateway = new AutoracePlaceDataHtmlGateway();

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

        const html = await gateway.getPlaceDataHtml(testDate);

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-11-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(gateway.getPlaceDataHtml(testDate)).rejects.toThrow(
            'htmlを取得できませんでした',
        );
    });
});
