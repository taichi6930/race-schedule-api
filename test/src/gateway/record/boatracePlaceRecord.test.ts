import { baseBoatracePlaceRecord } from '../../mock/common/baseBoatraceData';

describe('BoatracePlaceRecordクラスのテスト', () => {
    it('正しい入力でBoatracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;

        expect(placeRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeRecord.location).toBe('平和島');
    });

    it('日付を変更したNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;
        const copiedPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceRecord.location).toBe('平和島');
    });

    it('何も変更せずBoatracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseBoatracePlaceRecord;
        const copiedPlaceRecord = placeRecord.copy();

        expect(copiedPlaceRecord).toEqual(placeRecord);
    });
});
