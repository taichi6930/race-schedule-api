import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceData, baseRaceEntity } from '../../mock/common/baseCommonData';

describe('NarRaceEntityクラスのテスト', () => {
    it('正しい入力でNarRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseRaceEntity(RaceType.NAR).id).toBe('nar202412294412');
        expect(baseRaceEntity(RaceType.NAR).raceData).toStrictEqual(
            baseRaceData(RaceType.NAR),
        );
    });

    it('何も変更せずNarRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseRaceEntity(RaceType.NAR).copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(baseRaceEntity(RaceType.NAR).id);
        expect(copiedRaceEntity.raceData).toStrictEqual(
            baseRaceEntity(RaceType.NAR).raceData,
        );
    });

    it('何も変更せずNarRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseRaceEntity(RaceType.NAR);
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseRaceData(RaceType.NAR));
    });
});
