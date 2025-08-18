import type { RaceCourse } from '../../utility/data/common/raceCourse';
import type { RaceType } from '../../utility/raceType';


export interface IRaceDataHtmlGateway {
    
    getRaceDataHtml: (
        raceType: RaceType,
        date: Date,
        place?: RaceCourse,
        number?: number,
    ) => Promise<string>;
}
