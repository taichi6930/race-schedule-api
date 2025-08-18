import '../../utility/format';

import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import {
    generateRaceId,
    type RaceId,
    validateRaceId,
} from '../../utility/data/common/raceId';
import { generateRacePlayerId } from '../../utility/data/common/racePlayerId';
import {
    type RaceStage,
    validateRaceStage,
} from '../../utility/data/common/raceStage';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * メカニカルレースのレース開催データ
 */
export class MechanicalRacingRaceEntity
    implements IRaceEntity<MechanicalRacingRaceEntity>
{
    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param stage - 開催ステージ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly stage: RaceStage,
        public readonly racePlayerDataList: RacePlayerData[],
        public readonly updateDate: UpdateDate,
    ) {}

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param stage - 開催ステージ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        stage: RaceStage,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): MechanicalRacingRaceEntity {
        return new MechanicalRacingRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            validateRaceStage(raceData.raceType, stage),
            racePlayerDataList,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData - レースデータ
     * @param stage - 開催ステージ
     * @param racePlayerDataList - レースの選手データ
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceData: RaceData,
        stage: RaceStage,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): MechanicalRacingRaceEntity {
        return MechanicalRacingRaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            stage,
            racePlayerDataList,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(
        partial: Partial<MechanicalRacingRaceEntity> = {},
    ): MechanicalRacingRaceEntity {
        return MechanicalRacingRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.stage ?? this.stage,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * RacePlayerRecordに変換する
     */
    public toPlayerRecordList(): RacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            RacePlayerRecord.create(
                generateRacePlayerId(
                    this.raceData.raceType,
                    this.raceData.dateTime,
                    this.raceData.location,
                    this.raceData.number,
                    playerData.positionNumber,
                ),
                this.raceData.raceType,
                this.id,
                playerData.positionNumber,
                playerData.playerNumber,
                this.updateDate,
            ),
        );
    }
}
