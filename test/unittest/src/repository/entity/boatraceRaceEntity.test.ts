import {
    baseBoatraceRaceData,
    baseBoatraceRaceEntity,
} from '../../mock/common/baseBoatraceData';

describe('BoatraceRaceEntityクラスのテスト', () => {
    it('正しい入力でBoatraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseBoatraceRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.raceData).toBe(baseBoatraceRaceData);
    });

    it('何も変更せずBoatraceRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseBoatraceRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseBoatraceRaceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(baseBoatraceRaceData);
    });

    it('何も変更せずBoatraceRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseBoatraceRaceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseBoatraceRaceData);
    });
});
