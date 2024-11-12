import { WorldRaceDataHtmlGateway } from '../../../../lib/src/gateway/implement/worldRaceDataHtmlGateway';

describe('WorldRaceDataHtmlGateway', () => {
    let gateway: WorldRaceDataHtmlGateway;
    let fetchMock: jest.Mock;

    beforeEach(() => {
        gateway = new WorldRaceDataHtmlGateway();

        // fetch をモックし、型定義を追加
        fetchMock = jest.fn();
        global.fetch = fetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('正しいURLでfetchを呼び出し、HTMLが取得されること', async () => {
        const testDate = new Date('2024-10-01');
        const expectedUrl = `https://world.jra-van.jp/schedule/?year=2024&month=10`;
        const expectedHtml = '<html>Test HTML</html>';

        fetchMock.mockResolvedValue({
            text: jest.fn().mockResolvedValue(expectedHtml),
        });

        const html = await gateway.getRaceDataHtml(testDate);

        expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
        expect(html).toBe(expectedHtml);
    });

    it('fetchのエラーが発生した場合、エラーメッセージがスローされること', async () => {
        const testDate = new Date('2024-10-01');
        fetchMock.mockRejectedValue(new Error('Fetch error'));

        await expect(gateway.getRaceDataHtml(testDate)).rejects.toThrow(
            'htmlを取得できませんでした',
        );
    });
});
