import '../../utility/format';

import type { HeldDayData } from '../../domain/heldDayData';
import type { HorseRaceConditionData } from '../../domain/houseRaceConditionData';
import type { RaceData } from '../../domain/raceData';
import type { RacePlayerData } from '../../domain/racePlayerData';
import { RacePlayerRecord } from '../../gateway/record/racePlayerRecord';
import type { RaceId } from '../../utility/data/common/raceId';
import {
    generateRaceId,
    validateRaceId,
} from '../../utility/data/common/raceId';
import { generateRacePlayerId } from '../../utility/data/common/racePlayerId';
import type { RaceStage } from '../../utility/data/common/raceStage';
import { RaceType } from '../../utility/raceType';
import type { UpdateDate } from '../../utility/updateDate';
import { validateUpdateDate } from '../../utility/updateDate';
import type { IRaceEntity } from './iRaceEntity';

/**
 * 競馬のレース開催データ
 */
export class RaceEntity implements IRaceEntity<RaceEntity> {
    private readonly _heldDayData: HeldDayData | undefined;
    private readonly _conditionData: HorseRaceConditionData | undefined;
    private readonly _stage: RaceStage | undefined;
    private readonly _racePlayerDataList: RacePlayerData[] | undefined;
    /**
     * コンストラクタ
     * @param id - ID
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
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData | undefined,
        stage: RaceStage | undefined,
        racePlayerDataList: RacePlayerData[] | undefined,
        public readonly updateDate: UpdateDate,
    ) {
        this._heldDayData = heldDayData;
        this._conditionData = conditionData;
        this._stage = stage;
        this._racePlayerDataList = racePlayerDataList;
    }

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param heldDayData - 開催日データ
     * @param conditionData - レース条件データ
     * @param stage
     * @param racePlayerDataList
     * @param updateDate - 更新日時
     */
    public static create(
        id: string,
        raceData: RaceData,
        heldDayData: HeldDayData | undefined,
        conditionData: HorseRaceConditionData | undefined,
        stage: RaceStage | undefined,
        racePlayerDataList: RacePlayerData[] | undefined,
        updateDate: Date,
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
                validateRaceId(raceData.raceType, id),
                raceData,
                heldDayData,
                conditionData,
                stage,
                racePlayerDataList,
                validateUpdateDate(updateDate),
            );
        } catch {
            throw new Error(`Failed to create RaceEntity:
                id: ${id},
                raceData: ${JSON.stringify(raceData)},
                heldDayData: ${JSON.stringify(heldDayData)},
                conditionData: ${JSON.stringify(conditionData)},
                stage: ${JSON.stringify(stage)},
                racePlayerDataList: ${JSON.stringify(racePlayerDataList)},
                updateDate: ${JSON.stringify(updateDate)}
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
        updateDate: Date,
    ): RaceEntity {
        return RaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            heldDayData,
            conditionData,
            stage,
            racePlayerDataList,
            updateDate,
        );
    }

    /**
     * データのコピー
     * @param partial - 上書きする部分データ
     */
    public copy(partial: Partial<RaceEntity> = {}): RaceEntity {
        return RaceEntity.create(
            partial.id ?? this.id,
            partial.raceData ?? this.raceData,
            partial.heldDayData ?? this._heldDayData,
            partial.conditionData ?? this._conditionData,
            partial.stage ?? this._stage,
            partial.racePlayerDataList ?? this._racePlayerDataList,
            partial.updateDate ?? this.updateDate,
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
