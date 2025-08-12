/**
 * MechanicalRacingRaceEntity テストディシジョンテーブル
 *
 * | No. | テスト内容                                                                 | 入力例・操作                                                                                  | 期待結果・確認ポイント                                 |
 * |-----|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------|
 * | 1   | 正しい入力でMechanicalRacingRaceEntityのインスタンス作成                   | モックデータでcreate/copyを呼ぶ                                                              | プロパティが正しくセットされている                     |
 * | 2   | raceDataのみ変更してcopy                                                   | raceDataのみ変更したcopyを呼ぶ                                                               | raceDataのみ変更され、他は元の値                       |
 * | 3   | racePlayerDataListのみ変更してcopy                                         | racePlayerDataListのみ変更したcopyを呼ぶ                                                     | racePlayerDataListのみ変更され、他は元の値              |
 * | 4   | 何も変更せずcopy                                                          | copy()を引数なしで呼ぶ                                                                       | 全プロパティが元のインスタンスと同じ                    |
 * | 5   | toRaceRecordでレコード変換                                                 | toRaceRecord()を呼ぶ                                                                         | MechanicalRacingRaceRecord.createが正しく呼ばれる       |
 * | 6   | toPlayerRecordListでレコードリスト変換                                     | toPlayerRecordList()を呼ぶ                                                                   | RacePlayerRecord.createが正しく呼ばれる                 |
 * | 7   | createでバリデーションエラー（id, updateDateの各パターン）                 | 不正なid/updateDateを渡してcreateを呼ぶ                                                      | それぞれ例外がthrowされる                              |
 * | 8   | createWithoutIdでid自動生成                                                | createWithoutIdを呼ぶ                                                                        | idが自動生成され、他プロパティも正しくセット            |
 */

import { MechanicalRacingRaceEntity } from '../../../../../lib/src/repository/entity/mechanicalRacingRaceEntity';
import {
    baseAutoraceRaceData,
    baseAutoraceRaceEntity,
    baseAutoraceRaceId,
    baseAutoraceRacePlayerDataList,
    baseAutoraceRaceRecord,
    baseAutoraceRaceStage,
    baseAutoraceRaceUpdateDate,
} from '../../mock/common/baseAutoraceData';

describe('MechanicalRacingRaceEntity', () => {
    it('正しい入力でMechanicalRacingRaceEntityのインスタンスを作成できることを確認', () => {
        const entity = MechanicalRacingRaceEntity.create(
            baseAutoraceRaceId,
            baseAutoraceRaceData,
            baseAutoraceRaceStage,
            baseAutoraceRacePlayerDataList,
            baseAutoraceRaceUpdateDate,
        );
        expect(entity.id).toBe(baseAutoraceRaceId);
        expect(entity.raceData).toBe(baseAutoraceRaceData);
        expect(entity.stage).toBe(baseAutoraceRaceStage);
        expect(entity.racePlayerDataList).toBe(baseAutoraceRacePlayerDataList);
        expect(entity.updateDate).toBe(baseAutoraceRaceUpdateDate);
    });

    it('raceDataのみ変更してcopy', () => {
        const entity = baseAutoraceRaceEntity;
        const raceData = baseAutoraceRaceData.copy({ name: '別レース' });
        const copied = entity.copy({ raceData: raceData });
        expect(copied.id).toBe(entity.id);
        expect(copied.raceData).toBe(raceData);
        expect(copied.stage).toBe(entity.stage);
        expect(copied.racePlayerDataList).toBe(entity.racePlayerDataList);
        expect(copied.updateDate).toBe(entity.updateDate);
    });

    it('racePlayerDataListのみ変更してcopy', () => {
        const entity = baseAutoraceRaceEntity;
        const racePlayerDataList = [...baseAutoraceRacePlayerDataList];
        const copied = entity.copy({ racePlayerDataList: racePlayerDataList });
        expect(copied.racePlayerDataList).toBe(racePlayerDataList);
        expect(copied.raceData).toBe(entity.raceData);
        expect(copied.stage).toBe(entity.stage);
        expect(copied.updateDate).toBe(entity.updateDate);
    });

    it('何も変更せずcopy', () => {
        const entity = baseAutoraceRaceEntity;
        const copied = entity.copy();
        expect(copied.id).toBe(entity.id);
        expect(copied.raceData).toBe(entity.raceData);
        expect(copied.stage).toBe(entity.stage);
        expect(copied.racePlayerDataList).toBe(entity.racePlayerDataList);
        expect(copied.updateDate).toBe(entity.updateDate);
    });

    it('toRaceRecordでレコード変換', () => {
        const entity = baseAutoraceRaceEntity;
        expect(entity.toRaceRecord()).toEqual(baseAutoraceRaceRecord);
    });

    it('toPlayerRecordListでレコードリスト変換', () => {
        const entity = baseAutoraceRaceEntity;
        expect(entity.toPlayerRecordList().length).toEqual(8);
    });

    it('createでバリデーションエラー（id）', () => {
        expect(() =>
            MechanicalRacingRaceEntity.create(
                '',
                baseAutoraceRaceData,
                baseAutoraceRaceStage,
                baseAutoraceRacePlayerDataList,
                baseAutoraceRaceUpdateDate,
            ),
        ).toThrow();
    });

    it('createでバリデーションエラー（updateDate）', () => {
        expect(() =>
            MechanicalRacingRaceEntity.create(
                baseAutoraceRaceId,
                baseAutoraceRaceData,
                baseAutoraceRaceStage,
                baseAutoraceRacePlayerDataList,
                new Date('invalid-date'),
            ),
        ).toThrow();
    });

    it('createWithoutIdでid自動生成', () => {
        const entity = MechanicalRacingRaceEntity.createWithoutId(
            baseAutoraceRaceData,
            baseAutoraceRaceStage,
            baseAutoraceRacePlayerDataList,
            baseAutoraceRaceUpdateDate,
        );
        expect(entity.raceData).toBe(baseAutoraceRaceData);
        expect(entity.stage).toBe(baseAutoraceRaceStage);
        expect(entity.racePlayerDataList).toBe(baseAutoraceRacePlayerDataList);
        expect(entity.updateDate).toBe(baseAutoraceRaceUpdateDate);
        expect(entity.id).toBeDefined();
    });
});
