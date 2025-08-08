import { RaceCourseType } from '../../../../../lib/src/utility/data/common/raceCourseType';
import { baseNarRaceRecord } from '../../mock/common/baseNarData';

describe('NarRaceRecordクラスのテスト', () => {
    it('正しい入力でNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;

        expect(raceRecord.id).toEqual('nar202412294411');
        expect(raceRecord.name).toBe('東京大賞典');
        expect(raceRecord.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(raceRecord.location).toBe('大井');
        expect(raceRecord.surfaceType).toBe(RaceCourseType.DIRT);
        expect(raceRecord.distance).toBe(2000);
        expect(raceRecord.grade).toBe('GⅠ');
        expect(raceRecord.number).toBe(11);
    });

    it('日付を変更したNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;
        const copiedRaceRecord = raceRecord.copy({
            location: '川崎',
        });

        expect(copiedRaceRecord.id).toEqual('nar202412294411');
        expect(copiedRaceRecord.name).toBe('東京大賞典');
        expect(copiedRaceRecord.dateTime).toEqual(new Date('2024-12-29 15:40'));
        expect(copiedRaceRecord.location).toBe('川崎');
        expect(copiedRaceRecord.surfaceType).toBe(RaceCourseType.DIRT);
        expect(copiedRaceRecord.distance).toBe(2000);
        expect(copiedRaceRecord.grade).toBe('GⅠ');
        expect(copiedRaceRecord.number).toBe(11);
    });

    it('何も変更せずNarRaceRecordのインスタンスを作成できることを確認', () => {
        const raceRecord = baseNarRaceRecord;
        const copiedRaceRecord = raceRecord.copy();

        expect(copiedRaceRecord).toEqual(raceRecord);
    });
});
