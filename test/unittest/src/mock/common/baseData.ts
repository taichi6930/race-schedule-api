import { RaceType } from '../../../../../lib/src/utility/raceType';
import {
    baseAutoraceCalendarData,
    baseAutoraceCalendarDataFromGoogleCalendar,
    baseAutoraceRaceEntityList,
} from './baseAutoraceData';
import {
    baseBoatraceCalendarData,
    baseBoatraceCalendarDataFromGoogleCalendar,
    baseBoatraceRaceEntityList,
} from './baseBoatraceData';
import { basePlaceEntity, baseRaceEntity } from './baseCommonData';
import {
    baseJraCalendarData,
    baseJraCalendarDataFromGoogleCalendar,
    baseJraRaceEntityList,
} from './baseJraData';
import {
    baseKeirinCalendarData,
    baseKeirinCalendarDataFromGoogleCalendar,
    baseKeirinRaceEntityList,
} from './baseKeirinData';
import {
    baseNarCalendarData,
    baseNarCalendarDataFromGoogleCalendar,
    baseNarRaceEntityList,
} from './baseNarData';
import {
    baseOverseasCalendarData,
    baseOverseasCalendarDataFromGoogleCalendar,
    baseOverseasRaceEntityList,
} from './baseOverseasData';

export const baseRaceEntityListMap = {
    [RaceType.JRA]: baseJraRaceEntityList,
    [RaceType.NAR]: baseNarRaceEntityList,
    [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
    [RaceType.KEIRIN]: baseKeirinRaceEntityList,
    [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
    [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
};

export const baseCalendarDataFromGoogleCalendarMap = {
    [RaceType.JRA]: baseJraCalendarDataFromGoogleCalendar,
    [RaceType.NAR]: baseNarCalendarDataFromGoogleCalendar,
    [RaceType.OVERSEAS]: baseOverseasCalendarDataFromGoogleCalendar,
    [RaceType.KEIRIN]: baseKeirinCalendarDataFromGoogleCalendar,
    [RaceType.BOATRACE]: baseBoatraceCalendarDataFromGoogleCalendar,
    [RaceType.AUTORACE]: baseAutoraceCalendarDataFromGoogleCalendar,
};

export const baseCalendarDataMap = {
    [RaceType.JRA]: baseJraCalendarData,
    [RaceType.NAR]: baseNarCalendarData,
    [RaceType.OVERSEAS]: baseOverseasCalendarData,
    [RaceType.KEIRIN]: baseKeirinCalendarData,
    [RaceType.BOATRACE]: baseBoatraceCalendarData,
    [RaceType.AUTORACE]: baseAutoraceCalendarData,
};

export const baseRaceEntityMap = {
    [RaceType.JRA]: baseRaceEntity(RaceType.JRA),
    [RaceType.NAR]: baseRaceEntity(RaceType.NAR),
    [RaceType.OVERSEAS]: baseRaceEntity(RaceType.OVERSEAS),
    [RaceType.KEIRIN]: baseRaceEntity(RaceType.KEIRIN),
    [RaceType.AUTORACE]: baseRaceEntity(RaceType.AUTORACE),
    [RaceType.BOATRACE]: baseRaceEntity(RaceType.BOATRACE),
};

export const basePlaceEntityMap = {
    [RaceType.JRA]: basePlaceEntity(RaceType.JRA),
    [RaceType.NAR]: basePlaceEntity(RaceType.NAR),
    [RaceType.OVERSEAS]: undefined, // 海外競馬は未対応
    [RaceType.KEIRIN]: basePlaceEntity(RaceType.KEIRIN),
    [RaceType.AUTORACE]: basePlaceEntity(RaceType.AUTORACE),
    [RaceType.BOATRACE]: basePlaceEntity(RaceType.BOATRACE),
};
