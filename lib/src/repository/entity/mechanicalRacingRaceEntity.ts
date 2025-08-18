import '../../utility/format';

import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { MechanicalRacingRaceRecord } from '../../gateway/record/mechanicalRacingRaceRecord';
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


export class MechanicalRacingRaceEntity
    implements IRaceEntity<MechanicalRacingRaceEntity>
{
    
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        public readonly stage: RaceStage,
        public readonly racePlayerDataList: RacePlayerData[],
        public readonly updateDate: UpdateDate,
    ) {}

    
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

    
    public toRaceRecord(): MechanicalRacingRaceRecord {
        return MechanicalRacingRaceRecord.create(
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
