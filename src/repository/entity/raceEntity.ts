import '../../utility/format';

import type { HorseRaceConditionData } from '../../../lib/src/domain/houseRaceConditionData';
import type { RaceData } from '../../../lib/src/domain/raceData';
import { RaceType } from '../../../lib/src/utility/raceType';
import type { RaceId } from '../../../lib/src/utility/validateAndType/raceId';
import {
    generateRaceId,
    validateRaceId,
} from '../../../lib/src/utility/validateAndType/raceId';

/**
 * 競馬のレース開催データ
 */
export class RaceEntity {
    private readonly _conditionData: HorseRaceConditionData | undefined;

    /**
     * コンストラクタ
     * @param id - ID
     * @param raceData - レースデータ
     * @param conditionData - レース条件データ
     * @remarks
     * レース開催データを生成する
     */
    private constructor(
        public readonly id: RaceId,
        public readonly raceData: RaceData,
        conditionData: HorseRaceConditionData | undefined,
    ) {
        this._conditionData = conditionData;
    }

    /**
     * インスタンス生成メソッド
     * @param id - ID
     * @param raceData - レースデータ
     * @param conditionData - レース条件データ
     */
    public static create(
        id: string,
        raceData: RaceData,
        conditionData: HorseRaceConditionData | undefined,
    ): RaceEntity {
        try {
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
                conditionData,
            );
        } catch {
            throw new Error(`Failed to create RaceEntity:
                id: ${id},
                raceData: ${JSON.stringify(raceData)},
                conditionData: ${JSON.stringify(conditionData)}
            `);
        }
    }

    /**
     * idがない場合でのcreate
     * @param raceData - レースデータ
     * @param conditionData - レース条件データ
     */
    public static createWithoutId(
        raceData: RaceData,
        conditionData: HorseRaceConditionData | undefined,
    ): RaceEntity {
        return RaceEntity.create(
            generateRaceId(
                raceData.raceType,
                raceData.dateTime,
                raceData.location,
                raceData.number,
            ),
            raceData,
            conditionData,
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
            partial.conditionData ?? this._conditionData,
        );
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
}
