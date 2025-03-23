import { baseAutoracePlaceRecord } from '../../mock/common/baseAutoraceData';

describe('AutoracePlaceRecordクラスのテスト', () => {
    it('正しい入力でAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;

        expect(placeRecord.id).toEqual('autorace2024123105');
        expect(placeRecord.dateTime).toEqual(new Date('2024-12-31'));
        expect(placeRecord.location).toBe('飯塚');
        expect(placeRecord.grade).toBe('SG');
    });

    it('日付を変更したAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;
        const copiedPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceRecord.id).toEqual('autorace2024123105');
        expect(copiedPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceRecord.location).toBe('飯塚');
        expect(copiedPlaceRecord.grade).toBe('SG');
    });

    it('何も変更せずAutoracePlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseAutoracePlaceRecord;
        const copiedPlaceRecord = placeRecord.copy();

        expect(copiedPlaceRecord).toEqual(placeRecord);
    });
});
