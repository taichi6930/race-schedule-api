import type { GradeType } from '../../../lib/src/utility/validateAndType/gradeType';
import type { RaceStage } from '../../../lib/src/utility/validateAndType/raceStage';
import type { SearchRaceFilterEntity } from '../../repository/entity/filter/searchRaceFilterEntity';
import type { RaceEntity } from '../../repository/entity/raceEntity';
import type { CommonParameter } from '../../utility/commonParameter';
import type { RaceType } from '../../utility/raceType';

export interface IRaceUseCase {
    fetchRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
        searchList?: {
            [RaceType.JRA]?: {
                gradeList?: GradeType[];
            };
            [RaceType.NAR]?: {
                gradeList?: GradeType[];
            };
            [RaceType.OVERSEAS]?: {
                gradeList?: GradeType[];
            };
            [RaceType.KEIRIN]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
            [RaceType.AUTORACE]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
            [RaceType.BOATRACE]?: {
                gradeList?: GradeType[];
                stageList?: RaceStage[];
            };
        },
    ) => Promise<RaceEntity[]>;

    upsertRaceEntityList: (
        commonParameter: CommonParameter,
        searchRaceFilter: SearchRaceFilterEntity,
    ) => Promise<void>;
}
