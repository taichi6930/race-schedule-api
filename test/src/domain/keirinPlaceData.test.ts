import { PlaceData } from '../../../lib/src/domain/placeData';
import { RaceType } from '../../../lib/src/utility/raceType';
import { baseKeirinPlaceData } from '../mock/common/baseKeirinData';

describe('KeirinPlaceDataクラスのテスト', () => {
    it('正しい入力でKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseKeirinPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeData.location).toBe('平塚');
    });

    it('日付を変更したKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = PlaceData.create(
            RaceType.KEIRIN,
            new Date('2025-12-30'),
            '平塚',
        );
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceData.location).toBe('平塚');
    });

    it('何も変更せずKeirinPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = PlaceData.create(
            RaceType.KEIRIN,
            new Date('2025-12-30'),
            '平塚',
        );
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });
});
