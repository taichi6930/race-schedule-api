import { validateAutoracePlaceId } from '../../../lib/src/utility/data/autorace/autoracePlaceId';
import { validateAutoraceRaceId } from '../../../lib/src/utility/data/autorace/autoraceRaceId';
import { validateBoatracePlaceId } from '../../../lib/src/utility/data/boatrace/boatracePlaceId';
import { validateBoatraceRaceId } from '../../../lib/src/utility/data/boatrace/boatraceRaceId';
import { validateRacePlayerId } from '../../../lib/src/utility/data/common/racePlayerId';
import { validateJraPlaceId } from '../../../lib/src/utility/data/jra/jraPlaceId';
import { validateJraRaceId } from '../../../lib/src/utility/data/jra/jraRaceId';
import { validateKeirinPlaceId } from '../../../lib/src/utility/data/keirin/keirinPlaceId';
import { validateKeirinRaceId } from '../../../lib/src/utility/data/keirin/keirinRaceId';
import { validateNarPlaceId } from '../../../lib/src/utility/data/nar/narPlaceId';
import { validateNarRaceId } from '../../../lib/src/utility/data/nar/narRaceId';
import { validateWorldPlaceId } from '../../../lib/src/utility/data/world/worldPlaceId';
import { validateWorldRaceId } from '../../../lib/src/utility/data/world/worldRaceId';
import { RaceType } from '../../../lib/src/utility/raceType';

