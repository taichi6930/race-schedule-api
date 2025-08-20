import { RaceType } from '../../../../../lib/src/utility/raceType';
import { baseAutoraceRaceEntityList } from './baseAutoraceData';
import { baseBoatraceRaceEntityList } from './baseBoatraceData';
import {
    baseCalendarData,
    baseCalendarDataFromGoogleCalendar,
    basePlaceEntity,
    baseRaceEntity,
} from './baseCommonData';
import { baseJraRaceEntityList } from './baseJraData';
import { baseKeirinRaceEntityList } from './baseKeirinData';
import { baseNarRaceEntityList } from './baseNarData';
import { baseOverseasRaceEntityList } from './baseOverseasData';

export const baseRaceEntityListMap = {
    [RaceType.JRA]: baseJraRaceEntityList,
    [RaceType.NAR]: baseNarRaceEntityList,
    [RaceType.OVERSEAS]: baseOverseasRaceEntityList,
    [RaceType.KEIRIN]: baseKeirinRaceEntityList,
    [RaceType.AUTORACE]: baseAutoraceRaceEntityList,
    [RaceType.BOATRACE]: baseBoatraceRaceEntityList,
};

export const baseCalendarDataFromGoogleCalendarMap = {
    [RaceType.JRA]: baseCalendarDataFromGoogleCalendar(RaceType.JRA),
    [RaceType.NAR]: baseCalendarDataFromGoogleCalendar(RaceType.NAR),
    [RaceType.OVERSEAS]: baseCalendarDataFromGoogleCalendar(RaceType.OVERSEAS),
    [RaceType.KEIRIN]: baseCalendarDataFromGoogleCalendar(RaceType.KEIRIN),
    [RaceType.BOATRACE]: baseCalendarDataFromGoogleCalendar(RaceType.BOATRACE),
    [RaceType.AUTORACE]: baseCalendarDataFromGoogleCalendar(RaceType.AUTORACE),
};

export const baseCalendarDataMap = {
    [RaceType.JRA]: baseCalendarData(RaceType.JRA),
    [RaceType.NAR]: baseCalendarData(RaceType.NAR),
    [RaceType.OVERSEAS]: baseCalendarData(RaceType.OVERSEAS),
    [RaceType.KEIRIN]: baseCalendarData(RaceType.KEIRIN),
    [RaceType.BOATRACE]: baseCalendarData(RaceType.BOATRACE),
    [RaceType.AUTORACE]: baseCalendarData(RaceType.AUTORACE),
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
