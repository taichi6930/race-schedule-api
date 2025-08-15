import {
    baseOverseasRaceData,
    baseOverseasRaceEntity,
} from '../../mock/common/baseOverseasData';

describe('OverseasRaceEntityクラスのテスト', () => {
    /**
     * テスト用のOverseasRaceEntityインスタンス
     */
    const baseRaceEntity = baseOverseasRaceEntity;

    it('正しい入力でOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('overseas202410010212');
        expect(raceEntity.raceData).toBe(baseOverseasRaceData);
    });

    it('何も変更せずOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const copiedRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(raceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずOverseasRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const { raceData } = raceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseOverseasRaceData);
    });
});
