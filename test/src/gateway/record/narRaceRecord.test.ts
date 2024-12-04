import { baseNarRaceRecord } from '../../mock/common/baseNarData';

describe('NarRaceRecordクラスのテスト', () => {
    it('正しい入力でNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;

        expect(raceRecord.id).toEqual('nar202412294411');
        expect(raceRecord.name).toBe('東京大賞典');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(raceRecord.location).toBe('大井');
        expect(raceRecord.surfaceType).toBe('ダート');
        expect(raceRecord.distance).toBe(2000);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;
        const newRaceRecord = raceRecord.copy({
            location: '川崎',
        });

        expect(newRaceRecord.id).toEqual('nar202412294411');
        expect(newRaceRecord.name).toBe('東京大賞典');
        expect(newRaceRecord.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(newRaceRecord.location).toBe('川崎');
        expect(newRaceRecord.surfaceType).toBe('ダート');
        expect(newRaceRecord.distance).toBe(2000);
        expect(newRaceRecord.grade).toBe('GⅠ');
        expect(newRaceRecord.number).toBe(11);
    });

    it('何も変更せずNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;
        const newRaceRecord = raceRecord.copy();

        expect(newRaceRecord).toEqual(raceRecord);
    });
});
