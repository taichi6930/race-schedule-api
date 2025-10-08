import type { SearchRaceFilterEntity } from '../../../../../src/repository/entity/filter/searchRaceFilterEntity';
import type { IRaceRepository } from '../../../../../src/repository/interface/IRaceRepository';
import type { RaceType } from '../../../../../src/utility/raceType';
import { baseRaceEntity, baseRaceEntityList } from '../common/baseCommonData';

export const mockRaceRepository = (): jest.Mocked<IRaceRepository> => {
    return {
        fetchRaceEntityList: jest
            .fn()
            .mockImplementation(
                async (searchFilter: SearchRaceFilterEntity) => {
                    const { raceTypeList } = searchFilter;
                    return raceTypeList.map((raceType) =>
                        baseRaceEntity(raceType),
                    );
                },
            ),
        upsertRaceEntityList: jest
            .fn()
            .mockImplementation(async (raceType: RaceType) => {
                return {
                    code: 200,
                    message: 'OK',
                    successData: baseRaceEntityList(raceType),
                    failureData: [],
                };
            }),
    };
};