describe('JraPlaceIdSchema', () => {
    it('正しいJraPlaceId', () => {
        const validJraPlaceId = 'jra2021080101';
        expect(validateJraPlaceId(validJraPlaceId)).toBe(validJraPlaceId);
    });

    it('不正なJraPlaceId', () => {
        const invalidJraPlaceIdAndMessage = [
            ['abc2021080101', 'jraから始まる必要があります'],
            ['2021jra080101', 'jraから始まる必要があります'],
            ['jra202108010', 'JraPlaceIdの形式ではありません'],
            ['nar2021080101', 'jraから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidJraPlaceIdAndMessage) {
            expect(() => validateJraPlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('JraRaceIdSchema', () => {
    it('正しいJraRaceId', () => {
        const validJraRaceId = 'jra202108010101';
        expect(validateJraRaceId(validJraRaceId)).toBe(validJraRaceId);
    });

    it('不正なJraRaceId', () => {
        const invalidJraRaceIdAndMessage = [
            ['jraabc2021080101', 'JraRaceIdの形式ではありません'],
            ['jra2021jra080101', 'JraRaceIdの形式ではありません'],
            ['jra202108010', 'JraRaceIdの形式ではありません'],
            ['nar202108010101', 'jraから始まる必要があります'],
            ['jra202108010113', 'レース番号は1~12の範囲である必要があります'],
        ];
        for (const [invalidId, message] of invalidJraRaceIdAndMessage) {
            expect(() => validateJraRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('NarPlaceIdSchema', () => {
    it('正しいNarPlaceId', () => {
        const validNarPlaceId = 'nar2021080101';
        expect(validateNarPlaceId(validNarPlaceId)).toBe(validNarPlaceId);
    });

    it('不正なNarPlaceId', () => {
        const invalidNarPlaceIdAndMessage = [
            ['abc2021080101', 'narから始まる必要があります'],
            ['2021nar080101', 'narから始まる必要があります'],
            ['nar202108010', 'NarPlaceIdの形式ではありません'],
            ['jra2021080101', 'narから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidNarPlaceIdAndMessage) {
            expect(() => validateNarPlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('NarRaceIdSchema', () => {
    it('正しいNarRaceId', () => {
        const validNarRaceId = 'nar202108010101';
        expect(validateNarRaceId(validNarRaceId)).toBe(validNarRaceId);
    });

    it('不正なNarRaceId', () => {
        const invalidNarRaceIdAndMessage = [
            ['narabc2021080101', 'NarRaceIdの形式ではありません'],
            ['nar2021nar080101', 'NarRaceIdの形式ではありません'],
            ['nar202108010', 'NarRaceIdの形式ではありません'],
            ['jra202108010101', 'narから始まる必要があります'],
            ['nar202108010113', 'レース番号は1~12の範囲である必要があります'],
        ];
        for (const [invalidId, message] of invalidNarRaceIdAndMessage) {
            expect(() => validateNarRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('WorldPlaceIdSchema', () => {
    it('正しいWorldPlaceId', () => {
        const validWorldPlaceId = 'world2021080101';
        expect(validateWorldPlaceId(validWorldPlaceId)).toBe(validWorldPlaceId);
    });

    it('不正なWorldPlaceId', () => {
        const invalidWorldPlaceIdAndMessage = [
            ['abc2021080101', 'worldから始まる必要があります'],
            ['2021world080101', 'worldから始まる必要があります'],
            ['world202108010', 'WorldPlaceIdの形式ではありません'],
            ['jra2021080101', 'worldから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidWorldPlaceIdAndMessage) {
            expect(() => validateWorldPlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('WorldRaceIdSchema', () => {
    it('正しいWorldRaceId', () => {
        const validWorldRaceId = 'world202108010101';
        expect(validateWorldRaceId(validWorldRaceId)).toBe(validWorldRaceId);
    });

    it('不正なWorldRaceId', () => {
        const invalidWorldRaceIdAndMessage = [
            ['worldabc2021080101', 'WorldRaceIdの形式ではありません'],
            ['world2021world080101', 'WorldRaceIdの形式ではありません'],
            ['world202108010', 'WorldRaceIdの形式ではありません'],
            ['jra202108010101', 'worldから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidWorldRaceIdAndMessage) {
            expect(() => validateWorldRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('KeirinPlaceIdSchema', () => {
    it('正しいKeirinPlaceId', () => {
        const validKeirinPlaceId = 'keirin2021080101';
        expect(validateKeirinPlaceId(validKeirinPlaceId)).toBe(
            validKeirinPlaceId,
        );
    });

    it('不正なKeirinPlaceId', () => {
        const invalidKeirinPlaceIdAndMessage = [
            ['abc2021080101', 'keirinから始まる必要があります'],
            ['2021keirin080101', 'keirinから始まる必要があります'],
            ['keirin202108010', 'KeirinPlaceIdの形式ではありません'],
            ['jra2021080101', 'keirinから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidKeirinPlaceIdAndMessage) {
            expect(() => validateKeirinPlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('KeirinRaceIdSchema', () => {
    it('正しいKeirinRaceId', () => {
        const validKeirinRaceId = 'keirin202108010101';
        expect(validateKeirinRaceId(validKeirinRaceId)).toBe(validKeirinRaceId);
    });

    it('不正なKeirinRaceId', () => {
        const invalidKeirinRaceIdAndMessage = [
            ['keirinabc2021080101', 'KeirinRaceIdの形式ではありません'],
            ['keirin2021keirin080101', 'KeirinRaceIdの形式ではありません'],
            ['keirin202108010', 'KeirinRaceIdの形式ではありません'],
            ['jra202108010101', 'keirinから始まる必要があります'],
            [
                'keirin202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        for (const [invalidId, message] of invalidKeirinRaceIdAndMessage) {
            expect(() => validateKeirinRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('KeirinRacePlayerIdSchema', () => {
    it('正しいKeirinRacePlayerId', () => {
        const validKeirinRacePlayerId = 'keirin20210801010101';
        expect(
            validateRacePlayerId(RaceType.KEIRIN, validKeirinRacePlayerId),
        ).toBe(validKeirinRacePlayerId);
    });

    it('不正なKeirinRacePlayerId', () => {
        const invalidKeirinRacePlayerIdAndMessage = [
            ['keirinabc202108010101', 'keirinRacePlayerIdの形式ではありません'],
            [
                'keirin2021keirin08010101',
                'keirinRacePlayerIdの形式ではありません',
            ],
            ['keirin202108010101', 'keirinRacePlayerIdの形式ではありません'],
            ['jra20210801010101', 'keirinから始まる必要があります'],
            ['keirin20210801010113', '枠番が不正です'],
        ];
        for (const [
            invalidId,
            message,
        ] of invalidKeirinRacePlayerIdAndMessage) {
            expect(() =>
                validateRacePlayerId(RaceType.KEIRIN, invalidId),
            ).toThrow(message);
        }
    });
});

describe('BoatracePlaceIdSchema', () => {
    it('正しいBoatracePlaceId', () => {
        const validBoatracePlaceId = 'boatrace2021080101';
        expect(validateBoatracePlaceId(validBoatracePlaceId)).toBe(
            validBoatracePlaceId,
        );
    });

    it('不正なBoatracePlaceId', () => {
        const invalidBoatracePlaceIdAndMessage = [
            ['abc2021080101', 'boatraceから始まる必要があります'],
            ['2021boatrace080101', 'boatraceから始まる必要があります'],
            ['boatrace202108010', 'BoatracePlaceIdの形式ではありません'],
            ['jra2021080101', 'boatraceから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidBoatracePlaceIdAndMessage) {
            expect(() => validateBoatracePlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('BoatraceRaceIdSchema', () => {
    it('正しいBoatraceRaceId', () => {
        const validBoatraceRaceId = 'boatrace202108010101';
        expect(validateBoatraceRaceId(validBoatraceRaceId)).toBe(
            validBoatraceRaceId,
        );
    });

    it('不正なBoatraceRaceId', () => {
        const invalidBoatraceRaceIdAndMessage = [
            ['boatraceabc2021080101', 'BoatraceRaceIdの形式ではありません'],
            [
                'boatrace2021boatrace080101',
                'BoatraceRaceIdの形式ではありません',
            ],
            ['boatrace202108010', 'BoatraceRaceIdの形式ではありません'],
            ['jra202108010101', 'boatraceから始まる必要があります'],
            [
                'boatrace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        for (const [invalidId, message] of invalidBoatraceRaceIdAndMessage) {
            expect(() => validateBoatraceRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('BoatraceRacePlayerIdSchema', () => {
    it('正しいBoatraceRacePlayerId', () => {
        const validBoatraceRacePlayerId = 'boatrace20210801010101';
        expect(
            validateRacePlayerId(RaceType.BOATRACE, validBoatraceRacePlayerId),
        ).toBe(validBoatraceRacePlayerId);
    });

    it('不正なBoatraceRacePlayerId', () => {
        const invalidBoatraceRacePlayerIdAndMessage = [
            [
                'boatraceabc202108010101',
                'boatraceRacePlayerIdの形式ではありません',
            ],
            [
                'boatrace2021boatrace08010101',
                'boatraceRacePlayerIdの形式ではありません',
            ],
            [
                'boatrace202108010101',
                'boatraceRacePlayerIdの形式ではありません',
            ],
            ['jra20210801010101', 'boatraceから始まる必要があります'],
            ['boatrace20210801010113', '枠番が不正です'],
        ];
        for (const [
            invalidId,
            message,
        ] of invalidBoatraceRacePlayerIdAndMessage) {
            expect(() =>
                validateRacePlayerId(RaceType.BOATRACE, invalidId),
            ).toThrow(message);
        }
    });
});

describe('AutoracePlaceIdSchema', () => {
    it('正しいAutoracePlaceId', () => {
        const validAutoracePlaceId = 'autorace2021080101';
        expect(validateAutoracePlaceId(validAutoracePlaceId)).toBe(
            validAutoracePlaceId,
        );
    });

    it('不正なAutoracePlaceId', () => {
        const invalidAutoracePlaceIdAndMessage = [
            ['abc2021080101', 'autoraceから始まる必要があります'],
            ['2021autorace080101', 'autoraceから始まる必要があります'],
            ['autorace202108010', 'AutoracePlaceIdの形式ではありません'],
            ['jra2021080101', 'autoraceから始まる必要があります'],
        ];
        for (const [invalidId, message] of invalidAutoracePlaceIdAndMessage) {
            expect(() => validateAutoracePlaceId(invalidId)).toThrow(message);
        }
    });
});

describe('AutoraceRaceIdSchema', () => {
    it('正しいAutoraceRaceId', () => {
        const validAutoraceRaceId = 'autorace202108010101';
        expect(validateAutoraceRaceId(validAutoraceRaceId)).toBe(
            validAutoraceRaceId,
        );
    });

    it('不正なAutoraceRaceId', () => {
        const invalidAutoraceRaceIdAndMessage = [
            ['autoraceabc2021080101', 'AutoraceRaceIdの形式ではありません'],
            [
                'autorace2021autorace080101',
                'AutoraceRaceIdの形式ではありません',
            ],
            ['autorace202108010', 'AutoraceRaceIdの形式ではありません'],
            ['jra202108010101', 'autoraceから始まる必要があります'],
            [
                'autorace202108010113',
                'レース番号は1~12の範囲である必要があります',
            ],
        ];
        for (const [invalidId, message] of invalidAutoraceRaceIdAndMessage) {
            expect(() => validateAutoraceRaceId(invalidId)).toThrow(message);
        }
    });
});

describe('AutoraceRacePlayerIdSchema', () => {
    it('正しいAutoraceRacePlayerId', () => {
        const validAutoraceRacePlayerId = 'autorace20210801010101';
        expect(
            validateRacePlayerId(RaceType.AUTORACE, validAutoraceRacePlayerId),
        ).toBe(validAutoraceRacePlayerId);
    });

    it('不正なAutoraceRacePlayerId', () => {
        const invalidAutoraceRacePlayerIdAndMessage = [
            [
                'autoraceabc202108010101',
                'autoraceRacePlayerIdの形式ではありません',
            ],
            [
                'autorace2021autorace08010101',
                'autoraceRacePlayerIdの形式ではありません',
            ],
            [
                'autorace202108010101',
                'autoraceRacePlayerIdの形式ではありません',
            ],
            ['jra20210801010101', 'autoraceから始まる必要があります'],
            ['autorace20210801010113', '枠番が不正です'],
        ];
        for (const [
            invalidId,
            message,
        ] of invalidAutoraceRacePlayerIdAndMessage) {
            expect(() =>
                validateRacePlayerId(RaceType.AUTORACE, invalidId),
            ).toThrow(message);
        }
    });
});
