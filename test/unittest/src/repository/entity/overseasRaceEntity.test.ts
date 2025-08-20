import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseRaceData, baseRaceEntity } from '../../mock/common/baseCommonData';

describe('OverseasRaceEntityクラスのテスト', () => {
    it('正しい入力でOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        // インスタンスのプロパティが正しいか確認
        expect(baseRaceEntity(RaceType.OVERSEAS).id).toBe(
            'overseas202412290212',
        );
        expect(baseRaceEntity(RaceType.OVERSEAS).raceData).toStrictEqual(
            baseRaceData(RaceType.OVERSEAS),
        );
    });

    it('何も変更せずOverseasRaceEntityのインスタンスを作成できることを確認', () => {
        const copiedRaceEntity = baseRaceEntity(RaceType.OVERSEAS).copy();
        // インスタンスが変更されていないか確認
        expect(copiedRaceEntity.id).toEqual(
            baseRaceEntity(RaceType.OVERSEAS).id,
        );
        expect(copiedRaceEntity.raceData).toStrictEqual(
            baseRaceEntity(RaceType.OVERSEAS).raceData,
        );
    });

    it('何も変更せずOverseasRaceDataのインスタンスを作成できることを確認', () => {
        const { raceData } = baseRaceEntity(RaceType.OVERSEAS);
        // インスタンスが変更されていないか確認
        expect(raceData).toStrictEqual(baseRaceData(RaceType.OVERSEAS));
    });
});
