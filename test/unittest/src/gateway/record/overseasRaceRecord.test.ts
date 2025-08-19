import { baseOverseasRaceRecord } from '../../mock/common/baseOverseasData';

describe('OverseasRaceRecordクラスのテスト', () => {
    it('正しい入力でOverseasRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseOverseasRaceRecord;
        expect(raceRecord.id).toEqual('overseas202410010212');
        expect(raceRecord.name).toBe('凱旋門賞');
        expect(raceRecord.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(raceRecord.location).toBe('パリロンシャン');
        expect(raceRecord.surfaceType).toBe('芝');
        expect(raceRecord.distance).toBe(2400);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(12);
    });

    it('日付を変更したOverseasRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseOverseasRaceRecord;
        const copiedRaceRecord = raceRecord.copy({
            location: 'シャティン',
        });

        expect(copiedRaceRecord.id).toEqual('overseas202410010212');
        expect(copiedRaceRecord.name).toBe('凱旋門賞');
        expect(copiedRaceRecord.dateTime).toEqual(new Date('2024-10-01 16:30'));
        expect(copiedRaceRecord.location).toBe('シャティン');
        expect(copiedRaceRecord.surfaceType).toBe('芝');
        expect(copiedRaceRecord.distance).toBe(2400);
        expect(copiedRaceRecord.grade).toBe('GⅠ');
        expect(copiedRaceRecord.number).toBe(12);
    });

    it('何も変更せずOverseasRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseOverseasRaceRecord;
        const copiedRaceRecord = raceRecord.copy();

        expect(copiedRaceRecord).toEqual(raceRecord);
    });
});
