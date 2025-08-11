import {
    baseNarRaceData,
    baseNarRaceEntity,
    baseNarRaceRecord,
} from '../../mock/common/baseNarData';

describe('NarRaceEntityクラスのテスト', () => {
    /**
     * テスト用のNarRaceEntityインスタンス
     */
    const baseRaceEntity = baseNarRaceEntity;

    it('正しい入力でNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('nar202412294411');
        expect(raceEntity.raceData).toBe(baseNarRaceData);
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const copiedRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(raceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const { raceData } = raceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseNarRaceData);
    });

    it('NarRaceEntityのインスタンスをNarRaceRecordに変換できることを確認', () => {
        const raceEntity = baseNarRaceEntity;
        const raceRecord = raceEntity.toRaceRecord();
        // NarRaceRecordが正しいか確認
        expect(raceRecord).toEqual(baseNarRaceRecord);
    });
});
