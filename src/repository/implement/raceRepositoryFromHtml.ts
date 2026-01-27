import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { validateRaceDistance } from '../../../packages/shared/src/types/raceDistance';
import { RaceType } from '../../../packages/shared/src/types/raceType';
import { RaceSurfaceType } from '../../../packages/shared/src/types/surfaceType';
import { validateGradeType } from '../../../packages/shared/src/utilities/gradeType';
import { Logger } from '../../../packages/shared/src/utilities/logger';
import {
    RaceCourse,
    validateRaceCourse,
} from '../../../packages/shared/src/utilities/raceCourse';
import {
    RaceStage,
    StageMap,
} from '../../../packages/shared/src/utilities/raceStage';
import type { UpsertResult } from '../../../packages/shared/src/utilities/upsertResult';
import { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import { RaceData } from '../../domain/raceData';
import { RacePlayerData } from '../../domain/racePlayerData';
import type { IScrapingApiGateway } from '../../gateway/interface/iScrapingApiGateway';
import {
    isIncludedRaceType,
    RACE_TYPE_LIST_HORSE_RACING,
} from '../../utility/raceType';
import { SearchRaceFilterEntity } from '../entity/filter/searchRaceFilterEntity';
import { OldPlaceEntity } from '../entity/placeEntity';
import { RaceEntity } from '../entity/raceEntity';
import { IRaceRepository } from '../interface/IRaceRepository';

/**
 * レースデータリポジトリの実装
 * ScrapingAPIを経由してレースデータを取得する
 */
@injectable()
export class RaceRepositoryFromHtml implements IRaceRepository {
    public constructor(
        @inject('ScrapingApiGateway')
        private readonly scrapingApiGateway: IScrapingApiGateway,
    ) {}

    /**
     * 開催データを取得する
     * ScrapingAPIを経由してデータを取得し、RaceEntityに変換する
     * @param searchRaceFilter
     * @param placeEntityList
     */
    @Logger
    public async fetchRaceEntityList(
        searchRaceFilter: SearchRaceFilterEntity,
        placeEntityList?: OldPlaceEntity[],
    ): Promise<RaceEntity[]> {
        const raceEntityList: RaceEntity[] = [];
        if (!placeEntityList) return raceEntityList;

        // searchRaceFilterのgradeListが空の場合はすべてのグレードを対象とする
        const filteredPlaceEntityList: OldPlaceEntity[] =
            placeEntityList.filter((placeEntity) => {
                if (searchRaceFilter.gradeList.length === 0) {
                    return true;
                }
                // JRA, NAR, OVERSEASの場合はそのままtrue
                if (
                    isIncludedRaceType(
                        placeEntity.placeData.raceType,
                        RACE_TYPE_LIST_HORSE_RACING,
                    )
                ) {
                    return true;
                }
                return searchRaceFilter.gradeList.includes(placeEntity.grade);
            });

        // raceTypeごとにまとめる
        const raceTypeMap = new Map<RaceType, OldPlaceEntity[]>();
        for (const placeEntity of filteredPlaceEntityList) {
            const { raceType } = placeEntity.placeData;
            if (!raceTypeMap.has(raceType)) {
                raceTypeMap.set(raceType, []);
            }
            raceTypeMap.get(raceType)?.push(placeEntity);
        }

        // 各raceTypeごとにScrapingAPIを呼び出す
        for (const [raceType, places] of raceTypeMap.entries()) {
            const dates = places.map((p) => p.placeData.dateTime);
            const minDate = new Date(
                Math.min(...dates.map((d) => d.getTime())),
            );
            const maxDate = new Date(
                Math.max(...dates.map((d) => d.getTime())),
            );

            const locationList = [
                ...new Set(places.map((p) => p.placeData.location)),
            ];

            // ScrapingAPIからレースデータを取得
            const raceHtmlEntities =
                await this.scrapingApiGateway.fetchRaceList(
                    [raceType],
                    minDate,
                    maxDate,
                    locationList,
                    searchRaceFilter.gradeList.length > 0
                        ? searchRaceFilter.gradeList
                        : undefined,
                );

            // RaceHtmlEntityをRaceEntityに変換
            for (const htmlEntity of raceHtmlEntities) {
                try {
                    // 対応するplaceEntityを検索
                    const placeEntity = places.find(
                        (p) =>
                            p.placeData.dateTime.getTime() ===
                                htmlEntity.datetime.getTime() &&
                            p.placeData.location === htmlEntity.location,
                    );

                    if (!placeEntity) {
                        continue;
                    }

                    // HTMLエンティティからRaceEntityに変換
                    const raceEntity = this.convertHtmlEntityToRaceEntity(
                        htmlEntity,
                        placeEntity,
                    );

                    if (raceEntity) {
                        raceEntityList.push(raceEntity);
                    }
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : 'Unknown error';
                    console.error(
                        `Error converting race entity: ${errorMessage}`,
                        htmlEntity,
                    );
                }
            }
        }

        return raceEntityList;
    }

    /**
     * RaceHtmlEntityをRaceEntityに変換する
     */
    private convertHtmlEntityToRaceEntity(
        htmlEntity: {
            raceType: RaceType;
            datetime: Date;
            location: string;
            raceNumber: number;
            raceName: string;
            grade?: string;
            distance?: number;
            surfaceType?: string;
            stage?: string;
            additionalInfo?: Record<string, unknown>;
        },
        placeEntity: OldPlaceEntity,
    ): RaceEntity | null {
        try {
            const placeName: RaceCourse = validateRaceCourse(
                htmlEntity.raceType,
                htmlEntity.location,
            );

            const raceData = RaceData.create(
                htmlEntity.raceType,
                htmlEntity.datetime,
                placeName,
                htmlEntity.raceNumber,
                htmlEntity.raceName,
                htmlEntity.grade
                    ? validateGradeType(htmlEntity.raceType, htmlEntity.grade)
                    : undefined,
            );

            // HorseRaceConditionData の構築
            let conditionData: HorseRaceConditionData | undefined;
            if (
                isIncludedRaceType(
                    htmlEntity.raceType,
                    RACE_TYPE_LIST_HORSE_RACING,
                ) &&
                htmlEntity.distance &&
                htmlEntity.surfaceType
            ) {
                const distance = validateRaceDistance(
                    htmlEntity.raceType,
                    htmlEntity.distance,
                );
                const surfaceType = htmlEntity.surfaceType as RaceSurfaceType;

                conditionData = HorseRaceConditionData.create(
                    distance,
                    surfaceType,
                );
            }

            // Stage の構築
            let stage: RaceStage | undefined;
            if (htmlEntity.stage) {
                const stageMap = new StageMap();
                stage = stageMap.get(htmlEntity.raceType, htmlEntity.stage);
            }

            // RacePlayerData は空配列（機械系レース用）
            let racePlayerDataList: RacePlayerData[] | undefined;
            if (
                !isIncludedRaceType(
                    htmlEntity.raceType,
                    RACE_TYPE_LIST_HORSE_RACING,
                )
            ) {
                racePlayerDataList = [];
            }

            return RaceEntity.createWithoutId(
                placeEntity.id || '',
                raceData,
                placeEntity.heldDayData,
                conditionData,
                stage,
                racePlayerDataList,
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
            console.error(
                `Error in convertHtmlEntityToRaceEntity: ${errorMessage}`,
            );
            return null;
        }
    }

    /**
     * レースデータを登録する
     * HTMLにはデータを登録しない
     */
    @Logger
    public async upsertRaceList(
        _raceEntityList: RaceEntity[],
    ): Promise<UpsertResult> {
        void _raceEntityList;
        return {
            successCount: 0,
            failureCount: 0,
            failures: [],
        };
    }
}
