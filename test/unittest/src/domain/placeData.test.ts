/**
 * PlaceData ディシジョンテーブル
 * |No|raceType|dateTime      |location      |partialの内容                |期待結果                |備考                              |
 * |--|--------|--------------|--------------|----------------------------|------------------------|-----------------------------------|
 * |1 |有効    |有効          |有効          | -                         |OK                     |正常系                            |
 * |2 |有効    |有効          |無効          | -                         |Error                  |locationバリデーション             |
 * |3 |有効    |無効          |有効          | -                         |Error                  |dateTimeバリデーション             |
 * |4 |有効    |有効          |有効          |{ location: '京都' }        |copyで値変更OK         |copy正常系                         |
 * |5 |有効    |有効          |有効          |{ location: '大井' }        |copyで不正値→Error      |copy異常系（location）             |
 * |6 |有効    |有効          |有効          |{ dateTime: invalidDateTime }|copyで不正値→Error      |copy異常系（dateTime）             |
 * |7 |有効    |有効          |有効          |{} または undefined         |全プロパティ同値        |copyでpartial空                    |
 */
import { PlaceData } from '../../../../lib/src/domain/placeData';
import { RaceType } from '../../../../lib/src/utility/raceType';

describe('PlaceDataクラスのテスト', () => {
    const validRaceType = RaceType.JRA;
    const validDateTime = new Date('2024-05-26');
    const invalidDateTime = new Date(''); // 無効な日付
    const validLocation = '東京'; // JRAの有効な場所
    const invalidLocation = '大井'; // JRAでは無効な場所

    // 1. 正常系
    it('|1|有効|有効|有効|OK|', () => {
        const data = PlaceData.create(
            validRaceType,
            validDateTime,
            validLocation,
        );
        expect(data.raceType).toBe(validRaceType);
        expect(data.dateTime).toStrictEqual(validDateTime);
        expect(data.location).toBe(validLocation);
    });

    // 2. location無効
    it('|2|有効|有効|無効|Error|', () => {
        expect(() =>
            PlaceData.create(validRaceType, validDateTime, invalidLocation),
        ).toThrow();
    });

    // 3. dateTime無効
    it('|3|有効|無効|有効|Error|', () => {
        expect(() =>
            PlaceData.create(validRaceType, invalidDateTime, validLocation),
        ).toThrow();
    });

    // 4. copyで値変更
    it('|4|有効|有効|有効|copyで値変更OK|', () => {
        const data = PlaceData.create(
            validRaceType,
            validDateTime,
            validLocation,
        );
        const copied = data.copy({ location: '京都' });
        expect(copied.location).toBe('京都');
        expect(copied.raceType).toBe(validRaceType);
        expect(copied.dateTime).toStrictEqual(validDateTime);
    });

    // 5. copyで不正値
    it('|5|有効|有効|有効|copyで不正値→Error|', () => {
        const data = PlaceData.create(
            validRaceType,
            validDateTime,
            validLocation,
        );
        expect(() => data.copy({ location: invalidLocation })).toThrow();
        expect(() => data.copy({ dateTime: invalidDateTime })).toThrow();
    });

    // 6. copyでpartialが空
    it('|6|有効|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const data = PlaceData.create(
            validRaceType,
            validDateTime,
            validLocation,
        );
        // partial: undefined
        const copied1 = data.copy();
        expect(copied1.raceType).toBe(validRaceType);
        expect(copied1.dateTime).toStrictEqual(validDateTime);
        expect(copied1.location).toBe(validLocation);

        // partial: {}
        const copied2 = data.copy({});
        expect(copied2.raceType).toBe(validRaceType);
        expect(copied2.dateTime).toStrictEqual(validDateTime);
        expect(copied2.location).toBe(validLocation);
    });
});
