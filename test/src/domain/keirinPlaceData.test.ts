import { KeirinPlaceData } from '../../../lib/src/domain/keirinPlaceData';
import { baseKeirinPlaceData } from '../mock/common/baseKeirinData';

describe('KeirinPlaceDataクラスのテスト', () => {
    it('正しい入力でKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseKeirinPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeData.location).toBe('平塚');
    });

    it('日付を変更したKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = KeirinPlaceData.create(
            new Date('2025-12-30'),
            '平塚',
            'GⅠ',
        );
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceData.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = KeirinPlaceData.create(
            new Date('2025-12-30'),
            '平塚',
            'GⅠ',
        );
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });

    describe('Value Object としての等価性テスト', () => {
        it('同じ値を持つインスタンスは等価であることを確認', () => {
            const placeData1 = baseKeirinPlaceData;
            const placeData2 = baseKeirinPlaceData.copy();

            // 異なるインスタンスだが値が同じなので等価
            expect(placeData1 === placeData2).toBe(false); // 参照は異なる
            expect(placeData1.equals(placeData2)).toBe(true); // 値は等価
        });

        it('異なる値を持つインスタンスは等価でないことを確認', () => {
            const placeData1 = baseKeirinPlaceData;
            const placeData2 = placeData1.copy({ location: '立川' });

            expect(placeData1.equals(placeData2)).toBe(false);
        });

        it('日時が異なるインスタンスは等価でないことを確認', () => {
            const placeData1 = baseKeirinPlaceData;
            const placeData2 = placeData1.copy({
                dateTime: new Date('2025-12-31'),
            });

            expect(placeData1.equals(placeData2)).toBe(false);
        });

        it('toString メソッドが正しい文字列表現を返すことを確認', () => {
            const placeData = baseKeirinPlaceData;
            const result = placeData.toString();

            expect(result).toContain('KeirinPlaceData');
            expect(result).toContain('平塚');
            expect(result).toContain('GP');
        });
    });
});
