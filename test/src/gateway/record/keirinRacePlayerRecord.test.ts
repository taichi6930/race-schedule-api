import { baseKeirinRacePlayerRecord } from '../../mock/common/baseKeirinData';

describe('KeirinRacePlayerRecordクラスのテスト', () => {
    it('正しい入力でKeirinRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;

        expect(racePlayerRecord.id).toBe('keirin20251230351101');
        expect(racePlayerRecord.raceId).toBe('keirin202512303511');
        expect(racePlayerRecord.positionNumber).toBe(1);
        expect(racePlayerRecord.playerNumber).toBe(10000);
    });

    it('日付を変更したKeirinRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy({
            positionNumber: 2,
            playerNumber: 10001,
        });
        expect(racePlayerRecord.id).toBe('keirin20251230351101');
        expect(racePlayerRecord.raceId).toBe('keirin202512303511');
        expect(copiedRacePlayerRecord.positionNumber).toBe(2);
        expect(copiedRacePlayerRecord.playerNumber).toBe(10001);
    });

    it('何も変更せずKeirinRacePlayerRecordのインスタンスを作成できることを確認', () => {
        const racePlayerRecord = baseKeirinRacePlayerRecord;
        const copiedRacePlayerRecord = racePlayerRecord.copy();

        expect(copiedRacePlayerRecord).toEqual(racePlayerRecord);
    });
});
