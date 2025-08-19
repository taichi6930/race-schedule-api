import {
    baseOverseasRaceData,
    baseOverseasRaceEntity,
} from '../../mock/common/baseOverseasData';

describe('OverseasRaceEntityクラスのテスト', () => {
    it('正しい入力でOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseOverseasRaceEntity.id).toBe('overseas202410010212');
        expect(baseOverseasRaceEntity.raceData).toBe(baseOverseasRaceData);
    });

    it('何も変更せずOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseOverseasRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseOverseasRaceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(baseOverseasRaceEntity.raceData);
    });

    it('何も変更せずOverseasRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseOverseasRaceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseOverseasRaceData);
    });
});
