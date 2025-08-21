/**
 * HorseRaceConditionData ディシジョンテーブル
 * |No|surfaceType|distance|partialの内容        |期待結果           |備考                |
 * |--|-----------|--------|---------------------|-------------------|---------------------|
 * |1 |有効       |有効    | -                   |OK                |正常系               |
 * |2 |無効       |有効    | -                   |Error             |surfaceTypeバリデーション|
 * |3 |有効       |無効    | -                   |Error             |distanceバリデーション   |
 * |4 |有効       |有効    |{ distance: 1800 }   |copyで値変更OK    |copy正常系            |
 * |5 |有効       |有効    |{ distance: 0 }      |copyで不正値→Error|copy異常系            |
 * |6 |有効       |有効    |{} または undefined  |全プロパティ同値  |copyでpartial空        |
 */

import { HorseRaceConditionData } from '../../../../lib/src/domain/houseRaceConditionData';
import { RaceType } from '../../../../lib/src/utility/raceType';
import {
    defaultRaceDistance,
    defaultRaceSurfaceType,
} from '../mock/common/baseCommonData';

describe('HorseRaceConditionDataクラスのテスト', () => {
    const raceType = RaceType.JRA;
    const validSurfaceType = defaultRaceSurfaceType[raceType];
    const invalidSurfaceType = 'ウッド';
    const validDistance = defaultRaceDistance[raceType];
    const invalidDistance = 0;

    // 1. 正常系
    it('|1|有効|有効|OK|', () => {
        const data = HorseRaceConditionData.create(
            validSurfaceType,
            validDistance,
        );
        expect(data.surfaceType).toBe(validSurfaceType);
        expect(data.distance).toBe(validDistance);
    });

    // 2. surfaceType無効
    it('|2|無効|有効|Error|', () => {
        expect(() =>
            HorseRaceConditionData.create(invalidSurfaceType, validDistance),
        ).toThrow();
    });

    // 3. distance無効
    it('|3|有効|無効|Error|', () => {
        expect(() =>
            HorseRaceConditionData.create(validSurfaceType, invalidDistance),
        ).toThrow();
    });

    // 4. copyで値変更
    it('|4|有効|有効|copyで値変更OK|', () => {
        const data = HorseRaceConditionData.create(
            validSurfaceType,
            validDistance,
        );
        const copied = data.copy({ distance: 1800 });
        expect(copied.surfaceType).toBe(validSurfaceType);
        expect(copied.distance).toBe(1800);
    });

    // 5. copyで不正値
    it('|5|有効|有効|copyで不正値→Error|', () => {
        const data = HorseRaceConditionData.create(
            validSurfaceType,
            validDistance,
        );
        expect(() => data.copy({ distance: invalidDistance })).toThrow();
    });

    // 6. copyでpartialが空
    it('|6|有効|有効|copyでpartial空→全プロパティ同値|', () => {
        const data = HorseRaceConditionData.create(
            validSurfaceType,
            validDistance,
        );
        // partial: undefined
        const copied1 = data.copy();
        expect(copied1.surfaceType).toBe(validSurfaceType);
        expect(copied1.distance).toBe(validDistance);
        // partial: {}
        const copied2 = data.copy({});
        expect(copied2.surfaceType).toBe(validSurfaceType);
        expect(copied2.distance).toBe(validDistance);
    });
});
