import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceData, baseRaceEntity } from '../../mock/common/baseCommonData';

describe('JraRaceEntityクラスのテスト', () => {
    it('正しい入力でJraRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseRaceEntity(RaceType.JRA).id).toBe('jra202412290512');
        expect(baseRaceEntity(RaceType.JRA).raceData).toStrictEqual(
            baseRaceData(RaceType.JRA),
        );
    });

    it('何も変更せずJraRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseRaceEntity(RaceType.JRA).copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseRaceEntity(RaceType.JRA).id);
        expect(copiedRaceEntity.raceData).toStrictEqual(
            baseRaceEntity(RaceType.JRA).raceData,
        );
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseRaceEntity(RaceType.JRA);
        // インスタンスが変更されていないか確認
        expect(raceData).toStrictEqual(baseRaceData(RaceType.JRA));
    });
});
