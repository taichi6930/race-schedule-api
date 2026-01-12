// 地方競馬データ加工用サービス
import { HeldDayData } from '../../../../src/domain/heldDayData';
import { HorseRaceConditionData } from '../../../../src/domain/houseRaceConditionData';
import { RaceData } from '../../../../src/domain/raceData';
import { RaceEntity } from '../../../../src/repository/entity/raceEntity';

/**
 * DBやスクレイピングから取得した生データを、RaceEntityリストへ加工する
 * @param rawRows DBやスクレイピングで取得した生データ
 */
export function convertToRaceEntities(rawRows: any[]): RaceEntity[] {
    return rawRows.map((row: any): RaceEntity => {
        const dateJST = new Date(row.date_time);
        const heldDayData =
            row.held_times !== null && row.held_day_times !== null
                ? HeldDayData.create(
                      Number(row.held_times),
                      Number(row.held_day_times),
                  )
                : undefined;
        const conditionData =
            row.surface_type !== null && row.distance !== null
                ? HorseRaceConditionData.create(row.surface_type, row.distance)
                : undefined;
        return RaceEntity.create(
            row.id,
            row.place_id,
            RaceData.create(
                row.race_type,
                row.race_name,
                dateJST,
                row.location_name,
                row.grade,
                row.race_number,
            ),
            heldDayData,
            conditionData,
            undefined, // stage
            undefined, // racePlayerList
        );
    });
}
