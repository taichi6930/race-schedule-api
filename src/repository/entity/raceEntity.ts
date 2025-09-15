import { HorseRacingRaceRecord } from '../../../lib/src/gateway/record/horseRacingRaceRecord';
import { MechanicalRacingRaceRecord } from '../../../lib/src/gateway/record/mechanicalRacingRaceRecord';
import { RacePlayerRecord } from '../../../lib/src/gateway/record/racePlayerRecord';
import { getJSTDate } from '../../../lib/src/utility/date';
import type { HeldDayData } from '../../domain/heldDayData';
import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { RaceType } from '../../utility/raceType';
import type { PublicGamblingId } from '../../utility/validateAndType/idUtility';
import {
    generateId,
    IdType,
    validateId,
} from '../../utility/validateAndType/idUtility';
import type { RaceStage } from '../../utility/validateAndType/raceStage';

/**
 * レース開催データ
 */
export class RaceEntity {
    private readonly _heldDayData: HeldDayData | undefined;
    private readonly _conditionData: HorseRaceConditionData | undefined;
    private readonly _stage: RaceStage | undefined;
    private readonly _racePlayerDataList: RacePlayerData[] | undefined;

    /**
     * コンストラクタ
     * @param id - ID
     * @param placeId
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param stage - レースステージ
     * @param racePlayerDataList - レース出走メンバーデータリスト
     * @param updateDate - 更新日時
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: PublicGamblingId,
        public readonly placeId: string,
        public readonly raceData: RaceData,
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData | undefined,
        stage: RaceStage | undefined,
        racePlayerDataList: RacePlayerData[] | undefined,
    ) {
        this._heldDayData = heldDayData;
        this._conditionData = conditionData;
        this._stage = stage;
        this._racePlayerDataList = racePlayerDataList;
    }

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param placeId
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param stage
     * @param racePlayerDataList
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        placeId: string,
        raceData: RaceData,
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData | undefined,
        stage: RaceStage | undefined,
        racePlayerDataList: RacePlayerData[] | undefined,
    ): RaceEntity {
        try {
            if (
                (raceData.raceType === RaceType.JRA &&
                    heldDayData === undefined) ||
                (raceData.raceType !== RaceType.JRA &&
                    heldDayData !== undefined)
            ) {
                throw new Error(`HeldDayData is incorrect`);
            }
            // placeData.raceType が KEIRIN, AUTORACE, BOATRACE の場合, stageがundefinedの時はエラー
            if (
                ((raceData.raceType === RaceType.KEIRIN ||
                    raceData.raceType === RaceType.AUTORACE ||
                    raceData.raceType === RaceType.BOATRACE) &&
                    stage === undefined) ||
                ((raceData.raceType === RaceType.JRA ||
                    raceData.raceType === RaceType.NAR ||
                    raceData.raceType === RaceType.OVERSEAS) &&
                    stage !== undefined)
            ) {
                throw new Error(`Stage is incorrect`);
            }
            // placeData.raceType が KEIRIN, AUTORACE, BOATRACE の場合, racePlayerDataListがundefinedの時はエラー
            if (
                ((raceData.raceType === RaceType.KEIRIN ||
                    raceData.raceType === RaceType.AUTORACE ||
                    raceData.raceType === RaceType.BOATRACE) &&
                    racePlayerDataList === undefined) ||
                ((raceData.raceType === RaceType.JRA ||
                    raceData.raceType === RaceType.NAR ||
                    raceData.raceType === RaceType.OVERSEAS) &&
                    racePlayerDataList !== undefined)
            ) {
                throw new Error(`racePlayerDataList is incorrect`);
            }
            if (
                ((raceData.raceType === RaceType.JRA ||
                    raceData.raceType === RaceType.NAR ||
                    raceData.raceType === RaceType.OVERSEAS) &&
                    conditionData === undefined) ||
                ((raceData.raceType === RaceType.KEIRIN ||
                    raceData.raceType === RaceType.AUTORACE ||
                    raceData.raceType === RaceType.BOATRACE) &&
                    conditionData !== undefined)
            ) {
                throw new Error(`conditionData is incorrect`);
            }
            return new RaceEntity(
                validateId(IdType.RACE, raceData.raceType, id),
                placeId,
                raceData,
                heldDayData,
                conditionData,
                stage,
                racePlayerDataList,
            );
        } catch {
            throw new Error(`Failed to create RaceEntity:
                id: ${id},
                placeId: ${placeId},
                raceData: ${JSON.stringify(raceData)},
                heldDayData: ${JSON.stringify(heldDayData)},
                conditionData: ${JSON.stringify(conditionData)},
                stage: ${JSON.stringify(stage)},
                racePlayerDataList: ${JSON.stringify(racePlayerDataList)}
            `);
        }
    }

    /**
     * idがない場合でのcreate
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param stage
     * @param racePlayerDataList
     * @param updateDate - 更新日時
     */
    public static createWithoutId(
        raceData: RaceData,
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData | undefined,
        stage: RaceStage | undefined,
        racePlayerDataList: RacePlayerData[] | undefined,
    ): RaceEntity {
        return RaceEntity.create(
            generateId(IdType.RACE, {
                raceType: raceData.raceType,
                dateTime: raceData.dateTime,
                location: raceData.location,
                number: raceData.number,
            }),

            generateId(IdType.PLACE, {
                raceType: raceData.raceType,
                dateTime: raceData.dateTime,
                location: raceData.location,
            }),
            raceData,
            heldDayData,
            conditionData,
            stage,
            racePlayerDataList,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<RaceEntity> = {}): RaceEntity {
        return RaceEntity.create(
            partial.id ?? this.id,
            partial.placeId ?? this.placeId,
            partial.raceData ?? this.raceData,
            partial.heldDayData ?? this._heldDayData,
            partial.conditionData ?? this._conditionData,
            partial.stage ?? this._stage,
            partial.racePlayerDataList ?? this._racePlayerDataList,
        );
    }

    /**
     * JRA のみ有効な heldDayData のアクセサ
     * raceType が JRA 以外の場合にアクセスされると例外を投げる
     */
    public get heldDayData(): HeldDayData {
        if (this.raceData.raceType !== RaceType.JRA) {
            throw new Error('heldDayData is only available for JRA');
        }
        if (this._heldDayData === undefined) {
            throw new Error('heldDayData is missing for JRA');
        }
        return this._heldDayData;
    }

    /**
     * KEIRIN, AUTORACE, BOATRACE のみ有効な grade のアクセサ
     * それ以外の raceType でアクセスされると例外を投げる
     */
    public get stage(): RaceStage {
        if (
            this.raceData.raceType !== RaceType.KEIRIN &&
            this.raceData.raceType !== RaceType.AUTORACE &&
            this.raceData.raceType !== RaceType.BOATRACE
        ) {
            throw new Error(
                'stage is only available for KEIRIN/AUTORACE/BOATRACE',
            );
        }
        if (this._stage === undefined) {
            throw new Error('stage is missing for this race type');
        }
        return this._stage;
    }

    /**
     * KEIRIN, AUTORACE, BOATRACE のみ有効な grade のアクセサ
     * それ以外の raceType でアクセスされると例外を投げる
     */
    public get racePlayerDataList(): RacePlayerData[] {
        if (
            this.raceData.raceType !== RaceType.KEIRIN &&
            this.raceData.raceType !== RaceType.AUTORACE &&
            this.raceData.raceType !== RaceType.BOATRACE
        ) {
            throw new Error(
                'racePlayerDataList is only available for KEIRIN/AUTORACE/BOATRACE',
            );
        }
        if (this._racePlayerDataList === undefined) {
            throw new Error('racePlayerDataList is missing for this race type');
        }
        return this._racePlayerDataList;
    }

    /**
     * KEIRIN, AUTORACE, BOATRACE のみ有効な grade のアクセサ
     * それ以外の raceType でアクセスされると例外を投げる
     */
    public get conditionData(): HorseRaceConditionData {
        if (
            this.raceData.raceType !== RaceType.JRA &&
            this.raceData.raceType !== RaceType.NAR &&
            this.raceData.raceType !== RaceType.OVERSEAS
        ) {
            throw new Error(
                'conditionData is only available for JRA/NAR/OVERSEAS',
            );
        }
        if (this._conditionData === undefined) {
            throw new Error('conditionData is missing for this race type');
        }
        return this._conditionData;
    }

    /**
     * MechanicalRacingRaceRecordに変換する
     */
    public toMechanicalRacingRaceRecord(): MechanicalRacingRaceRecord {
        return MechanicalRacingRaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.stage,
            this.raceData.dateTime,
            this.raceData.location,
            this.raceData.grade,
            this.raceData.number,
            getJSTDate(new Date()),
        );
    }

    /**
     * RaceEntityをHorseRacingRaceRecordに変換する
     */
    public toHorseRacingRaceRecord(): HorseRacingRaceRecord {
        return HorseRacingRaceRecord.create(
            this.id,
            this.raceData.raceType,
            this.raceData.name,
            this.raceData.dateTime,
            this.raceData.location,
            this.conditionData.surfaceType,
            this.conditionData.distance,
            this.raceData.grade,
            this.raceData.number,
            getJSTDate(new Date()),
        );
    }

    /**
     * RacePlayerRecordに変換する
     */
    public toPlayerRecordList(): RacePlayerRecord[] {
        return this.racePlayerDataList.map((playerData) =>
            RacePlayerRecord.create(
                generateId(IdType.PLAYER, {
                    raceType: this.raceData.raceType,
                    dateTime: this.raceData.dateTime,
                    location: this.raceData.location,
                    number: this.raceData.number,
                    positionNumber: playerData.positionNumber,
                }),
                this.raceData.raceType,
                this.id,
                playerData.positionNumber,
                playerData.playerNumber,
                getJSTDate(new Date()),
            ),
        );
    }
}
