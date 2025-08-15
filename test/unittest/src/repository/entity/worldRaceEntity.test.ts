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
        expect(raceEntity.id).toBe('world20241001longchamp12');
        expect(raceEntity.raceData).toBe(baseWorldRaceData);
    });

    it('何も変更せずWorldRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const copiedRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(raceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずWorldRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const { raceData } = raceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseWorldRaceData);
    });
});
