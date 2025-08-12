import '../../utility/format';

import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import { RaceRecord } from '../../gateway/record/raceRecord';
import { type RaceId, validateRaceId } from '../../utility/data/common/raceId';
import type { RaceStage } from '../../utility/data/common/raceStage';
import { generateRaceId, generateRacePlayerId } from '../../utility/raceId';
import { type UpdateDate, validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * オートレースのレース開催データ
 */
export class AutoraceRaceEntity implements IRaceEntity<AutoraceRaceEntity> {
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
    ): AutoraceRaceEntity {
        return new AutoraceRaceEntity(
            validateRaceId(raceData.raceType, id),
            raceData,
            stage,
            racePlayerDataList,
            validateUpdateDate(updateDate),
        );
    }

    /**
     * idがない場合でのcreate
     * @param raceData
     * @param stage
     * @param racePlayerDataList
     * @param updateDate
     */
    public static createWithoutId(
        raceData: RaceData,
        stage: RaceStage,
        racePlayerDataList: RacePlayerData[],
        updateDate: Date,
    ): AutoraceRaceEntity {
        return AutoraceRaceEntity.create(
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
     * @param partial
     */
    public copy(partial: Partial<AutoraceRaceEntity> = {}): AutoraceRaceEntity {
        return AutoraceRaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.stage ?? this.stage,
            partial.racePlayerDataList ?? this.racePlayerDataList,
            partial.updateDate ?? this.updateDate,
        );
    }

    /**
     * AutoraceRaceRecordに変換する
     */
    public toRaceRecord(): RaceRecord {
        return RaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.stage,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.grade,
            this.raceData.number,
            this.updateDate,
        );
    }

    /**
     * AutoraceRacePlayerRecordに変換する
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
