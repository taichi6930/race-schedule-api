import { JraRaceEntity } from '../../../../lib/src/repository/entity/jraRaceEntity';
import {
    baseJraGoogleCalendarData,
    baseJraRaceData,
    baseJraRaceEntity,
    baseJraRaceRecord,
} from '../../mock/common/baseJraData';

describe('JraRaceEntityクラスのテスト', () => {
    /**
     * テスト用のJraRaceEntityインスタンス
     */
    const baseRaceEntity = baseJraRaceEntity;

    it('正しい入力でJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        // インスタンスのプロパティが正しいか確認
        expect(raceEntity.id).toBe('jra202412220611');
        expect(raceEntity.raceData).toBe(baseJraRaceData);
    });

    it('何も変更せずJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const newRaceEntity = raceEntity.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceEntity.id).toEqual(raceEntity.id);
        expect(newRaceEntity.raceData).toBe(raceEntity.raceData);
    });

    it('何も変更せずJraRaceDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const raceData = raceEntity.raceData;
        // インスタンスが変更されていないか確認
        expect(raceData).toEqual(baseJraRaceData);
    });

    it('JraRaceEntityのインスタンスをGoogleカレンダーのイベントに変換できることを確認', () => {
        const raceEntity = baseRaceEntity;
        const googleCalendarData = raceEntity.toGoogleCalendarData(
            new Date('2025-01-01T12:00:00.000Z'),
        );
        // Googleカレンダーのイベントが正しいか確認
        expect(googleCalendarData).toEqual(baseJraGoogleCalendarData);
    });

    it('JraRaceEntityのインスタンスをJraRaceRecordに変換できることを確認', () => {
        const raceEntity = baseJraRaceEntity;
        const raceRecord = raceEntity.toRecord();
        // JraRaceRecordが正しいか確認
        expect(raceRecord).toEqual(baseJraRaceRecord);
    });

    it('GoogleカレンダーのイベントからJraRaceEntityのインスタンスを作成できることを確認', () => {
        const raceEntity = baseJraRaceEntity;
        const googleCalendarData = raceEntity.toGoogleCalendarData(
            new Date('2025-01-01T12:00:00.000Z'),
        );
        const newRaceEntity =
            JraRaceEntity.fromGoogleCalendarDataToRaceEntity(
                googleCalendarData,
            );
        // インスタンスが正しいか確認
        expect(newRaceEntity).toEqual(raceEntity);
    });

    it('GoogleカレンダーのイベントからCalendarDataのインスタンスを作成できることを確認', () => {
        const raceEntity = baseJraRaceEntity;
        const googleCalendarData = raceEntity.toGoogleCalendarData(
            new Date('2025-01-01T12:00:00.000Z'),
        );
        const calendarData =
            JraRaceEntity.fromGoogleCalendarDataToCalendarData(
                googleCalendarData,
            );
        // CalendarDataが正しいか確認
        expect(calendarData.id).toBe(googleCalendarData.id);
        expect(calendarData.title).toBe(googleCalendarData.summary);
        expect(calendarData.startTime).toEqual(
            new Date(googleCalendarData.start?.dateTime ?? ''),
        );
        expect(calendarData.endTime).toEqual(
            new Date(googleCalendarData.end?.dateTime ?? ''),
        );
        expect(calendarData.location).toBe(googleCalendarData.location);
        expect(calendarData.description).toBe(googleCalendarData.description);
    });
});
