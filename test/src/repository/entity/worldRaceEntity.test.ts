import {
    baseWorldRaceData,
    baseWorldRaceEntity,
} from '../../mock/common/baseWorldData';

describe('WorldRaceEntityクラスのテスト', () => {
    /**
     * テスト用のWorldRaceEntityインスタンス
     */
    const baseRaceEntity = baseWorldRaceEntity;

    it('正しい入力でWorldRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('world20241001longchamp11');
        expect(raceEntity.raceData).toBe(baseWorldRaceData);
    });

    it('何も変更せずWorldRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(raceEntity.id);
        expect(newRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.raceData;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseWorldRaceData);
    });
});
