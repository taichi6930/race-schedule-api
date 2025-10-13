/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable unicorn/no-keyword-prefix */
import {
    isIncludedRaceType,
    RACE_TYPE_LIST_HORSE_RACING,
    RACE_TYPE_LIST_MECHANICAL_RACING,
    RaceType,
} from '../../../../src/utility/raceType';

describe('isIncludedRaceType', () => {
    describe('単一のRaceTypeとの比較', () => {
        test('raceTypeがJRAの場合、[RaceType.JRA]に含まれる', () => {
            expect(isIncludedRaceType(RaceType.JRA, [RaceType.JRA])).toBe(true);
        });

        test('raceTypeがNARの場合、[RaceType.JRA]に含まれない', () => {
            expect(isIncludedRaceType(RaceType.NAR, [RaceType.JRA])).toBe(
                false,
            );
        });

        test('raceTypeがKEIRINの場合、[RaceType.JRA]に含まれない', () => {
            expect(isIncludedRaceType(RaceType.KEIRIN, [RaceType.JRA])).toBe(
                false,
            );
        });
    });

    describe('複数のRaceTypeとの比較 - RACE_TYPE_LIST_MECHANICAL_RACING', () => {
        // RACE_TYPE_LIST_MECHANICAL_RACINGは[RaceType.KEIRIN, RaceType.AUTORACE]を含む
        test('raceTypeがKEIRINの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(
                    RaceType.KEIRIN,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(true);
        });

        test('raceTypeがAUTORACEの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(
                    RaceType.AUTORACE,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(true);
        });

        test('raceTypeがBOATRACEの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(
                    RaceType.BOATRACE,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(true);
        });

        test('raceTypeがJRAの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.JRA,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(false);
        });

        test('raceTypeがNARの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.NAR,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(false);
        });

        test('raceTypeがOVERSEASの場合、RACE_TYPE_LIST_MECHANICAL_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.OVERSEAS,
                    RACE_TYPE_LIST_MECHANICAL_RACING,
                ),
            ).toBe(false);
        });
    });

    describe('複数のRaceTypeとの比較 - RACE_TYPE_LIST_HORSE_RACING', () => {
        // RACE_TYPE_LIST_HORSE_RACINGは[RaceType.JRA, RaceType.NAR, RaceType.OVERSEAS]を含む
        test('raceTypeがJRAの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(RaceType.JRA, RACE_TYPE_LIST_HORSE_RACING),
            ).toBe(true);
        });

        test('raceTypeがNARの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(RaceType.NAR, RACE_TYPE_LIST_HORSE_RACING),
            ).toBe(true);
        });

        test('raceTypeがOVERSEASの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれる', () => {
            expect(
                isIncludedRaceType(
                    RaceType.OVERSEAS,
                    RACE_TYPE_LIST_HORSE_RACING,
                ),
            ).toBe(true);
        });

        test('raceTypeがKEIRINの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.KEIRIN,
                    RACE_TYPE_LIST_HORSE_RACING,
                ),
            ).toBe(false);
        });

        test('raceTypeがAUTORACEの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.AUTORACE,
                    RACE_TYPE_LIST_HORSE_RACING,
                ),
            ).toBe(false);
        });

        test('raceTypeがBOATRACEの場合、RACE_TYPE_LIST_HORSE_RACINGに含まれない', () => {
            expect(
                isIncludedRaceType(
                    RaceType.BOATRACE,
                    RACE_TYPE_LIST_HORSE_RACING,
                ),
            ).toBe(false);
        });
    });

    describe('旧式の判定方法との等価性検証 - MECHANICAL_RACING', () => {
        // 旧: raceType !== RaceType.KEIRIN && raceType !== RaceType.AUTORACE && raceType !== RaceType.BOATRACE
        // 新: !isIncludedRaceType(raceType, RACE_TYPE_LIST_MECHANICAL_RACING)
        // 注意: RACE_TYPE_LIST_MECHANICAL_RACINGには[KEIRIN, AUTORACE]のみ含まれ、BOATRACEは含まれない

        test('JRA: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.JRA;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            // 注意: 旧判定はtrue、新判定はtrueだが、BOATRACEが含まれない点が異なる
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('NAR: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.NAR;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('OVERSEAS: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.OVERSEAS;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('KEIRIN: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.KEIRIN;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('AUTORACE: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.AUTORACE;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('BOATRACE: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.BOATRACE;
            const oldCheck =
                raceType !== RaceType.KEIRIN &&
                raceType !== RaceType.AUTORACE &&
                raceType !== RaceType.BOATRACE;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_MECHANICAL_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });
    });

    describe('旧式の判定方法との等価性検証 - HORSE_RACING', () => {
        // 旧: raceType !== RaceType.JRA && raceType !== RaceType.NAR && raceType !== RaceType.OVERSEAS
        // 新: !isIncludedRaceType(raceType, RACE_TYPE_LIST_HORSE_RACING)

        test('JRA: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.JRA;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('NAR: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.NAR;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('OVERSEAS: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.OVERSEAS;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('KEIRIN: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.KEIRIN;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('AUTORACE: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.AUTORACE;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('BOATRACE: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.BOATRACE;
            const oldCheck =
                raceType !== RaceType.JRA &&
                raceType !== RaceType.NAR &&
                raceType !== RaceType.OVERSEAS;
            const newCheck = !isIncludedRaceType(
                raceType,
                RACE_TYPE_LIST_HORSE_RACING,
            );
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });
    });

    describe('単一RaceTypeの旧式判定との等価性検証', () => {
        // 旧: raceType !== RaceType.JRA
        // 新: !isIncludedRaceType(raceType, [RaceType.JRA])

        test('JRA: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.JRA;
            const oldCheck = raceType !== RaceType.JRA;
            const newCheck = !isIncludedRaceType(raceType, [RaceType.JRA]);
            expect(newCheck).toBe(false);
            expect(oldCheck).toBe(false);
        });

        test('NAR: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.NAR;
            const oldCheck = raceType !== RaceType.JRA;
            const newCheck = !isIncludedRaceType(raceType, [RaceType.JRA]);
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });

        test('KEIRIN: 旧判定と新判定が等価であることを確認', () => {
            const raceType = RaceType.KEIRIN;
            const oldCheck = raceType !== RaceType.JRA;
            const newCheck = !isIncludedRaceType(raceType, [RaceType.JRA]);
            expect(newCheck).toBe(true);
            expect(oldCheck).toBe(true);
        });
    });
});
