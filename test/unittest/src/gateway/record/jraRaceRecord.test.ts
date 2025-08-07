import { baseJraRaceRecord } from '../../mock/common/baseJraData';

describe('JraRaceRecordクラスのテスト', () => {
    it('正しい入力でJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;

        expect(raceRecord.id).toEqual('jra202412220611');
        expect(raceRecord.name).toBe('有馬記念');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-22 15:40'));
        expect(raceRecord.location).toBe('中山');
        expect(raceRecord.surfaceType).toBe('芝');
        expect(raceRecord.distance).toBe(2500);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(11);
        expect(raceRecord.heldTimes).toBe(5);
        expect(raceRecord.heldDayTimes).toBe(8);
    });

    it('日付を変更したJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;
        const copiedRaceRecord = raceRecord.copy({
            location: '東京',
        });
        expect(copiedRaceRecord.id).toEqual('jra202412220611');
        expect(copiedRaceRecord.name).toBe('有馬記念');
        expect(copiedRaceRecord.dateTime).toEqual(new Date('2024-12-22 15:40'));
        expect(copiedRaceRecord.location).toBe('東京');
        expect(copiedRaceRecord.surfaceType).toBe('芝');
        expect(copiedRaceRecord.distance).toBe(2500);
        expect(copiedRaceRecord.grade).toBe('GⅠ');
        expect(copiedRaceRecord.number).toBe(11);
        expect(copiedRaceRecord.heldTimes).toBe(5);
        expect(copiedRaceRecord.heldDayTimes).toBe(8);
    });

    it('何も変更せずJraRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseJraRaceRecord;
        const copiedRaceRecord = raceRecord.copy();

        expect(copiedRaceRecord).toEqual(raceRecord);
    });
});
