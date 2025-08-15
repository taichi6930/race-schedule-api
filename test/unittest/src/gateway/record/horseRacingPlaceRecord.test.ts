import { baseNarPlaceRecord } from '../../mock/common/baseNarData';

describe('NarPlaceRecordクラスのテスト', () => {
    it('正しい入力でNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;

        expect(placeRecord.id).toEqual('nar2024122944');
        expect(placeRecord.dateTime).toEqual(new Date('2024-12-29'));
        expect(placeRecord.location).toBe('大井');
    });

    it('日付を変更したNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;
        const copiedPlaceRecord = placeRecord.copy({
            location: '川崎',
        });

        expect(copiedPlaceRecord.id).toEqual('nar2024122944');
        expect(copiedPlaceRecord.dateTime).toEqual(new Date('2024-12-29'));
        expect(copiedPlaceRecord.location).toBe('川崎');
    });

    it('何も変更せずNarPlaceRecordのインスタンスを作成できることを確認', () => {
        const placeRecord = baseNarPlaceRecord;
        const copiedPlaceRecord = placeRecord.copy();

        expect(copiedPlaceRecord).toEqual(placeRecord);
    });
});
