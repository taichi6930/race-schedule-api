import { baseKeirinPlaceRecord } from '../../mock/common/baseKeirinData';

describe('KeirinPlaceRecordクラスのテスト', () => {
    it('正しい入力でKeirinPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;

        expect(placeRecord.id).toEqual('keirin2025123035');
        expect(placeRecord.dateTime).toEqual(new Date('2025-12-30'));
        expect(placeRecord.location).toBe('平塚');
        expect(placeRecord.grade).toBe('GP');
    });

    it('日付を変更したKeirinPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;
        const copiedPlaceRecord = placeRecord.copy({
            dateTime: new Date('2022-12-30'),
        });

        expect(copiedPlaceRecord.id).toEqual('keirin2025123035');
        expect(copiedPlaceRecord.dateTime).toEqual(new Date('2022-12-30'));
        expect(copiedPlaceRecord.location).toBe('平塚');
        expect(copiedPlaceRecord.grade).toBe('GP');
    });

    it('何も変更せずKeirinPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseKeirinPlaceRecord;
        const copiedPlaceRecord = placeRecord.copy();

        expect(copiedPlaceRecord).toEqual(placeRecord);
    });
});
