/**
 * ディシジョンテーブル
 *
 * | No. | 操作   | id         | raceType   | raceId     | positionNumber | playerNumber | updateDate         | 期待結果         | 備考                      |
 * |-----|--------|------------|------------|------------|---------------|--------------|--------------------|------------------|---------------------------|
 * |  1  | create | 正常値      | 正常値     | 正常値     | 正常値        | 正常値       | 正常なDate         | 正常に生成       | 正常系                    |
 * |  2  | create | 不正値      | 正常値     | 正常値     | 正常値        | 正常値       | 正常なDate         | 例外発生         | idバリデーション失敗      |
 * |  3  | create | 正常値      | 正常値     | 不正値     | 正常値        | 正常値       | 正常なDate         | 例外発生         | raceIdバリデーション失敗  |
 * |  4  | create | 正常値      | 正常値     | 正常値     | 不正値        | 正常値       | 正常なDate         | 例外発生         | positionNumberバリデ失敗  |
 * |  5  | create | 正常値      | 正常値     | 正常値     | 正常値        | 不正値       | 正常なDate         | 例外発生         | playerNumberバリデ失敗    |
 * |  6  | create | 正常値      | 正常値     | 正常値     | 正常値        | 正常値       | 不正なDate         | 例外発生         | updateDateバリデ失敗      |
 * |  7  | copy   | undefined   | undefined  | undefined  | undefined     | undefined    | undefined          | 全項目コピー     | デフォルトコピー          |
 * |  8  | copy   | undefined   | undefined  | undefined  | 99            | undefined    | undefined          | positionNumber変更| 部分更新                  |
 * |  9  | copy   | undefined   | undefined  | undefined  | undefined     | 99999        | undefined          | playerNumber変更 | 部分更新                  |
 * | 10  | copy   | undefined   | undefined  | undefined  | undefined     | undefined    | 新しいDate         | updateDate変更   | 部分更新                  |
 */

import { RacePlayerRecord } from '../../../../../lib/src/gateway/record/racePlayerRecord';
import { generateRaceId } from '../../../../../lib/src/utility/validateAndType/raceId';
import { generateRacePlayerId } from '../../../../../lib/src/utility/validateAndType/racePlayerId';
import {
    defaultLocation,
    testRaceTypeListMechanicalRacing,
} from '../../mock/common/baseCommonData';

describe.each(testRaceTypeListMechanicalRacing)(
    'RacePlayerRecord(%s)',
    (raceType) => {
        const validDate = new Date('2026-01-01T00:00:00Z');
        const validLocation = defaultLocation[raceType];
        const validNumber = 1;
        const validRaceId = generateRaceId(
            raceType,
            validDate,
            validLocation,
            validNumber,
        );
        const validUpdateDate = new Date('2026-01-01T12:00:00Z');

        const validPositionNumber = 1;
        const validPlayerNumber = 10000;
        const validRacePlayerId = generateRacePlayerId(
            raceType,
            validDate,
            validLocation,
            validNumber,
            validPositionNumber,
        );
        it('正常値ですべて生成できる', () => {
            const record = RacePlayerRecord.create(
                validRacePlayerId,
                raceType,
                validRaceId,
                validPositionNumber,
                validPlayerNumber,
                validUpdateDate,
            );
            expect(record).toBeInstanceOf(RacePlayerRecord);
            expect(record.id).toBe(validRacePlayerId);
            expect(record.raceType).toBe(raceType);
            expect(record.raceId).toBe(validRaceId);
            expect(record.positionNumber).toBe(validPositionNumber);
            expect(record.playerNumber).toBe(validPlayerNumber);
            expect(record.updateDate).toEqual(validUpdateDate);
        });

        it('idバリデーション失敗で例外', () => {
            expect(() =>
                RacePlayerRecord.create(
                    'bad-id',
                    raceType,
                    validRaceId,
                    validPositionNumber,
                    validPlayerNumber,
                    validUpdateDate,
                ),
            ).toThrow();
        });

        it('raceIdバリデーション失敗で例外', () => {
            expect(() =>
                RacePlayerRecord.create(
                    validRacePlayerId,
                    raceType,
                    'bad-race-id',
                    validPositionNumber,
                    validPlayerNumber,
                    validUpdateDate,
                ),
            ).toThrow();
        });

        it('positionNumberバリデーション失敗で例外', () => {
            expect(() =>
                RacePlayerRecord.create(
                    validRacePlayerId,
                    raceType,
                    validRaceId,
                    99,
                    validPlayerNumber,
                    validUpdateDate,
                ),
            ).toThrow();
        });

        it('playerNumberバリデーション失敗で例外', () => {
            expect(() =>
                RacePlayerRecord.create(
                    validRacePlayerId,
                    raceType,
                    validRaceId,
                    validPositionNumber,
                    0,
                    validUpdateDate,
                ),
            ).toThrow();
        });

        it('updateDateバリデーション失敗で例外', () => {
            expect(() =>
                RacePlayerRecord.create(
                    validRacePlayerId,
                    raceType,
                    validRaceId,
                    validPositionNumber,
                    validPlayerNumber,
                    new Date('bad-date'),
                ),
            ).toThrow();
        });

        it('copy: 全項目コピー（partial未指定）', () => {
            const base = RacePlayerRecord.create(
                validRacePlayerId,
                raceType,
                validRaceId,
                validPositionNumber,
                validPlayerNumber,
                validUpdateDate,
            );
            const copied = base.copy();
            expect(copied).not.toBe(base);
            expect(copied).toEqual(base);
        });

        it('copy: positionNumberのみ変更', () => {
            const base = RacePlayerRecord.create(
                validRacePlayerId,
                raceType,
                validRaceId,
                validPositionNumber,
                validPlayerNumber,
                validUpdateDate,
            );
            const copied = base.copy({ positionNumber: 2 });
            expect(copied.positionNumber).toBe(2);
            expect(copied.playerNumber).toBe(base.playerNumber);
        });

        it('copy: playerNumberのみ変更', () => {
            const base = RacePlayerRecord.create(
                validRacePlayerId,
                raceType,
                validRaceId,
                validPositionNumber,
                validPlayerNumber,
                validUpdateDate,
            );
            const copied = base.copy({ playerNumber: 10001 });
            expect(copied.playerNumber).toBe(10001);
            expect(copied.positionNumber).toBe(base.positionNumber);
        });

        it('copy: updateDateのみ変更', () => {
            const base = RacePlayerRecord.create(
                validRacePlayerId,
                raceType,
                validRaceId,
                validPositionNumber,
                validPlayerNumber,
                validUpdateDate,
            );
            const _date = new Date('2025-01-01T00:00:00Z');
            const copied = base.copy({ updateDate: _date });
            expect(copied.updateDate).toEqual(_date);
        });
    },
);
