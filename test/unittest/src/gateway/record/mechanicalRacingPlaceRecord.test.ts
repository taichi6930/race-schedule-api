import { PlaceData } from '../../../../../lib/src/domain/placeData';
import { MechanicalRacingPlaceRecord } from '../../../../../lib/src/gateway/record/mechanicalRacingPlaceRecord';
import { generatePlaceId } from '../../../../../lib/src/utility/data/common/placeId';
import { RaceType } from '../../../../../lib/src/utility/raceType';

/**
 * ディシジョンテーブル
 *
 * 【create/copy】
 * | No. | 操作   | id         | raceType   | dateTime      | location   | grade   | updateDate    | 期待結果         | 備考                      |
 * |-----|--------|------------|------------|---------------|------------|---------|--------------|------------------|---------------------------|
 * |  1  | create | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常なDate   | 正常に生成       | 正常系                    |
 * |  2  | create | 不正値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 正常なDate   | 例外発生         | idバリデーション失敗      |
 * |  3  | create | 正常値      | 正常値     | 不正なDate    | 正常値     | 正常値  | 正常なDate   | 例外発生         | dateTimeバリデーション失敗|
 * |  4  | create | 正常値      | 正常値     | 正常なDate    | 不正値     | 正常値  | 正常なDate   | 例外発生         | locationバリデーション失敗|
 * |  5  | create | 正常値      | 正常値     | 正常なDate    | 正常値     | 不正値  | 正常なDate   | 例外発生         | gradeバリデーション失敗   |
 * |  6  | create | 正常値      | 正常値     | 正常なDate    | 正常値     | 正常値  | 不正なDate   | 例外発生         | updateDateバリデーション失敗|
 * |  7  | copy   | undefined   | undefined  | undefined     | undefined  | undefined| undefined   | 全項目コピー     | デフォルトコピー          |
 * |  8  | copy   | undefined    | undefined  | undefined     | undefined  | 新しい値| undefined   | gradeのみ変更       | 部分更新                  |
 * |  9  | copy   | undefined   | undefined  | 不正なDate    | undefined  | undefined| undefined   | 例外発生         | dateTimeバリデーション失敗|
 *
 * 【toEntity】
 * | No. | 操作     | recordの値 | 期待結果           | 備考                    |
 * |-----|----------|------------|--------------------|-------------------------|
 * | 10  | toEntity | 正常値     | Entity生成できる    | Entityの値が一致        |
 */
describe('MechanicalRacingPlaceRecord', () => {
    const validRaceType = RaceType.KEIRIN;
    const validDate = new Date('2026-01-01T00:00:00Z');
    const validLocation = '立川';
    const validPlaceId = generatePlaceId(
        validRaceType,
        validDate,
        validLocation,
    );
    const validGrade = 'GⅠ';
    const validUpdateDate = new Date('2026-01-01T12:00:00Z');

    describe('MechanicalRacingPlaceRecord.create', () => {
        it('正常値ですべて生成できる', () => {
            const record = MechanicalRacingPlaceRecord.create(
                validPlaceId,
                validRaceType,
                validDate,
                validLocation,
                validGrade,
                validUpdateDate,
            );
            expect(record).toBeInstanceOf(MechanicalRacingPlaceRecord);
            expect(record.id).toBe(validPlaceId);
            expect(record.raceType).toBe(validRaceType);
            expect(record.dateTime).toBe(validDate);
            expect(record.location).toBe(validLocation);
            expect(record.grade).toBe(validGrade);
            expect(record.updateDate).toBe(validUpdateDate);
        });

        it('idバリデーション失敗で例外', () => {
            expect(() =>
                MechanicalRacingPlaceRecord.create(
                    'bad-id',
                    validRaceType,
                    validDate,
                    validLocation,
                    validGrade,
                    validUpdateDate,
                ),
            ).toThrow('Failed to create PlaceRecord');
        });

        it('dateTimeバリデーション失敗で例外', () => {
            expect(() =>
                MechanicalRacingPlaceRecord.create(
                    validPlaceId,
                    validRaceType,
                    new Date('bad-date'),
                    validLocation,
                    validGrade,
                    validUpdateDate,
                ),
            ).toThrow('Failed to create PlaceRecord');
        });

        it('locationバリデーション失敗で例外', () => {
            expect(() =>
                MechanicalRacingPlaceRecord.create(
                    validPlaceId,
                    validRaceType,
                    validDate,
                    'bad-location',
                    validGrade,
                    validUpdateDate,
                ),
            ).toThrow('Failed to create PlaceRecord');
        });

        it('gradeバリデーション失敗で例外', () => {
            expect(() =>
                MechanicalRacingPlaceRecord.create(
                    validPlaceId,
                    validRaceType,
                    validDate,
                    validLocation,
                    'bad-grade',
                    validUpdateDate,
                ),
            ).toThrow('Failed to create PlaceRecord');
        });

        it('updateDateバリデーション失敗で例外', () => {
            expect(() =>
                MechanicalRacingPlaceRecord.create(
                    validPlaceId,
                    validRaceType,
                    validDate,
                    validLocation,
                    validGrade,
                    new Date('bad-date'),
                ),
            ).toThrow('Failed to create PlaceRecord');
        });
    });

    describe('MechanicalRacingPlaceRecord.copy', () => {
        const base = MechanicalRacingPlaceRecord.create(
            validPlaceId,
            validRaceType,
            validDate,
            validLocation,
            validGrade,
            validUpdateDate,
        );

        it('全項目コピー（partial未指定）', () => {
            const copied = base.copy();
            expect(copied).not.toBe(base);
            expect(copied).toEqual(base);
        });

        it('gradeのみ変更', () => {
            const grade = 'GP';
            const copied = base.copy({ grade: grade });
            expect(copied.id).toBe(base.id);
            expect(copied.raceType).toBe(base.raceType);
            expect(copied.dateTime).toBe(base.dateTime);
            expect(copied.location).toBe(base.location);
            expect(copied.grade).toBe(grade);
            expect(copied.updateDate).toBe(base.updateDate);
        });

        it('dateTimeバリデーション失敗で例外', () => {
            expect(() => base.copy({ dateTime: new Date('bad-date') })).toThrow(
                'Failed to create PlaceRecord',
            );
        });
    });

    describe('MechanicalRacingPlaceRecord.toEntity', () => {
        const base = MechanicalRacingPlaceRecord.create(
            validPlaceId,
            validRaceType,
            validDate,
            validLocation,
            validGrade,
            validUpdateDate,
        );

        it('エンティティへの変換', () => {
            const entity = base.toEntity();
            expect(entity).toEqual({
                id: base.id,
                raceType: base.raceType,
                placeData: PlaceData.create(
                    base.raceType,
                    base.dateTime,
                    base.location,
                ),
                grade: base.grade,
                updateDate: base.updateDate,
            });
        });
    });
});
