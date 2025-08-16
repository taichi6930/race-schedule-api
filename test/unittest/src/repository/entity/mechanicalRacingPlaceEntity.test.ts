/**
 * MechanicalRacingPlaceEntity テストディシジョンテーブル
 *
 * | No. | テスト内容                                                                 | 入力例・操作                                                                                  | 期待結果・確認ポイント                                 |
 * |-----|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------|
 * | 1   | 正しい入力でMechanicalRacingPlaceEntityのインスタンス作成                  | モックデータでcreate/copyを呼ぶ                                                              | プロパティが正しくセットされている                     |
 * | 2   | placeDataの日付だけ変更してcopy                                            | placeData.dateTimeのみ変更したcopyを呼ぶ                                                     | dateTimeのみ変更され、他は元の値                       |
 * | 3   | 何も変更せずcopy                                                          | copy()を引数なしで呼ぶ                                                                       | 全プロパティが元のインスタンスと同じ                    |
 * | 4   | toRecordでレコード変換                                                     | toRecord()を呼ぶ                                                                             | PlaceRecord.createが正しく呼ばれる      |
 * | 5   | createでバリデーションエラー（id, grade, updateDateの各パターン）          | 不正なid/grade/updateDateを渡してcreateを呼ぶ                                                | それぞれ例外がthrowされる                              |
 * | 6   | createWithoutIdでid自動生成                                                | createWithoutIdを呼ぶ                                                                        | idが自動生成され、他プロパティも正しくセット            |
 */

import { ZodError } from 'zod';

import { MechanicalRacingPlaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingPlaceEntity';
import {
    baseAutoracePlaceData,
    baseAutoracePlaceEntity,
    baseAutoracePlaceGrade,
    baseAutoracePlaceId,
    baseAutoracePlaceRecord,
    baseAutoraceRaceUpdateDate,
} from '../../mock/common/baseAutoraceData';
import {
    baseBoatracePlaceData,
    baseBoatracePlaceEntity,
    baseBoatracePlaceRecord,
} from '../../mock/common/baseBoatraceData';
import {
    baseKeirinPlaceData,
    baseKeirinPlaceEntity,
    baseKeirinPlaceRecord,
} from '../../mock/common/baseKeirinData';

describe('MechanicalRacingPlaceEntity', () => {
    it('正しい入力でMechanicalRacingPlaceEntityのインスタンスを作成できることを確認', () => {
        for (const { placeEntity, placeData } of [
            {
                placeEntity: baseKeirinPlaceEntity,
                placeData: baseKeirinPlaceData,
            },
            {
                placeEntity: baseAutoracePlaceEntity,
                placeData: baseAutoracePlaceData,
            },
            {
                placeEntity: baseBoatracePlaceEntity,
                placeData: baseBoatracePlaceData,
            },
        ]) {
            expect(placeEntity.placeData).toEqual(placeData);
        }
    });

    it('placeDataの日付だけ変更してcopy', () => {
        for (const { placeEntity, placeData } of [
            {
                placeEntity: baseKeirinPlaceEntity,
                placeData: baseKeirinPlaceData,
            },
            {
                placeEntity: baseAutoracePlaceEntity,
                placeData: baseAutoracePlaceData,
            },
            {
                placeEntity: baseBoatracePlaceEntity,
                placeData: baseBoatracePlaceData,
            },
        ]) {
            const copiedPlaceEntity = placeEntity.copy({
                placeData: placeData.copy({
                    dateTime: new Date('2022-12-30'),
                }),
            });

            expect(copiedPlaceEntity.placeData.dateTime).toEqual(
                new Date('2022-12-30'),
            );
            expect(copiedPlaceEntity.placeData.location).toBe(
                placeData.location,
            );
        }
    });

    it('何も変更せずPlaceEntityのインスタンスを作成できることを確認', () => {
        for (const { placeEntity, placeData } of [
            {
                placeEntity: baseKeirinPlaceEntity,
                placeData: baseKeirinPlaceData,
            },
            {
                placeEntity: baseAutoracePlaceEntity,
                placeData: baseAutoracePlaceData,
            },
            {
                placeEntity: baseBoatracePlaceEntity,
                placeData: baseBoatracePlaceData,
            },
        ]) {
            const copiedPlaceEntity = placeEntity.copy();
            expect(copiedPlaceEntity.id).toEqual(placeEntity.id);
            expect(copiedPlaceEntity.placeData).toBe(placeData);
        }
    });

    it('toRecordでレコード変換', () => {
        for (const { placeEntity, placeRecord } of [
            {
                placeEntity: baseKeirinPlaceEntity,
                placeRecord: baseKeirinPlaceRecord,
            },
            {
                placeEntity: baseAutoracePlaceEntity,
                placeRecord: baseAutoracePlaceRecord,
            },
            {
                placeEntity: baseBoatracePlaceEntity,
                placeRecord: baseBoatracePlaceRecord,
            },
        ]) {
            expect(placeEntity.toRecord()).toEqual(placeRecord);
        }
    });

    it('createでバリデーションエラー（id）', () => {
        try {
            MechanicalRacingPlaceEntity.create(
                '',
                baseAutoracePlaceData,
                'GP',
                new Date(),
            );
            fail('バリデーションエラーがthrowされるべき');
        } catch (error) {
            if (error instanceof ZodError) {
                // エラー内容に"autoraceから始まる必要があります"が含まれること
                expect(
                    error.issues.some(
                        (e) => e.message === 'autoraceから始まる必要があります',
                    ),
                ).toBe(true);
                // エラー内容に"autoracePlaceIdの形式ではありません"が含まれること
                expect(
                    error.issues.some(
                        (e) =>
                            e.message === 'autoracePlaceIdの形式ではありません',
                    ),
                ).toBe(true);
            } else {
                fail('ZodError以外がthrowされました');
            }
        }
    });

    it('createでバリデーションエラー（grade）', () => {
        try {
            MechanicalRacingPlaceEntity.create(
                baseAutoracePlaceId, // autoracePlaceIdの正しい形式
                baseAutoracePlaceData,
                '嘘のグレード',
                new Date(),
            );
            fail('バリデーションエラーがthrowされるべき');
        } catch (error) {
            if (error instanceof ZodError) {
                // エラー内容に「AUTORACEのグレードではありません」が含まれること
                expect(
                    error.issues.some(
                        (e) => e.message === 'AUTORACEのグレードではありません',
                    ),
                ).toBe(true);
            } else {
                fail('ZodError以外がthrowされました');
            }
        }
    });

    it('createWithoutIdでid自動生成', () => {
        const placeEntity = MechanicalRacingPlaceEntity.createWithoutId(
            baseAutoracePlaceData,
            baseAutoracePlaceGrade,
            baseAutoraceRaceUpdateDate,
        );
        expect(placeEntity).toEqual(baseAutoracePlaceEntity);
    });
});
