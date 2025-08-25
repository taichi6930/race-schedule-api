/**
 * ディシジョンテーブル
 *
 * 【create/copy】
 * | No. | 操作   | id         | raceType   | name      | surfaceType | distance   | dateTime      | location   | grade   | number   | updateDate    | 期待結果         | 備考                      |
 * |-----|--------|------------|------------|-----------|-------------|------------|---------------|------------|---------|----------|--------------|------------------|---------------------------|
 * |  1  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 正常に生成       | 正常系                    |
 * |  2  | create | 不正値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | idバリデーション失敗      |
 * |  3  | create | 正常値      | 正常値     | 不正値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | nameバリデーション失敗    |
 * |  4  | create | 正常値      | 正常値     | 正常値    | 不正値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | surfaceTypeバリデーション失敗 |
 * |  5  | create | 正常値      | 正常値     | 正常値    | 正常値      | 不正値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | distanceバリデーション失敗 |
 * |  6  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 不正なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | dateTimeバリデーション失敗|
 * |  7  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 不正値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | locationバリデーション失敗|
 * |  8  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 不正値  | 正常値   | 正常なDate   | 例外発生         | gradeバリデーション失敗   |
 * |  9  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 不正値   | 正常なDate   | 例外発生         | numberバリデーション失敗  |
 * | 10  | create | 正常値      | 正常値     | 正常値    | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常値   | 不正なDate   | 例外発生         | updateDateバリデーション失敗|
 * | 11  | copy   | undefined  | undefined | undefined | undefined   | undefined  | undefined     | undefined  | undefined| undefined| undefined    | 全項目コピー     | デフォルトコピー          |
 * | 12  | copy   | undefined  | undefined | undefined | undefined   | undefined  | undefined     | undefined  | 新しい値| undefined| undefined    | gradeのみ変更       | 部分更新                  |
 * | 13  | copy   | undefined  | undefined | 不正値    | undefined   | undefined  | undefined     | undefined  | undefined| undefined| undefined    | 例外発生         | nameバリデーション失敗    |
 * | 14  | copy   | undefined  | undefined | undefined | 不正値      | undefined  | undefined     | undefined  | undefined| undefined| undefined    | 例外発生         | surfaceTypeバリデーション失敗 |
 * | 15  | copy   | undefined  | undefined | undefined | undefined   | 不正値     | undefined     | undefined  | undefined| undefined| undefined    | 例外発生         | distanceバリデーション失敗 |
 */
import { HorseRacingRaceRecord } from '../../../../../lib/src/gateway/record/horseRacingRaceRecord';
import { generateRaceId } from '../../../../../lib/src/utility/validateAndType/raceId';
import {
    defaultLocation,
    defaultRaceGrade,
    testRaceTypeListHorseRacing,
} from '../../mock/common/baseCommonData';

describe.each(testRaceTypeListHorseRacing)(
    'HorseRacingRaceRecord(%s)',
    (raceType) => {
        const validDate = new Date('2026-01-01T00:00:00Z');
        const validLocation = defaultLocation[raceType];
        const validSurfaceType = 'ダート';
        const validDistance = 1600;
        const validNumber = 1;
        const validRaceId = generateRaceId(
            raceType,
            validDate,
            validLocation,
            validNumber,
        );
        const validName = '第1レース';
        const validGrade = defaultRaceGrade[raceType];
        const validUpdateDate = new Date('2026-01-01T12:00:00Z');

        describe('HorseRacingRaceRecord.create', () => {
            it('1: 正常値ですべて生成できる', () => {
                const record = HorseRacingRaceRecord.create(
                    validRaceId,
                    raceType,
                    validName,
                    validDate,
                    validLocation,
                    validSurfaceType,
                    validDistance,
                    validGrade,
                    validNumber,
                    validUpdateDate,
                );
                expect(record).toBeInstanceOf(HorseRacingRaceRecord);
                expect(record.id).toBe(validRaceId);
                expect(record.raceType).toBe(raceType);
                expect(record.name).toBe(validName);
                expect(record.dateTime).toEqual(validDate);
                expect(record.location).toBe(validLocation);
                expect(record.surfaceType).toBe(validSurfaceType);
                expect(record.distance).toBe(validDistance);
                expect(record.grade).toBe(validGrade);
                expect(record.number).toBe(validNumber);
                expect(record.updateDate).toEqual(validUpdateDate);
            });

            it('2: idバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        'bad-id',
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('3: nameバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        '',
                        validDate,
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('4: surfaceTypeバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        '',
                        validDistance,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('5: distanceバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        validSurfaceType,
                        -100,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('6: dateTimeバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        new Date('bad-date'),
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('7: locationバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        '',
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('8: gradeバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        'bad-grade',
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('9: numberバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        -1,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('10: updateDateバリデーション失敗で例外', () => {
                expect(() =>
                    HorseRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validDate,
                        validLocation,
                        validSurfaceType,
                        validDistance,
                        validGrade,
                        validNumber,
                        new Date('bad-date'),
                    ),
                ).toThrow('RaceRecord');
            });
        });

        describe('HorseRacingRaceRecord.copy', () => {
            let base: HorseRacingRaceRecord;
            beforeEach(() => {
                base = HorseRacingRaceRecord.create(
                    validRaceId,
                    raceType,
                    validName,
                    validDate,
                    validLocation,
                    validSurfaceType,
                    validDistance,
                    validGrade,
                    validNumber,
                    validUpdateDate,
                );
            });

            it('11: 全項目コピー（partial未指定）', () => {
                const copied = base.copy();
                expect(copied).not.toBe(base);
                expect(copied).toEqual(base);
            });

            it('12: gradeのみ変更', () => {
                const copied = base.copy({ grade: 'GⅡ' });
                expect(copied.id).toBe(base.id);
                expect(copied.raceType).toBe(base.raceType);
                expect(copied.name).toBe(base.name);
                expect(copied.dateTime).toEqual(base.dateTime);
                expect(copied.location).toBe(base.location);
                expect(copied.surfaceType).toBe(base.surfaceType);
                expect(copied.distance).toBe(base.distance);
                expect(copied.grade).toBe('GⅡ');
                expect(copied.number).toBe(base.number);
                expect(copied.updateDate).toEqual(base.updateDate);
            });

            it('13: nameバリデーション失敗で例外', () => {
                expect(() => base.copy({ name: '' })).toThrow('RaceRecord');
            });

            it('14: surfaceTypeバリデーション失敗で例外', () => {
                expect(() => base.copy({ surfaceType: '' })).toThrow(
                    'RaceRecord',
                );
            });

            it('15: distanceバリデーション失敗で例外', () => {
                expect(() => base.copy({ distance: -100 })).toThrow(
                    'RaceRecord',
                );
            });
        });
    },
);
