import { baseRacePlayerDataList } from '../../../../test/unittest/src/mock/common/baseCommonData';
import { RaceData } from '../../domain/raceData';
import { RaceStage } from '../../utility/data/common/raceStage';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { PlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import type { SearchRaceFilterEntity } from '../entity/searchRaceFilterEntity';
import type { IRaceRepository } from '../interface/IRaceRepository';

// MechanicalRacingRaceRepositoryFromHtmlImplのモックを作成
export class MockMechanicalRacingRaceRepositoryFromHtml
    implements IRaceRepository<RaceEntity, PlaceEntity>
{
    @Logger
    public async fetchRaceEntityList(
        searchFilter: SearchRaceFilterEntity<PlaceEntity>,
    ): Promise<RaceEntity[]> {
        const { placeEntityList, raceType } = searchFilter;
        const raceEntityList: RaceEntity[] = [];
        for (const placeEntity of placeEntityList) {
            const { placeData, grade } = placeEntity;
            const { location, dateTime } = placeData;
            // 1から12までのレースを作成
            for (let raceNumber = 1; raceNumber <= 12; raceNumber++) {
                const raceDate = new Date(dateTime);
                raceDate.setHours(raceNumber + 9, 0, 0, 0);
                raceEntityList.push(
                    RaceEntity.createWithoutId(
                        RaceData.create(
                            raceType,
                            `${raceType}${location}第${raceNumber.toString()}R`,
                            raceDate,
                            location,
                            grade,
                            raceNumber,
                        ),
                        undefined, // heldDayDataは未設定
                        undefined, // conditionDataは未設定
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
        raceEntityList: RaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: RaceEntity[];
        failureData: RaceEntity[];
    }> {
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
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }
}
