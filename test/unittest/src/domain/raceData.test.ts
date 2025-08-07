import { RaceData } from '../../../../lib/src/domain/raceData';
import { RaceType } from '../../../../lib/src/utility/raceType';

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
     * |No|raceType|name|dateTime|location|grade|number|partialの内容|期待結果|備考|
     * |--|--------|----|-------|--------|-----|------|-------------|--------|----|
     * |1 |有効    |有効|有効   |有効   |有効 |有効 | -           |OK      |正常系|
     * |2 |有効    |無効|有効   |有効   |有効 |有効 | -           |Error   |nameバリデーション|
     * |3 |有効    |有効|無効   |有効   |有効 |有効 | -           |Error   |dateTimeバリデーション|
     * |4 |有効    |有効|有効   |無効   |有効 |有効 | -           |Error   |locationバリデーション|
     * |5 |有効    |有効|有効   |有効   |無効 |有効 | -           |Error   |gradeバリデーション|
     * |6 |有効    |有効|有効   |有効   |有効 |無効 | -           |Error   |numberバリデーション|
     * |7 |有効    |有効|有効   |有効   |有効 |有効 |{ name: '日本ダービー', number: 11 }|copyで値変更OK|copy正常系|
     * |8 |有効    |有効|有効   |有効   |有効 |有効 |{ number: 0 }, { name: '' }|copyで不正値→Error|copy異常系|
     * |9 |有効    |有効|有効   |有効   |有効 |有効 |{} または undefined|全プロパティ同値|copyでpartial空|
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

    // 9. copyでpartialが空
    it('|9|有効|有効|有効|有効|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const data = RaceData.create(
            validRaceType,
            validName,
            validDateTime,
            validLocation,
            validGrade,
            validNumber,
        );
        // partial: undefined
        const copied1 = data.copy();
        expect(copied1.raceType).toBe(validRaceType);
        expect(copied1.name).toBe(validName);
        expect(copied1.dateTime).toStrictEqual(validDateTime);
        expect(copied1.location).toBe(validLocation);
        expect(copied1.grade).toBe(validGrade);
        expect(copied1.number).toBe(validNumber);

        // partial: {}
        const copied2 = data.copy({});
        expect(copied2.raceType).toBe(validRaceType);
        expect(copied2.name).toBe(validName);
        expect(copied2.dateTime).toStrictEqual(validDateTime);
        expect(copied2.location).toBe(validLocation);
        expect(copied2.grade).toBe(validGrade);
        expect(copied2.number).toBe(validNumber);
    });
});
