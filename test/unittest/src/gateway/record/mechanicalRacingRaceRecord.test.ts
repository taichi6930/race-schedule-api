/**
 * ディシジョンテーブル
 *
 * 【create/copy】
 * | No. | 操作   | id         | raceType   | name      | stage     | dateTime      | location   | grade   | number   | updateDate    | 期待結果         | 備考                      |
 * |-----|--------|------------|------------|-----------|-----------|---------------|------------|---------|----------|--------------|------------------|---------------------------|
 * |  1  | create | 正常値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 正常に生成       | 正常系                    |
 * |  2  | create | 不正値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | idバリデーション失敗      |
 * |  3  | create | 正常値      | 正常値     | 不正値    | 正常値    | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | nameバリデーション失敗    |
 * |  4  | create | 正常値      | 正常値     | 正常値    | 不正値    | 正常なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | stageバリデーション失敗   |
 * |  5  | create | 正常値      | 正常値     | 正常値    | 正常値    | 不正なDate    | 正常値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | dateTimeバリデーション失敗|
 * |  6  | create | 正常値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 不正値     | 正常値  | 正常値   | 正常なDate   | 例外発生         | locationバリデーション失敗|
 * |  7  | create | 正常値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 正常値     | 不正値  | 正常値   | 正常なDate   | 例外発生         | gradeバリデーション失敗   |
 * |  8  | create | 正常値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 正常値     | 正常値  | 不正値   | 正常なDate   | 例外発生         | numberバリデーション失敗  |
 * |  9  | create | 正常値      | 正常値     | 正常値    | 正常値    | 正常なDate    | 正常値     | 正常値  | 正常値   | 不正なDate   | 例外発生         | updateDateバリデーション失敗|
 * | 10  | copy   | undefined  | undefined | undefined | undefined | undefined     | undefined  | undefined| undefined| undefined    | 全項目コピー     | デフォルトコピー          |
 * | 11  | copy   | undefined  | undefined | undefined | undefined | undefined     | undefined  | 新しい値| undefined| undefined    | gradeのみ変更       | 部分更新                  |
 * | 12  | copy   | undefined  | undefined | 不正値    | undefined | undefined     | undefined  | undefined| undefined| undefined    | 例外発生         | nameバリデーション失敗    |
 */
import { MechanicalRacingRaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { generateRaceId } from '../../../../../lib/src/utility/data/validateAndType/raceId';
import {
    defaultLocation,
    defaultStage,
    testRaceTypeListMechanicalRacing,
} from '../../mock/common/baseCommonData';

describe.each(testRaceTypeListMechanicalRacing)(
    'MechanicalRacingRaceRecord(%s)',
    (raceType) => {
        const validDate = new Date('2026-01-01T00:00:00Z');
        const validLocation = defaultLocation[raceType];
        const validNumber = 1;
        const validRaceId = generateRaceId(
            raceType,
            validDate,
            validLocation,
            validNumber,
        );
        const validName = '第1レース';
        const validStage = defaultStage[raceType];
        const validGrade = 'GⅠ';
        const validUpdateDate = new Date('2026-01-01T12:00:00Z');

        describe('MechanicalRacingRaceRecord.create', () => {
            it('正常値ですべて生成できる', () => {
                const record = MechanicalRacingRaceRecord.create(
                    validRaceId,
                    raceType,
                    validName,
                    validStage,
                    validDate,
                    validLocation,
                    validGrade,
                    validNumber,
                    validUpdateDate,
                );
                expect(record).toBeInstanceOf(MechanicalRacingRaceRecord);
                expect(record.id).toBeDefined();
                expect(record.raceType).toBe(raceType);
                expect(record.name).toBeDefined();
                expect(record.stage).toBeDefined();
                expect(record.dateTime).toBeDefined();
                expect(record.location).toBeDefined();
                expect(record.grade).toBeDefined();
                expect(record.number).toBeDefined();
                expect(record.updateDate).toBeDefined();
            });

            it('idバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        'bad-id',
                        raceType,
                        validName,
                        validStage,
                        validDate,
                        validLocation,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('nameバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        '',
                        validStage,
                        validDate,
                        validLocation,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('stageバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        '',
                        validDate,
                        validLocation,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('dateTimeバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validStage,
                        new Date('bad-date'),
                        validLocation,
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('locationバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validStage,
                        validDate,
                        'bad-location',
                        validGrade,
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('gradeバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validStage,
                        validDate,
                        validLocation,
                        'bad-grade',
                        validNumber,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('numberバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validStage,
                        validDate,
                        validLocation,
                        validGrade,
                        -1,
                        validUpdateDate,
                    ),
                ).toThrow('RaceRecord');
            });

            it('updateDateバリデーション失敗で例外', () => {
                expect(() =>
                    MechanicalRacingRaceRecord.create(
                        validRaceId,
                        raceType,
                        validName,
                        validStage,
                        validDate,
                        validLocation,
                        validGrade,
                        validNumber,
                        new Date('bad-date'),
                    ),
                ).toThrow('RaceRecord');
            });
        });

        describe('MechanicalRacingRaceRecord.copy', () => {
            const base = MechanicalRacingRaceRecord.create(
                validRaceId,
                raceType,
                validName,
                validStage,
                validDate,
                validLocation,
                validGrade,
                validNumber,
                validUpdateDate,
            );

            it('全項目コピー（partial未指定）', () => {
                const copied = base.copy();
                expect(copied).not.toBe(base);
                expect(copied).toEqual(base);
            });

            it('gradeのみ変更', () => {
                const copied = base.copy({ grade: 'GⅡ' });
                expect(copied.id).toBe(base.id);
                expect(copied.raceType).toBe(base.raceType);
                expect(copied.name).toBe(base.name);
                expect(copied.stage).toBe(base.stage);
                expect(copied.dateTime).toBe(base.dateTime);
                expect(copied.location).toBe(base.location);
                expect(copied.grade).toBe('GⅡ');
                expect(copied.number).toBe(base.number);
                expect(copied.updateDate).toBe(base.updateDate);
            });

            it('nameバリデーション失敗で例外', () => {
                expect(() => base.copy({ name: '' })).toThrow('RaceRecord');
            });
        });
    },
);
