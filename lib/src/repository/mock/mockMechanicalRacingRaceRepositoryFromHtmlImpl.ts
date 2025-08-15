import { baseRacePlayerDataList } from '../../../../test/unittest/src/mock/common/baseCommonData';
import { RaceData } from '../../domain/raceData';
import { RaceStage } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { MechanicalRacingRaceEntity } from '../entity/mechanicalRacingRaceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// MechanicalRacingRaceRepositoryFromHtmlImplのモックを作成
export class MockMechanicalRacingRaceRepositoryFromHtmlImpl
    implements
        IRaceRepository<MechanicalRacingRaceEntity, MechanicalRacingPlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<MechanicalRacingPlaceEntity>,
    ): Promise<MechanicalRacingRaceEntity[]> {
        const { placeEntityList, raceType } = searchFilter;
        const raceEntityList: MechanicalRacingRaceEntity[] = [];
        for (const placeEntity of placeEntityList ?? []) {
            const { placeData, grade } = placeEntity;
            const { location, dateTime } = placeData;
            // 1から12までのレースを作成
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                const raceDate = new Date(dateTime);
                raceDate.setHours(raceNumber + 9, 0, 0, 0);
                raceEntityList.push(
                    MechanicalRacingRaceEntity.createWithoutId(
                        RaceData.create(
                            raceType,
                            `${raceType}${location}第${raceNumber.toString()}R`,
                            raceDate,
                            location,
                            grade,
                            raceNumber,
                        ),
                        this.createStage(raceType, raceNumber),
                        baseRacePlayerDataList(raceType),
                        getJSTDate(new Date()),
                    ),
                );
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    @Logger
    public async registerRaceEntityList(
        raceType: RaceType,
        raceEntityList: MechanicalRacingRaceEntity[],
    ): Promise<void> {
        console.debug(raceEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    private createStage(raceType: RaceType, raceNumber: number): RaceStage {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return raceNumber === 12 ? 'S級決勝' : 'S級予選';
            }
            case RaceType.BOATRACE: {
                return raceNumber === 12 ? '優勝戦' : '一般戦';
            }
            case RaceType.AUTORACE: {
                return raceNumber === 12 ? '優勝戦' : '予選';
            }
            case RaceType.JRA: {
                return '不明';
            }
            case RaceType.NAR: {
                return '不明';
            }
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }
}
