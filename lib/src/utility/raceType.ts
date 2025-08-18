
export const RaceType = {
    JRA: 'JRA',
    NAR: 'NAR',
    KEIRIN: 'KEIRIN',
    OVERSEAS: 'OVERSEAS',
    AUTORACE: 'AUTORACE',
    BOATRACE: 'BOATRACE',
} as const;

export type RaceType = (typeof RaceType)[keyof typeof RaceType];

export function isRaceType(value: string): value is RaceType {
    
    value = value.toUpperCase();
    return (Object.values(RaceType) as string[]).includes(value);
}

export const convertRaceTypeList = (
    raceTypeList: string[] | undefined,
): RaceType[] => {
    if (raceTypeList == undefined) return [];
    
    return raceTypeList
        .map((type) => {
            
            switch (type.toLowerCase()) {
                case 'jra': {
                    return RaceType.JRA;
                }
                case 'nar': {
                    return RaceType.NAR;
                }
                case 'overseas': {
                    return RaceType.OVERSEAS;
                }
                case 'keirin': {
                    return RaceType.KEIRIN;
                }
                case 'autorace': {
                    return RaceType.AUTORACE;
                }
                case 'boatrace': {
                    return RaceType.BOATRACE;
                }
                default: {
                    return 'undefined'; 
                }
            }
        })
        .filter((type): type is RaceType => type !== 'undefined');
};
