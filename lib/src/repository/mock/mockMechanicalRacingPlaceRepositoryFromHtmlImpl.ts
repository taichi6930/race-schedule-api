import { PlaceData } from '../../domain/placeData';
import { GradeType } from '../../utility/data/common/gradeType';
import { getJSTDate } from '../../utility/date';
import { Logger } from '../../utility/logger';
import { RaceType } from '../../utility/raceType';
import { MechanicalRacingPlaceEntity } from '../entity/mechanicalRacingPlaceEntity';
import { SearchPlaceFilterEntity } from '../entity/searchPlaceFilterEntity';
import { IPlaceRepository } from '../interface/IPlaceRepository';

export class MockMechanicalRacingPlaceRepositoryFromHtmlImpl
    implements IPlaceRepository<MechanicalRacingPlaceEntity>
{
    /**
     * 場データを取得する
     * @param searchFilter
     */
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            const placeEntity = MechanicalRacingPlaceEntity.createWithoutId(
                searchFilter.raceType,
                PlaceData.create(
                    searchFilter.raceType,
                    new Date(currentDate),
                    this.createLocation(searchFilter.raceType),
                ),
                this.createGrade(searchFilter.raceType),
                getJSTDate(new Date()),
            );
            placeEntityList.push(placeEntity);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return placeEntityList;
    }

    /**
     * 開催データを登録する
     * HTMLにはデータを登録しない
     * @param raceType
     * @param placeEntityList
     */
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<void> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    private createLocation(raceType: RaceType): string {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return '川崎';
            }
            case RaceType.BOATRACE: {
                return '平和島';
            }
            case RaceType.AUTORACE: {
                return '伊勢崎';
            }
            case RaceType.JRA: {
                return '不明';
            }
            case RaceType.NAR: {
                return '不明';
            }
            case RaceType.WORLD: {
                return '不明';
            }
            default: {
                return '不明';
            }
        }
    }

    private createGrade(raceType: RaceType): GradeType {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return 'GP';
            }
            case RaceType.BOATRACE: {
                return 'SG';
            }
            case RaceType.AUTORACE: {
                return 'SG';
            }
            case RaceType.JRA: {
                return '不明';
            }
            case RaceType.NAR: {
                return '不明';
            }
            case RaceType.WORLD: {
                return '不明';
            }
            default: {
                return '不明';
            }
        }
    }
}
