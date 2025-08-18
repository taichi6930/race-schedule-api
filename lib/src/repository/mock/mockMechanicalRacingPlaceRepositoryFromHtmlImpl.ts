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
    
    @Logger
    public async fetchPlaceEntityList(
        searchFilter: SearchPlaceFilterEntity,
    ): Promise<MechanicalRacingPlaceEntity[]> {
        const placeEntityList = [];
        const currentDate = new Date(searchFilter.startDate);

        while (currentDate <= searchFilter.finishDate) {
            const placeEntity = MechanicalRacingPlaceEntity.createWithoutId(
                PlaceData.create(
                    searchFilter.raceType,
                    new Date(currentDate),
                    this.defaultLocation[searchFilter.raceType],
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

    
    @Logger
    public async registerPlaceEntityList(
        raceType: RaceType,
        placeEntityList: MechanicalRacingPlaceEntity[],
    ): Promise<{
        code: number;
        message: string;
        successData: MechanicalRacingPlaceEntity[];
        failureData: MechanicalRacingPlaceEntity[];
    }> {
        console.debug(placeEntityList);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw new Error('HTMLにはデータを登録出来ません');
    }

    private readonly defaultLocation = {
        [RaceType.JRA]: '東京',
        [RaceType.NAR]: '大井',
        [RaceType.OVERSEAS]: 'パリロンシャン',
        [RaceType.KEIRIN]: '平塚',
        [RaceType.AUTORACE]: '川口',
        [RaceType.BOATRACE]: '浜名湖',
    };

    private createGrade(raceType: RaceType): GradeType {
        switch (raceType) {
            case RaceType.KEIRIN: {
                return 'GⅠ';
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
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }
}
