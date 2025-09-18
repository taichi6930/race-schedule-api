import { RaceData } from '../../../../src/domain/raceData';
import type { SearchRaceFilterEntity } from '../../../../src/repository/entity/filter/searchRaceFilterEntity';
import type { PlaceEntity } from '../../../../src/repository/entity/placeEntity';
import { RaceEntity } from '../../../../src/repository/entity/raceEntity';
import type { IRaceRepository } from '../../../../src/repository/interface/IRaceRepository';
import type { CommonParameter } from '../../../../src/utility/commonParameter';
import { RaceType } from '../../../../src/utility/raceType';
import type { UpsertResult } from '../../../../src/utility/upsertResult';
import type { RaceStage } from '../../../../src/utility/validateAndType/raceStage';
import { baseRacePlayerDataList } from '../../../../test/unittest/src/mock/common/baseCommonData';

// MechanicalRacingRaceRepositoryFromHtmlのモックを作成
export class MockMechanicalRacingRaceRepositoryFromHtml
    implements IRaceRepository
{
    public async fetchRaceEntityList(
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: PlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        if (!placeEntityList) return raceEntityList;
        for (const placeEntity of placeEntityList) {
            const { placeData, grade } = placeEntity;
            const { raceType, location, dateTime } = placeData;
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
                    ),
                );
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
        return raceEntityList;
    }

    public async upsertRaceEntityList(
        _commonParameter: CommonParameter,
        _entityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _commonParameter;
        void _entityList;
        return { successCount: 0, failureCount: 0, failures: [] };
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
                return raceNumber === 12 ? '優勝戦' : '一般戦';
            }
            case RaceType.JRA:
            case RaceType.NAR:
            case RaceType.OVERSEAS: {
                return '不明';
            }
        }
    }
}
