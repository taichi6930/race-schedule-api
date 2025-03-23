import {
    baseAutoraceRaceData,
    baseAutoraceRaceEntity,
} from '../../mock/common/baseAutoraceData';

describe('AutoraceRaceEntityクラスのテスト', () => {
    it('正しい入力でAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseAutoraceRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.raceData).toBe(baseAutoraceRaceData);
    });

    it('何も変更せずAutoraceRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseAutoraceRaceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseAutoraceRaceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(baseAutoraceRaceData);
    });

    it('何も変更せずAutoraceRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseAutoraceRaceEntity.raceData;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseAutoraceRaceData);
    });
});
