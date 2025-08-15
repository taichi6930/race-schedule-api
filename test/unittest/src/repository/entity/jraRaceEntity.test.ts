import {
    baseJraRaceData,
    baseJraRaceEntity,
    baseJraRaceRecord,
} from '../../mock/common/baseJraData';

describe('JraRaceEntityクラスのテスト', () => {
    /**
     * テスト用のJraRaceEntityインスタンス
     */
    const baseRaceEntity = baseJraRaceEntity;

    it('正しい入力でJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('jra202412220612');
        expect(raceEntity.raceData).toBe(baseJraRaceData);
    });

    it('何も変更せずJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const copiedRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(raceEntity.id);
        expect(copiedRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const { raceData } = raceEntity;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseJraRaceData);
    });

    it('JraRaceEntityのインスタンスをJraRaceRecordに変換できることを確認', () => {
        const raceEntity = baseJraRaceEntity;
        const raceRecord = raceEntity.toRaceRecord();
        // JraRaceRecordが正しいか確認
        expect(raceRecord).toEqual(baseJraRaceRecord);
    });
});
