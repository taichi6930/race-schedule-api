import { baseAutoraceRacePlayerRecord } from '../../mock/common/baseAutoraceData';

describe('AutoraceRacePlayerRecordクラスのテスト', () => {
    it('正しい入力でAutoraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseAutoraceRacePlayerRecord;

        expect(racePlayerRecord.id).toBe(`autorace20241231051101`);
        expect(racePlayerRecord.raceId).toBe(`autorace202412310511`);
        expect(racePlayerRecord.positionNumber).toBe(1);
        expect(racePlayerRecord.playerNumber).toBe(10000);
    });

    it('日付を変更したAutoraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseAutoraceRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy({
            positionNumber: 2,
            playerNumber: 10001,
        });
        expect(racePlayerRecord.id).toBe(`autorace20241231051101`);
        expect(racePlayerRecord.raceId).toBe(`autorace202412310511`);
        expect(copiedRacePlayerRecord.positionNumber).toBe(2);
        expect(copiedRacePlayerRecord.playerNumber).toBe(10001);
    });

    it('何も変更せずAutoraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseAutoraceRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy();

        expect(copiedRacePlayerRecord).toEqual(racePlayerRecord);
    });
});
