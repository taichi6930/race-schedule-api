import {
    baseRaceData,
    baseRaceEntity,
    testRaceTypeListAll,
} from '../../mock/common/baseCommonData';

describe('RaceEntityクラスのテスト', () => {
    describe.each(testRaceTypeListAll)('%s', (raceType) => {
        it('正しい入力でRaceEntityのインスタンスを作成できることを確認', () => {
            expect(baseRaceEntity(raceType).raceData).toStrictEqual(
                baseRaceData(raceType),
            );
        });

        it('何も変更せずRaceEntityのインスタンスを作成できることを確認', () => {
            const copiedRaceEntity = baseRaceEntity(raceType).copy();
            expect(copiedRaceEntity).toEqual(baseRaceEntity(raceType));
        });

        it('何も変更せずRaceDataのインスタンスを作成できることを確認', () => {
            const { raceData } = baseRaceEntity(raceType);
            expect(raceData).toEqual(baseRaceData(raceType));
        });
    });
});
