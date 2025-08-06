import { PlaceData } from '../../../lib/src/domain/placeData';
import { RaceType } from '../../../lib/src/utility/raceType';
import { baseNarPlaceData } from '../mock/common/baseNarData';

describe('NarPlaceDataクラスのテスト', () => {
    it('正しい入力でNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseNarPlaceData;

        expect(placeData.dateTime).toEqual(new Date('2024-12-29'));
        expect(placeData.location).toBe('大井');
    });

    it('日付を変更したNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = baseNarPlaceData;
        const copiedPlaceData = placeData.copy({
            dateTime: new Date('2024-06-04'),
        });

        expect(copiedPlaceData.dateTime).toEqual(new Date('2024-06-04'));
        expect(copiedPlaceData.location).toBe('大井');
    });

    it('何も変更せずNarPlaceDataのインスタンスを作成できることを確認', () => {
        const placeData = PlaceData.create(
            RaceType.NAR,
            new Date('2024-06-03'),
            '大井',
        );
        const copiedPlaceData = placeData.copy();

        expect(copiedPlaceData).toEqual(placeData);
    });
});
