import {
    baseNarRaceData,
    baseNarRaceEntity,
} from '../../mock/common/baseNarData';

describe('NarRaceEntityクラスのテスト', () => {
    it('正しい入力でNarRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseNarRaceEntity.id).toBe('nar202412294412');
        expect(baseNarRaceEntity.raceData).toBe(baseNarRaceData);
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseNarRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseNarRaceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(baseNarRaceEntity.raceData);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseNarRaceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseNarRaceData);
    });
});
