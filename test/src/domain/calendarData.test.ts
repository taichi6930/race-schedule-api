/**
 * CalendarData ディシジョンテーブル
 * |No|id|raceType|title|startTime|endTime|location|description|partialの内容|期待結果|備考|
 * |--|--|--------|-----|---------|-------|--------|-----------|-------------|--------|----|
 * |1 |有効|有効   |有効|有効    |有効  |有効   |有効      | -           |OK      |正常系|
 * |2 |無効|有効   |有効|有効    |有効  |有効   |有効      | -           |Error   |idバリデーション|
 * |3 |有効|有効   |無効|有効    |有効  |有効   |有効      | -           |Error   |titleバリデーション|
 * |4 |有効|有効   |有効|無効    |有効  |有効   |有効      | -           |Error   |startTimeバリデーション|
 * |5 |有効|有効   |有効|有効    |無効  |有効   |有効      | -           |Error   |endTimeバリデーション|
 * |6 |有効|有効   |有効|有効    |有効  |無効   |有効      | -           |Error   |locationバリデーション|
 * |7 |有効|有効   |有効|有効    |有効  |有効   |無効      | -           |Error   |descriptionバリデーション|
 * |8 |有効|有効   |有効|有効    |有効  |有効   |有効      |{ title: 'コピー' }|copyで値変更OK|copy正常系|
 * |9 |有効|有効   |有効|有効    |有効  |有効   |有効      |{} または undefined|全プロパティ同値|copyでpartial空|
 */
import { CalendarData } from '../../../lib/src/domain/calendarData';
import { RaceType } from '../../../lib/src/utility/raceType';

describe('CalendarDataクラスのテスト', () => {
    const validId = 'event1';
    const invalidId = '';
    const validRaceType = RaceType.JRA;
    const validTitle = 'イベントタイトル';
    const invalidTitle = '';
    const validStartTime = '2024-08-12T09:00:00';
    const invalidStartTime = '';
    const validEndTime = '2024-08-12T10:00:00';
    const invalidEndTime = '';
    const validLocation = '東京';
    const invalidLocation = '';
    const validDescription = 'イベントの説明';
    const invalidDescription = '';

    // 1. 正常系
    it('|1|有効|有効|有効|有効|有効|有効|有効|OK|', () => {
        const calendarData = CalendarData.create(
            validId,
            validRaceType,
            validTitle,
            validStartTime,
            validEndTime,
            validLocation,
            validDescription,
        );
        expect(calendarData.id).toBe(validId);
        expect(calendarData.raceType).toBe(validRaceType);
        expect(calendarData.title).toBe(validTitle);
        expect(calendarData.startTime).toEqual(new Date(validStartTime));
        expect(calendarData.endTime).toEqual(new Date(validEndTime));
        expect(calendarData.location).toBe(validLocation);
        expect(calendarData.description).toBe(validDescription);
    });

    // 2. id無効
    it('|2|無効|有効|有効|有効|有効|有効|有効|Error|', () => {
        expect(() =>
            CalendarData.create(
                invalidId,
                validRaceType,
                validTitle,
                validStartTime,
                validEndTime,
                validLocation,
                validDescription,
            ),
        ).toThrow();
    });

    // 3. title無効
    it('|3|有効|有効|無効|有効|有効|有効|有効|Error|', () => {
        expect(() =>
            CalendarData.create(
                validId,
                validRaceType,
                invalidTitle,
                validStartTime,
                validEndTime,
                validLocation,
                validDescription,
            ),
        ).toThrow();
    });

    // 4. startTime無効
    it('|4|有効|有効|有効|無効|有効|有効|有効|Error|', () => {
        expect(() =>
            CalendarData.create(
                validId,
                validRaceType,
                validTitle,
                invalidStartTime,
                validEndTime,
                validLocation,
                validDescription,
            ),
        ).toThrow();
    });

    // 5. endTime無効
    it('|5|有効|有効|有効|有効|無効|有効|有効|Error|', () => {
        expect(() =>
            CalendarData.create(
                validId,
                validRaceType,
                validTitle,
                validStartTime,
                invalidEndTime,
                validLocation,
                validDescription,
            ),
        ).toThrow();
    });

    // 6. location無効
    it('|6|有効|有効|有効|有効|有効|無効|有効|Error|', () => {
        expect(() =>
            CalendarData.create(
                validId,
                validRaceType,
                validTitle,
                validStartTime,
                validEndTime,
                invalidLocation,
                validDescription,
            ),
        ).toThrow();
    });

    // 7. description無効
    it('|7|有効|有効|有効|有効|有効|有効|無効|Error|', () => {
        expect(() =>
            CalendarData.create(
                validId,
                validRaceType,
                validTitle,
                validStartTime,
                validEndTime,
                validLocation,
                invalidDescription,
            ),
        ).toThrow();
    });

    // 8. copyで値変更
    it('|8|有効|有効|有効|有効|有効|有効|有効|copyで値変更OK|', () => {
        const calendarData = CalendarData.create(
            validId,
            validRaceType,
            validTitle,
            validStartTime,
            validEndTime,
            validLocation,
            validDescription,
        );
        const copied = calendarData.copy({ title: 'コピー' });
        expect(copied.title).toBe('コピー');
        expect(copied.id).toBe(validId);
        expect(copied.raceType).toBe(validRaceType);
        expect(copied.startTime).toEqual(new Date(validStartTime));
        expect(copied.endTime).toEqual(new Date(validEndTime));
        expect(copied.location).toBe(validLocation);
        expect(copied.description).toBe(validDescription);
    });

    // 9. copyでpartialが空
    it('|9|有効|有効|有効|有効|有効|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const calendarData = CalendarData.create(
            validId,
            validRaceType,
            validTitle,
            validStartTime,
            validEndTime,
            validLocation,
            validDescription,
        );
        // partial: undefined
        const copied1 = calendarData.copy();
        expect(copied1.id).toBe(validId);
        expect(copied1.raceType).toBe(validRaceType);
        expect(copied1.title).toBe(validTitle);
        expect(copied1.startTime).toEqual(new Date(validStartTime));
        expect(copied1.endTime).toEqual(new Date(validEndTime));
        expect(copied1.location).toBe(validLocation);
        expect(copied1.description).toBe(validDescription);
        // partial: {}
        const copied2 = calendarData.copy({});
        expect(copied2.id).toBe(validId);
        expect(copied2.raceType).toBe(validRaceType);
        expect(copied2.title).toBe(validTitle);
        expect(copied2.startTime).toEqual(new Date(validStartTime));
        expect(copied2.endTime).toEqual(new Date(validEndTime));
        expect(copied2.location).toBe(validLocation);
        expect(copied2.description).toBe(validDescription);
    });
});
