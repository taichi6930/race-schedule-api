import { RaceData } from '../../../lib/src/domain/raceData';
import { RaceType } from '../../../lib/src/utility/raceType';

describe('RaceDataクラスのテスト', () => {
    const validRaceType = RaceType.JRA;
    const validName = '東京優駿';
    const invalidName = '';
    const validDateTime = new Date('2024-05-26 15:40');
    const invalidDateTime = new Date('');
    const validLocation = '東京';
    const invalidLocation = '大井';
    const validGrade = 'GⅠ';
    const invalidGrade = 'G9';
    const validNumber = 10;
    const invalidNumber = 0;

    /**
     * RaceData ディシジョンテーブル
     * |No|raceType|name|dateTime|location|grade|number|期待結果|備考|
     * |--|--------|----|-------|--------|-----|------|--------|----|
     * |1 |有効    |有効|有効   |有効   |有効 |有効 |OK      |正常系|
     * |2 |有効    |無効|有効   |有効   |有効 |有効 |Error   |nameバリデーション|
     * |3 |有効    |有効|無効   |有効   |有効 |有効 |Error   |dateTimeバリデーション|
     * |4 |有効    |有効|有効   |無効   |有効 |有効 |Error   |locationバリデーション|
     * |5 |有効    |有効|有効   |有効   |無効 |有効 |Error   |gradeバリデーション|
     * |6 |有効    |有効|有効   |有効   |有効 |無効 |Error   |numberバリデーション|
     * |7 |有効    |有効|有効   |有効   |有効 |有効 |copyで値変更OK|copy正常系|
     * |8 |有効    |有効|有効   |有効   |有効 |有効 |copyで不正値→Error|copy異常系|
     */

    // 1. 正常系
    it('|1|有効|有効|有効|有効|有効|有効|OK|', () => {
        const data = RaceData.create(
            validRaceType,
            validName,
            validDateTime,
            validLocation,
            validGrade,
            validNumber,
        );
        expect(data.raceType).toBe(validRaceType);
        expect(data.name).toBe(validName);
        expect(data.dateTime).toStrictEqual(validDateTime);
        expect(data.location).toBe(validLocation);
        expect(data.grade).toBe(validGrade);
        expect(data.number).toBe(validNumber);
    });

    // 2. name無効
    it('|2|有効|無効|有効|有効|有効|有効|Error|', () => {
        expect(() =>
            RaceData.create(
                validRaceType,
                invalidName,
                validDateTime,
                validLocation,
                validGrade,
                validNumber,
            ),
        ).toThrow();
    });

    // 3. dateTime無効
    it('|3|有効|有効|無効|有効|有効|有効|Error|', () => {
        expect(() =>
            RaceData.create(
                validRaceType,
                validName,
                invalidDateTime,
                validLocation,
                validGrade,
                validNumber,
            ),
        ).toThrow();
    });

    // 4. location無効
    it('|4|有効|有効|有効|無効|有効|有効|Error|', () => {
        expect(() =>
            RaceData.create(
                validRaceType,
                validName,
                validDateTime,
                invalidLocation,
                validGrade,
                validNumber,
            ),
        ).toThrow();
    });

    // 5. grade無効
    it('|5|有効|有効|有効|有効|無効|有効|Error|', () => {
        expect(() =>
            RaceData.create(
                validRaceType,
                validName,
                validDateTime,
                validLocation,
                invalidGrade,
                validNumber,
            ),
        ).toThrow();
    });

    // 6. number無効
    it('|6|有効|有効|有効|有効|有効|無効|Error|', () => {
        expect(() =>
            RaceData.create(
                validRaceType,
                validName,
                validDateTime,
                validLocation,
                validGrade,
                invalidNumber,
            ),
        ).toThrow();
    });

    // 7. copyで値変更
    it('|7|有効|有効|有効|有効|有効|有効|copyで値変更OK|', () => {
        const data = RaceData.create(
            validRaceType,
            validName,
            validDateTime,
            validLocation,
            validGrade,
            validNumber,
        );
        const copied = data.copy({ name: '日本ダービー', number: 11 });
        expect(copied.name).toBe('日本ダービー');
        expect(copied.number).toBe(11);
        expect(copied.raceType).toBe(validRaceType);
        expect(copied.location).toBe(validLocation);
    });

    // 8. copyで不正値
    it('|8|有効|有効|有効|有効|有効|有効|copyで不正値→Error|', () => {
        const data = RaceData.create(
            validRaceType,
            validName,
            validDateTime,
            validLocation,
            validGrade,
            validNumber,
        );
        expect(() => data.copy({ number: invalidNumber })).toThrow();
        expect(() => data.copy({ name: invalidName })).toThrow();
    });
});
