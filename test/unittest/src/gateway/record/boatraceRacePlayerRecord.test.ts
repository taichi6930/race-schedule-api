import { baseBoatraceRacePlayerRecord } from '../../mock/common/baseBoatraceData';

describe('BoatraceRacePlayerRecordクラスのテスト', () => {
    it('正しい入力でBoatraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseBoatraceRacePlayerRecord;

        expect(racePlayerRecord.id).toBe(`boatrace20241231041101`);
        expect(racePlayerRecord.raceId).toBe(`boatrace202412310411`);
        expect(racePlayerRecord.positionNumber).toBe(1);
        expect(racePlayerRecord.playerNumber).toBe(10000);
    });

    it('日付を変更したBoatraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseBoatraceRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy({
            positionNumber: 2,
            playerNumber: 10001,
        });
        expect(racePlayerRecord.id).toBe(`boatrace20241231041101`);
        expect(racePlayerRecord.raceId).toBe(`boatrace202412310411`);
        expect(copiedRacePlayerRecord.positionNumber).toBe(2);
        expect(copiedRacePlayerRecord.playerNumber).toBe(10001);
    });

    it('何も変更せずBoatraceRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseBoatraceRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy();

        expect(copiedRacePlayerRecord).toEqual(racePlayerRecord);
    });
});
