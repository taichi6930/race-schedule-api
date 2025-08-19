import {
    baseJraRaceData,
    baseJraRaceEntity,
} from '../../mock/common/baseJraData';

describe('JraRaceEntityクラスのテスト', () => {
    it('正しい入力でJraRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseJraRaceEntity.id).toBe('jra202412220612');
        expect(baseJraRaceEntity.raceData).toBe(baseJraRaceData);
    });

    it('何も変更せずJraRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseJraRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseJraRaceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(baseJraRaceEntity.raceData);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseJraRaceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseJraRaceData);
    });
});
