import { baseAutoraceRaceRecord } from '../../mock/common/baseAutoraceData';

describe('AutoraceRaceRecordクラスのテスト', () => {
    it('正しい入力でAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;

        expect(raceRecord.id).toEqual('autorace202412310511');
        expect(raceRecord.name).toBe('スーパースター王座決定戦');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceRecord.stage).toBe('優勝戦');
        expect(raceRecord.location).toBe('飯塚');
        expect(raceRecord.grade).toBe('SG');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;
        const copiedRaceRecord = raceRecord.copy({
            dateTime: new Date('2022-12-30'),
        });
        expect(copiedRaceRecord.id).toEqual('autorace202412310511');
        expect(copiedRaceRecord.name).toBe('スーパースター王座決定戦');
        expect(copiedRaceRecord.dateTime).toEqual(new Date('2022-12-30 00:00'));
        expect(copiedRaceRecord.stage).toBe('優勝戦');
        expect(copiedRaceRecord.location).toBe('飯塚');
        expect(copiedRaceRecord.grade).toBe('SG');
        expect(copiedRaceRecord.number).toBe(11);
    });

    it('何も変更せずAutoraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseAutoraceRaceRecord;
        const copiedRaceRecord = raceRecord.copy();

        expect(copiedRaceRecord).toEqual(raceRecord);
    });
});
