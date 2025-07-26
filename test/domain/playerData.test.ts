describe('異常値: name, priority', () => {
    beforeEach(() => {
        mockValidatePlayerNumber.mockReturnValue(123);
    });

    it('name: 空文字でもそのまま入る', () => {
        const data = PlayerData.create(RaceType.KEIRIN, 123, '', 1);
        expect(data.name).toBe('');
    });

    it('priority: 負数でもそのまま入る', () => {
        const data = PlayerData.create(RaceType.KEIRIN, 123, 'test', -10);
        expect(data.priority).toBe(-10);
    });

    it('priority: 極端な値でもそのまま入る', () => {
        const data = PlayerData.create(RaceType.KEIRIN, 123, 'test', 9999999);
        expect(data.priority).toBe(9999999);
    });

    it('name: undefinedを渡すとTypeScriptで弾かれる（型安全性）', () => {
        // @ts-expect-error 型安全性テスト: nameにundefinedは許容されない
        expect(() =>
            PlayerData.create(RaceType.KEIRIN, 123, undefined, 1),
        ).toThrow();
    });

    it('priority: undefinedを渡すとTypeScriptで弾かれる（型安全性）', () => {
        // @ts-expect-error 型安全性テスト: priorityにundefinedは許容されない
        expect(() => PlayerData.create(RaceType.KEIRIN, 123, 'test')).toThrow();
    });
});
import { PlayerData } from '../../lib/src/domain/playerData';
import { validatePlayerNumber } from '../../lib/src/utility/data/playerNumber';
import { RaceType } from '../../lib/src/utility/sqlite';

jest.mock('../../lib/src/utility/data/playerNumber');

const mockValidatePlayerNumber = jest.mocked(validatePlayerNumber);

describe('PlayerData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('正常系: 正しい値でインスタンス生成できる', () => {
            mockValidatePlayerNumber.mockReturnValue(123);
            const data = PlayerData.create(
                RaceType.KEIRIN,
                123,
                'テスト選手',
                1,
            );
            expect(data.raceType).toBe(RaceType.KEIRIN);
            expect(data.playerNumber).toBe(123);
            expect(data.name).toBe('テスト選手');
            expect(data.priority).toBe(1);
            expect(mockValidatePlayerNumber).toHaveBeenCalledWith(123);
        });

        it('異常系: validatePlayerNumberが例外を投げた場合、createも例外を投げる', () => {
            mockValidatePlayerNumber.mockImplementation(() => {
                throw new Error('invalid');
            });
            expect(() =>
                PlayerData.create(RaceType.KEIRIN, 999, 'NG選手', 2),
            ).toThrow('invalid');
        });
    });

    describe('copy', () => {
        beforeEach(() => {
            mockValidatePlayerNumber.mockReturnValue(123);
        });

        it('全項目未指定: 元の値がそのままコピーされる', () => {
            const original = PlayerData.create(
                RaceType.KEIRIN,
                123,
                'コピー元',
                1,
            );
            const copy = original.copy();
            expect(copy).not.toBe(original);
            expect(copy.raceType).toBe(original.raceType);
            expect(copy.playerNumber).toBe(original.playerNumber);
            expect(copy.name).toBe(original.name);
            expect(copy.priority).toBe(original.priority);
        });

        it('一部項目だけ上書き: 指定した値だけ変わる', () => {
            const original = PlayerData.create(
                RaceType.KEIRIN,
                123,
                'コピー元',
                1,
            );
            mockValidatePlayerNumber.mockReturnValue(456);
            const copy = original.copy({ playerNumber: 456, name: 'コピー先' });
            expect(copy.raceType).toBe(RaceType.KEIRIN);
            expect(copy.playerNumber).toBe(456);
            expect(copy.name).toBe('コピー先');
            expect(copy.priority).toBe(1);
            expect(mockValidatePlayerNumber).toHaveBeenCalledWith(456);
        });

        it('全項目上書き: 全部変わる', () => {
            const original = PlayerData.create(
                RaceType.KEIRIN,
                123,
                'コピー元',
                1,
            );
            mockValidatePlayerNumber.mockReturnValue(789);
            const copy = original.copy({
                raceType: RaceType.BOATRACE,
                playerNumber: 789,
                name: '新選手',
                priority: 5,
            });
            expect(copy.raceType).toBe(RaceType.BOATRACE);
            expect(copy.playerNumber).toBe(789);
            expect(copy.name).toBe('新選手');
            expect(copy.priority).toBe(5);
            expect(mockValidatePlayerNumber).toHaveBeenCalledWith(789);
        });

        it('異常系: playerNumberのバリデーションで例外が出たらcopyも例外', () => {
            const original = PlayerData.create(
                RaceType.KEIRIN,
                123,
                'コピー元',
                1,
            );
            mockValidatePlayerNumber.mockImplementation(() => {
                throw new Error('invalid');
            });
            expect(() => original.copy({ playerNumber: 999 })).toThrow(
                'invalid',
            );
        });
    });
});
