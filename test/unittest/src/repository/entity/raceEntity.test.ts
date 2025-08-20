import { ALL_RACE_TYPE_LIST } from '../../../../../lib/src/utility/raceType';
import { baseRaceData, baseRaceEntity } from '../../mock/common/baseCommonData';

describe('RaceEntityクラスのテスト', () => {
    for (const raceType of ALL_RACE_TYPE_LIST) {
        it('正しい入力でRaceEntityのインスタンスを作成できることを確認', () => {
            // インスタンスのプロパティが正しいか確認
            expect(baseRaceEntity(raceType).raceData).toStrictEqual(
                baseRaceData(raceType),
            );
        });

        it('何も変更せずRaceEntityのインスタンスを作成できることを確認', () => {
            const copiedRaceEntity = baseRaceEntity(raceType).copy();
            // インスタンスが変更されていないか確認
            expect(copiedRaceEntity.id).toEqual(baseRaceEntity(raceType).id);
            expect(copiedRaceEntity.raceData).toStrictEqual(
                baseRaceEntity(raceType).raceData,
            );
        });

        it('何も変更せずRaceDataのインスタンスを作成できることを確認', () => {
            const { raceData } = baseRaceEntity(raceType);
            // インスタンスが変更されていないか確認
            expect(raceData).toStrictEqual(baseRaceData(raceType));
        });
    }
});
