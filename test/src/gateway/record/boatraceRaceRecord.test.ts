import { baseBoatraceRaceRecord } from '../../mock/common/baseBoatraceData';

describe('BoatraceRaceRecordクラスのテスト', () => {
    it('正しい入力でBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;

        expect(raceRecord.id).toEqual('boatrace202412310411');
        expect(raceRecord.name).toBe('グランプリ');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(raceRecord.stage).toBe('優勝戦');
        expect(raceRecord.location).toBe('平和島');
        expect(raceRecord.grade).toBe('SG');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;
        const copiedRaceRecord = raceRecord.copy({
            location: '大村',
        });
        expect(copiedRaceRecord.id).toEqual('boatrace202412310411');
        expect(copiedRaceRecord.name).toBe('グランプリ');
        expect(copiedRaceRecord.dateTime).toEqual(new Date('2024-12-31 16:30'));
        expect(copiedRaceRecord.stage).toBe('優勝戦');
        expect(copiedRaceRecord.location).toBe('大村');
        expect(copiedRaceRecord.grade).toBe('SG');
        expect(copiedRaceRecord.number).toBe(11);
    });

    it('何も変更せずBoatraceRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseBoatraceRaceRecord;
        const copiedRaceRecord = raceRecord.copy();

        expect(copiedRaceRecord).toEqual(raceRecord);
    });
});
